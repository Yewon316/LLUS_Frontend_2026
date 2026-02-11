import SearchPlus from "../components/SearchPlus";
import { POPULAR_MEETINGS } from "../data/meetings";
import MeetingGrid from "../components/MeetingGrid";

export default function SportsPage() {
  const sportsMeetings = POPULAR_MEETINGS.filter(
    (m) => m.category === "스포츠",
  );

  return (
    <div className="section">
      <div>
        <SearchPlus />
        <MeetingGrid meetings={sportsMeetings} columns={3} />
      </div>
    </div>
  );
}
