import { useMemo, useState } from "react";
import SearchPlus from "../components/SearchPlus";
import MeetingGrid from "../components/MeetingGrid";
import { Link } from "react-router-dom";

export default function StudyPage({ meetings, onDelete }) {
  const [keyword, setKeyword] = useState("");

  const filteredMeetings = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return meetings;

    return meetings.filter((m) => {
      const haystack = [m.title, m.desc]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [keyword, meetings]);

  return (
    <div className="section">
      <div>
        <Link to="/create">
          <button className="createBtn">Create</button>
        </Link>

        <SearchPlus keyword={keyword} setKeyword={setKeyword} />

        <MeetingGrid
          meetings={filteredMeetings}
          columns={3}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}