import { useState } from "react";
import { useAuth, validatePassword } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import nextiLogo from "@/assets/nexti-logo.png";

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = [
    { label: "Mínimo 8 caracteres", ok: password.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    { label: "Letra minúscula", ok: /[a-z]/.test(password) },
    { label: "Caractere especial (!@#$...)", ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!client.trim()) {
      setError("Informe a empresa");
      return;
    }

    // Normalize: "atitude" variants → "atitudeservicos"
    const normalizedClient = client.trim().toLowerCase().replace(/\s+/g, "");
    const finalClient = normalizedClient === "atitude" || normalizedClient === "atitudeserviços"
      ? "atitudeservicos"
      : normalizedClient;

    if (mode === "login") {
      const result = login(username, password);
      if (!result.success) setError(result.error || "Erro ao fazer login");
    } else {
      if (!name.trim()) {
        setError("Informe o nome completo");
        return;
      }
      const pwError = validatePassword(password);
      if (pwError) {
        setError(pwError);
        return;
      }
      const result = register(username, password, name, finalClient);
      if (!result.success) setError(result.error || "Erro ao cadastrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="flex justify-center">
            <img src={nextiLogo} alt="Nexti" className="h-10 object-contain" />
          </div>
          <CardTitle className="text-xl">
            {mode === "login" ? "Entrar no Analytics" : "Criar Conta"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Informe suas credenciais para acessar"
              : "Preencha os dados para se cadastrar"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Empresa - text input */}
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Ex: nexti, orsegups, atitudeservicos, vigeyes"
                autoComplete="organization"
              />
              <p className="text-[10px] text-muted-foreground">
                Digite o nome da empresa exatamente como cadastrado
              </p>
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Usuário</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {mode === "register" && password.length > 0 && (
                <div className="space-y-1 mt-2">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2 text-xs">
                      {check.ok ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className={check.ok ? "text-primary" : "text-muted-foreground"}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              {mode === "login" ? (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastrar
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-sm text-primary hover:underline"
            >
              {mode === "login"
                ? "Não tem conta? Cadastre-se"
                : "Já tem conta? Faça login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
