import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../Features/adminSlice";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, loading, error } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return <div>Loading....</div>;
  }

  const { userCount, productCount, totalOrderAmount, recentOrders } =
    dashboardStats;

  const chartData = {
    labels: ["Revenue", "Remaining"],
    datasets: [
      {
        data: [totalOrderAmount, 1000000 - totalOrderAmount],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 mt-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-rose-600 mb-6">
        Admin Dashboard
      </h1>

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
            <p className="text-2xl font-bold text-gray-900">{userCount}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <i className="fas fa-users text-3xl"></i>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Total Products
            </h2>
            <p className="text-2xl font-bold text-gray-900">{productCount}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <i className="fas fa-cogs text-3xl"></i>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Total Orders Amount
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              ₹{totalOrderAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
            <i className="fas fa-rupee-sign text-3xl"></i>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="bg-rose-600 p-6 rounded-full w-80 h-80 flex items-center justify-center">
          <Doughnut
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>
      </div>

      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Total Sales & Revenue
        </h2>
        <p className="text-gray-600 text-lg mt-2">Revenue generated so far</p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center sm:text-left">
          Recent Orders
        </h2>
        <p className="text-lg text-gray-600 mb-2 text-center sm:text-left">
          Total Orders: {recentOrders.length}
        </p>
        <div className="bg-white rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OrderStatus
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.OrderId} className="hover:bg-gray-100">
                    <td className="px-2 py-2">{order.OrderId}</td>
                    {/* <td className="px-2 py-2">{order.OrderDate}</td> */}
                    <td className="px-2 py-2">
                      {new Date(order.OrderDate).toLocaleDateString("en-GB", {
                        weekday: "short", // Optional: Short weekday name (Mon, Tue, etc.)
                        year: "numeric", // Full year (2025)
                        month: "short", // Short month name (Jan, Feb, etc.)
                        day: "numeric", // Day of the month (1-31)
                      })}
                    </td>
                    <td className="px-2 py-2">{order.UserName || "Unknown"}</td>
                    <td className="px-2 py-2">₹{order.TotalPrice}</td>
                    {/* Loop through each item in the order and display the TotalPrice */}
                    <td className="px-2 py-2">{order.Phone}</td>

                    <td className="px-2 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold
                        ${
                          order.OrderStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.OrderStatus === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.OrderStatus === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.OrderStatus || "Order Placed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
