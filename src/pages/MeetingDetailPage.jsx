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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];

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

// ── Schedule string ↔ structured state helpers ──────────────────
// stored format: "Mon/Wed · Morning"  or  "Sat · Afternoon"  etc.
function parseSchedule(str) {
  if (!str) return { days: [], timeSlot: "" };
  const parts = str.split("·").map((s) => s.trim());
  const days = parts[0] ? parts[0].split("/").map((d) => d.trim()).filter(Boolean) : [];
  const timeSlot = parts[1] ?? "";
  return { days, timeSlot };
}

function buildSchedule(days, timeSlot) {
  const dayPart = days.length > 0 ? days.join("/") : "";
  return [dayPart, timeSlot].filter(Boolean).join(" · ");
}

// ── Members string ↔ structured state helpers ───────────────────
function parseMembers(str) {
  if (!str) return { noLimit: false, memberCount: "" };
  if (str === "No limit") return { noLimit: true, memberCount: "" };
  const n = str.replace(/\D/g, "");
  return { noLimit: false, memberCount: n };
}

function buildMembers(noLimit, memberCount) {
  if (noLimit) return "No limit";
  return memberCount ? `${memberCount} members` : "";
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

  // ── Edit form state ──────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mode, setMode] = useState("Offline");

  // Tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Schedule
  const [days, setDays] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");

  // Members
  const [noLimit, setNoLimit] = useState(false);
  const [editMemberCount, setEditMemberCount] = useState("");

  const [saveErr, setSaveErr] = useState("");

  // ── Load meeting ─────────────────────────────────────────────
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

      const m = meetingRes.data;
      setMeeting(m);
      setMemberCount(countRes.count || 0);
      initEditForm(m);

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

  const initEditForm = (m) => {
    setTitle(m.title || "");
    setDesc(m.desc || "");
    setMode(m.mode || "Offline");
    setTags(m.tags || []);
    const { days: d, timeSlot: t } = parseSchedule(m.schedule);
    setDays(d);
    setTimeSlot(t);
    const { noLimit: nl, memberCount: mc } = parseMembers(m.members);
    setNoLimit(nl);
    setEditMemberCount(mc);
  };

  // ── Tag helpers ──────────────────────────────────────────────
  const addTag = (raw) => {
    const cleaned = raw.replace(/^#+/, "").trim();
    if (!cleaned) return;
    if (!tags.includes(cleaned)) setTags((prev) => [...prev, cleaned]);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleTagBlur = () => {
    if (tagInput.trim()) {
      addTag(tagInput);
      setTagInput("");
    }
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  // ── Day toggle ───────────────────────────────────────────────
  const toggleDay = (d) =>
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!desc.trim()) return "Description is required.";
    if (tags.length === 0) return "At least one tag is required.";
    if (days.length === 0) return "Select at least one day for the schedule.";
    if (!timeSlot) return "Select a time slot for the schedule.";
    if (!noLimit && !editMemberCount) return "Enter member count or select No limit.";
    return null;
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveErr("");

    const validationError = validate();
    if (validationError) {
      setSaveErr(validationError);
      return;
    }

    const { error } = await supabase
      .from("meetings")
      .update({
        title: title.trim(),
        desc: desc.trim(),
        mode,
        tags,
        schedule: buildSchedule(days, timeSlot),
        members: buildMembers(noLimit, editMemberCount),
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update meeting:", error);
      setSaveErr(error.message ?? "Failed to save.");
      return;
    }

    // Re-fetch to get the latest data
    const { data: updated, error: fetchErr } = await supabase
      .from("meetings")
      .select("*")
      .eq("id", id)
      .single();

    if (!fetchErr && updated) setMeeting(updated);
    setIsEditing(false);
  };

  // ── Join/Leave ───────────────────────────────────────────────
  const handleJoin = async () => {
    if (!user) { navigate("/login"); return; }
    setJoining(true);
    if (joined) {
      await supabase.from("meeting_members").delete().eq("meeting_id", id).eq("user_id", user.id);
      setJoined(false);
      setMemberCount((prev) => prev - 1);
    } else {
      const { error } = await supabase.from("meeting_members").insert({ meeting_id: id, user_id: user.id });
      if (!error) { setJoined(true); setMemberCount((prev) => prev + 1); }
    }
    setJoining(false);
  };

  const goBack = () => navigate(-1);

  const joinLabel = !user ? "Login to Join"
    : joining ? (joined ? "Leaving..." : "Joining...")
    : joined ? "Leave Meeting"
    : "Join this Meeting";

  const schedulePreview = buildSchedule(days, timeSlot);

  return (
    <section className="detail">
      <div className="detail__wrap">
        <button className="detail__back" onClick={goBack}>← Back</button>

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
              {isEditing ? (
                <form className="meetingCreate__form" onSubmit={handleSave}>
                  <div className="meetingCreate__grid">

                    {/* Title */}
                    <div className="meetingCreate__field meetingCreate__field--full">
                      <label className="meetingCreate__label">
                        Title <span className="meetingCreate__required">*</span>
                      </label>
                      <input
                        className="meetingCreate__input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Running Crew (Beginner-Friendly)"
                      />
                    </div>

                    {/* Description */}
                    <div className="meetingCreate__field meetingCreate__field--full">
                      <label className="meetingCreate__label">
                        Description <span className="meetingCreate__required">*</span>
                      </label>
                      <textarea
                        className="meetingCreate__textarea"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="What's the plan? 장소/목표/규칙 등"
                      />
                    </div>

                    {/* Tags */}
                    <div className="meetingCreate__field meetingCreate__field--full">
                      <label className="meetingCreate__label">
                        Tags <span className="meetingCreate__required">*</span>
                      </label>
                      <div className="meetingCreate__chipBox">
                        {tags.map((t) => (
                          <span key={t} className="meetingCreate__chip">
                            #{t}
                            <button type="button" className="meetingCreate__chipRemove" onClick={() => removeTag(t)}>×</button>
                          </span>
                        ))}
                        <input
                          className="meetingCreate__chipInput"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          onBlur={handleTagBlur}
                          placeholder={tags.length === 0 ? "Type and press Enter or comma" : ""}
                        />
                      </div>
                      <div className="meetingCreate__hint"># is added automatically · Backspace to remove last tag</div>
                    </div>

                    {/* Mode */}
                    <div className="meetingCreate__field">
                      <label className="meetingCreate__label">Mode</label>
                      <select
                        className="meetingCreate__select"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                      >
                        <option value="Offline">Offline</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>

                    {/* Members */}
                    <div className="meetingCreate__field">
                      <label className="meetingCreate__label">
                        Members <span className="meetingCreate__required">*</span>
                      </label>
                      <div className="meetingCreate__membersRow">
                        <input
                          className="meetingCreate__input"
                          type="number"
                          min="1"
                          value={editMemberCount}
                          onChange={(e) => setEditMemberCount(e.target.value)}
                          placeholder="e.g., 10"
                          disabled={noLimit}
                          style={{ opacity: noLimit ? 0.4 : 1 }}
                        />
                        <label className="meetingCreate__noLimit">
                          <input
                            type="checkbox"
                            checked={noLimit}
                            onChange={(e) => {
                              setNoLimit(e.target.checked);
                              if (e.target.checked) setEditMemberCount("");
                            }}
                          />
                          No limit
                        </label>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="meetingCreate__field meetingCreate__field--full">
                      <label className="meetingCreate__label">
                        Schedule <span className="meetingCreate__required">*</span>
                      </label>
                      <div className="meetingCreate__days">
                        {DAYS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            className={`meetingCreate__dayBtn${days.includes(d) ? " meetingCreate__dayBtn--active" : ""}`}
                            onClick={() => toggleDay(d)}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                      <div className="meetingCreate__timeSlots">
                        {TIME_SLOTS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`meetingCreate__timeBtn${timeSlot === t ? " meetingCreate__timeBtn--active" : ""}`}
                            onClick={() => setTimeSlot((prev) => (prev === t ? "" : t))}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      {schedulePreview && (
                        <div className="meetingCreate__hint">Preview: {schedulePreview}</div>
                      )}
                    </div>
                  </div>

                  {saveErr && <div className="meetingCreate__error">{saveErr}</div>}

                  <div className="meetingCreate__actions">
                    <button className="meetingCreate__btn meetingCreate__btn--primary" type="submit">Save</button>
                    <button className="meetingCreate__btn" type="button" onClick={() => { setIsEditing(false); setSaveErr(""); initEditForm(meeting); }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  {meeting.desc && <p className="detail__desc">{meeting.desc}</p>}

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
                </>
              )}
            </div>

            <div className="detail__footer">
              <div className="detail__actions">
                {meeting.user_id !== user?.id && (
                  <button className="detail__joinBtn" onClick={handleJoin}>{joinLabel}</button>
                )}
                {meeting.user_id === user?.id && !isEditing && (
                  <button className="detail__joinBtn" onClick={() => setIsEditing(true)}>Edit</button>
                )}
                <button className="detail__backBtn" onClick={goBack}>Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}