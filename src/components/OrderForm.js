import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderForm() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerId] = useState(`ROCK-CUST-${Math.floor(Math.random() * 10000)}`);
  const [custName, setCustName] =useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [warrantyTill, setWarrantyTill] = useState('');
  const [associateEmail, setAssociateEmail] = useState('');  // Associate Email State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products/categories`);
        console.log(apiUrl);
        console.log(response.data.name);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, [apiUrl]);

  // Fetch products when category is selected
  useEffect(() => {
    if (selectedCategory) {
      const fetchProductsByCategory = async () => {
        try {
          const response = await axios.get(`${apiUrl}/products/category/${selectedCategory}`);
          setProducts(response.data);
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Failed to fetch products');
        }
      };
      fetchProductsByCategory();
    }
  }, [selectedCategory, apiUrl]);

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product.name);
    setProductId(product._id);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure the associateEmail is provided
    if (!associateEmail) {
      setError('Please provide an associate email');
      return;
    }

    const orderData = {
      associateEmail,  // Use associateEmail from input
      products: [{
        productId,  // Pass only the productId and quantity
        quantity,
      }],
      customerId,
      customerName: custName,
      customerPhoneNumber: phoneNumber,
      paymentStatus,
      warrantyTill,
    };
    console.log(orderData);
    try {
      const response = await axios.post(`${apiUrl}/orders/order`, orderData);  // Backend will calculate the totalBillablePrice
      setSuccess('Order created successfully');
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Error creating order');
    }
  };

  const calculateWarrantyTill = () => {
    const warrantyDate = new Date();
    warrantyDate.setFullYear(warrantyDate.getFullYear() + 1);
    return warrantyDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
  };

  useEffect(() => {
    setWarrantyTill(calculateWarrantyTill());
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Create New Order</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="associateEmail" className="form-label">Associate Email</label>
          <input
            type="email"
            id="associateEmail"
            className="form-control"
            value={associateEmail}
            onChange={(e) => setAssociateEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="product" className="form-label">Product</label>
          <select
            id="product"
            className="form-select"
            value={selectedProduct}
            onChange={(e) => handleProductSelect(products.find((product) => product.name === e.target.value))}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product.name}>{product.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="custName" className="form-label">Customer Name</label>
          <input
            type="text"
            id="custName"
            className="form-control"
            value={custName}
            onChange={(e) => setCustName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Customer Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
          <select
            id="paymentStatus"
            className="form-select"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            required
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="warrantyTill" className="form-label">Warranty Till</label>
          <input
            type="date"
            id="warrantyTill"
            className="form-control"
            value={warrantyTill}
            onChange={(e) => setWarrantyTill(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit Order</button>
      </form>
    </div>
  );
}

export default OrderForm;
