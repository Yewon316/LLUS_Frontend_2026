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

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dbMeeting, setDbMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [joined, setJoined] = useState(false);

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
    );
  }

  if (!meeting) {
    return (
      <div className="section">
        <button className="btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 style={{ marginTop: 12 }}>Meeting not found</h1>
        <p style={{ opacity: 0.8 }}>
          No meeting matches id: <code>{id}</code>
        </p>
        {err ? <p style={{ opacity: 0.8 }}>Supabase error: {err}</p> : null}
      </div>
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
