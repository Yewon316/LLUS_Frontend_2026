import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

export default function MeetingCreatePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const category = params.get("category") ?? "Sports";
  const from = decodeURIComponent(params.get("from") ?? "/");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [mode, setMode] = useState("Offline");
  const [schedule, setSchedule] = useState("");
  const [members, setMembers] = useState("");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const tags = useMemo(() => {
    return tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [tagsText]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!title.trim()) {
      setErr("Title is required.");
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
        schedule: schedule.trim(),
        members: members.trim(),
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
        <p className="meetingCreate__subtitle">
          Fill out the details and we’ll drop it straight into the list.
        </p>

        <form className="meetingCreate__form" onSubmit={onSubmit}>
          <div className="meetingCreate__grid">
            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">Title</label>
              <input
                className="meetingCreate__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Running Crew (Beginner-Friendly)"
              />
            </div>

            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">Description</label>
              <textarea
                className="meetingCreate__textarea"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What’s the plan? 장소/목표/규칙 등"
              />
            </div>

            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">
                Tags (comma separated)
              </label>
              <input
                className="meetingCreate__input"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Beginners Welcome, Running"
              />
              <div className="meetingCreate__hint">
                Preview:{" "}
                {tags.length ? tags.map((t) => `#${t}`).join(" ") : "—"}
              </div>
            </div>

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

            <div className="meetingCreate__field">
              <label className="meetingCreate__label">Schedule</label>
              <input
                className="meetingCreate__input"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Weekend afternoons"
              />
            </div>

            <div className="meetingCreate__field meetingCreate__field--full">
              <label className="meetingCreate__label">Members</label>
              <input
                className="meetingCreate__input"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                placeholder="14 members / No limit"
              />
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
