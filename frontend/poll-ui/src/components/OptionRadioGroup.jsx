import React from "react";
import { Form } from "react-bootstrap";

export default function OptionRadioGroup({ options, selected, onSelect }) {
  return (
    <Form>
      {options.map((o) => (
        <Form.Check
          key={o.id}
          type="radio"
          id={`opt-${o.id}`}
          name="option"
          label={o.text}
          checked={selected === o.id}
          onChange={() => onSelect(o.id)}
          className="mb-2"
        />
      ))}
    </Form>
  );
}
