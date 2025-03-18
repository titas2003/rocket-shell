import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import AssociateRegister from './components/AssociateRegister';
import AssociateLogin from './components/AssociateLogin';
import HomePage from './components/HomePage'; // Import HomePage component
import OrderForm from './components/OrderForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <div className="App">
        {/* Define Routes */}
        <Routes>
          {/* Root Route */}
          <Route path="/" element={<HomePage />} />

          {/* Other Routes */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/dashboard" element={token ? <AdminDashboard setToken={setToken} /> : <AdminLogin />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/create-product" element={<ProductForm />} />
          <Route path="/associate-register" element={<AssociateRegister />} />
          <Route path="/associate-login" element={<AssociateLogin />} />
          <Route path="/create-order" element={<OrderForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
