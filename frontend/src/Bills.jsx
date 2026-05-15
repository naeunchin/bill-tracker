import { useState, useEffect } from "react";
import './Bills.css';
import { Modal, Button, Form } from 'react-bootstrap';

function Bills() {
    const [bills, setBills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        payeeName: '',
        dueDate: '',
        paymentDue: '',
        paid: false
    });

    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const API_URL = 'http://localhost:8080/restapi/bills';

    const isManager = false;

    useEffect(() => {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error('Server error');
                return response.json();
            })
            .then(data => {
                setBills(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = () => {
        if (!formData.payeeName || !formData.dueDate || formData.paymentDue === '') {
            alert("Please fill out all required fields before saving.");
            return;
        }

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to save bill.');
                return response.json();
            })
            .then(savedBill => {
                if (editingId) {
                    setBills(bills.map(b => b.id === editingId ? savedBill : b));
                } else {
                    setBills([...bills, savedBill]);
                }
                handleClose();
            })
            .catch(error => {
                console.error("Error saving bill", error);
                alert(error.message);
            });
    };

    const handleClose = () => setShowModal(false);

    const handleShow = () => {
        setEditingId(null);
        setFormData({ payeeName: '', dueDate: '', paymentDue: '', paid: false });
        setShowModal(true);
    };

    const handleEdit = (bill) => {
        setEditingId(bill.id);
        setFormData({
            payeeName: bill.payeeName,
            dueDate: bill.dueDate,
            paymentDue: bill.paymentDue,
            paid: bill.paid
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this bill?")) {
            fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        setBills(bills.filter(bill => bill.id !== id));
                    } else {
                        alert("Failed to delete this bill.");
                    }
                })
                .catch(error => console.error("Error deleting:", error));
        }
    };

    return (
        <div className="app-container">
            <h1>My Bill Tracker</h1>

            {!isManager && (
                <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                    <Button variant="success" onClick={handleShow}>
                        + New Bill
                    </Button>
                </div>
            )}

            {isLoading ? (
                <p>Loading bills from database...</p>
            ) : bills.length === 0 ? (
                <p>No bills found.</p>
            ) : (
                <table className="bills-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Payee Name</th>
                        <th>Due Date</th>
                        <th>Amount Due</th>
                        <th>Status</th>
                        {!isManager && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {bills.map(bill => (
                        <tr key={bill.id}>
                            <td>{bill.id}</td>
                            <td>{bill.username}</td>
                            <td>{bill.payeeName}</td>
                            <td>{bill.dueDate}</td>
                            <td>${bill.paymentDue ? bill.paymentDue.toFixed(2) : '0.00'}</td>
                            <td>
                                <span className={bill.paid ? "status-paid" : "status-unpaid"}>
                                    {bill.paid ? "Paid" : "Unpaid"}
                                </span>
                            </td>
                            {!isManager && (
                                <td style={{ whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(bill)}
                                        style={{
                                            backgroundColor: '#ffc107',
                                            color: '#000',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '10px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bill.id)}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Bill Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Payee Name <span style={{color: 'red'}}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="payeeName"
                                value={formData.payeeName}
                                onChange={handleInputChange}
                                placeholder="e.g., NAIT"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date <span style={{color: 'red'}}>*</span></Form.Label>
                            <Form.Control
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Payment Due <span style={{color: 'red'}}>*</span></Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="paymentDue"
                                value={formData.paymentDue}
                                onChange={handleInputChange}
                                placeholder="0.00"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="paid"
                                label="Bill paid?"
                                checked={formData.paid}
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Bills;