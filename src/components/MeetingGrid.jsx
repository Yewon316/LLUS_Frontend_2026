import { useNavigate } from "react-router-dom";

export default function MeetingGrid({ meetings, columns = 3, onCardClick }) {
  const navigate = useNavigate();

  const goDetail = (m) => {
    onCardClick?.(m);
    navigate(`/meetings/${m.id}`);
  };

  return (
    <div className="meetingGrid" style={{ "--cols": columns }}>
      {meetings.map((m) => (
        <div
          key={m.id}
          className="meetingCard"
          onClick={() => goDetail(m)}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && goDetail(m)}>
          <h3 className="meetingTitle">{m.title}</h3>
          <p className="meetingDesc">{m.desc}</p>

          {m.tags?.length ? (
            <div className="tagRow">
              {m.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {(m.mode || m.schedule || m.members) && (
            <div className="meta">
              {[m.mode, m.schedule, m.members].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
