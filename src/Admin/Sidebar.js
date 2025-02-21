import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../Features/adminSlice"; 
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSidebarOpen = useSelector((state) => state.admin.sidebarOpen); 

  const handleLogout = (event) => {
    event.preventDefault();
    const role = localStorage.getItem("role");
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      navigate(role === "admin" ? "/" : "/login");
      alert("Logged out successfully");
    }
  };

  return (
    <div>
      {/* Hamburger Menu Icon (visible on small screens) */}
      <button
        onClick={() => dispatch(toggleSidebar())} 
        className="lg:hidden p-4 text-black fixed left-4 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-rose-600 text-white p-4 flex flex-col transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="/admin/dashboard" className="hover:text-gray-400">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/user-section" className="hover:text-gray-400">
                User Section
              </a>
            </li>
            <li>
              <a href="/admin/product-section" className="hover:text-gray-400">
                Product Section
              </a>
            </li>
          </ul>
        </nav>

        {/* Spacer (flex-grow to push logout button to the bottom) */}
        <div className="flex-grow" />

        {/* Always position the logout button at the bottom */}
        <button
          onClick={(event) => handleLogout(event)}
          className="p-2 rounded-xl px-5 py-3 mt-auto bg-black"
        >
          Logout
        </button>
      </div>

      {/* Overlay (visible when sidebar is open on small screens) */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => dispatch(toggleSidebar())} 
      ></div>
    </div>
  );
};

export default Sidebar;

