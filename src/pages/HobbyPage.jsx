import SearchPlus from "../components/SearchPlus";
import { HOBBY_MEETINGS } from "../data/meetings";
import MeetingGrid from "../components/MeetingGrid";
import "../styles/home.css";
import { useState } from "react";

export default function HobbyPage() {
  const [keyword, setKeyword] = useState(""); //검색어 상태 (SearchPlus에서 입력받음)
  const [activeFilter, setActiveFilter] = useState("All"); // 현재 선택된 필터 버튼 상태

  const creativeTags = [
    "Photography",
    "Music",
    "Guitar",
    "Art",
    "Drawing",
    "Movie",
    "Discussion",
    "Writing",
    "Creative",
  ];

  const outdoorTags = ["Outdoor", "Hiking"];

  const socialTags = [
    "Social",
    "Board Game",
    "Reading",
    "Books",
    "Baking",
    "Cooking",
    "Yoga",
    "Health",
  ];

  const search = keyword.trim().toLowerCase(); // 검색어를 미리 정리
  // trim() → 앞뒤 공백 제거
  // toLowerCase() → 대소문자 구분 없이 비교

  const hobbyMeetings = HOBBY_MEETINGS.filter((item) => {
    if (activeFilter === "All") return true;

    if (activeFilter === "Creative") {
      return item.tags.some((tag) => creativeTags.includes(tag)); // item.tags 배열 안에 creativeTags 중 하나라도 있으면 true
    }
    if (activeFilter === "Outdoor") {
      return item.tags.some((tag) => outdoorTags.includes(tag));
    }
    if (activeFilter === "Social") {
      return item.tags.some((tag) => socialTags.includes(tag));
    }
    return true;
  })

    .filter((item) => {
      if (!search) return true; // 검색어가 없으면 전체 통과
      return item.title?.toLowerCase().includes(search); // title이 존재할 경우 소문자로 변환 후 검색어 포함 여부 확인
    });

  return (
    <div className="section">
      <div>
        <SearchPlus keyword={keyword} setKeyword={setKeyword} />
        <h3 className="section__title">Hobby</h3>
        <div className="filter_buttons">
          <button
            className={`filter_text ${activeFilter === "All" ? "filter_text--active" : ""}`}
            onClick={() => setActiveFilter("All")}>
            All
          </button>
          <button
            className={`filter_text ${activeFilter === "Creative" ? "filter_text--active" : ""}`}
            onClick={() => setActiveFilter("Creative")}>
            Creative
          </button>
          <button
            className={`filter_text ${activeFilter === "Outdoor" ? "filter_text--active" : ""}`}
            onClick={() => setActiveFilter("Outdoor")}>
            Outdoor
          </button>
          <button
            className={`filter_text ${activeFilter === "Social" ? "filter_text--active" : ""}`}
            onClick={() => setActiveFilter("Social")}>
            Social
          </button>
        </div>
        <MeetingGrid meetings={hobbyMeetings} columns={3} />
      </div>
    </div>
  );
}
