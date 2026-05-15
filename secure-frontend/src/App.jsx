import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useEffect } from 'react';
import './App.css';
import Home from './Home.jsx';
import Bills from './Bills.jsx';
import keycloak from './keycloak.js'

// Check if the user is logged in
function RequireAuth({ children }) {
    useEffect(() => {
        if (!keycloak.authenticated) {
            keycloak.login();
        }
    }, []);

    if (!keycloak.authenticated) {
        return <div className="text-center mt-5"><h3>Redirecting to Secure Login...</h3></div>;
    }
    return children;
}

function App() {
    const handleLogin = () => {
        keycloak.login();
    }
    const handleLogout = () => {
        keycloak.logout({ redirectUri: window.location.origin });
    };

    return (
        <>
            {/* Navigation Bar */}
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand as={Link} to="/">Bill Tracker</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/bills">Manage Bills</Nav.Link>
                        </Nav>
                        <Nav>
                            {/* Dynamically swap Login/Logout buttons based on auth state */}
                            {!keycloak.authenticated ? (
                                <Button variant="outline-light" onClick={handleLogin}>Login</Button>
                            ) : (
                                <>
                                    {/* Display the username from the token */}
                                    <Navbar.Text className="me-3">
                                        Signed in as: {keycloak.tokenParsed?.preferred_username}
                                    </Navbar.Text>
                                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bills" element={
                        <RequireAuth>
                            <Bills />
                        </RequireAuth>
                    } />
                </Routes>
            </Container>
        </>
    );
}

export default App;