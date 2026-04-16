import React, { useState, useCallback } from "react";
import { useAuth, StoredUser, validatePassword } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Users, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2, RefreshCw, Pencil, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import customersIndex from "@/data/customers-index.json";

const CLIENT_OPTIONS = [
  { value: "nexti", label: "Nexti (acesso total)" },
  ...customersIndex.customers.map((c) => ({ value: c.label.toLowerCase().replace(/\s+/g, ""), label: c.label })),
];

export default function UserManagementTab() {
  const { user, getUsers, deleteUser, register, updateUser } = useAuth();
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  // Register form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [regError, setRegError] = useState("");

  // Edit state
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editError, setEditError] = useState("");

  const passwordChecks = [
    { label: "Mínimo 8 caracteres", ok: newPassword.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(newPassword) },
    { label: "Letra minúscula", ok: /[a-z]/.test(newPassword) },
    { label: "Caractere especial (!@#$...)", ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) },
  ];

  if (user?.role !== "admin") return null;

  const users = getUsers();
  const activeUsers = users.filter((u) => u.status === "active");

  const handleDelete = (u: StoredUser) => {
    deleteUser(u.id);
    toast({ title: "Usuário removido", description: `${u.name} foi removido do sistema.` });
    refresh();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!newName.trim()) { setRegError("Informe o nome completo"); return; }
    if (!newClient) { setRegError("Selecione a empresa"); return; }
    if (!newUsername.trim()) { setRegError("Informe o usuário"); return; }
    const pwError = validatePassword(newPassword);
    if (pwError) { setRegError(pwError); return; }

    const result = register(newUsername, newPassword, newName, newClient);
    if (!result.success) {
      setRegError(result.error || "Erro ao cadastrar");
    } else {
      toast({ title: "Usuário cadastrado", description: `${newName} foi criado e já pode acessar o sistema.` });
      setNewUsername("");
      setNewPassword("");
      setNewName("");
      setNewClient("");
      refresh();
    }
  };

  const startEdit = (u: StoredUser) => {
    setEditId(u.id);
    setEditName(u.name);
    setEditUsername(u.username);
    setEditPassword("");
    setEditError("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditError("");
  };

  const saveEdit = () => {
    if (!editId) return;
    setEditError("");

    const data: { name?: string; username?: string; password?: string } = {};
    if (editName.trim()) data.name = editName.trim();
    if (editUsername.trim()) data.username = editUsername.trim();
    if (editPassword) data.password = editPassword;

    const result = updateUser(editId, data);
    if (!result.success) {
      setEditError(result.error || "Erro ao atualizar");
    } else {
      toast({ title: "Usuário atualizado", description: "Dados salvos com sucesso." });
      setEditId(null);
      refresh();
    }
  };

  const renderUserRow = (u: StoredUser, actions: React.ReactNode) => {
    const isEditing = editId === u.id;

    if (isEditing) {
      return (
        <div className="py-3 px-4 rounded-lg border bg-card space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nome</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Usuário</Label>
              <Input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nova senha (opcional)</Label>
              <div className="relative">
                <Input
                  type={showEditPassword ? "text" : "password"}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Manter atual"
                  className="h-8 text-sm pr-8"
                />
                <button type="button" onClick={() => setShowEditPassword(!showEditPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showEditPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>
          {editError && (
            <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-md px-3 py-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {editError}
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" className="gap-1 h-7 text-xs" onClick={saveEdit}>
              <Save className="h-3 w-3" /> Salvar
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={cancelEdit}>
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between py-3 px-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{u.name}</span>
            {u.role === "admin" && <Badge variant="secondary" className="text-[10px]">Admin</Badge>}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span>@{u.username}</span>
            <span>•</span>
            <span>{u.client}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-3 shrink-0">
          {actions}
        </div>
      </div>
    );
  };


  return (
    <div className="space-y-6">
      {/* Register form */}
      <div className="border border-border/60 rounded-xl p-5 bg-card">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Cadastrar Novo Usuário
        </h3>
        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Nome completo</Label>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome" className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Empresa</Label>
            <Select value={newClient} onValueChange={setNewClient}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Usuário</Label>
            <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Username" className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Senha"
                className="h-9 text-sm pr-9"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {newPassword.length > 0 && (
            <div className="col-span-2 flex flex-wrap gap-3">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-1.5 text-xs">
                  {check.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span className={check.ok ? "text-green-600" : "text-muted-foreground"}>{check.label}</span>
                </div>
              ))}
            </div>
          )}

          {regError && (
            <div className="col-span-2 flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" /> {regError}
            </div>
          )}

          <div className="col-span-2">
            <Button type="submit" size="sm" className="gap-1.5">
              <UserPlus className="h-3.5 w-3.5" /> Cadastrar
            </Button>
          </div>
        </form>
      </div>

      {/* User lists */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active" className="gap-1.5">
              <Users className="h-3.5 w-3.5" /> Ativos ({activeUsers.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Pendentes ({pendingUsers.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-1.5">
              <X className="h-3.5 w-3.5" /> Recusados ({rejectedUsers.length})
            </TabsTrigger>
          </TabsList>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={refresh}>
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </Button>
        </div>

        <TabsContent value="active" className="space-y-2 mt-4">
          {activeUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum usuário ativo.</p>}
          {activeUsers.map((u) => (
            <React.Fragment key={u.id}>
              {renderUserRow(u,
                u.id !== user!.id && u.role !== "admin" ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(u)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(u)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : u.id === user!.id ? (
                  <Button size="sm" variant="ghost" onClick={() => startEdit(u)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                ) : null
              )}
            </React.Fragment>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-2 mt-4">
          {pendingUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum cadastro pendente.</p>}
          {pendingUsers.map((u) => (
            <React.Fragment key={u.id}>
              {renderUserRow(u,
                <>
                  <Button size="sm" variant="default" className="gap-1" onClick={() => handleApprove(u)}>
                    <Check className="h-3.5 w-3.5" /> Aprovar
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleReject(u)}>
                    <X className="h-3.5 w-3.5" /> Recusar
                  </Button>
                </>
              )}
            </React.Fragment>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-2 mt-4">
          {rejectedUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum cadastro recusado.</p>}
          {rejectedUsers.map((u) => (
            <React.Fragment key={u.id}>
              {renderUserRow(u,
                <>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => handleApprove(u)}>
                    <Check className="h-3.5 w-3.5" /> Reativar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(u)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </React.Fragment>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
