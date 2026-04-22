import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];

export default function MeetingCreatePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const category = params.get("category") ?? "Sports";
  const from = decodeURIComponent(params.get("from") ?? "/");

  // Basic fields
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mode, setMode] = useState("Offline");

  // Tags — chip-based
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Schedule — structured
  const [days, setDays] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");

  // Members — number + no limit
  const [noLimit, setNoLimit] = useState(false);
  const [memberCount, setMemberCount] = useState("");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");


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


  const toggleDay = (d) =>
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  const scheduleString = () => {
    if (days.length === 0 && !timeSlot) return "";
    const dayPart = days.length > 0 ? days.join("/") : "";
    return [dayPart, timeSlot].filter(Boolean).join(" · ");
  };


  const membersString = () => {
    if (noLimit) return "No limit";
    return memberCount ? `${memberCount} members` : "";
  };

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!desc.trim()) return "Description is required.";
    if (tags.length === 0) return "At least one tag is required.";
    if (days.length === 0) return "Select at least one day for the schedule.";
    if (!timeSlot) return "Select a time slot for the schedule.";
    if (!noLimit && !memberCount) return "Enter member count or select No limit.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const validationError = validate();
    if (validationError) {
      setErr(validationError);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: crypto.randomUUID(),
        category,
        title: title.trim(),
        desc: desc.trim(),
        tags,
        mode,
        schedule: scheduleString(),
        members: membersString(),
        user_id: user.id,
      };

      const { error } = await supabase.from("meetings").insert(payload);
      if (error) throw error;

      navigate(from, { replace: true });
    } catch (e2) {
      console.error(e2);
      setErr(e2.message ?? "Failed to create meeting.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section meetingCreate">
      <div className="meetingCreate__card">
        <button
          className="meetingCreate__back"
          type="button"
          onClick={() => navigate(from)}>
          ← Back
        </button>

        <h1 className="meetingCreate__title">Create a {category} meeting</h1>

        <form className="meetingCreate__form" onSubmit={onSubmit}>
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
                placeholder="What's the plan?"
              />
            </div>

            {/* Tags — chip input */}
            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">
                Tags <span className="meetingCreate__required">*</span>
              </label>
              <div className="meetingCreate__chipBox">
                {tags.map((t) => (
                  <span key={t} className="meetingCreate__chip">
                    #{t}
                    <button
                      type="button"
                      className="meetingCreate__chipRemove"
                      onClick={() => removeTag(t)}>
                      ×
                    </button>
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
            </div>

            {/* Mode */}
            <div className="meetingCreate__field">
              <label className="meetingCreate__label">Mode</label>
              <select
                className="meetingCreate__select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}>
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
                  value={memberCount}
                  onChange={(e) => setMemberCount(e.target.value)}
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
                      if (e.target.checked) setMemberCount("");
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
                    onClick={() => toggleDay(d)}>
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
                    onClick={() => setTimeSlot((prev) => (prev === t ? "" : t))}>
                    {t}
                  </button>
                ))}
              </div>

              {scheduleString() && (
                <div className="meetingCreate__hint">
                  Preview: {scheduleString()}
                </div>
              )}
            </div>
          </div>

          {err ? <div className="meetingCreate__error">{err}</div> : null}

          <div className="meetingCreate__actions">
            <button
              className="meetingCreate__btn meetingCreate__btn--primary"
              type="submit"
              disabled={saving}>
              {saving ? "Saving..." : "Create"}
            </button>
            <button
              className="meetingCreate__btn"
              type="button"
              onClick={() => navigate(from)}
              disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}