import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
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
    offerPrize: "", // Add this field for OfferPrize
    image: "",
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // console.log(editingProduct);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.CategoryName &&
          product.CategoryName.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
      )
    : products;

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (editingProduct) {
      setEditingProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    // Create FormData
    const formData = new FormData();
    formData.append("ProductName", newProduct.name);
    formData.append("ProductDescription", newProduct.description);
    formData.append("Rating", newProduct.rating);
    formData.append("ProductPrice", newProduct.price);
    formData.append("OfferPrize", newProduct.offerPrize);
    formData.append("CategoryId", newProduct.categoryId);
    formData.append("image", newProduct.imageFile); // 👈 must be File object

    console.log("FormData to be sent:", formData);

    // Dispatch the Redux action with formData
    dispatch(addProduct(formData))
      .unwrap()
      .then((product) => {
        console.log("Showwwwwwww", product);
        toast.success(`Product added successfully!`);
        setIsAddProductFormVisible(false);
        setNewProduct({
          name: "",
          description: "",
          rating: "",
          price: "",
          offerPrice: "",
          categoryId: "",
          imageFile: null,
        });
      })
      .catch((error) => {
        toast.error("Failed to add product.");
        console.error("Add product error:", error);
      });
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct?.Id) {
      toast.error("Missing product ID. Cannot update.");
      return;
    }

    try {
      // Dispatch the action with the updated product
      const updatedProduct = await dispatch(
        editProduct(editingProduct)
      ).unwrap();
      console.log(updatedProduct);
      // Show success toast
      toast.success(`Product updated successfully!`);

      // Clear the editing state
      setEditingProduct(null);
    } catch (error) {
      // Handle error case
      toast.error("Failed to update product.");
    }
  };

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct({ id }))
      .unwrap()
      .then(() => {
        toast.success("Product deleted successfully!");
        window.location.reload(); // Trigger page reload
      })
      .catch(() => toast.error("Failed to delete product."));
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      Id: product.Id,
      name: product.ProductName,
      description: product.ProductDescription,
      rating: product.Rating,
      price: product.ProductPrice,
      offerPrize: product.OfferPrize,
      categoryId: product.CategoryId,
      imageFile: null, // initially null
      ImageUrl: product.imageUrl, // for preview
    });
    console.log("Editing product ID:", product.Id);
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
          {categories
            .filter((category) => category) // Ensure no null/undefined categories
            .map((category, index) => (
              <option key={category + index} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
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

          {/* Product Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
            />
          </div>

          {/* Product Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Product Description *
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
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
              rows="4"
            />
          </div>

          {/* Rating */}
          <div className="mb-4">
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating *
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={editingProduct ? editingProduct.rating : newProduct.rating}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
              step="0.1" // Adjust decimal places for rating
              min="0"
              max="5"
            />
          </div>

          {/* Product Price */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Product Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
              min="0"
            />
          </div>

          {/* Offer Price */}
          <div className="mb-4">
            <label
              htmlFor="offerPrize"
              className="block text-sm font-medium text-gray-700"
            >
              Offer Prize *
            </label>
            <input
              type="number"
              id="offerPrize"
              name="offerPrize"
              value={
                editingProduct
                  ? editingProduct.offerPrize
                  : newProduct.offerPrize
              }
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700"
            >
              Category ID *
            </label>
            <input
              type="number"
              id="categoryId"
              name="categoryId"
              value={newProduct.categoryId}
              onChange={(e) =>
                setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
              placeholder="Enter category ID"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image *
            </label>
            {/* Show current image preview when editing */}
            {editingProduct?.ImageUrl && (
              <div className="mb-2">
                <p className="text-sm text-gray-700">Current Image:</p>
                <img
                  src={editingProduct.ImageUrl}
                  alt="Current"
                  className="w-20 h-20 object-cover border rounded"
                />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={(e) => {
                const file = e.target.files[0];
                if (editingProduct) {
                  setEditingProduct({ ...editingProduct, imageFile: file });
                } else {
                  setNewProduct({ ...newProduct, imageFile: file });
                }
              }}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none"
              required={!editingProduct}
            />
          </div>

          {/* Submit Buttons */}
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
            key={`${product?.CategoryName}_${product?.Id}`}
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
              src={product?.ImageUrl}
              alt={product?.ProductName}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-md border mb-4 sm:mb-0 sm:mr-4"
            />

            {/* Product Details */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold">{product?.ProductName}</h3>
              <p className="text-gray-600">Category: {product?.CategoryName}</p>
              <p className="text-gray-500">{product?.ProductDescription}</p>
              <p className="text-gray-800 font-semibold">
                Price: ₹{product?.OfferPrize || product?.ProductPrice}
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
                onClick={() => handleDeleteClick(product.Id, product.category)} // Handle deletion
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
