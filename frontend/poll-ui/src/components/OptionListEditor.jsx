import React from "react";
import { Button, InputGroup, Form } from "react-bootstrap";

export default function OptionListEditor({ options, setOptions }) {
  const add = () => options.length < 8 && setOptions([...options, ""]);
  const del = (i) =>
    options.length > 2 && setOptions(options.filter((_, j) => j !== i));
  const set = (i, val) => {
    const next = options.slice();
    next[i] = val;
    setOptions(next);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Form.Label className="mb-0">Options</Form.Label>
        <Button
          size="sm"
          variant="outline-primary"
          onClick={add}
          disabled={options.length >= 8}
        >
          + Add
        </Button>
      </div>

      {options.map((v, i) => (
        <InputGroup className="mb-2" key={i}>
          <Form.Control
            placeholder={`Option ${i + 1}`}
            value={v}
            onChange={(e) => set(i, e.target.value)}
            required
          />
          <Button
            variant="outline-danger"
            onClick={() => del(i)}
            disabled={options.length <= 2}
          >
            ✕
          </Button>
        </InputGroup>
      ))}
    </>
  );
}
