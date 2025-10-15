import React from "react";
import { Form } from "react-bootstrap";

export default function UsernameInput({ value, onChange }) {
  return (
    <Form.Group className="mb-3" controlId="username">
      <Form.Label>Username</Form.Label>
      <Form.Control
        type="text"
        placeholder="Type a name to vote"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Form.Text className="text-muted">
        No login — just a name; one vote per poll per username.
      </Form.Text>
    </Form.Group>
  );
}
