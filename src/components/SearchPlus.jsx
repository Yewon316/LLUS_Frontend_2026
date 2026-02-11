import React from "react";
import { CATEGORIES } from "../data/meetings";

export default function SearchSection({
  category,
  setCategory,
  keyword,
  setKeyword,
  onSearch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ category, keyword });
  };

  return (
    <section className="hero">
      <h1 className="hero__title">어떤 모임을 찾고 있나요?</h1>
      <form className="search" onSubmit={handleSubmit}>
        <div className="search__selectWrap">
          <select
            className="search__select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="카테고리 선택">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="search__caret"></span>
        </div>

        <div className="search__inputWrap">
          <input
            className="search__input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="키워드로 바로 입력하세요"
          />
        </div>
        <button className="btn btn--primary" type="submit">
          검색
        </button>
        <button className="btn plus_button" type="button">
          +
        </button>
      </form>
    </section>
  );
}
