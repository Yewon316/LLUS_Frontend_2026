import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchPlus from "../components/SearchPlus";
import MeetingGrid from "../components/MeetingGrid";
import SkeletonCard from "../components/SkeletonCard";
import { supabase } from "../lib/supabaseClient";
import useScrollReveal from "../hooks/useScrollReveal";
import "../styles/home.css";

const CREATIVE_TAGS = [
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
const OUTDOOR_TAGS = ["Outdoor", "Hiking"];
const SOCIAL_TAGS = [
  "Social",
  "Board Game",
  "Reading",
  "Books",
  "Baking",
  "Cooking",
  "Yoga",
  "Health",
];

export default function HobbyPage() {
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
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

  // ★ elly의 필터 로직 그대로 유지
  const creativeTags = ["Photography","Music","Guitar","Art","Drawing","Movie","Discussion","Writing","Creative"];
  const outdoorTags = ["Outdoor", "Hiking"];
  const socialTags = ["Social","Board Game","Reading","Books","Baking","Cooking","Yoga","Health"];

  const hobbyMeetings = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return meetings
      .filter((item) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Creative") return item.tags?.some(t => creativeTags.includes(t));
        if (activeFilter === "Outdoor") return item.tags?.some(t => outdoorTags.includes(t));
        if (activeFilter === "Social") return item.tags?.some(t => socialTags.includes(t));
        return true;
      })
      .filter((item) => {
        if (!search) return true;
        return item.title?.toLowerCase().includes(search);
      });
  }, [meetings, activeFilter, keyword]);

  // ★ Create는 Aaron의 MeetingCreatePage로 이동
  const handlePlus = () => {
    const from = encodeURIComponent(location.pathname);
    navigate(`/meetings/new?category=Hobby&from=${from}`);
  };

  return (
    <div className="section">
      <div>
        <SearchPlus keyword={keyword} setKeyword={setKeyword} onPlus={handlePlus} />
        <h3 className="section__title">Hobby</h3>
        <div className="filter_buttons">
          {["All","Creative","Outdoor","Social"].map(f => (
            <button key={f}
              className={`filter_text ${activeFilter === f ? "filter_text--active" : ""}`}
              onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="meetingGrid" style={{ "--cols": 3 }}>
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="reveal" ref={revealRef}>
            <MeetingGrid meetings={hobbyMeetings} columns={3} />
          </div>
        )}
      </div>
    </div>
  );
}