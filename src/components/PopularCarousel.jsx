import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { categoryClass } from "../utils/ui";

export default function PopularCarousel({ items }) {
  const scrollerRef = useRef(null);
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="section__head">
        <div>
          <h2 className="section__title">Trending</h2>
          <p className="section__sub">
            이번 주에 참여자가 많은 모임을 모았어요
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="section__sub" style={{ textAlign: "center", padding: "24px 0" }}>
          해당 카테고리의 Trending 모임이 없습니다
        </p>
      ) : (
        <div className="carousel" ref={scrollerRef}>
          {items.map((m) => (
            <article
              key={m.id}
              className="card card--popular"
              onClick={() => navigate(`/meetings/${m.id}`)}
              style={{ cursor: "pointer" }}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/meetings/${m.id}`)}
            >
              <div className="card__top">
                <span className={categoryClass(m.category)}>{m.category}</span>
              </div>

              <h3 className="card__title">{m.title}</h3>
              <p className="card__desc">{m.desc}</p>

              <div className="tags">
                {m.tags.map((t) => (
                  <span key={t} className="tag">
                    # {t}
                  </span>
                ))}
              </div>

              <div className="meta">
                <span>{m.mode}</span>
                <span>·</span>
                <span>{m.schedule}</span>
                <span>·</span>
                <span>{m.members}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
