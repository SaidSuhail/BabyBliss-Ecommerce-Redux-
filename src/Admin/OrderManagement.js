import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  const [selectedStatus, setSelectedStatus] = useState({});
  const API_URL = "http://localhost:3001/orders";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(API_URL);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleCheckboxChange = (orderId, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [orderId]: status,
    }));
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return;

    try {
      await axios.patch(`${API_URL}/${orderId}`, { status: newStatus });
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setSelectedStatus((prev) => ({ ...prev, [orderId]: null }));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  // Pagination Logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className=" p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto relative min-h-screen pb-20 ">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-rose-600 text-center drop-shadow-md">
          Order Management
          <span className="block mt-2 text-2xl md:text-3xl text-gray-600 font-medium">
            Manage Customer Orders
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 flex-grow mb-28">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-rose-500"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Order Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">
                      Order #<span className="font-mono">{order.id}</span>
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-sm font-medium">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {order.shippingDetails?.fullName || "Unknown Customer"}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Status Controls */}
                <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    {["Shipped", "Delivered", "Cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleCheckboxChange(order.id, status)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                          selectedStatus[order.id] === status
                            ? status === "Cancelled"
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : status === "Shipped"
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : status === "Delivered"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-amber-500 text-white hover:bg-amber-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleStatusUpdate(order.id)}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4  w-26 h-14 rounded-lg 
            transition-transform duration-200 hover:scale-105 active:scale-100 focus:scale-100 shadow-md"
                  >
                    UpdateStatus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Buttons */}
        <div className="absolute bottom-4 left-[55%] -translate-x-1/2 flex flex-wrap justify-center gap-2 bg-white p-2 rounded shadow-md z-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-rose-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
