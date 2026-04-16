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
}

const AUTH_STORAGE_KEY = "nexti_auth_user";
const USERS_STORAGE_KEY = "nexti_users_db";

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres";
  if (!/[A-Z]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula";
  if (!/[a-z]/.test(password)) return "A senha deve conter pelo menos uma letra minúscula";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "A senha deve conter pelo menos um caractere especial";
  return null;
}

function loadUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StoredUser[];
      return parsed.map((u) => ({ ...u, status: u.status || "active" }));
    }
  } catch {}
  const seed = (defaultUsersJson.users as any[]).map((u) => ({
    ...u,
    status: u.status || "active",
  })) as StoredUser[];
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
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Usuário ou senha inválidos" };
    if (found.status === "pending") return { success: false, error: "Seu cadastro ainda está aguardando aprovação" };
    if (found.status === "rejected") return { success: false, error: "Seu cadastro foi recusado. Entre em contato com o administrador" };

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
      password,
      client,
      name,
      role: "user",
      status: "pending",
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, getUsers, approveUser, rejectUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}
