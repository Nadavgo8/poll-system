import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PollsList() {
  const [polls, setPolls] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const r = await fetch("/api/polls?limit=100");
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Failed to load polls");
      setPolls(j);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (!polls)
    return (
      <div className="card">
        Loading… {err && <div className="err">{err}</div>}
      </div>
    );
  if (polls.length === 0)
    return (
      <div className="card">
        <h3>Polls</h3>
        <p className="muted">
          No polls yet. <Link to="/new">Create one</Link>.
        </p>
      </div>
    );

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Polls</h3>
        <button className="ghost" onClick={load}>
          Refresh
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {polls.map((p) => (
          <li
            key={p.id}
            style={{ padding: "10px 0", borderBottom: "1px solid #1e2230" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <Link to={`/p/${p.id}`} style={{ fontWeight: 600 }}>
                  {p.title}
                </Link>
                <div className="muted" style={{ fontSize: 12 }}>
                  By {p.creator} · {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="muted">
                Votes: <strong>{p.totalVotes ?? 0}</strong>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
