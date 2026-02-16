import React, { useMemo, useState } from "react";
import SearchSection from "../components/SearchSection";
import PopularCarousel from "../components/PopularCarousel";
import RecentList from "../components/RecentList";

import { POPULAR_MEETINGS, RECENT_MEETINGS } from "../data/meetings";

export default function HomePage() {
  const [category, setCategory] = useState("All");
  const [keyword, setKeyword] = useState("");

  const popular = useMemo(() => POPULAR_MEETINGS, []);

  const recentFiltered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return RECENT_MEETINGS;
    return RECENT_MEETINGS.filter(
      (m) =>
        m.title.toLowerCase().includes(kw) || m.desc.toLowerCase().includes(kw),
    );
  }, [keyword]);

  const handleSearch = ({ category, keyword }) => {
    console.log("search:", { category, keyword });
  };

  return (
    <>
      <SearchSection
        category={category}
        setCategory={setCategory}
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={handleSearch}
      />
      <PopularCarousel items={popular} />
      <RecentList items={recentFiltered} title="Latest Meetup" />
    </>
  );
}
