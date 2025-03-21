import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AdminAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);  // State to track the current page
    const [ordersPerPage] = useState(10);  // Number of orders per page
    const navigate = useNavigate();  // Initialize useNavigate hook for navigation

    useEffect(() => {
        // Fetch data from the API
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/orders`);
                setOrders(response.data.orders); // Assuming the data structure is like 'orders' array
                setLoading(false);
            } catch (error) {
                setError('Failed to load orders.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array to run this only once when the component mounts

    const handleGetDetails = (orderId) => {
        navigate(`/order-summary/${orderId}`);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Pagination component
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container mt-4">
            <h2>Orders</h2>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Total Price</th>
                        <th>Payment Status</th>
                        <th>Warranty Till</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.orderId}</td>
                            <td>{order.customerName}</td>
                            <td>{order.customerEmail}</td>
                            <td>{order.customerPhoneNumber}</td>
                            <td>{order.totalBillablePrice}</td>
                            <td>{order.paymentStatus}</td>
                            <td>{new Date(order.warrantyTill).toLocaleDateString()}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleGetDetails(order.orderId)}>
                                    Get Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePagination(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </li>
                    {pageNumbers.map((number) => (
                        <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePagination(number)}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePagination(currentPage < pageNumbers.length ? currentPage + 1 : pageNumbers.length)}
                            disabled={currentPage === pageNumbers.length}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminAllOrders;
