import { useMemo, useState } from "react";
import SearchPlus from "../components/SearchPlus";
import { POPULAR_MEETINGS } from "../data/meetings";
import MeetingGrid from "../components/MeetingGrid";

export default function SportsPage() {
  const [keyword, setKeyword] = useState("");

  const sportsMeetings = useMemo(
    () => POPULAR_MEETINGS.filter((m) => m.category === "Sports"),
    [],
  );

  const filteredMeetings = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return sportsMeetings;

    return sportsMeetings.filter((m) => {
      const haystack = [
        m.title,
        m.desc,
        m.category,
        ...(m.tags ?? []),
        m.mode,
        m.schedule,
        m.members,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [keyword, sportsMeetings]);

  return (
    <div className="section">
      <div>
        <SearchPlus keyword={keyword} setKeyword={setKeyword} />
        <MeetingGrid meetings={filteredMeetings} columns={3} />
      </div>
    </div>
  );
}
