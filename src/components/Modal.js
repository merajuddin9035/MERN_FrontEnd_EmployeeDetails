import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ show, onClose, onDelete, onUpdate, employee, actionType }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        department: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (actionType === 'update' && employee) {
            setFormData({
                name: employee.name || '',
                age: employee.age || '',
                department: employee.department || '',
                email: employee.email || '',
                phone: employee.phone || '',
                address: employee.address || '',
            });
        } else if (actionType === 'insert') {
            
            setFormData({
                name: '',
                age: '',
                department: '',
                email: '',
                phone: '',
                address: '',
            });
        }
    }, [employee, actionType]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAction = () => {
        if (actionType === 'delete') {
            onDelete();
        } else {
            onUpdate(formData);
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{actionType === 'delete' ? 'Delete Employee' : actionType === 'update' ? 'Update Employee' : 'Insert Employee'}</h2>
                {actionType === 'delete' ? (
                    <p>Are you sure you want to delete <strong>{employee.name}</strong>?</p>
                ) : (
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <label>Age:</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                        <label>Department:</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                )}
                <div className="modal-buttons">
                    <button onClick={handleAction}>{actionType === 'delete' ? 'Delete' : actionType === 'update' ? 'Update' : 'Insert Employee'}</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
