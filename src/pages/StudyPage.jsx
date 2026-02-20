import { useMemo, useState } from "react";
import SearchPlus from "../components/SearchPlus";
import { STUDY_MEETINGS } from "../data/meetings";
import MeetingGrid from "../components/MeetingGrid";


export default function StudyPage() {
  const [keyword, setKeyword] = useState("");

  const studyMeetings = useMemo(
    () => STUDY_MEETINGS.filter((m) => m.category === "Study"),
    [],
  );

  const filteredMeetings = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return studyMeetings;

    return STUDY_MEETINGS.filter((m) => {
      const haystack = [m.title, m.desc]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [keyword, studyMeetings]);

  return (
    <div className="section">
      <div>
        <SearchPlus keyword={keyword} setKeyword={setKeyword} />
        <MeetingGrid meetings={filteredMeetings} columns={3} />
      </div>
    </div>
  );
}
