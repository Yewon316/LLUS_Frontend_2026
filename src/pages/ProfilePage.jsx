import React, { useEffect, useState } from "react";
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


  const [createdMeetings, setCreatedMeetings] = useState([]);
  const [joinedMeetings, setJoinedMeetings] = useState([]);

  useEffect(() => {
    const loadCreatedMeetings = async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setCreatedMeetings(data);
      }
    };

    loadCreatedMeetings();
  }, [user.id]);

  const tabData = [createdMeetings, joinedMeetings];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Logout failed.");
    }
  };

  const handleSave = async () => {
    console.log("Saving profile with data:", formData);
    setIsEditing(false);
  };


  const handleDelete = async (id) => {
    await supabase.from("meetings").delete().eq("id", id);
    setCreatedMeetings((prev) => prev.filter((m) => m.id !== id));
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
              onClick={() => navigate("/login")}
            >
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
            <button
              className="profile__info-edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
          <button className="profile__info-save" onClick={handleSave}>
            Save
          </button>

          <div className="profile__info-fields">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <p className="profile__info-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
                {isEditing ? (
                  <input
                    className="profile__info-input"
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  />
                ) : (
                  <p className="profile__info-value">{formData[key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

     
      <div className="profile__tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`profile__tab ${
              activeTab === i ? "profile__tab--active" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="profile__content">
        {tabData[activeTab].length === 0 ? (
          <p className="profile__empty">No meetings found.</p>
        ) : (
          tabData[activeTab].map((item) => (
            <div key={item.id}>
              <div
                className="profile__item"
                onClick={() => navigate(`/meetings/${item.id}`)}
              >
                <div>
                  <p className="profile__item-title">{item.title}</p>
                  <p className="profile__item-category">{item.category}</p>
                </div>
              </div>

             
              {activeTab === 0 && (
                <button
                  className="profile__delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              )}
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