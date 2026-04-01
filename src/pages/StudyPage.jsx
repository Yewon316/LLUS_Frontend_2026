import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchPlus from "../components/SearchPlus";
import MeetingGrid from "../components/MeetingGrid";
import SkeletonCard from "../components/SkeletonCard";
import { supabase } from "../lib/supabaseClient";
import useScrollReveal from "../hooks/useScrollReveal";

export default function StudyPage() {
  const [keyword, setKeyword] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const revealRef = useScrollReveal();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("category", "Study")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setMeetings(data ?? []);
      setLoading(false);
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
        {loading ? (
          <div className="meetingGrid" style={{ "--cols": 3 }}>
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="reveal" ref={revealRef}>
            <MeetingGrid meetings={filteredMeetings} columns={3} />
          </div>
        )}
      </div>
    </div>
  );
}