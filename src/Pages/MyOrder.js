import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve the user's email from localStorage
  const userid = localStorage.getItem("userid");
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     if (!userid) {
  //       // Clear orders and stop fetching if the user is logged out
  //       setOrders([]);
  //       setLoading(false);
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const response = await axios.get("http://localhost:3001/orders");
  //       console.log(response.data); // Log to check data

  //       // Filter orders by the logged-in user's email
  //       const userOrders = response.data.filter(
  //         (order) => order.userId === userid
  //       );
  //       setOrders(userOrders);
  //     } catch (err) {
  //       console.error("Error fetching orders:", err);
  //       setError("Failed to load orders");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, [userid]);
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
        const response = await axios.get("https://localhost:7055/api/Order/Get-order-Details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // Assuming JWT token stored in localStorage
          }
        });
        console.log(response.data); // Log to check data

        // If the backend is already filtering by userid, no need for this filter
        if(Array.isArray(response.data.Data))
        setOrders(response.data.Data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userid]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return "text-blue-600";
      case "Delivered":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-yellow-600"; // Default to yellow for "Booked"
    }
  };

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
      <h1 className="text-4xl font-extrabold mb-6 text-rose-600">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <h2 className="text-xl">You have no orders yet.</h2>
          <Link to="/" className="text-blue-500 underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {[...orders]
            .sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate))
            .map((order) => (
              <div
                key={`order-${order.OrderId}`}
                className="order-item mb-6 p-4 bg-white shadow rounded"
              >
                <h2 className="text-xl font-extrabold">ORDER-ID: {order.OrderId}</h2>
                <p className="text-sm text-gray-800 font-mono">
                  Date: {new Date(order.OrderDate).toLocaleDateString() || "N/A"}
                </p>
  
                <p className={`text-sm font-semibold ${getStatusColor(order.OrderStatus)}`}>
                  Status: {order.OrderStatus || "Booked"}
                </p>
  
                <div className="order-products mt-4">
                  {Array.isArray(order.Items) && order.Items.length > 0 ? (
                    order.Items.map((item) => (
                      <div
                      key={`order-${order.OrderId}-item-${item.OrderItemId}-${item.ProductId}`}
                      className="product-item flex items-center mb-4"
                      >
                        <img
                          src={item.ProductImage || "/placeholder.jpg"} // fallback
                          alt={item.ProductName}
                          className="w-20 h-20 object-cover mr-4 rounded"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{item.ProductName}</h3>
                          <p className="text-sm">
                            ₹{item.TotalPrice} x {item.Quantity}
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
}  
export default MyOrdersPage;
