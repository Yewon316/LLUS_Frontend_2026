import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchPlus from "../components/SearchPlus";
import MeetingGrid from "../components/MeetingGrid";
import SkeletonCard from "../components/SkeletonCard";
import { supabase } from "../lib/supabaseClient";
import "../styles/home.css";

export default function HobbyPage() {
  const [keyword, setKeyword] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("category", "Hobby")
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

  const hobbyMeetings = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    if (!search) return meetings;
    return meetings.filter((item) =>
      item.title?.toLowerCase().includes(search)
    );
  }, [meetings, keyword]);

  const handlePlus = () => {
    const from = encodeURIComponent(location.pathname);
    navigate(`/meetings/new?category=Hobby&from=${from}`);
  };

  return (
    <div className="section">
      <div>
        <SearchPlus keyword={keyword} setKeyword={setKeyword} onPlus={handlePlus} />
        <h3 className="section__title">Hobby</h3>
        {loading ? (
          <div className="meetingGrid" style={{ "--cols": 3 }}>
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <MeetingGrid meetings={hobbyMeetings} columns={3} />
        )}
      </div>
    </div>
  );
}