import { Link } from "react-router-dom"

export default function MeetingGrid({ meetings, columns = 3, onCardClick }) {
  return (
    <div
      className="meetingGrid"
      style={{ "--cols": columns }} // only used to pass columns value into CSS
     >
        {meetings.map((m) => (
           <Link
        to= {`/${m.category.toLowerCase()}/${m.id}`}
        key = {m.id}
        style = {{ textDecoration: 'none', color: 'inherit' }}
      >
          <div
            key={m.id}
            className="meetingCard"
          onClick={() => onCardClick?.(m)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onCardClick?.(m)}>
          <h3 className="meetingTitle">{m.title}</h3>
          {/* <p className="meetingDesc">{m.desc}</p> */}

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
        </Link>
      ))}
    </div>
  );
}
