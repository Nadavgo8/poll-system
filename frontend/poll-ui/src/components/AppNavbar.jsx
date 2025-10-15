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
