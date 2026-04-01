import React from "react";
import { useNavigate } from "react-router-dom";

export default function RecentList({
  items,
  title,
  rightActionLabel = "More",
}) {
  const navigate = useNavigate();

  return (
    <section className="section section--recent">
      <div className="section__head section__head--row">
        <h2 className="section__title">{title}</h2>
        <button className="linkBtn">{rightActionLabel}</button>
      </div>

      <div className="list">
        {items.map((m) => (
          <article
            key={m.id}
            className="card card--row"
            onClick={() => navigate(`/meetings/${m.id}`)}
            style={{ cursor: "pointer" }}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/meetings/${m.id}`)}
          >
            <div>
              <h3 className="card__title">{m.title}</h3>
              <p className="card__desc">{m.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
