import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

function Bar({ pct }) {
  return (
    <div className="bar">
      <div className="barFill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [username, setUsername] = useState(localStorage.username || "");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    const r = await fetch(`/api/polls/${id}`);
    if (r.ok) setPoll(await r.json());
    else setMsg("Poll not found.");
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const total = poll?.totalVotes ?? 0;

  async function vote() {
    if (!username.trim() || !selected) return;
    setLoading(true);
    setMsg("");
    try {
      localStorage.username = username.trim();
      const r = await fetch(`/api/polls/${id}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          optionId: selected,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Vote failed");
      setPoll(j);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  const shareUrl = useMemo(() => `${window.location.origin}/p/${id}`, [id]);

  if (!poll)
    return (
      <div className="card">
        Loading… {msg && <div className="err">{msg}</div>}
      </div>
    );

  return (
    <div className="grid">
      <section className="card">
        <h2>{poll.title}</h2>
        <p className="muted">Created by {poll.creator}</p>

        <label className="field">
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Type a name to vote"
          />
        </label>

        <div className="choices">
          {poll.options.map((o) => (
            <label key={o.id} className="choice">
              <input
                type="radio"
                name="opt"
                checked={selected === o.id}
                onChange={() => setSelected(o.id)}
              />
              <span>{o.text}</span>
            </label>
          ))}
        </div>

        <div className="actions">
          <button
            onClick={vote}
            disabled={!username.trim() || !selected || loading}
          >
            {loading ? "Submitting…" : "Vote"}
          </button>
          {msg && <div className="err">{msg}</div>}
        </div>

        <div className="share">
          <span className="muted">Share:</span> <code>{shareUrl}</code>
        </div>
      </section>

      <section className="card">
        <h3>Results</h3>
        <p className="muted">Total votes: {total}</p>
        <div className="results">
          {poll.options.map((o) => (
            <div key={o.id} className="resultRow">
              <div className="label">
                <strong>{o.text}</strong>
                <span>
                  {o.votes} ({o.percentage}%)
                </span>
              </div>
              <Bar pct={o.percentage} />
            </div>
          ))}
        </div>
        <button className="ghost" onClick={load} style={{ marginTop: 8 }}>
          Refresh
        </button>
      </section>
    </div>
  );
}
