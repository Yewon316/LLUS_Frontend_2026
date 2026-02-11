import React, { useRef } from "react";
import { categoryClass } from "../utils/ui";

export default function PopularCarousel({ items }) {
  const scrollerRef = useRef(null);

  return (
    <section className="section">
      <div className="section__head">
        <div>
          <h2 className="section__title">지금 인기 있는 모임</h2>
          <p className="section__sub">
            이번 주에 참여자가 많은 모임을 모았어요
          </p>
        </div>
      </div>

      <div className="carousel" ref={scrollerRef}>
        {items.map((m) => (
          <article key={m.id} className="card card--popular">
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
    </section>
  );
}
