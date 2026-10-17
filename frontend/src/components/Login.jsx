
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3500/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user?.id) {
        localStorage.setItem("userId", data.user.id);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050b18] px-4 py-8 font-sans text-white">
      <section className="w-full max-w-[460px] rounded-[28px] border border-blue-400/30 bg-[#0a1425]/80 px-6 py-10 sm:px-12 sm:py-8">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back!
          </h1>

          <p className="mt-3 text-base text-slate-400 sm:text-lg">
            Log in to your account
          </p>

        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="login-email"
              className="mb-3 block text-base font-medium"
            >
              Email address
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-[18px] border border-slate-600 bg-[#070f1d] px-5 py-3 text-base outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-3 block text-base font-medium"
            >
              Password
            </label>

            <div className="flex items-center rounded-[18px] border border-slate-600 bg-[#070f1d] pr-4 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-base outline-none placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-sm text-blue-400 transition hover:text-blue-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember me and forgot password */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2.5 text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 accent-blue-500"
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-[18px] bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-lg font-semibold transition hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0a1425] active:scale-[0.99] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-9 text-center text-sm text-slate-300 sm:text-base">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
