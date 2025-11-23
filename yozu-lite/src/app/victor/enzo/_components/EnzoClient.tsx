"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function EnzoClient() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation de particules en arrière-plan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    // Créer des particules
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.6)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Canvas d'animation de fond */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Grille futuriste en arrière-plan */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Glow effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-2xl">
          {/* Carte glassmorphique */}
          <div className="relative group">
            {/* Bordure animée */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-gradient-xy" />

            {/* Carte principale */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-12 border border-cyan-500/20 shadow-2xl">
              {/* Header avec effet holographique */}
              <div className="mb-8">
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                  Enzo Dashboard
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
              </div>

              {/* Description */}
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Bienvenue dans l&apos;interface futuriste d&apos;Enzo. Explorez
                les possibilités infinies de la navigation quantique.
              </p>

              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Vitesse", value: "99.9%", color: "cyan" },
                  { label: "Uptime", value: "100%", color: "purple" },
                  { label: "Quantum", value: "∞", color: "pink" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                      {stat.label}
                    </div>
                    <div
                      className={`text-2xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton futuriste */}
              <button
                onClick={() => router.back()}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[2px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]"
              >
                <div className="relative bg-slate-900 rounded-[10px] px-8 py-4 transition-all duration-300 group-hover:bg-slate-900/50">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Retour Temporel
                    </span>
                  </div>
                </div>
              </button>

              {/* Footer avec effet de scan */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Système en ligne
                  </span>
                  <span className="font-mono">v2.0.77</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes gradient-xy {
          0%,
          100% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 6s ease infinite;
        }
      `}</style>
    </div>
  );
}
