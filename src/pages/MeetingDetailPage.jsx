import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  POPULAR_MEETINGS,
  RECENT_MEETINGS,
  HOBBY_MEETINGS,
} from "../data/meetings";

const ALL_MEETINGS = [
  ...POPULAR_MEETINGS,
  ...RECENT_MEETINGS,
  ...HOBBY_MEETINGS,
];

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const meeting = useMemo(() => {
    return ALL_MEETINGS.find((m) => String(m.id) === String(id));
  }, [id]);

  if (!meeting) {
    return (
      <section style={{ padding: 24 }}>
        <button className="btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 style={{ marginTop: 12 }}>Meeting not found</h1>
        <p style={{ opacity: 0.8 }}>
          No meeting matches id: <code>{id}</code>
        </p>
      </section>
    );
  }

  return (
    <section style={{ padding: 24 }}>
      <button className="btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 style={{ marginTop: 16 }}>{meeting.title}</h1>
      <p style={{ opacity: 0.85, marginTop: 8 }}>{meeting.desc}</p>

      {(meeting.category ||
        meeting.mode ||
        meeting.schedule ||
        meeting.members) && (
        <div style={{ marginTop: 12, opacity: 0.75 }}>
          {[meeting.category, meeting.mode, meeting.schedule, meeting.members]
            .filter(Boolean)
            .join(" · ")}
        </div>
      )}

      {meeting.tags?.length ? (
        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {meeting.tags.map((t) => (
            <span key={t} className="tag">
              #{t}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
