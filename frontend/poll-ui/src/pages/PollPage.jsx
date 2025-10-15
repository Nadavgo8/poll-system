import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { api } from "../services/api";
import UsernameInput from "../components/UsernameInput";
import OptionRadioGroup from "../components/OptionRadioGroup";
import ResultsList from "../components/ResultsList";

export default function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [username, setUsername] = useState(localStorage.username || "");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const j = await api.getPoll(id);
      setPoll(j);
    } catch (e) {
      setErr(e.message);
    }
  }
  useEffect(() => {
    load();
  }, [id]);

  async function submitVote() {
    if (!username.trim() || !selected) return;
    setBusy(true);
    setErr("");
    try {
      localStorage.username = username.trim();
      const j = await api.vote(id, {
        username: username.trim(),
        optionId: selected,
      });
      setPoll(j);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!poll) return <Spinner animation="border" role="status" />;

  return (
    <div className="d-grid gap-3">
      <Card body>
        <h4 className="mb-1">{poll.title}</h4>
        <div className="text-muted mb-3">Created by {poll.creator}</div>

        <UsernameInput value={username} onChange={setUsername} />
        <OptionRadioGroup
          options={poll.options}
          selected={selected}
          onSelect={setSelected}
        />

        {err && <Alert variant="danger">{err}</Alert>}
        <div className="d-flex gap-2">
          <Button
            onClick={submitVote}
            disabled={!username.trim() || !selected || busy}
          >
            {busy ? <Spinner size="sm" /> : "Vote"}
          </Button>
          <Button variant="outline-secondary" onClick={load}>
            Refresh
          </Button>
        </div>

        <div className="mt-3 text-muted">
          Share:{" "}
          <code>
            {window.location.origin}/p/{id}
          </code>
        </div>
      </Card>

      <Card body>
        <h5>Results</h5>
        <ResultsList options={poll.options} total={poll.totalVotes} />
      </Card>
    </div>
  );
}
