import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addItem } from "../Features/userSlice";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "../Features/userSlice";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
const Fashion = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const wishlist = useSelector((state) => state.cart?.wishlistItems || []);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://localhost:3001/fashion")
      .then((response) => {
        setProducts(response.data);

        // Extract unique normalized categories, ensuring category is a string
        const uniqueCategories = Array.from(
          new Set(
            response.data
              .map((product) =>
                typeof product.category === "string"
                  ? product.category.trim().toLowerCase()
                  : null
              )
              .filter((category) => category)
          )
        );
        setCategories(uniqueCategories);

        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching products: " + error.message);
        setLoading(false);
      });
  }, []);

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          typeof product.category === "string" &&
          product.category.trim().toLowerCase() === selectedCategory
      )
    : products;

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
  };
  const handleWishlistToggle = (product) => {
    const isWishlisted = wishlist.some((item) => item.id === product.id);
    if (isWishlisted) {
      dispatch(removeItemFromWishlist(product.id));
    } else {
      dispatch(addItemToWishlist(product));
    }
  };
  // const handleAddToWishlist = (product) => {
  //   dispatch(addItemToWishlist(product)); // Dispatch to add to wishlist
  // };
  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-rose-600">
        Baby Fashion Products
      </h1>

      {/* Category Filter Dropdown */}
      <div className="flex justify-end mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 bg-white text-rose-600 border border-rose-400 rounded-full shadow-md focus:ring-2 focus:ring-rose-500 focus:outline-none transition duration-300"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
              {/* Capitalize */}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 relative"
          >
            <Link to={`/fashion/${product.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">
                    {product.name}
                  </h2>
                  <p className="text-rose-600 font-bold mt-2">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            </Link>

            <button
              className="mt-5 w-44 px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition duration-300"
              onClick={() => handleAddToCart(product)}
            >
              Add To Cart
            </button>
            <button
              className={`absolute top-80 right-3 p-2 rounded-full shadow-md transition 
    ${
      wishlist.some((item) => item.id === product.id)
        ? "bg-rose-500 text-white"
        : "bg-white text-rose-500 hover:bg-rose-100"
    }`}
              onClick={() => handleWishlistToggle(product)}
            >
              <Heart
                className={`transition duration-300 ${
                  wishlist.some((item) => item.id === product.id)
                    ? "fill-white"
                    : "hover:fill-rose-500"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fashion;
