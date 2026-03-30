import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HOBBY_MEETINGS } from "../data/meetings";
import "../styles/detail.css";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = HOBBY_MEETINGS.find((m) => m.id === id);

  const [members, setMembers] = useState(parseInt(item?.members) || 0);

  if (!item) return <p>Can't find the meeting</p>;

  return (
    <div className="detail">
      <div className="detail__members">{members}</div>

      <button className="detail__back" onClick={() => navigate(-1)}>Back</button>

      <h1 className="detail__title">{item.title}</h1>

      <div className="detail__tags">
        {item.tags.map((tag) => (
          <span key={tag} className="detail__tag">#{tag}</span>
        ))}
      </div>

      <p className="detail__meta">{item.mode} · {item.schedule} · {item.members}</p>

      <p className="detail__desc">{item.desc}</p>

      <button className="detail__join" onClick={() => setMembers((prev) => prev + 1)}>
        Join
      </button>
    </div>
  );
}
