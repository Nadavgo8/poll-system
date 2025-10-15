import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import PollsPage from "./pages/PollsPage.jsx";
import NewPollPage from "./pages/NewPollPage.jsx";
import PollPage from "./pages/PollPage.jsx";

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="sm" className="mb-3">
      <Container>
        <Navbar.Brand>Polls</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/polls">
            All
          </Nav.Link>
          <Nav.Link as={Link} to="/new">
            Create
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Container className="pb-4">
        <Routes>
          <Route path="/" element={<Navigate to="/polls" replace />} />
          <Route path="/polls" element={<PollsPage />} />
          <Route path="/new" element={<NewPollPage />} />
          <Route path="/p/:id" element={<PollPage />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
