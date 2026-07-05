"use client";

import { useState } from "react";
import { createClient } from "@/lib/auth/supabase/client";
import { Input } from "@/modules/_shared/components/Input";
import { Button } from "@/modules/_shared/components/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/modules/_shared/components/Tabs";
import { Eye, EyeOff, Mail, ArrowLeft, Loader2 } from "lucide-react";

// ─── Supabase error → Spanish message ─────────────────────────────────
function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "El correo o la contraseña son incorrectos.",
    "Email not confirmed": "Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.",
    "User already registered": "Este correo ya está registrado. Intenta iniciar sesión.",
    "Signup requires a valid password": "Debes ingresar una contraseña válida.",
    "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
    "Email rate limit exceeded":
      "Hemos recibido varias solicitudes en poco tiempo. Espera unos minutos antes de intentarlo nuevamente.",
    "For security purposes, you can only request this after 60 seconds.":
      "Hemos recibido varias solicitudes en poco tiempo. Espera unos minutos antes de intentarlo nuevamente.",
  };

  for (const [key, value] of Object.entries(map)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return "Ocurrió un error inesperado. Intenta de nuevo.";
}

// ─── Types ────────────────────────────────────────────────────────────
type AuthView = "tabs" | "forgot-password" | "registration-success" | "forgot-success";
type ActiveTab = "login" | "register";

