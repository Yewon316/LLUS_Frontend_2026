import React, { useMemo , useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  POPULAR_MEETINGS,
  RECENT_MEETINGS,
  HOBBY_MEETINGS,
} from "../data/meetings";
 

// 임시 방편으로 테스트용
const TEMP_CREATED_MEETINGS = [
  {
    id: "s1",
    title: "MA 265 Linear Algebra Study Group",
    desc: "We study linear algebra",
    category: "Study",
    tags: ["math", "linear algebra"],
  }
];


const ALL_MEETINGS = [
  ...POPULAR_MEETINGS,
  ...RECENT_MEETINGS,
  ...HOBBY_MEETINGS,
  ...TEMP_CREATED_MEETINGS,
];

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const meeting = useMemo(() => {
    return ALL_MEETINGS.find((m) => String(m.id) === String(id));
  }, [id]);

  // 요기 추가
  const [isEditing, setIsEditing] = useState(false);  
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
  });

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title,
        desc: meeting.desc,
      });
    }
  }, [meeting]);

  const handleSave = () => {
    setIsEditing(false);
  };
  // 요기 까지

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
      {!isEditing ? (
        <button
          className="btn"
          style={{ marginLeft: 12 }}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      ) : (
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
        <h1 style={{ marginTop: 16 }}>{formData.title}</h1>
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
        <p style={{ opacity: 0.85, marginTop: 8 }}>{formData.desc}</p>
      )}
      
      {/* 
      <h1 style={{ marginTop: 16 }}>{meeting.title}</h1>
      <p style={{ opacity: 0.85, marginTop: 8 }}>{meeting.desc}</p> */}

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
