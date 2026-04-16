import { useState, useEffect, useCallback } from "react";
import { useAuth, StoredUser } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Trash2, Users, Clock, ShieldAlert, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function UserManagement() {
  const { user, getUsers, approveUser, rejectUser, deleteUser } = useAuth();
  const [tab, setTab] = useState("active");
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  // Auto-refresh when window regains focus
  useEffect(() => {
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-2">
            <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
            <p className="font-semibold">Acesso restrito</p>
            <p className="text-sm text-muted-foreground">Apenas administradores podem acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const users = getUsers();
  const activeUsers = users.filter((u) => u.status === "active");
  const pendingUsers = users.filter((u) => u.status === "pending");
  const rejectedUsers = users.filter((u) => u.status === "rejected");

  const handleApprove = (u: StoredUser) => {
    approveUser(u.id);
    toast({ title: "Usuário aprovado", description: `${u.name} agora pode acessar o sistema.` });
  };

  const handleReject = (u: StoredUser) => {
    rejectUser(u.id);
    toast({ title: "Cadastro recusado", description: `${u.name} foi recusado.`, variant: "destructive" });
  };

  const handleDelete = (u: StoredUser) => {
    deleteUser(u.id);
    toast({ title: "Usuário removido", description: `${u.name} foi removido do sistema.` });
  };

  const UserRow = ({ u, actions }: { u: StoredUser; actions: React.ReactNode }) => (
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
      <div className="flex items-center gap-1.5 ml-3 shrink-0">{actions}</div>
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">Gestão de Usuários</h1>
        <p className="text-sm text-muted-foreground">Gerencie acessos e aprove novos cadastros.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
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

        <TabsContent value="active" className="space-y-2 mt-4">
          {activeUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum usuário ativo.</p>}
          {activeUsers.map((u) => (
            <UserRow
              key={u.id}
              u={u}
              actions={
                u.id !== user.id && u.role !== "admin" ? (
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(u)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                ) : null
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-2 mt-4">
          {pendingUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum cadastro pendente.</p>}
          {pendingUsers.map((u) => (
            <UserRow
              key={u.id}
              u={u}
              actions={
                <>
                  <Button size="sm" variant="default" className="gap-1" onClick={() => handleApprove(u)}>
                    <Check className="h-3.5 w-3.5" /> Aprovar
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleReject(u)}>
                    <X className="h-3.5 w-3.5" /> Recusar
                  </Button>
                </>
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-2 mt-4">
          {rejectedUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum cadastro recusado.</p>}
          {rejectedUsers.map((u) => (
            <UserRow
              key={u.id}
              u={u}
              actions={
                <>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => handleApprove(u)}>
                    <Check className="h-3.5 w-3.5" /> Reativar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(u)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </>
              }
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
