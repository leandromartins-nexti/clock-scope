import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { onboardingSteps } from "./onboarding-steps";
import { Sparkles, CheckCircle2, ChevronLeft, ChevronRight, X, List, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const STORAGE_KEY = "analytics_onboarding_completed";
const RESTART_KEY = "analytics_onboarding_restart";

// ── Confetti ────────────────────────────────────────────────
function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#FF5722", "#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899"];
    const particles: { x: number; y: number; w: number; h: number; color: string; vx: number; vy: number; rot: number; rv: number }[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        w: 4 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        rv: (Math.random() - 0.5) * 0.2,
      });
    }

    let frame: number;
    let elapsed = 0;
    const animate = () => {
      elapsed += 16;
      if (elapsed > 3000) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.rot += p.rv;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}

// ── Tooltip with Arrow ──────────────────────────────────────
interface TooltipProps {
  step: number;
  total: number;
  title: string;
  description: string;
  icon: React.ElementType;
  position: { top: number; left: number };
  arrowDir: "top" | "bottom" | "left" | "right";
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onGoToStep: (idx: number) => void;
  nextLabel?: string;
  completedSteps: Set<number>;
}

function TourTooltip({
  step, total, title, description, icon: Icon, position, arrowDir,
  onNext, onPrev, onSkip, onGoToStep, nextLabel, completedSteps,
}: TooltipProps) {
  const [showStepList, setShowStepList] = useState(false);

  const arrowClass = {
    top: "before:absolute before:-top-[10px] before:left-1/2 before:-translate-x-1/2 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-white",
    bottom: "before:absolute before:-bottom-[10px] before:left-1/2 before:-translate-x-1/2 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-t-[10px] before:border-t-white",
    left: "before:absolute before:top-1/2 before:-left-[10px] before:-translate-y-1/2 before:border-t-[10px] before:border-t-transparent before:border-b-[10px] before:border-b-transparent before:border-r-[10px] before:border-r-white",
    right: "before:absolute before:top-1/2 before:-right-[10px] before:-translate-y-1/2 before:border-t-[10px] before:border-t-transparent before:border-b-[10px] before:border-b-transparent before:border-l-[10px] before:border-l-white",
  }[arrowDir];

  return (
    <div
      className={cn(
        "fixed z-[10002] w-[360px] bg-white rounded-xl shadow-2xl p-5 animate-fade-in before:content-[''] before:block",
        arrowClass
      )}
      style={{ top: position.top, left: position.left }}
      role="dialog"
      aria-label={`Etapa ${step + 1} de ${total}: ${title}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5722]">
          Etapa {step + 1} de {total}
        </span>
        <button
          onClick={() => setShowStepList(!showStepList)}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="Ver lista de etapas"
        >
          <List size={16} className="text-muted-foreground" />
        </button>
      </div>

      {showStepList && (
        <div className="mb-3 max-h-[200px] overflow-y-auto border border-border rounded-lg p-2 space-y-0.5">
          {onboardingSteps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { onGoToStep(i); setShowStepList(false); }}
              className={cn(
                "w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition",
                i === step ? "bg-orange-50 text-[#FF5722] font-semibold" :
                completedSteps.has(i) ? "text-green-600" : "text-muted-foreground hover:bg-gray-50"
              )}
            >
              <span className="w-4 text-center">{completedSteps.has(i) ? "✓" : i + 1}</span>
              {s.title}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-[#FF5722]" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

      {/* Progress bar */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= step ? "bg-[#FF5722]" : "bg-gray-200"
            )}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSkip}
          className="text-xs text-muted-foreground hover:text-foreground transition"
          aria-label="Pular tour"
        >
          Pular tour
        </button>
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button
              onClick={onPrev}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-gray-50 transition"
              aria-label="Anterior"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
          )}
          <button
            onClick={onNext}
            className="flex items-center gap-1 text-xs font-medium text-white bg-[#FF5722] px-3 py-1.5 rounded-lg hover:opacity-90 transition"
            aria-label={nextLabel || "Próximo"}
          >
            {nextLabel || "Próximo"} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Progress Chip ───────────────────────────────────────────
function ProgressChip({ step, total }: { step: number; total: number }) {
  return (
    <div className="fixed bottom-6 left-6 z-[10003] bg-white rounded-full px-4 py-2 shadow-lg text-xs font-medium text-muted-foreground">
      Tour guiado · Etapa {step + 1}/{total}
    </div>
  );
}

// ── Welcome Modal ───────────────────────────────────────────
function WelcomeModal({ onStart, onSkip, onDismiss }: { onStart: () => void; onSkip: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onSkip} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] p-8 text-center animate-scale-in z-10">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-5">
          <Sparkles size={28} className="text-[#FF5722]" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Bem-vindo ao Nexti Analytics</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Conheça em 90 segundos tudo que você pode fazer para transformar dados em decisões operacionais.
        </p>
        <button
          onClick={onStart}
          className="w-full bg-[#FF5722] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition mb-2"
        >
          Fazer tour guiado
          <span className="block text-[10px] font-normal opacity-80 mt-0.5">12 etapas · 90 segundos</span>
        </button>
        <button
          onClick={onSkip}
          className="w-full border border-border text-muted-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition mb-3"
        >
          Pular por agora
        </button>
        <button
          onClick={onDismiss}
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition"
        >
          Sei o que estou fazendo, não mostrar novamente
        </button>
      </div>
    </div>
  );
}

// ── Completion Modal ────────────────────────────────────────
function CompletionModal({ onExplore, onQualidade }: { onExplore: () => void; onQualidade: () => void }) {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] p-8 text-center animate-scale-in z-10 overflow-hidden">
        <Confetti />
        <div className="relative z-20">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Pronto! Você conhece o Analytics</h2>
          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
            Agora é hora de explorar. Comece pelo Resumo Executivo para ter uma visão geral da sua operação.
          </p>
          <p className="text-xs text-muted-foreground/60 mb-6">
            Você pode refazer este tour a qualquer momento no menu do seu perfil.
          </p>
          <button
            onClick={onExplore}
            className="w-full bg-[#FF5722] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition mb-2"
          >
            Começar a explorar
          </button>
          <button
            onClick={onQualidade}
            className="w-full border border-border text-muted-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Ver a aba Qualidade do Ponto
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ESC confirmation ────────────────────────────────────────
function EscConfirmModal({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  return (
    <div className="fixed inset-0 z-[10004] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onStay} />
      <div className="relative bg-white rounded-xl shadow-xl w-[340px] p-6 text-center animate-scale-in z-10">
        <h3 className="text-sm font-semibold mb-2">Deseja sair do tour?</h3>
        <p className="text-xs text-muted-foreground mb-4">Você pode refazê-lo a qualquer momento.</p>
        <div className="flex gap-2">
          <button onClick={onStay} className="flex-1 border border-border py-2 rounded-lg text-sm hover:bg-gray-50 transition">Continuar</button>
          <button onClick={onLeave} className="flex-1 bg-[#FF5722] text-white py-2 rounded-lg text-sm hover:opacity-90 transition">Sair do tour</button>
        </div>
      </div>
    </div>
  );
}

// ── Spotlight overlay ───────────────────────────────────────
function SpotlightOverlay({ targetRect }: { targetRect: DOMRect | null }) {
  if (!targetRect) return <div className="fixed inset-0 z-[10000] bg-black/70 onboarding-backdrop-in" />;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      <svg className="w-full h-full onboarding-backdrop-in" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={targetRect.left - 6}
              y={targetRect.top - 6}
              width={targetRect.width + 12}
              height={targetRect.height + 12}
              rx="12"
              ry="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.70)"
          mask="url(#spotlight-mask)"
        />
      </svg>
      {/* Outline pulse around element */}
      <div
        className="absolute spotlight-pulse pointer-events-auto"
        style={{
          top: targetRect.top - 6,
          left: targetRect.left - 6,
          width: targetRect.width + 12,
          height: targetRect.height + 12,
          borderRadius: 12,
        }}
      />
    </div>
  );
}

// ── Calculate tooltip position ──────────────────────────────
function calcTooltipPos(
  targetRect: DOMRect | null,
  preferred: "top" | "bottom" | "left" | "right",
  tooltipW = 360,
  tooltipH = 280
): { top: number; left: number; arrowDir: "top" | "bottom" | "left" | "right" } {
  if (!targetRect) {
    return {
      top: window.innerHeight / 2 - tooltipH / 2,
      left: window.innerWidth / 2 - tooltipW / 2,
      arrowDir: "top",
    };
  }

  const gap = 16;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const attempts: ("bottom" | "top" | "right" | "left")[] = [preferred, "bottom", "top", "right", "left"];

  for (const dir of attempts) {
    let top = 0, left = 0;
    if (dir === "bottom") {
      top = targetRect.bottom + gap;
      left = targetRect.left + targetRect.width / 2 - tooltipW / 2;
      if (top + tooltipH < vh && left > 0 && left + tooltipW < vw) {
        return { top, left: Math.max(8, Math.min(left, vw - tooltipW - 8)), arrowDir: "top" };
      }
    }
    if (dir === "top") {
      top = targetRect.top - tooltipH - gap;
      left = targetRect.left + targetRect.width / 2 - tooltipW / 2;
      if (top > 0 && left > 0 && left + tooltipW < vw) {
        return { top, left: Math.max(8, Math.min(left, vw - tooltipW - 8)), arrowDir: "bottom" };
      }
    }
    if (dir === "right") {
      top = targetRect.top + targetRect.height / 2 - tooltipH / 2;
      left = targetRect.right + gap;
      if (left + tooltipW < vw && top > 0 && top + tooltipH < vh) {
        return { top: Math.max(8, Math.min(top, vh - tooltipH - 8)), left, arrowDir: "left" };
      }
    }
    if (dir === "left") {
      top = targetRect.top + targetRect.height / 2 - tooltipH / 2;
      left = targetRect.left - tooltipW - gap;
      if (left > 0 && top > 0 && top + tooltipH < vh) {
        return { top: Math.max(8, Math.min(top, vh - tooltipH - 8)), left, arrowDir: "right" };
      }
    }
  }

  // fallback center
  return { top: vh / 2 - tooltipH / 2, left: vw / 2 - tooltipW / 2, arrowDir: "top" };
}

// ── Main Component ──────────────────────────────────────────
export default function OnboardingTour() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<"idle" | "welcome" | "touring" | "completed">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showEscConfirm, setShowEscConfirm] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const isMobile = window.innerWidth < 768;

  // Check if should show on mount or restart requested
  useEffect(() => {
    const restart = localStorage.getItem(RESTART_KEY);
    if (restart === "true") {
      localStorage.removeItem(RESTART_KEY);
      localStorage.removeItem(STORAGE_KEY);
      setPhase("welcome");
      return;
    }
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done || done !== "true") {
      if (location.pathname.startsWith("/analytics")) {
        setPhase("welcome");
      }
    }
  }, [location.pathname]);

  // Update target rect when step changes
  useEffect(() => {
    if (phase !== "touring") return;
    const step = onboardingSteps[currentStep];
    if (!step?.target) {
      setTargetRect(null);
      return;
    }
    // Small delay to let DOM update
    const timeout = setTimeout(() => {
      const el = document.querySelector(step.target!);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        // Scroll into view if needed
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        setTargetRect(null);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [phase, currentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (phase !== "touring") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setShowEscConfirm(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, currentStep]);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      document.documentElement.style.setProperty("--onboarding-duration", "0ms");
    }
    return () => {
      document.documentElement.style.removeProperty("--onboarding-duration");
    };
  }, []);

  const finishTour = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setPhase("idle");
    setCurrentStep(0);
    setTargetRect(null);
  }, []);

  const handleStart = () => {
    setPhase("touring");
    setCurrentStep(0);
    setCompletedSteps(new Set());
    // Navigate to analytics root for the tour
    if (location.pathname !== "/analytics") {
      navigate("/analytics");
    }
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase("completed");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    finishTour();
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setPhase("idle");
  };

  const handleGoToStep = (idx: number) => {
    setCurrentStep(idx);
  };

  // Render nothing if idle
  if (phase === "idle") return null;

  const step = onboardingSteps[currentStep];
  const tooltipPos = calcTooltipPos(targetRect, step?.tooltipPosition || "bottom");

  return createPortal(
    <>
      {phase === "welcome" && (
        <WelcomeModal onStart={handleStart} onSkip={handleSkip} onDismiss={handleDismiss} />
      )}

      {phase === "touring" && (
        <>
          <SpotlightOverlay targetRect={step?.isModal || step?.showLeftArrow ? null : targetRect} />

          {/* Left arrow indicator for sidebar hint */}
          {step?.showLeftArrow && (
            <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[10002] flex items-center animate-fade-in">
              <div className="flex items-center gap-1 pl-4 pr-3 py-3">
                <div className="flex items-center animate-bounce-horizontal">
                  <ArrowLeft size={36} className="text-[#FF5722]" strokeWidth={2.5} />
                  <ArrowLeft size={28} className="text-[#FF5722]/60 -ml-4" strokeWidth={2} />
                  <ArrowLeft size={20} className="text-[#FF5722]/30 -ml-3" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          )}

          {isMobile ? (
            // Mobile: bottom sheet
            <div className="fixed bottom-0 left-0 right-0 z-[10002] bg-white rounded-t-2xl shadow-2xl p-5 animate-fade-in">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5722]">
                  Etapa {currentStep + 1} de {onboardingSteps.length}
                </span>
              </div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <step.icon size={20} className="text-[#FF5722]" />
                </div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: onboardingSteps.length }).map((_, i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full", i <= currentStep ? "bg-[#FF5722]" : "bg-gray-200")} />
                ))}
              </div>
              <div className="flex justify-between">
                <button onClick={handleSkip} className="text-xs text-muted-foreground">Pular</button>
                <div className="flex gap-2">
                  {currentStep > 0 && <button onClick={handlePrev} className="text-xs px-3 py-1.5 border rounded-lg">Anterior</button>}
                  <button onClick={handleNext} className="text-xs px-3 py-1.5 bg-[#FF5722] text-white rounded-lg">{step.nextLabel || "Próximo"}</button>
                </div>
              </div>
            </div>
          ) : (
            <TourTooltip
              step={currentStep}
              total={onboardingSteps.length}
              title={step.title}
              description={step.description}
              icon={step.icon}
              position={step?.showLeftArrow ? { top: window.innerHeight / 2 - 140, left: 80 } : tooltipPos}
              arrowDir={step?.showLeftArrow ? "left" : tooltipPos.arrowDir}
              onNext={handleNext}
              onPrev={handlePrev}
              onSkip={handleSkip}
              onGoToStep={handleGoToStep}
              nextLabel={step.nextLabel}
              completedSteps={completedSteps}
            />
          )}

          <ProgressChip step={currentStep} total={onboardingSteps.length} />

          {showEscConfirm && (
            <EscConfirmModal
              onStay={() => setShowEscConfirm(false)}
              onLeave={() => { setShowEscConfirm(false); finishTour(); }}
            />
          )}
        </>
      )}

      {phase === "completed" && (
        <CompletionModal
          onExplore={() => { finishTour(); navigate("/analytics"); }}
          onQualidade={() => { finishTour(); navigate("/analytics/operacional"); }}
        />
      )}
    </>,
    document.body
  );
}

// ── Reset helper (for "Refazer tour" button) ────────────────
export function resetOnboardingTour() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(RESTART_KEY, "true");
}
