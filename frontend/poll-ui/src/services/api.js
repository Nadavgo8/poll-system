class HttpError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}


export async function fetchJson(url, options) {
  const r = await fetch(url, options);
  const text = await r.text();

  // Try parse JSON either way
  let data;
  try {
    data = JSON.parse(text);
  } catch {}

  if (!r.ok) {
    const msg = (data && data.message) || text || r.statusText;
    throw new HttpError(r.status, msg, data ?? text);
  }
  return data ?? text;
}

export const api = {
  listPolls: ({ limit = 100, offset = 0 } = {}) =>
    fetchJson(`/api/polls?limit=${limit}&offset=${offset}`),

  createPoll: (body) =>
    fetchJson(`/api/polls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  getPoll: (id) => fetchJson(`/api/polls/${id}`),

  vote: (id, { username, optionId }) =>
    fetchJson(`/api/polls/${id}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, optionId }),
    }),
};
