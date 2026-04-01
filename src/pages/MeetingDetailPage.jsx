import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

const BADGE_CLASS = {
  Study: "badge-study",
  Project: "badge-project",
  Sports: "badge-sports",
  Hobby: "badge-hobby",
};

function DetailSkeleton() {
  return (
    <div className="detail__card" aria-hidden="true">
      <div className="detail__skeleton">
        <div className="skeleton-line detail__skeletonBadge" />
        <div className="skeleton-line detail__skeletonTitle" />
        <div className="skeleton-line detail__skeletonDesc" />
        <div className="skeleton-line detail__skeletonDesc detail__skeletonDesc--mid" />
        <div className="skeleton-line detail__skeletonDesc detail__skeletonDesc--short" />
        <div className="skeleton-line detail__skeletonInfo" />
        <div className="skeleton-line detail__skeletonBtn" />
      </div>
    </div>
  );
}

function EmptyState({ id, onBack }) {
  return (
    <div className="detail__card">
      <div className="detail__empty">
        <div className="detail__emptyIcon">🔍</div>
        <h2 className="detail__emptyTitle">Meeting not found</h2>
        <p className="detail__emptyDesc">
          No meeting matches id <code>{id}</code>.<br />
          It may have been removed or the link is incorrect.
        </p>
        <button className="detail__backBtn" onClick={onBack}>
          ← Go Back
        </button>
      </div>
    </div>
  );
}

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    (async () => {
      const [meetingRes, countRes] = await Promise.all([
        supabase.from("meetings").select("*").eq("id", id).single(),
        supabase
          .from("meeting_members")
          .select("*", { count: "exact", head: true })
          .eq("meeting_id", id),
      ]);

      if (meetingRes.error) {
        console.error(meetingRes.error);
        setLoading(false);
        return;
      }

      setMeeting(meetingRes.data);
      setMemberCount(countRes.count || 0);

      if (user) {
        const { data: membership } = await supabase
          .from("meeting_members")
          .select("id")
          .eq("meeting_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        setJoined(!!membership);
      }

      setLoading(false);
    })();
  }, [id, user]);

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setJoining(true);
    if (joined) {
      await supabase
        .from("meeting_members")
        .delete()
        .eq("meeting_id", id)
        .eq("user_id", user.id);
      setJoined(false);
      setMemberCount((prev) => prev - 1);
    } else {
      const { error } = await supabase
        .from("meeting_members")
        .insert({ meeting_id: id, user_id: user.id });
      if (!error) {
        setJoined(true);
        setMemberCount((prev) => prev + 1);
      }
    }
    setJoining(false);
  };

  const goBack = () => navigate(-1);

  const joinLabel = !user
    ? "Login to Join"
    : joining
      ? joined ? "Leaving..." : "Joining..."
      : joined ? "Leave Meeting" : "Join this Meeting";

  return (
    <section className="detail">
      <div className="detail__wrap">
        <button className="detail__back" onClick={goBack}>
          ← Back
        </button>

        {loading ? (
          <DetailSkeleton />
        ) : !meeting ? (
          <EmptyState id={id} onBack={goBack} />
        ) : (
          <div className="detail__card">
            <div className="detail__header">
              {meeting.category && (
                <span className={`badge ${BADGE_CLASS[meeting.category] || ""}`}>
                  {meeting.category}
                </span>
              )}
              <h1 className="detail__title">{meeting.title}</h1>
            </div>

            <div className="detail__body">
              {meeting.desc && (
                <p className="detail__desc">{meeting.desc}</p>
              )}

              <div className="detail__info">
                {meeting.mode && (
                  <div className="detail__infoItem">
                    <span className="detail__label">Mode</span>
                    <span className="detail__value">{meeting.mode}</span>
                  </div>
                )}
                {meeting.schedule && (
                  <div className="detail__infoItem">
                    <span className="detail__label">Schedule</span>
                    <span className="detail__value">{meeting.schedule}</span>
                  </div>
                )}
                <div className="detail__infoItem">
                  <span className="detail__label">Members</span>
                  <span className="detail__value">{memberCount}</span>
                </div>
                {meeting.category && (
                  <div className="detail__infoItem">
                    <span className="detail__label">Category</span>
                    <span className="detail__value">{meeting.category}</span>
                  </div>
                )}
              </div>

              {meeting.tags?.length > 0 && (
                <div className="detail__tags">
                  {meeting.tags.map((t) => (
                    <span key={t} className="tag">#{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="detail__footer">
              <div className="detail__actions">
                <button
                  className={`detail__joinBtn ${joined ? "detail__joinBtn--leave" : ""}`}
                  onClick={handleJoin}
                  disabled={joining}
                >
                  {joinLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
