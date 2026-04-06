import { useState } from "react";
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
    name: user.user_metadata?.name || "",
    gender: user.user_metadata?.gender || "",
    school: user.user_metadata?.school || "",
    major: user.user_metadata?.major || "",
    phone: user.user_metadata?.phone || "",
    bio: user.user_metadata?.bio || "",
});

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

    const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          gender: formData.gender,
          school: formData.school,
          major: formData.major,
          phone: formData.phone,
          bio: formData.bio
        }
      });
      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };


  return (
    <div className="section profile">
  
      <div style={{ marginBottom: "32px" }}>
        <h1 className="profile__nickname">{nickname}</h1>
        <p className="profile__email">{user.email}</p>
  
        <div className="profile__info">
        <div className="profile__info-header">
          <h2 className="profile__info-title">Basic Info</h2>
          <button className="profile__info-edit"
          onClick={() => setIsEditing(true)}>
            Edit
          </button>
               <button className="profile__info-save" onClick={handleSave}>Save</button>
        </div>


        <div className="profile__info-fields">
          <div>
            <p className="profile__info-label">Name</p>
              {isEditing?(
              <input
                className="prifile__info-input"
                value = {formData.name}
                onChange = {(e) => setFormData({...formData, name: e.target.value})}
              />
            ) : (
               <p className="profile__info-value">{formData.name}</p>
            )}

          </div>
          <div>
            <p className="profile__info-label">Gender</p>
              {isEditing?(
              <input
                className="prifile__info-input"
                value = {formData.gender}
                onChange = {(e) => setFormData({...formData, gender: e.target.value})}
              />
            ) : (
               <p className="profile__info-value">{formData.gender}</p>
            )}
          </div>
          <div>
            <p className="profile__info-label">School</p>
              {isEditing?(
              <input
                className="prifile__info-input"
                value = {formData.school}
                onChange = {(e) => setFormData({...formData, school: e.target.value})}
              />
            ) : (
               <p className="profile__info-value">{formData.school}</p>
            )}
          </div>
          <div>
            <p className="profile__info-label">Major</p>
              {isEditing?(
              <input
                className="prifile__info-input"
                value = {formData.major}
                onChange = {(e) => setFormData({...formData, major: e.target.value})}
              />
            ) : (
               <p className="profile__info-value">{formData.major}</p>
            )}
          </div>
          <div>
            <p className="profile__info-label">Phone</p>
              {isEditing?(
              <input
                className="prifile__info-input"
                value = {formData.phone}
                onChange = {(e) => setFormData({...formData, phone: e.target.value})}
              />
            ) : (
               <p className="profile__info-value">{formData.phone}</p>
            )}
          </div>
          <div>
            <p className="profile__info-label">Bio</p>
              {isEditing?(
              <input
                className="prifile__info-input"
                value = {formData.bio}
                onChange = {(e) => setFormData({...formData, bio: e.target.value})}
              />
            ) : (
               <p className="profile__info-value">{formData.bio}</p>
            )}
          </div>
        </div>
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