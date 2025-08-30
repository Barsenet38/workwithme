"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, AlertCircle, Hexagon, Cpu, Database } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Optional: Add particle background (copy from login page)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Particle[] = [];
    const particleCount = 80;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.3 + 0.1})`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage(`A password reset link has been sent to ${email}`);
    } catch {
      setError("Failed to send reset link. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-slate-900 text-slate-100 p-4 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50">
                <Hexagon className="h-10 w-10 text-cyan-500" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            HR SYSTEM
          </h1>
          <p className="text-slate-400">Secure access to human resources portal</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-cyan-400">Forgot Password</h2>
          <p className="text-slate-400 mb-6 text-center">
            Enter your email to receive a password reset link.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center border border-red-500/20">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-500/10 text-green-400 rounded-lg flex items-center border border-green-500/20">
              {message}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 text-slate-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                loading
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <Link href="/auth" className="text-cyan-500 hover:text-cyan-400">
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-slate-500 text-xs inline-flex items-center space-x-6 justify-center">
          <div className="flex items-center">
            <Cpu className="h-3 w-3 mr-1 text-cyan-500" />
            <span>Encrypted Connection</span>
          </div>
          <div className="flex items-center">
            <Database className="h-3 w-3 mr-1 text-cyan-500" />
            <span>HR Database v4.2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
