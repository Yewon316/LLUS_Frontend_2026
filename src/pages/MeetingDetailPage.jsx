import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
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
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setMeeting(data);
      setLoading(false);
    })();
  }, [id]);

  const goBack = () => navigate(-1);

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

              {(meeting.mode || meeting.schedule || meeting.members || meeting.category) && (
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
                  {meeting.members && (
                    <div className="detail__infoItem">
                      <span className="detail__label">Members</span>
                      <span className="detail__value">{meeting.members}</span>
                    </div>
                  )}
                  {meeting.category && (
                    <div className="detail__infoItem">
                      <span className="detail__label">Category</span>
                      <span className="detail__value">{meeting.category}</span>
                    </div>
                  )}
                </div>
              )}

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
                <button className="detail__joinBtn">Join this Meeting</button>
                <button className="detail__backBtn" onClick={goBack}>Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
