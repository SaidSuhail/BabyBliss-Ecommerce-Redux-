import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addProduct,
  editProduct,
  deleteProduct,
} from "../Features/adminSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProductManagement = () => {
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const { products, categories, loading, error } = useSelector(
    (state) => state.admin
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddProductFormVisible, setIsAddProductFormVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category.trim().toLowerCase() === selectedCategory
      )
    : products;

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    dispatch(addProduct(newProduct))
      .unwrap()
      .then((product) => {
        toast.success(`Product "${product.name}" added successfully!`);
        setIsAddProductFormVisible(false);
        setNewProduct({
          name: "",
          category: "",
          price: "",
          image: "",
          description: "",
        });
      })
      .catch(() => toast.error("Failed to add product."));
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    dispatch(editProduct(editingProduct))
      .unwrap()
      .then((product) => {
        toast.success(`Product "${product.name}" updated successfully!`);
        setEditingProduct(null);
      })
      .catch(() => toast.error("Failed to update product."));
  };

  const handleDeleteProduct = (id, category) => {
    dispatch(deleteProduct({ id, category }))
      .unwrap()
      .then(() => toast.success("Product deleted successfully!"))
      .catch(() => toast.error("Failed to delete product."));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsAddProductFormVisible(false); // Hide Add Product form if open

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200); // Small delay to allow state update before scrolling
  };

  const handleDeleteClick = (id, category) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      handleDeleteProduct(id, category);
    }
  };
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="p-6 bg-gray-100 mt-4 min-h-screen  relative pb-24">
      <div className="flex justify-between  items-center mb-6">
        <h1 className="text-4xl font-extrabold text-rose-600">
          Admin Product Management
        </h1>
        {/* Add Product Button */}
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          onClick={() => {
            setIsAddProductFormVisible(true);
            setEditingProduct(null);
            setTimeout(() => {
              formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 200);
          }}
        >
          Add Product
        </button>
      </div>

      {/* Error Display */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Category Filter */}
      <div className="flex justify-end mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-3 bg-white text-rose-600 border border-rose-400 rounded-full shadow-md focus:ring-2 focus:ring-rose-500 focus:outline-none transition duration-300"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
            </option>
          ))}
        </select>
      </div>

      {/* Add Product Form */}
      {(isAddProductFormVisible || editingProduct) && (
        <form
          ref={formRef}
          onSubmit={
            editingProduct ? handleEditProductSubmit : handleAddProductSubmit
          }
          className="bg-white p-6 rounded-lg shadow-lg mb-6 max-w-96 sm:max-w-md mx-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>

          {/* Name Input */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={handleInputChange}
              style={{
                marginTop: "0.25rem",
                display: "block",
                width: "100%",
                padding: "0.7rem 1rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                outline: "none",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
              required
            />
          </div>

          {/* Category Input */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={
                editingProduct ? editingProduct.category : newProduct.category
              }
              onChange={handleInputChange}
              style={{
                marginTop: "0.25rem",
                display: "block",
                width: "100%",
                padding: "0.7rem 1rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                outline: "none",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
              required
            />
          </div>

          {/* Price Input */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none "
              required
            />
          </div>

          {/* Image URL Input */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={editingProduct ? editingProduct.image : newProduct.image}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none "
            />
          </div>
          {/* Description Input */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={
                editingProduct
                  ? editingProduct.description
                  : newProduct.description
              }
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none "
              rows="4"
            />
          </div>
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => {
                setIsAddProductFormVisible(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      )}
      {/* Product List */}
      <div className="space-y-6 mb-24">
        {currentProducts.map((product, index) => (
          <div
            key={`${product.category}_${product.id}`}
            className="flex flex-col sm:flex-row md:flex-row items-center bg-white p-4 shadow-lg rounded-lg mb-4"
          >
            {/* Product Index */}
            <div className="w-12 text-center mb-4 sm:mb-0">
              <span className="text-gray-600">
                {indexOfFirstProduct + index + 1}
              </span>{" "}
              {/* Display index (1-based) */}
            </div>
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-md border mb-4 sm:mb-0 sm:mr-4"
            />

            {/* Product Details */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600">Category: {product.category}</p>
              <p className="text-gray-500">{product.description}</p>
              <p className="text-gray-800 font-semibold">
                Price: ₹{product.price}
              </p>
            </div>
            {/* Edit and Delete Buttons */}
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleEditClick(product)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDeleteClick(product.id, product.category)} // Handle deletion
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="absolute flex flex-wrap justify-center mt-6 gap-2"> */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 bg-white p-2 rounded shadow-md z-10">
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

      <ToastContainer />
    </div>
  );
};
export default AdminProductManagement;
