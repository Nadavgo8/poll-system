import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPoll() {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState(localStorage.username || "");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  function addOption() {
    if (options.length < 8) setOptions([...options, ""]);
  }
  function removeOption(i) {
    if (options.length > 2) setOptions(options.filter((_, j) => j !== i));
  }
  function setOpt(i, v) {
    const next = options.slice();
    next[i] = v;
    setOptions(next);
  }

  async function submit(e) {
    e.preventDefault();
    const body = {
      title: title.trim(),
      creator: creator.trim(),
      options: options.map((o) => o.trim()).filter(Boolean),
    };
    if (!body.title || !body.creator || body.options.length < 2) {
      alert("Please fill title, your name, and at least 2 options.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Failed to create poll");
      localStorage.username = body.creator; // remember
      nav(`/p/${j.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Create a Poll</h2>

      <label className="field">
        <span>Your name</span>
        <input
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          placeholder="e.g., Nadav"
        />
      </label>

      <label className="field">
        <span>Question / title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., What's for lunch?"
        />
      </label>

      <div className="options">
        <div className="row">
          <h4>Options</h4>
          <button
            type="button"
            onClick={addOption}
            disabled={options.length >= 8}
          >
            + Add
          </button>
        </div>

        {options.map((v, i) => (
          <div key={i} className="option-row">
            <input
              value={v}
              onChange={(e) => setOpt(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
            />
            <button
              type="button"
              className="ghost"
              onClick={() => removeOption(i)}
              disabled={options.length <= 2}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="actions">
        <button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create poll"}
        </button>
      </div>
    </form>
  );
}
