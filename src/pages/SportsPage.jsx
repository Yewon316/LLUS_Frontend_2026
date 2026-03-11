import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchPlus from "../components/SearchPlus";
import MeetingGrid from "../components/MeetingGrid";
import { supabase } from "../lib/supabaseClient";



export default function SportsPage() {
  const [keyword, setKeyword] = useState("");
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("category", "Sports")
        .order("created_at", { ascending: false });

      console.log("sports data:", data);
      console.log("sports error:", error);

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
    navigate(`/meetings/new?category=Sports&from=${from}`);
  };

  return (
    <div className="section">
      <div>
        <SearchPlus
          keyword={keyword}
          setKeyword={setKeyword}
          onPlus={handlePlus}
        />
        <MeetingGrid meetings={filteredMeetings} columns={3} />
      </div>
    </div>
  );
}
