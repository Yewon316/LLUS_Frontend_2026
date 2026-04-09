import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
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
          No meeting matches id <code>{id}</code>.
          <br />
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
  const [searchParams] = useSearchParams();
  const startInEditMode = searchParams.get("edit") === "true";

  const navigate = useNavigate();
  const { user } = useAuth();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [joining, setJoining] = useState(false);

  const [isEditing, setIsEditing] = useState(startInEditMode);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    category: "",
    schedule: "",
    mode: "",
  });

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

      setFormData({
        title: meetingRes.data.title || "",
        desc: meetingRes.data.desc || "",
        category: meetingRes.data.category || "",
        schedule: meetingRes.data.schedule || "",
        mode: meetingRes.data.mode || "",
      });

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

 
  const handleSave = async () => {
  const { data: updated, error } = await supabase
    .from("meetings")
    .update({
      title: formData.title,
      desc: formData.desc,
      category: formData.category,
      schedule: formData.schedule,
      mode: formData.mode,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update meeting:", error);
    return;
  }

  setMeeting(updated);
  setIsEditing(false);
};
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
    ? joined
      ? "Leaving..."
      : "Joining..."
    : joined
    ? "Leave Meeting"
    : "Join this Meeting";

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
                <span
                  className={`badge ${BADGE_CLASS[meeting.category] || ""}`}
                >
                  {meeting.category}
                </span>
              )}
              <h1 className="detail__title">{meeting.title}</h1>
            </div>

            <div className="detail__body">
                            {isEditing ? (
                <form
                  className="meetingCreate__form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="meetingCreate__grid">

                    <div className="meetingCreate__field meetingCreate__field--full">
                      <label className="meetingCreate__label">Title</label>
                      <input
                        className="meetingCreate__input"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g., Running Crew (Beginner-Friendly)"
                      />
                    </div>

                    <div className="meetingCreate__field meetingCreate__field--full">
                      <label className="meetingCreate__label">Description</label>
                      <textarea
                        className="meetingCreate__textarea"
                        value={formData.desc}
                        onChange={(e) =>
                          setFormData({ ...formData, desc: e.target.value })
                        }
                        placeholder="What’s the plan? 장소/목표/규칙 등"
                      />
                    </div>

                    <div className="meetingCreate__field">
                      <label className="meetingCreate__label">Mode</label>
                      <select
                        className="meetingCreate__select"
                        value={formData.mode}
                        onChange={(e) =>
                          setFormData({ ...formData, mode: e.target.value })
                        }
                      >
                        <option value="Offline">Offline</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>

                    <div className="meetingCreate__field">
                      <label className="meetingCreate__label">Schedule</label>
                      <input
                        className="meetingCreate__input"
                        value={formData.schedule}
                        onChange={(e) =>
                          setFormData({ ...formData, schedule: e.target.value })
                        }
                        placeholder="Weekend afternoons"
                      />
                    </div>
                  </div>

                  <div className="meetingCreate__actions">
                    <button
                      className="meetingCreate__btn meetingCreate__btn--primary"
                      type="submit"
                    >
                      Save
                    </button>

                    <button
                      className="meetingCreate__btn"
                      type="button"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {meeting.desc && (
                    <p className="detail__desc">{meeting.desc}</p>
                  )}


                  {(meeting.mode ||
                    meeting.schedule ||
                    meeting.members ||
                    meeting.category) && (
                    <div className="detail__info">
                      {meeting.mode && (
                        <div className="detail__infoItem">
                          <span className="detail__label">Mode</span>
                          <span className="detail__value">
                            {meeting.mode}
                          </span>
                        </div>
                      )}
                      {meeting.schedule && (
                        <div className="detail__infoItem">
                          <span className="detail__label">Schedule</span>
                          <span className="detail__value">
                            {meeting.schedule}
                          </span>
                        </div>
                      )}
                      {meeting.members && (
                        <div className="detail__infoItem">
                          <span className="detail__label">Members</span>
                          <span className="detail__value">
                            {meeting.members}
                          </span>
                        </div>
                      )}
                      {meeting.category && (
                        <div className="detail__infoItem">
                          <span className="detail__label">Category</span>
                          <span className="detail__value">
                            {meeting.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {meeting.tags?.length > 0 && (
                    <div className="detail__tags">
                      {meeting.tags.map((t) => (
                        <span key={t} className="tag">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="detail__footer">
              <div className="detail__actions">
                <button className="detail__joinBtn" onClick={handleJoin}>
                  {joinLabel}
                </button>

                {meeting.user_id === user?.id && !isEditing && (
                  <button
                    className="detail__joinBtn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}

                <button className="detail__backBtn" onClick={goBack}>
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}