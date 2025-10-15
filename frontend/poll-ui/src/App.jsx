import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import PollsList from "./pages/PollsList.jsx";
import NewPoll from "./pages/NewPoll.jsx";
import PollPage from "./pages/PollPage.jsx";
import "./styles.css";

function Layout({ children }) {
  return (
    <>
      <header className="topbar">
        <div className="container">
          <Link to="/polls" className="brand">
            Polls
          </Link>
          <nav>
            <Link to="/polls">All</Link>
            <Link to="/new">Create</Link>
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/polls" replace />} />
          <Route path="/polls" element={<PollsList />} />
          <Route path="/new" element={<NewPoll />} />
          <Route path="/p/:id" element={<PollPage />} />
          <Route path="*" element={<div className="card">Not found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
