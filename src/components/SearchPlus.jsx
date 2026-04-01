import React from "react";

export default function SectionPlus({
  category,
  setCategory,
  keyword,
  setKeyword,
  onSearch,
  onPlus,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ category, keyword });
  };

  return (
    <section className="hero">
      <h1 className="hero__title">Which meeting are you looking for</h1>
      <form className="search_plus" onSubmit={handleSubmit}>
        <div className="search__inputWrap">
          <input
            className="search__input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Type keyword here"
          />
        </div>
        <button className="btn--search" type="submit">
          Search
        </button>
        <button className="btn--plus" type="button" onClick={onPlus}>
          +
        </button>
      </form>
    </section>
  );
}