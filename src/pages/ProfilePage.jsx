import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import "../styles/detail.css";

const TABS = ["Created", "Joined"];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    school: "",
    major: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (user?.user_metadata) {
      setFormData({
        name: user.user_metadata.name || "",
        gender: user.user_metadata.gender || "",
        school: user.user_metadata.school || "",
        major: user.user_metadata.major || "",
        phone: user.user_metadata.phone || "",
        bio: user.user_metadata.bio || "",
      });
    }
  }, [user]);

  const tabData = [[], []];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Logout failed.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: formData,
      });
      if (error) throw error;
      setIsEditing(false);
      alert("Profile updated successfully!");
      // Optionally refresh the session
      await supabase.auth.getSession();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset formData to original
    if (user?.user_metadata) {
      setFormData({
        name: user.user_metadata.name || "",
        gender: user.user_metadata.gender || "",
        school: user.user_metadata.school || "",
        major: user.user_metadata.major || "",
        phone: user.user_metadata.phone || "",
        bio: user.user_metadata.bio || "",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
  const nickname = user.user_metadata?.username;

  return (
    <div className="section profile">
      <div style={{ marginBottom: "32px" }}>
        <h1 className="profile__nickname">{nickname}</h1>
        <p className="profile__email">{user.email}</p>

        <div className="profile__info">
          <div className="profile__info-header">
            <h2 className="profile__info-title">Basic Info</h2>
          {!isEditing && <button className="profile__info-edit" onClick={handleEdit}>Edit</button>}
          <div className="profile__info-fields">
            <div>
              <p className="profile__info-label">Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="profile__info-input"
                />
              ) : (
                <p className="profile__info-value">{formData.name || "Not set"}</p>
              )}
            </div>
            <div>
              <p className="profile__info-label">Gender</p>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="profile__info-input"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="profile__info-value">{formData.gender || "Not set"}</p>
              )}
            </div>
            <div>
              <p className="profile__info-label">School</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => handleInputChange("school", e.target.value)}
                  className="profile__info-input"
                />
              ) : (
                <p className="profile__info-value">{formData.school || "Not set"}</p>
              )}
            </div>
            <div>
              <p className="profile__info-label">Major</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  className="profile__info-input"
                />
              ) : (
                <p className="profile__info-value">{formData.major || "Not set"}</p>
              )}
            </div>
            <div>
              <p className="profile__info-label">Phone</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="profile__info-input"
                />
              ) : (
                <p className="profile__info-value">{formData.phone || "Not set"}</p>
              )}
            </div>
            <div>
              <p className="profile__info-label">Bio</p>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="profile__info-input"
                  rows="3"
                />
              ) : (
                <p className="profile__info-value">{formData.bio || "Not set"}</p>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="profile__actions">
              <button className="profile__btn profile__btn--save" onClick={handleSave}>Save</button>
              <button className="profile__btn profile__btn--cancel" onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      <div className="profile__tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`profile__tab ${activeTab === i ? "profile__tab--active" : ""}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="profile__content">
        {tabData[activeTab].length === 0 ? (
          <p className="profile__empty">No meetings found.</p>
        ) : (
          tabData[activeTab].map((item) => (
            <div
              key={item.id}
              className="profile__item"
              onClick={() => navigate(`/meetings/${item.id}`)}>
              <div>
                <p className="profile__item-title">{item.title}</p>
                <p className="profile__item-category">{item.category}</p>
              </div>
              <p className="profile__item-date">{item.date}</p>
            </div>
          ))
        )}
      </div>
      <button className="profile__logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
