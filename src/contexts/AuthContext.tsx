import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import defaultUsersJson from "@/data/users.json";

export type UserStatus = "active" | "pending" | "rejected";

export interface AppUser {
  id: number;
  username: string;
  client: string;
  name: string;
  role: string;
  status: UserStatus;
}

export interface StoredUser extends AppUser {
  password: string;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  register: (username: string, password: string, name: string, client: string) => { success: boolean; error?: string };
  logout: () => void;
  getUsers: () => StoredUser[];
  approveUser: (id: number) => void;
  rejectUser: (id: number) => void;
  deleteUser: (id: number) => void;
  updateUser: (id: number, data: { name?: string; username?: string; password?: string }) => { success: boolean; error?: string };
}

const AUTH_STORAGE_KEY = "nexti_auth_user";
const USERS_STORAGE_KEY = "nexti_users_db";

// Simple obfuscation for passwords stored in JSON (base64 + reverse)
function encodePassword(plain: string): string {
  return btoa(plain.split("").reverse().join(""));
}

function decodePassword(encoded: string): string {
  try {
    return atob(encoded).split("").reverse().join("");
  } catch {
    // Fallback: password is stored in plain text (legacy)
    return encoded;
  }
}

function isEncoded(value: string): boolean {
  try {
    const decoded = atob(value);
    return btoa(decoded) === value;
  } catch {
    return false;
  }
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres";
  if (!/[A-Z]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula";
  if (!/[a-z]/.test(password)) return "A senha deve conter pelo menos uma letra minúscula";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "A senha deve conter pelo menos um caractere especial";
  return null;
}

function buildSeed(): StoredUser[] {
  return (defaultUsersJson.users as any[]).map((u) => ({
    ...u,
    status: u.status || "active",
    password: encodePassword(u.password),
  })) as StoredUser[];
}

function loadUsers(): StoredUser[] {
  const seed = buildSeed();
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      const parsed = (JSON.parse(stored) as StoredUser[]).map((u) => ({
        ...u,
        status: u.status || "active",
      }));
      // Merge: add any seed users (by username) missing from localStorage
      const existingUsernames = new Set(parsed.map((u) => u.username.toLowerCase()));
      const maxId = parsed.reduce((m, u) => Math.max(m, u.id), 0);
      let nextId = maxId + 1;
      const merged = [...parsed];
      for (const seedUser of seed) {
        if (!existingUsernames.has(seedUser.username.toLowerCase())) {
          merged.push({ ...seedUser, id: nextId++ });
        }
      }
      if (merged.length !== parsed.length) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch {}
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getStoredUser(): AppUser | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => ({ success: false }),
  register: () => ({ success: false }),
  logout: () => {},
  getUsers: () => [],
  approveUser: () => {},
  rejectUser: () => {},
  deleteUser: () => {},
  updateUser: () => ({ success: false }),
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => getStoredUser());
  const [, setTick] = useState(0);

  const login = useCallback((username: string, password: string) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (!found) return { success: false, error: "Usuário ou senha inválidos" };

    // Check password: try encoded first, then plain (legacy)
    const storedPlain = isEncoded(found.password) ? decodePassword(found.password) : found.password;
    if (storedPlain !== password) return { success: false, error: "Usuário ou senha inválidos" };

    if (found.status === "pending") return { success: false, error: "Seu cadastro ainda está aguardando aprovação" };
    if (found.status === "rejected") return { success: false, error: "Seu cadastro foi recusado. Entre em contato com o administrador" };

    // If password was plain text (legacy), re-encode it
    if (!isEncoded(found.password)) {
      found.password = encodePassword(password);
      saveUsers(users);
    }

    const appUser: AppUser = {
      id: found.id,
      username: found.username,
      client: found.client,
      name: found.name,
      role: found.role,
      status: found.status,
    };
    setUser(appUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
    return { success: true };
  }, []);

  const register = useCallback((username: string, password: string, name: string, client: string) => {
    const pwError = validatePassword(password);
    if (pwError) return { success: false, error: pwError };

    const users = loadUsers();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: "Nome de usuário já existe" };
    }

    const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
    const newUser: StoredUser = {
      id: maxId + 1,
      username: username.toLowerCase(),
      password: encodePassword(password),
      client,
      name,
      role: "user",
      status: "active",
    };
    users.push(newUser);
    saveUsers(users);

    return { success: true, error: undefined };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const getUsers = useCallback(() => loadUsers(), []);

  const approveUser = useCallback((id: number) => {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx >= 0) {
      users[idx].status = "active";
      saveUsers(users);
      setTick((t) => t + 1);
    }
  }, []);

  const rejectUser = useCallback((id: number) => {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx >= 0) {
      users[idx].status = "rejected";
      saveUsers(users);
      setTick((t) => t + 1);
    }
  }, []);

  const deleteUser = useCallback((id: number) => {
    let users = loadUsers();
    users = users.filter((u) => u.id !== id);
    saveUsers(users);
    setTick((t) => t + 1);
  }, []);

  const updateUser = useCallback((id: number, data: { name?: string; username?: string; password?: string }) => {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) return { success: false, error: "Usuário não encontrado" };

    if (data.username) {
      const dup = users.find((u) => u.id !== id && u.username.toLowerCase() === data.username!.toLowerCase());
      if (dup) return { success: false, error: "Nome de usuário já existe" };
      users[idx].username = data.username.toLowerCase();
    }
    if (data.name) users[idx].name = data.name;
    if (data.password) {
      const pwError = validatePassword(data.password);
      if (pwError) return { success: false, error: pwError };
      users[idx].password = encodePassword(data.password);
    }

    saveUsers(users);
    setTick((t) => t + 1);
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, getUsers, approveUser, rejectUser, deleteUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
