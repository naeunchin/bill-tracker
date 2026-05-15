import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './App.css';
import Home from './Home.jsx';
import Bills from './Bills.jsx';
import Login from './Login.jsx';

function App() {
    return (
        <>
            {/* 1. The Bootstrap Navigation Bar */}
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand as={Link} to="/">Bill Tracker</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/bills">Manage Bills</Nav.Link>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bills" element={<Bills />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;