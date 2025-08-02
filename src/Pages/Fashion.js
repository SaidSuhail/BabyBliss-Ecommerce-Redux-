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
      .get("https://localhost:7055/All Products")
      .then((response) => {
        console.log("Response data:", response.data); // Log the response
        if (response.data && Array.isArray(response.data.Data)) {
          const filtered = response.data.Data.filter(
            (product) =>
              product.CategoryName?.toLowerCase() === "girls" ||
              product.CategoryName?.toLowerCase() === "boys"
          );

          setProducts(filtered);
          setCategories(["Girls", "Boys"]);

          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Error fetching products: " + error.message);
        setLoading(false);
      });
  }, []);
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.CategoryName === selectedCategory)
    : products;

  const handleAddToCart = (product) => {
    // dispatch(addItem(product));
    dispatch(
      addItem({
        productId: product.Id,
        ProductName: product.ProductName,
        Price: product.OfferPrize || product.ProductPrice,
        OrginalPrize: product.ProductPrice,
        ProductImage: product.ImageUrl,
      })
    );
  };
  const handleWishlistToggle = (product) => {
    if (!product || !product.Id) {
      console.error("Invalid product data");
      return;
    }
    const isWishlisted = wishlist.some(
      (item) => item && item.Id === product.Id // Use 'Id' here instead of 'productId'
    );
    if (isWishlisted) {
      dispatch(removeItemFromWishlist(product.Id)); // Use 'Id'
    } else {
      dispatch(addItemToWishlist(product)); // Pass product with 'Id'
    }
  };

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
          className="ml-4 p-3 pl-4 pr-8 bg-white text-rose-600 border border-rose-400 rounded-full shadow-md focus:ring-2 focus:ring-rose-500 focus:outline-none transition duration-300"
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
            key={product.Id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 relative"
          >
            <Link to={`/fashion/${product.Id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
                <img
                  src={product.ImageUrl}
                  alt={product.ProductName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">
                    {product.ProductName}
                  </h2>
                  <p className="text-rose-600 font-bold mt-2">
                    ₹{product.OfferPrize || product.ProductPrice}
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
                wishlist.some((item) => item && item.Id === product.Id) // Use 'Id' here as well
                  ? "bg-rose-600 text-white"
                  : "bg-white text-rose-500 hover:bg-rose-100"
              }`}
              onClick={() => handleWishlistToggle(product)} // Make sure you're passing the correct product object
            >
              <Heart
                className={`transition duration-300 ${
                  wishlist.some((item) => item && item.Id === product.Id) // Use 'Id' for checking
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
