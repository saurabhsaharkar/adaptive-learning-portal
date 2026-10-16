
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();

    // Connect to your backend authentication API later.
    console.log({ email, password, rememberMe });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050b18] px-4 py-8 font-sans text-white">
      <section className="w-full max-w-[460px] rounded-[28px] border border-blue-400/30 bg-[#0a1425]/80 px-6 py-10 sm:px-12 sm:py-8">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create your account
          </h1>

          <p className="mt-3 text-base text-slate-400 sm:text-lg">
            Start your personalized learning journey.
          </p>

        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="login-email"
              className="mb-3 block text-base font-medium"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="name"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-[18px] border border-slate-600 bg-[#070f1d] px-5 py-3 text-base outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

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

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-[18px] bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-lg font-semibold transition hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0a1425] active:scale-[0.99]"
          >
            Create Account
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-9 text-center text-sm text-slate-300 sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
