import SearchPlus from "../components/SearchPlus";
import { HOBBY_MEETINGS } from "../data/meetings";
import MeetingGrid from "../components/MeetingGrid";
import "../styles/home.css";
import { useState } from "react";

export default function HobbyPage() {
  const [keyword, setKeyword] = useState(""); //검색어 상태 (SearchPlus에서 입력받음)
  const [activeFilter, setActiveFilter] = useState("All"); // 현재 선택된 필터 버튼 상태
  const [meetings, setMeetings] = useState(HOBBY_MEETINGS);
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [mode, setMode] = useState("");
  const [members, setMembers] = useState("");
  const [time, setTime] = useState("");
  const [tags, setTags] = useState("");
  
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

  const hobbyMeetings = meetings.filter((item) => {
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

    const handleAdd = () => {
      if (!title.trim()) return
      const newHobby = {
        id: Date.now(),
        title,
        desc,
        tags: [],
        mode,
        schedule: time,
        members,
      }
      setMeetings([...meetings, newHobby])
      setTitle("")
      setDesc("")
      setTime("")
      setMode("")
      setMembers("")
      setTags("")
    }

  const handleDelete = (id) => {
    setMeetings(meetings.filter(m => m.id !== id))
  }


  return (
    <div className="section">
      <div>
        <SearchPlus keyword={keyword} setKeyword={setKeyword} />
        <h3 className="section__title">Hobby</h3>
        <button className="addBtn" onClick={() => setShowForm(!showForm)}>+</button>
        {showForm && (
          <div className="createForm">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (e.g. Photography, Outdoor)" />
            <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Schedule (e.g. Every Saturday)" />
            <input value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Mode (Online / Offline)" />
            <input value={members} onChange={(e) => setMembers(e.target.value)} placeholder="Members (e.g. 6 members)" />
            <button onClick={handleAdd}>Create</button>
          </div>
        )}
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
        <MeetingGrid meetings={hobbyMeetings} columns={3} onDelete={handleDelete} />
      </div>
    </div>
  );
}
