import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../Features/adminSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.admin.sidebarOpen);

  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => dispatch(toggleSidebar())} />

      {/* Main Content */}
      <div
        className={`flex-grow p-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "lg:ml-64 ml-0"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
