<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
=======
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  POPULAR_MEETINGS,
  RECENT_MEETINGS,
  HOBBY_MEETINGS,
} from "../data/meetings";
import { fetchMeetingById } from "../api/meetings";

const ALL_MEETINGS = [
  ...POPULAR_MEETINGS,
  ...RECENT_MEETINGS,
  ...HOBBY_MEETINGS,
];
>>>>>>> Stashed changes

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dbMeeting, setDbMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

<<<<<<< Updated upstream
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log("detail error:", error);
        setMeeting(null);
        setLoading(false);
        return;
      }

      setMeeting(data);
      setLoading(false);
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!meeting) return;

    const ok = window.confirm("Delete this meeting? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    setErr("");

    try {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meeting.id);
      if (error) throw error;

      // 삭제 후 해당 카테고리 페이지로 이동시키기
      const category = meeting.category;
      const to =
        category === "Sports"
          ? "/sports"
          : category === "Study"
            ? "/study"
            : category === "Project"
              ? "/project"
              : category === "Hobby"
                ? "/hobby"
                : "/";

      navigate(to, { replace: true });
    } catch (e) {
      console.error(e);
      setErr(e.message ?? "Failed to delete meeting.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <p>Loading...</p>
      </div>
=======
  const fallbackMeeting = useMemo(() => {
    return ALL_MEETINGS.find((m) => String(m.id) === String(id));
  }, [id]);

  useEffect(() => {
    let alive = true;

    if (fallbackMeeting) {
      setDbMeeting(null);
      setErr("");
      setLoading(false);
      return () => {
        alive = false;
      };
    }

    (async () => {
      setLoading(true);
      setErr("");

      try {
        const meeting = await fetchMeetingById(id);
        if (!alive) return;
        setDbMeeting(meeting);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setErr(e.message ?? "Failed to load meeting.");
        setDbMeeting(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [fallbackMeeting, id]);

  const meeting = dbMeeting ?? fallbackMeeting;

  if (loading && !meeting) {
    return (
      <section style={{ padding: 24 }}>
        <button className="btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 style={{ marginTop: 12 }}>Loading meeting...</h1>
      </section>
>>>>>>> Stashed changes
    );
  }

  if (!meeting) {
    return (
      <div className="section">
        <button className="btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
<<<<<<< Updated upstream
        <h1>Meeting not found</h1>
        <p>No meeting matches id: {id}</p>
      </div>
=======
        <h1 style={{ marginTop: 12 }}>Meeting not found</h1>
        <p style={{ opacity: 0.8 }}>
          No meeting matches id: <code>{id}</code>
        </p>
        {err ? <p style={{ opacity: 0.8 }}>Supabase error: {err}</p> : null}
      </section>
>>>>>>> Stashed changes
    );
  }

  return (
    <div className="section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}>
        <button className="btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <button
          className="btn"
          onClick={handleDelete}
          disabled={deleting}
          style={{
            border: "1px solid #ffd1d1",
            background: "#fff3f3",
            color: "#b20000",
            fontWeight: 800,
          }}>
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <h1 style={{ marginTop: 16 }}>{meeting.title}</h1>
      <p>{meeting.desc}</p>

      {meeting.tags?.length ? (
        <div className="tagRow">
          {meeting.tags.map((t) => (
            <span key={t} className="tag">
              #{t}
            </span>
          ))}
        </div>
      ) : null}

      <div style={{ marginTop: 12, opacity: 0.8 }}>
        {[meeting.mode, meeting.schedule, meeting.members]
          .filter(Boolean)
          .join(" · ")}
      </div>

      {err ? <p style={{ color: "crimson", marginTop: 12 }}>{err}</p> : null}
      <div style={{ marginTop: 20 }}>
        <button
          className="btn"
          onClick={() => setJoined(!joined)}
          style={{
            background: joined ? "#fff3f3" : "#f0fdf4",
            border: joined ? "1px solid #ffd1d1" : "1px solid #bbf7d0",
            color: joined ? "#b20000" : "#166534",
            fontWeight: 700,
            padding: "10px 24px",
          }}>
          {joined ? "Leave" : "Join"}
        </button>
        {joined && <p style={{ color: "#166534", marginTop: 8 }}>Joined!</p>}
      </div>
    </div>
  );
}
