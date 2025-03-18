import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

function AdminDashboard({ setToken }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stock`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products', err);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/'); // Use navigate instead of history.push
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Available Products</h5>
              {products.length > 0 ? (
                <ul className="list-group">
                  {products.map((product) => (
                    <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {product.name} 
                      <span className="badge bg-primary">{product.stock} in stock</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Actions</h5>
              <button className="btn btn-primary w-100 mb-3" onClick={() => navigate('/create-product')}>Create Product</button>
              <button className="btn btn-secondary w-100" onClick={() => navigate('/manage-products')}>Manage Products</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
