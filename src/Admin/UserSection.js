import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  fetchOrders,
  setSelectedUser,
  blockUnblockUser,
} from "../Features/adminSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactNotifications } from "react-notifications-component";

import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const UserDetails = () => {
  const dispatch = useDispatch();
  const detailsRef = useRef(null);
  const {
    users,
    selectedUser,
    orders,
    loading: reduxLoading,
    error: reduxError,
  } = useSelector((state) => state.admin);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users when the component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Fetch orders when a user is selected
  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      dispatch(fetchOrders(selectedUser.id))
        .catch((err) => {
          setError("Failed to load orders.");
          toast.error("Failed to load orders.");
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, selectedUser]);

  const handleViewDetails = (user) => {
    dispatch(setSelectedUser(user)); // Step 2: Select user

    setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100); // Step 3: Add slight delay for smooth scroll
  };

  // Handle block/unblock user action
  const handleBlockUnblock = async (userId, isBlocked) => {
    try {
      await dispatch(blockUnblockUser({ userId, isBlocked }));

      const notificationType = isBlocked ? "success" : "danger"; // Red for blocking, Green for unblocking
      Store.addNotification({
        title: "Success!",
        message: `User ${isBlocked ? "unblocked" : "blocked"} successfully!`,
        type: notificationType, // 'success', 'danger', 'info', 'warning'
        insert: "top", // Position of the notification
        container: "top-right", // Container location
        animationIn: ["animated", "bounceIn"], // Animation for showing
        animationOut: ["animated", "fadeOut"], // Animation for hiding
        dismiss: {
          duration: 1000, // Duration to display the notification
          onScreen: true, // Keeps notification on screen
        },
      });
    } catch (err) {
      Store.addNotification({
        title: "Error!",
        message: "Failed to update user status.",
        type: "danger", // 'danger' for error notifications
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "bounceIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 1000,
          onScreen: true,
        },
      });
    }
  };

  const handleExit = () => {
    // Clear selected user details to go back to the user list or hide the details
    dispatch(setSelectedUser(null)); // This clears the selected user, effectively "closing" the user details view
  };
  if (reduxLoading || loading) return <div>Loading...</div>;
  if (reduxError || error) return <div>{reduxError || error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 mt-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-rose-600 mb-6">
        User Details
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* User List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <h3 className="text-xl font-semibold text-center text-gray-900 truncate">
              {user.name}
            </h3>
            <p className="text-center text-gray-600 truncate">{user.email}</p>

            <div className="flex justify-center mt-4 space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full sm:w-auto sm:px-3 sm:py-1 sm:text-sm"
                onClick={() => handleViewDetails(user)} // Set selected user
              >
                View
              </button>
              <button
                onClick={() => handleBlockUnblock(user.id, user.blocked)}
                className={`px-4 py-2 rounded-md text-white w-full sm:w-auto sm:px-3 sm:py-1 sm:text-sm ${
                  user.blocked
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {user.blocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show User Details */}
      {selectedUser && (
        <div
          ref={detailsRef}
          className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-extrabold text-gray-900">
            {selectedUser.name}
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <p className="flex items-center">
                <strong className="mr-2 text-gray-700">Name:</strong>{" "}
                <span className="text-gray-800">{selectedUser.name}</span>
              </p>
              <p className="flex items-center">
                <strong className="mr-2 text-gray-700">Email:</strong>{" "}
                <span className="text-gray-800">{selectedUser.email}</span>
              </p>
              <p className="flex items-center">
                <strong className="mr-2 text-gray-700">Password:</strong>{" "}
                <span className="text-gray-800">{selectedUser.password}</span>
              </p>
              {selectedUser.role === "admin" && (
                <p className="flex items-center">
                  <strong className="mr-2 text-gray-700">Role:</strong>{" "}
                  <span className="text-gray-800">{selectedUser.role}</span>
                </p>
              )}
            </div>

            {/* Cart */}
            {selectedUser.cart && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Cart</h3>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4  text-gray-700">Item</th>
                      <th className="py-2 px-4  text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.cart.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-8 text-gray-800">{item.name}</td>
                        <td className="py-2 px-14 text-gray-800">
                          ₹
                          {typeof item.price === "number"
                            ? item.price.toFixed(2)
                            : parseFloat(item.price || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t font-bold bg-gray-100">
                      <td className="py-3 px-4 text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        ₹
                        {selectedUser.cart
                          .reduce(
                            (acc, item) => acc + (parseFloat(item.price) || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Orders */}
            {loading ? (
              <p className="text-gray-700">Loading orders...</p>
            ) : (
              <div className="space-y-2 overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-8 text-gray-700">Order ID</th>
                      <th className="py-2 px-4 text-gray-700">Total Amount</th>
                      <th className="py-2 px-4 text-gray-700">Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      <>
                        {orders.map((order, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-8 text-gray-800">
                              {order.id}
                            </td>
                            <td className="py-2 px-4 text-gray-800">
                              ₹{order.totalAmount.toFixed(2)}
                            </td>
                            <td className="py-2 px-4 text-gray-800">
                              {order.orderDate}
                            </td>
                          </tr>
                        ))}
                        {/* Total Order Amount Row */}
                        <tr className="border-t font-bold bg-gray-100">
                          <td
                            className="py-3 px-4 text-gray-900 text-right"
                            colSpan="2"
                          >
                            Total:
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            ₹
                            {orders
                              .reduce(
                                (acc, order) => acc + (order.totalAmount || 0),
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-2 px-4 text-gray-700 text-center"
                        >
                          No orders found for this user.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Back/Exit Button */}
          <button
            onClick={handleExit} // Clears the selected user, effectively "exiting" the user details page
            className="mt-6 px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg w-full sm:w-auto sm:px-3 sm:py-1 sm:text-sm"
          >
            Close
          </button>
        </div>
      )}
      {/* <ToastContainer /> */}
      <ReactNotifications />
    </div>
  );
};

export default UserDetails;
