import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve the user's email from localStorage
  const userid = localStorage.getItem("userid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userid) {
        // Clear orders and stop fetching if the user is logged out
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/orders");
        console.log(response.data); // Log to check data

        // Filter orders by the logged-in user's email
        const userOrders = response.data.filter(
          (order) => order.userId === userid
        );
        setOrders(userOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userid]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userEmail"); 
    setOrders([]); 
    setLoading(false); 
    setError(null);
    navigate("/login"); 
  };
  console.log(handleLogout)

  if (!userid) {
    return (
      <div className="my-orders-page p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-extrabold text-rose-600 mb-6">My Orders</h1>
        <div className="text-center">
          <h2 className="text-xl">You are not logged in.</h2>
          <Link to="/login" className="text-blue-500 underline">
            Log in to view your orders
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="my-orders-page p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6  text-rose-600">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <h2 className="text-xl">You have no orders yet.</h2>
          <Link to="/" className="text-blue-500 underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              className="order-item mb-6 p-4 bg-white shadow rounded"
            >
              <h2 className="text-xl font-semibold">Order</h2>
              <p className="text-sm text-gray-600">Date: {order.orderDate || "N/A"}</p>
              <p className="text-sm text-yellow-600 font-semibold">Status: {order.status || "Booked"}</p>
              <div className="order-products mt-4">
                {Array.isArray(order.cart) && order.cart.length > 0 ? (
                  order.cart.map((product) => (
                    <div
                      key={product.id}
                      className="product-item flex items-center mb-4"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover mr-4 rounded"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-sm">
                          ₹{product.price} x {product.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products in this order.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
