import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';

function OrderSummary() {
  const { orderId } = useParams(); // Get the orderId from the URL
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [productsWithDetails, setProductsWithDetails] = useState([]); // State to store products with fetched details

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/orders/getorder/${orderId}`);
        setOrderData(response.data.order[0]); // Set the order data
        fetchProductDetails(response.data.order[0].products);
      } catch (err) {
        setError('Failed to fetch order data');
        console.error('Error fetching order:', err);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, apiUrl]);

  // Function to fetch product details for each productId
  const fetchProductDetails = async (products) => {
    const updatedProducts = [];

    for (let product of products) {
      try {
        const productResponse = await axios.get(`${apiUrl}/products/product/${product.productId}`);
        if (productResponse.data) {
          updatedProducts.push({
            ...product,
            productName: productResponse.data.name,  // Set the product name
            price: productResponse.data.price, // Set the product price
          });
        } else {
          updatedProducts.push({ ...product, productName: 'Unknown Product', price: 0 });
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        updatedProducts.push({ ...product, productName: 'Unknown Product', price: 0 });
      }
    }

    setProductsWithDetails(updatedProducts);  // Update the state with the fetched product details
  };

  // If there is no order data or there is an error, return a message
  if (error) {
    return <div className="container my-4 alert alert-danger">{error}</div>;
  }

  if (!orderData) {
    return <div className="container my-4">Loading...</div>;
  }

  const { customerName, customerPhoneNumber, customerId, paymentStatus, warrantyTill, totalBillablePrice } = orderData;

  // If products is not an array, return empty array to avoid errors
  const safeProducts = Array.isArray(productsWithDetails) ? productsWithDetails : [];

  // Calculate total price
  const totalPrice = totalBillablePrice || 0;

  // Calculate CGST (9%)
  const cgst = totalPrice * 0.09;

  // Calculate SGST (9%)
  const sgst = totalPrice * 0.09;

  // Calculate grand total (totalPrice + CGST + SGST)
  const grandTotal = totalPrice + cgst + sgst;

  // Function to generate and download the PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 20;
    const marginTop = 20;
    const lineHeight = 10;

    // Title and Company Info
    doc.setFontSize(16);
    doc.text('Rocket Computers', marginLeft, marginTop);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, marginLeft, marginTop + lineHeight);
    doc.text(`Customer Name: ${customerName}`, marginLeft, marginTop + (lineHeight * 2));
    doc.text(`Customer ID: ${customerId}`, marginLeft, marginTop + (lineHeight * 3));
    doc.text('Company Address: 123 Tech Park, Silicon Valley, CA', marginLeft, marginTop + (lineHeight * 4));
    doc.text('Company GST Number: GST123456789', marginLeft, marginTop + (lineHeight * 5));

    // Products Table Header
    let y = marginTop + (lineHeight * 7);
    doc.setFontSize(10);
    doc.text('Product Name', marginLeft, y);
    doc.text('Price', marginLeft + 80, y);
    doc.text('Quantity', marginLeft + 120, y);
    doc.text('Total', marginLeft + 160, y);
    y += lineHeight;

    // Products Table Body
    safeProducts.forEach((product) => {
      doc.text(product.productName, marginLeft, y);
      doc.text(product.price.toFixed(2), marginLeft + 80, y);
      doc.text(product.quantity.toString(), marginLeft + 120, y);
      doc.text((product.price * product.quantity).toFixed(2), marginLeft + 160, y);
      y += lineHeight;
    });

    // Summary Table
    y += lineHeight * 2; // Adding some space between products and summary
    doc.text('Summary:', marginLeft, y);
    y += lineHeight;
    doc.text(`Total Price: ${totalPrice.toFixed(2)}`, marginLeft, y);
    y += lineHeight;
    doc.text(`CGST (9%): ${cgst.toFixed(2)}`, marginLeft, y);
    y += lineHeight;
    doc.text(`SGST (9%): ${sgst.toFixed(2)}`, marginLeft, y);
    y += lineHeight;
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, marginLeft, y);

    // Payment Status
    y += lineHeight * 2;
    doc.text(`Payment Status: ${paymentStatus}`, marginLeft, y);

    // Order ID at the bottom-right
    doc.text(`Order ID: ${orderData.orderId}`, marginLeft+100, y);

    // Save the PDF
    doc.save('order-summary.pdf');
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Order Summary</h2>

      {/* Company and Customer Information Table */}
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td colSpan="2">
              <strong>Company Name:</strong> Rocket Computers
            </td>
            <td colSpan="2">
              <strong>Customer Name:</strong> {customerName}
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <strong>Company Address:</strong> 123 Tech Park, Silicon Valley, CA
            </td>
            <td colSpan="2">
              <strong>Customer ID:</strong> {customerId}
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <strong>Company GST Number:</strong> GST123456789
            </td>
            <td colSpan="2">
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Products Table */}
      <h5 className="mt-3">Products:</h5>
      {safeProducts.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {safeProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.productName}</td>
                <td>{product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>{(product.price * product.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No products found in this order.</div>
      )}

      {/* Summary Table */}
      <table className="table table-bordered mt-3">
        <tbody>
          <tr>
            <th>Total Price</th>
            <td>{totalPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <th>CGST (9%)</th>
            <td>{cgst.toFixed(2)}</td>
          </tr>
          <tr>
            <th>SGST (9%)</th>
            <td>{sgst.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Grand Total</th>
            <td>{grandTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-3">
        <strong>Payment Status:</strong> {paymentStatus}
      </div>

      {/* Order ID at the bottom-right */}
      <div className="text-right mt-4">
        <strong>Order ID:</strong> {orderData.orderId}
      </div>

      {/* Button to Download PDF */}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;
