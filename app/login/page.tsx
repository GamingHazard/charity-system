"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isSessionLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, isSessionLoading, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(username, password);
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in. Check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#1f2925] lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#183f35] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <img src="/hero-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102d27] via-[#183f35]/60 to-[#183f35]/20" />
        <div className="relative z-10 flex items-center gap-3 text-white">
          <img src="/logo.png" alt="Seeds of Love Foundation" className="h-14 w-14 object-contain" />
          <div>
            <p className="text-lg font-bold tracking-[0.18em]">ENSIGO OF LOVE</p>
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">We rise by lifting others</p>
          </div>
        </div>
        <div className="relative z-10 max-w-xl text-white">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#f0b56d]">Foundation operations</p>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">Turn good intentions into lasting impact.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/75">A focused workspace for the people, programs, and stories that move our work forward.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 text-sm text-white/70">
          <ShieldCheck className="h-5 w-5 text-[#f0b56d]" />
          <span>Protected workspace for authorized team members</span>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-24">
        <div className="w-full max-w-md">
          <div className="mb-12 lg:hidden">
            <img src="/logo.png" alt="Seeds of Love Foundation" className="h-16 w-16 object-contain" />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[#2f705e]">Foundation administration</p>
          </div>
          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f705e]">Welcome back</p>
            <h2 className="text-4xl font-semibold tracking-tight text-[#1f2925]">Sign in to your workspace</h2>
            <p className="mt-4 text-base leading-6 text-[#65706a]">Manage programs, stories, partnerships, and the work behind the mission.</p>
          </div>
          {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#1f2925]">Username</label>
              <input id="username" name="username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your username" required disabled={isSubmitting} className="h-14 w-full rounded-xl border border-[#d6d9d2] bg-white px-4 text-base text-[#1f2925] outline-none transition placeholder:text-[#9aa29d] focus:border-[#2f705e] focus:ring-4 focus:ring-[#2f705e]/10 disabled:cursor-not-allowed disabled:opacity-60" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label htmlFor="password" className="block text-sm font-semibold text-[#1f2925]">Password</label>
                <a href="mailto:ensigooflove@gmail.com?subject=Dashboard%20access%20help" className="text-xs font-semibold text-[#2f705e] hover:text-[#1f2925]">Need help signing in?</a>
              </div>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required disabled={isSubmitting} className="h-14 w-full rounded-xl border border-[#d6d9d2] bg-white px-4 pr-12 text-base text-[#1f2925] outline-none transition placeholder:text-[#9aa29d] focus:border-[#2f705e] focus:ring-4 focus:ring-[#2f705e]/10 disabled:cursor-not-allowed disabled:opacity-60" />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#65706a] hover:bg-[#f4f1eb] hover:text-[#1f2925] focus:outline-none focus:ring-2 focus:ring-[#2f705e]">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting || isSessionLoading} className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#2f705e] px-5 text-base font-semibold text-white transition hover:bg-[#255b4d] focus:outline-none focus:ring-4 focus:ring-[#2f705e]/25 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Signing in..." : "Continue to dashboard"}
              {!isSubmitting && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
          <p className="mt-10 border-t border-[#d6d9d2] pt-6 text-xs leading-5 text-[#7a837e]">Authorized team members only. By continuing, you agree to use this workspace responsibly and protect the information it contains.</p>
        </div>
      </section>
    </main>
  );
}