export default function LoginPage() {
  const supabase = createClient();

  // ── View state ──────────────────────────────────────────────────────
  const [view, setView] = useState<AuthView>("tabs");
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");

  // ── Login state ─────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ── Register state ──────────────────────────────────────────────────
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  // ── Forgot password state ───────────────────────────────────────────
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setLoginError(translateAuthError(error.message));
        return;
      }

      // Successful login — middleware will handle redirect
      window.location.href = "/dashboard";
    } catch {
      setLoginError("Ocurrió un error de conexión. Intenta de nuevo.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError("");

    // ── Client-side validation ──────────────────────────────────────
    if (registerPassword.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (registerPassword !== registerConfirm) {
      setRegisterError("Las contraseñas no coinciden.");
      return;
    }

    setRegisterLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) {
        setRegisterError(translateAuthError(error.message));
        return;
      }

      setRegisteredEmail(registerEmail);
      setView("registration-success");
    } catch {
      setRegisterError("Ocurrió un error de conexión. Intenta de nuevo.");
    } finally {
      setRegisterLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/callback`,
      });

      if (error) {
        setForgotError(translateAuthError(error.message));
        return;
      }

      setView("forgot-success");
    } catch {
      setForgotError("Ocurrió un error de conexión. Intenta de nuevo.");
    } finally {
      setForgotLoading(false);
    }
  }

  // ─── Registration success view ─────────────────────────────────────
  if (view === "registration-success") {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--c-accent-subtle)] flex items-center justify-center">
          <Mail className="w-8 h-8 text-[var(--c-accent)]" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-[var(--c-text-primary)]">
            Confirma tu correo electrónico
          </h2>
          <p className="text-sm text-[var(--c-text-secondary)] leading-relaxed max-w-[320px]">
            Hemos enviado un enlace de confirmación a{" "}
            <span className="font-medium text-[var(--c-text-primary)]">{registeredEmail}</span>.
            Revisa tu bandeja de entrada para activar tu cuenta.
          </p>
        </div>
        <div className="w-full border-t border-[var(--c-border-subtle)] pt-4 mt-2">
          <p className="text-xs text-[var(--c-text-tertiary)] mb-3">
            ¿No recibiste el correo? Revisa tu carpeta de spam.
          </p>
          <Button
            variant="ghost"
            className="text-[var(--c-accent)] text-sm"
            onClick={() => {
              setView("tabs");
              setActiveTab("login");
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  // ─── Forgot password success view ──────────────────────────────────
  if (view === "forgot-success") {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--c-accent-subtle)] flex items-center justify-center">
          <Mail className="w-8 h-8 text-[var(--c-accent)]" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-[var(--c-text-primary)]">Revisa tu correo</h2>
          <p className="text-sm text-[var(--c-text-secondary)] leading-relaxed max-w-[320px]">
            Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
          </p>
        </div>
        <div className="w-full border-t border-[var(--c-border-subtle)] pt-4 mt-2">
          <Button
            variant="ghost"
            className="text-[var(--c-accent)] text-sm"
            onClick={() => {
              setView("tabs");
              setActiveTab("login");
              setForgotEmail("");
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  // ─── Forgot password form ──────────────────────────────────────────
  if (view === "forgot-password") {
    return (
      <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 mb-2">
          <h2 className="text-base font-semibold text-[var(--c-text-primary)]">
            Recuperar contraseña
          </h2>
          <p className="text-sm text-[var(--c-text-secondary)]">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="forgot-email"
            className="text-[13px] font-medium text-[var(--c-text-primary)]"
          >
            Correo electrónico
          </label>
          <Input
            id="forgot-email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            autoComplete="email"
            error={forgotError || undefined}
          />
        </div>

        <Button type="submit" disabled={forgotLoading} className="w-full">
          {forgotLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar enlace de recuperación"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="text-[var(--c-accent)] text-sm"
          onClick={() => {
            setView("tabs");
            setForgotError("");
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio de sesión
        </Button>
      </form>
    );
  }

  // ─── Main tabs view (Login / Register) ─────────────────────────────
  return (
    <Tabs>
      <TabsList className="mb-6">
        <TabsTrigger
          value="login"
          active={activeTab === "login"}
          onClick={() => {
            setActiveTab("login");
            setLoginError("");
          }}
        >
          Iniciar sesión
        </TabsTrigger>
        <TabsTrigger
          value="register"
          active={activeTab === "register"}
          onClick={() => {
            setActiveTab("register");
            setRegisterError("");
          }}
        >
          Crear cuenta
        </TabsTrigger>
      </TabsList>

      {/* ── Login Tab ──────────────────────────────────────────────── */}
      <TabsContent value="login" active={activeTab === "login"}>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-[13px] font-medium text-[var(--c-text-primary)]"
            >
              Correo electrónico
            </label>
            <Input
              id="login-email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-[13px] font-medium text-[var(--c-text-primary)]"
              >
                Contraseña
              </label>
              <button
                type="button"
                className="text-xs text-[var(--c-accent)] hover:text-[var(--c-accent-hover)] transition-colors"
                onClick={() => {
                  setForgotEmail(loginEmail);
                  setView("forgot-password");
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showLoginPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-text-tertiary)] hover:text-[var(--c-text-secondary)] transition-colors"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                tabIndex={-1}
                aria-label={showLoginPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {loginError && (
            <p className="text-sm text-[var(--c-danger)] bg-[var(--c-danger)]/5 border border-[var(--c-danger)]/20 rounded-[var(--r-md)] px-3 py-2">
              {loginError}
            </p>
          )}

          <Button type="submit" disabled={loginLoading} className="w-full mt-1">
            {loginLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </TabsContent>

      {/* ── Register Tab ───────────────────────────────────────────── */}
      <TabsContent value="register" active={activeTab === "register"}>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-name"
              className="text-[13px] font-medium text-[var(--c-text-primary)]"
            >
              Nombre completo
            </label>
            <Input
              id="register-name"
              type="text"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              placeholder="Tu nombre"
              required
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-email"
              className="text-[13px] font-medium text-[var(--c-text-primary)]"
            >
              Correo electrónico
            </label>
            <Input
              id="register-email"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-password"
              className="text-[13px] font-medium text-[var(--c-text-primary)]"
            >
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="register-password"
                type={showRegisterPassword ? "text" : "password"}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-text-tertiary)] hover:text-[var(--c-text-secondary)] transition-colors"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                tabIndex={-1}
                aria-label={showRegisterPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showRegisterPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-[var(--c-text-tertiary)]">Mínimo 6 caracteres</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-confirm"
              className="text-[13px] font-medium text-[var(--c-text-primary)]"
            >
              Confirmar contraseña
            </label>
            <Input
              id="register-confirm"
              type="password"
              value={registerConfirm}
              onChange={(e) => setRegisterConfirm(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              autoComplete="new-password"
            />
          </div>

          {registerError && (
            <p className="text-sm text-[var(--c-danger)] bg-[var(--c-danger)]/5 border border-[var(--c-danger)]/20 rounded-[var(--r-md)] px-3 py-2">
              {registerError}
            </p>
          )}

          <Button type="submit" disabled={registerLoading} className="w-full mt-1">
            {registerLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
