import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!username.trim()) {
      setErr("Username is required.");
      return;
    }

    if (!email.trim()) {
      setErr("Email is required.");
      return;
    }

    if (!password) {
      setErr("Password is required.");
      return;
    }

    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      });

      if (error) throw error;

      if (data?.session) {
        navigate("/", { replace: true });
        return;
      }

      setMsg(
        "Sign-up successful. Please check your email and confirm your account before logging in.",
      );
    } catch (error) {
      console.error(error);
      setErr(error.message ?? "Sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section meetingCreate">
      <div className="meetingCreate__card">
        <h1 className="meetingCreate__title">Sign Up</h1>
        <p className="meetingCreate__subtitle">
          Create your account with username, email, and password.
        </p>

        <form className="meetingCreate__form" onSubmit={onSubmit}>
          <div className="meetingCreate__grid">
            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">Username</label>
              <input
                className="meetingCreate__input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>

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
                placeholder="At least 6 characters"
              />
            </div>

            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">Confirm Password</label>
              <input
                className="meetingCreate__input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          {err ? <div className="meetingCreate__error">{err}</div> : null}
          {msg ? <div className="meetingCreate__hint">{msg}</div> : null}

          <div className="meetingCreate__actions">
            <button
              className="meetingCreate__btn meetingCreate__btn--primary"
              type="submit"
              disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
