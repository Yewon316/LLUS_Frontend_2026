import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search ?? ""}`
    : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      setErr(error.message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section meetingCreate">
      <div className="meetingCreate__card">
        <h1 className="meetingCreate__title">Login</h1>
        <p className="meetingCreate__subtitle">
          Sign in with your email and password.
        </p>

        <form className="meetingCreate__form" onSubmit={onSubmit}>
          <div className="meetingCreate__grid">
            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">Email</label>
              <input
                className="meetingCreate__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">Password</label>
              <input
                className="meetingCreate__input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {err ? <div className="meetingCreate__error">{err}</div> : null}

          <div className="meetingCreate__actions">
            <button
              className="meetingCreate__btn meetingCreate__btn--primary"
              type="submit"
              disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={{ color: "var(--accent)", fontWeight: "600" }}>
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
