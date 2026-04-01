// import { useMemo, useState } from "react";
// import SearchPlus from "../components/SearchPlus";
// import MeetingGrid from "../components/MeetingGrid";
// import { Link } from "react-router-dom";

// export default function StudyPage({ meetings, onDelete }) {
//   const [keyword, setKeyword] = useState("");

//   const filteredMeetings = useMemo(() => {
//     const q = keyword.trim().toLowerCase();
//     if (!q) return meetings;

//     return meetings.filter((m) => {
//       const haystack = [m.title, m.desc]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       return haystack.includes(q);
//     });
//   }, [keyword, meetings]);

//   return (
//     <div className="section">
//       <div>
//         <Link to="/create">
//           <button className="createBtn">Create</button>
//         </Link>

//         <SearchPlus keyword={keyword} setKeyword={setKeyword} />

//         <MeetingGrid
//           meetings={filteredMeetings}
//           columns={3}
//           onDelete={onDelete}
//         />
//       </div>
//     </div>
//   )
// }

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchPlus from "../components/SearchPlus";
import MeetingGrid from "../components/MeetingGrid";
import { supabase } from "../lib/supabaseClient";
import { STUDY_MEETINGS } from "../data/meetings";

export default function StudyPage() {
  const [keyword, setKeyword] = useState("");
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("category", "Study")
        .order("created_at", { ascending: false });

      console.log("study data:", data);
      console.log("study error:", error);

      if (error) {
        console.error(error);
        return;
      }
      setMeetings(data ?? []);
    })();

  

  }, []);
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

  const handlePlus = () => {
    const from = encodeURIComponent(location.pathname + location.search);
    navigate(`/meetings/new?category=Study&from=${from}`);
  };

return (
    <div className="section">
      <div>
        <SearchPlus keyword={keyword} setKeyword={setKeyword} onPlus={handlePlus} />
        <h3 className="section__title">Study</h3>
        {/*<div className="filter_buttons">
          {["All","Creative","Outdoor","Social"].map(f => (
            <button key={f}
              className={`filter_text ${activeFilter === f ? "filter_text--active" : ""}`}
              onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>*/}
        <MeetingGrid meetings={filteredMeetings} columns={3} />
      </div>
    </div>
  );
}