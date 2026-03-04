
import { Link } from "react-router-dom";
// I add onDelete and onCreate props

export default function MeetingGrid({ meetings, columns = 3, onCardClick, onDelete, onCreate }) {
  return (
    <div
      className="meetingGrid"
      style={{ "--cols": columns }}  // only used to pass columns value into CSS
    >
      {meetings.map((m) => (
        <div key={m.id} className="meetingCardWrapper">

          <Link
            to={`/${m.category.toLowerCase()}/${m.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="meetingCard"
              onClick={() => onCardClick?.(m)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onCardClick?.(m)}
            >
              <h3 className="meetingTitle">{m.title}</h3>
                    {/* <p className="meetingDesc">{m.desc}</p> , desc는 카드에서 안보이게 */}  
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

          {/* 요기에 삭제 버튼 추가 */}
          <button
            className="deleteBtn"
            onClick={() => onDelete?.(m.id)}>Delete</button>

          {/* 요기에 create 버튼 추가 */}
           {/* <button
            className="createBtn"
            onClick={() => onCreate?.(m.id)}>Create</button> */}

        </div>
      ))}
    </div>
  );
}