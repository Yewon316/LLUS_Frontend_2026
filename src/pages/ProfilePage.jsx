import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Logout failed.");
    }
  };

  if (loading) {
    return <div className="section">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="section">
        <div className="meetingCreate__card">
          <h1 className="meetingCreate__title">Profile</h1>
          <p className="meetingCreate__subtitle">You are not logged in.</p>
          <div className="meetingCreate__actions">
            <button
              className="meetingCreate__btn meetingCreate__btn--primary"
              onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section meetingCreate">
      <div className="meetingCreate__card">
        <h1 className="meetingCreate__title">User Profile</h1>
        <p className="meetingCreate__subtitle">
          Your basic account information.
        </p>

        <div className="meetingCreate__form">
          <div className="meetingCreate__actions">
            <button
              className="meetingCreate__btn meetingCreate__btn--primary"
              type="button"
              onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
