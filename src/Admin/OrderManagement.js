

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchDashboardData, fetchOrdersAll, updateOrderStatus } from "../Features/adminSlice";
// import { CurrencyIcon, UserIcon } from "lucide-react";

// function OrderManagement() {
//   const dispatch = useDispatch();
//   const orders = useSelector((state) => state.admin.orders);
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 6;

//   // Fetch orders when the component mounts
//   useEffect(() => {
//     dispatch(fetchOrdersAll());
//   }, [dispatch]);

  
//   const handleStatusChange = (orderId) => {
//     dispatch(updateOrderStatus({ orderId }))
//       .unwrap()
//       .then((res) => {
//         dispatch(fetchDashboardData()); // ✅ This will refresh dashboard data
//         console.log("Order updated successfully:", res);
//         dispatch(fetchOrdersAll()); // or adjust state locally
//         dispatch(updateOrderStatus(res));  // Update the order in Redux

//       })
//       .catch((err) => {
//         console.error("Order update failed:", err);
//       });
//   };
  

//   // Pagination Logic
//   const totalPages = Math.ceil(orders.length / ordersPerPage);
//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         {/* Header Section */}
//         <header className="space-y-2 text-center">
//           <h1 className="text-3xl font-bold text-rose-600 drop-shadow-md sm:text-4xl md:text-5xl">
//             Order Management
//           </h1>
//           <p className="text-lg text-gray-600 md:text-xl">
//             Manage Customer Orders
//           </p>
//         </header>
  
//         {/* Orders Grid */}
//         <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {currentOrders.map((order) => (
//             <div
//               key={order.OrderId}
//               className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
//             >
//               {/* Order Content */}
//               <div className="space-y-3 border-b border-gray-200 pb-4">
//                 {/* Order Header */}
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h2 className="text-base font-semibold sm:text-lg">
//                       Order #
//                       <span className="font-mono text-gray-700">
//                         {order.OrderId}
//                       </span>
//                     </h2>
//                     <p className="mt-1 text-sm text-gray-500">
//                       {new Date(order.OrderDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-800">
//                     {order.OrderStatus}
//                   </span>
//                 </div>
  
//                 {/* Customer Info */}
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <UserIcon className="h-4 w-4 flex-shrink-0" />
//                     <span>{order.UserName || "Unknown Customer"}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <CurrencyIcon className="h-4 w-4 flex-shrink-0" />
//                     <span>₹{order.TotalPrice.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
  
//               {/* Actions */}
//               <div className="pt-4">
//                 <button
//                   onClick={() => handleStatusChange(order.OrderId)}
//                   className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 sm:text-base"
//                 >
//                   Mark as Delivered
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
  
//         {/* Pagination */}
//         <div className="flex flex-wrap items-center justify-center gap-2">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="rounded bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => handlePageChange(page)}
//               className={`rounded px-3 py-1 text-sm ${
//                 currentPage === page
//                   ? "bg-rose-500 text-white"
//                   : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="rounded bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   )}

// export default OrderManagement;

import React, { useEffect, useState } from "react";
import { CurrencyIcon, UserIcon } from "lucide-react";
import axios from "axios"; // You can use axios or fetch
import { fetchDashboardData,updateOrderStatus,fetchOrdersAll } from "../Features/adminSlice";
import { useDispatch } from "react-redux";

function OrderManagement() {
  const [orders, setOrders] = useState([]); // Default to empty array
  const [totalOrders, setTotalOrders] = useState(0); // Total number of orders
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  const dispatch = useDispatch();

  
  // Fetch orders when the component mounts
  useEffect(() => {
    dispatch(fetchOrdersAll());
  }, [dispatch]);
  // Fetch orders when the component mounts or when the page changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7055/api/Order/paginated-orders`, {
            params: {
              pageNumber: currentPage,
              pageSize: ordersPerPage
            }
          });
          console.log("API Response:", response.data); // Check the response structure
  
        // Ensure the Items array exists in the response and is not empty
        if (response.data.Items && Array.isArray(response.data.Items)) {
          // Update orders with the new data
          setOrders(response.data.Items);
  
          // Update totalOrders from response data
          setTotalOrders(response.data.TotalCount);
  
          // Update the order statuses if you are handling them individually
          const updatedOrders = response.data.Items.map(order => {
            // Example of updating the order status (adjust the logic as needed)
            if (order.OrderStatus === "Pending") {
              // Example logic, update status as needed
              return { ...order, OrderStatus: "Delivered" };
            }
            return order;
          });
  
          // Update state with new order statuses
          setOrders(updatedOrders);
        } else {
          console.error("Unexpected API response structure: Items not found or not an array");
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
  
    fetchOrders();
  }, [currentPage]); // Rerun this effect when currentPage changes
  
  
  // Pagination Logic
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // const handleStatusChange = async (orderId) => {
  //   try {
  //     const res = await dispatch(updateOrderStatus({ orderId })).unwrap();
  //     dispatch(fetchDashboardData());
  //     console.log("Order updated successfully:", res);
  //     dispatch(fetchOrdersAll());
  //   } catch (err) {
  //     console.error("Order update failed:", err);
  //   }
  // };
  // const handleStatusChange = (orderId) => {
  //   console.log("Order ID:", orderId); // Check the order ID
  //       dispatch(updateOrderStatus({ orderId }))
  //         .unwrap()
  //         .then((res) => {
  //           dispatch(fetchDashboardData()); // ✅ This will refresh dashboard data
  //           console.log("Order updated successfully:", res);
  //           dispatch(fetchOrdersAll()); // or adjust state locally
  //           dispatch(updateOrderStatus(res));  // Update the order in Redux
  //         })
  //         .catch((err) => {
  //           console.error("Order update failed:", err);
  //         });
  //     };
  const handleStatusChange = (orderId) => {
    console.log("Order ID:", orderId); // Check the order ID
    if (orderId) {
      dispatch(updateOrderStatus({ orderId }))
        .unwrap()
        .then((res) => {
          dispatch(fetchDashboardData()); // ✅ This will refresh dashboard data
          console.log("Order updated successfully:", res);
          dispatch(fetchOrdersAll()); // or adjust state locally
          // dispatch(updateOrderStatus(res));  // Update the order in Redux
        })
        .catch((err) => {
          console.error("Order update failed:", err);
        });
    } else {
      console.error("No order ID provided.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-rose-600 drop-shadow-md sm:text-4xl md:text-5xl">
            Order Management
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">
            Manage Customer Orders
          </p>
        </header>

        {/* Orders Grid */}
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.OrderId}
                className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
              >
                {/* Order Content */}
                <div className="space-y-3 border-b border-gray-200 pb-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-base font-semibold sm:text-lg">
                        Order #
                        <span className="font-mono text-gray-700">
                          {order.OrderId}
                        </span>
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(order.OrderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-800">
                      {order.OrderStatus}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserIcon className="h-4 w-4 flex-shrink-0" />
                      <span>{order.CustomerName || "Unknown Customer"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CurrencyIcon className="h-4 w-4 flex-shrink-0" />
                      <span>₹{order.TotalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  <button
                    onClick={() => handleStatusChange(order.OrderId)}
                    className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 sm:text-base"
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No orders available.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rounded px-3 py-1 text-sm ${
                currentPage === page
                  ? "bg-rose-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
