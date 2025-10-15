import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import OptionListEditor from "../components/OptionListEditor";

export default function NewPollPage() {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState(localStorage.username || "");
  const [options, setOptions] = useState(["", ""]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const body = {
      title: title.trim(),
      creator: creator.trim(),
      options: options.map((s) => s.trim()).filter(Boolean),
    };
    if (!body.title || !body.creator || body.options.length < 2) {
      setErr("Please fill title, your name, and at least two options.");
      return;
    }
    setBusy(true);
    try {
      const j = await api.createPoll(body);
      localStorage.username = body.creator;
      nav(`/p/${j.id}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card body>
      <h4 className="mb-3">Create Poll</h4>
      {err && <Alert variant="danger">{err}</Alert>}
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Your name</Form.Label>
          <Form.Control
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="e.g. Nadav"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Question / Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's for lunch?"
          />
        </Form.Group>

        <OptionListEditor options={options} setOptions={setOptions} />

        <div className="d-flex gap-2 mt-3">
          <Button type="submit" disabled={busy}>
            {busy ? <Spinner size="sm" /> : "Create poll"}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
