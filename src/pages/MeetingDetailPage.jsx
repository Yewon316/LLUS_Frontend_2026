import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [meeting, setMeeting] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
  });

 
  useEffect(() => {
    const loadMeeting = async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setMeeting(data);
        setFormData({
          title: data.title,
          desc: data.desc,
        });
      }
    };

    loadMeeting();
  }, [id]);


  const handleSave = async () => {
    const { error } = await supabase
      .from("meetings")
      .update({
        title: formData.title,
        desc: formData.desc,
      })
      .eq("id", id);

    if (!error) {
      setMeeting((prev) => ({
        ...prev,
        title: formData.title,
        desc: formData.desc,
      }));
      setIsEditing(false);
    }
  };

  if (!meeting) {
    return (
      <section style={{ padding: 24 }}>
        <button className="btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Meeting not found</h1>
      </section>
    );
  }

  const isCreator = meeting.creator_id === user.id;

  return (
    <section style={{ padding: 24 }}>
      <button className="btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

   
      {isCreator && !isEditing && (
        <button
          className="btn"
          style={{ marginLeft: 12 }}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      )}

      {isEditing && (
        <button
          className="btn"
          style={{ marginLeft: 12 }}
          onClick={handleSave}
        >
          Save
        </button>
      )}

     
      {isEditing ? (
        <input
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 16,
            width: "100%",
            padding: 6,
          }}
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
      ) : (
        <h1 style={{ marginTop: 16 }}>{meeting.title}</h1>
      )}

    
      {isEditing ? (
        <textarea
          style={{
            width: "100%",
            height: 120,
            marginTop: 8,
            padding: 8,
            fontSize: 16,
          }}
          value={formData.desc}
          onChange={(e) =>
            setFormData({ ...formData, desc: e.target.value })
          }
        />
      ) : (
        <p style={{ opacity: 0.85, marginTop: 8 }}>{meeting.desc}</p>
      )}
    </section>
  );
}