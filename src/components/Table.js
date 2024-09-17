import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import './Table.css';

const Table = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [actionType, setActionType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/employees')
            .then(response => response.json())
            .then(data => {
                setEmployees(data);
                setFilteredEmployees(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value === '') {
            setFilteredEmployees(employees);
        } else {
            setFilteredEmployees(
                employees.filter(employee =>
                    employee.name.toLowerCase().includes(event.target.value.toLowerCase())
                )
            );
        }
    };

    const handleInsert = () => {
        setSelectedEmployee(null);
        setActionType('insert');
        setShowModal(true);
    };

    const handleDelete = (employee) => {
        setSelectedEmployee(employee);
        setActionType('delete');
        setShowModal(true);
    };

    const handleUpdate = (employee) => {
        setSelectedEmployee(employee);
        setActionType('update');
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedEmployee(null);
    };

    const handleModalDelete = () => {
        fetch(`http://localhost:5000/api/employees/${selectedEmployee._id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(() => {
                setEmployees(employees.filter(employee => employee._id !== selectedEmployee._id));
                setFilteredEmployees(filteredEmployees.filter(employee => employee._id !== selectedEmployee._id));
                alert(`${selectedEmployee.name} deleted successfully!`);
                handleModalClose();
            })
            .catch(error => console.error('Error deleting data:', error));
    };

    const handleModalUpdate = (newEmployee) => {
        if (actionType === 'update') {
            fetch(`http://localhost:5000/api/employees/${selectedEmployee._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            })
                .then(response => response.json())
                .then(updatedEmployee => {
                    setEmployees(employees.map(employee =>
                        employee._id === selectedEmployee._id ? updatedEmployee : employee
                    ));
                    setFilteredEmployees(filteredEmployees.map(employee =>
                        employee._id === selectedEmployee._id ? updatedEmployee : employee
                    ));
                    alert(`${updatedEmployee.name} updated successfully!`);
                    handleModalClose();
                })
                .catch(error => console.error('Error updating data:', error));
        } else if (actionType === 'insert') {
            fetch('http://localhost:5000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            })
                .then(response => response.json())
                .then(addedEmployee => {
                    setEmployees([...employees, addedEmployee]);
                    setFilteredEmployees([...filteredEmployees, addedEmployee]);
                    alert(`${addedEmployee.name} added successfully!`);
                    handleModalClose();
                })
                .catch(error => console.error('Error adding data:', error));
        }
    };

    return (
        <div>
            <h1>Employee Details</h1>
            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button onClick={handleInsert}>
                    <FontAwesomeIcon icon={faPlus} /> Insert Employee
                </button>
            </div>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Department</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={employee._id}>
                                <td>{index + 1}</td>
                                <td>{employee.name}</td>
                                <td>{employee.age}</td>
                                <td>{employee.department}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.address}</td>
                                <td>
                                    <button onClick={() => handleUpdate(employee)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(employee)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal
                show={showModal}
                onClose={handleModalClose}
                onDelete={handleModalDelete}
                onUpdate={handleModalUpdate}
                employee={selectedEmployee}
                actionType={actionType}
            />
        </div>
    );
};

export default Table;
