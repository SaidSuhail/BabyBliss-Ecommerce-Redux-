import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CarouselCustomNavigation } from "./CarouselCustomNavigation";
import { useDispatch } from "react-redux";
import { addItem } from "../Features/userSlice";
import { useSelector } from "react-redux";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "../Features/userSlice";
import { Heart } from "lucide-react";
import Lottie from "lottie-react";
import loadingAnimation from "../Assets/loadingAnimation.json";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.cart?.wishlistItems || []);

  useEffect(() => {
    // Fetch products and categories from the JSON server
    axios
      .get("https://localhost:7055/All Products")
      .then((response) => {
        console.log("Response data:", response.data); // Log the response

        if (response.data && Array.isArray(response.data.Data)) {
          setProducts(response.data.Data);
          const uniqueCategories = [
            ...new Set(
              response.data.Data.map((product) => product.CategoryName || "")
            ),
          ];
          setCategories(uniqueCategories);
        } else {
          console.error("Expected an array, but received:", response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

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

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.CategoryName === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          className="w-64 h-64"
        />
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <CarouselCustomNavigation />

      <h1 className="text-4xl font-extrabold text-center mb-4 mt-6 text-rose-600">
        Products
      </h1>

      {/* Filter Button and Dropdown */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button
            className="bg-rose-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-rose-700 focus:outline-none transition duration-300"
            onClick={() => setSelectedCategory("")}
          >
            Reset Filter
          </button>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
            className="ml-4 p-3 pl-4 pr-8 bg-white text-rose-600 border border-rose-400 rounded-full shadow-md focus:ring-2 focus:ring-rose-500 focus:outline-none transition duration-300"
          >
            <option value="" className="text-gray-500">
              Select Category
            </option>
            {categories.map((category, index) => (
              <option
                key={index}
                value={category}
                className="hover:bg-pink-100 hover:text-rose-700 transition duration-300"
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.Id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 relative"
          >
            <Link to={`/product/${product.Id}`} className="block">
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
              className="mt-5 w-44 px-4 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-600 transition duration-300"
              onClick={() => {
                // Ensure you're passing the correct productId
                console.log("Adding to cart for productId:", product.Id);
                dispatch(
                  addItem({
                    productId: product.Id,
                    ProductName: product.ProductName,
                    Price: product.OfferPrize || product.ProductPrice,
                    OrginalPrize: product.ProductPrice,
                    ProductImage: product.ImageUrl,
                  })
                );
                console.log("Product being added:", {
                  productId: product.Id,
                  ProductName: product.ProductName,
                  Price: product.OfferPrize || product.ProductPrice,
                  OrginalPrize: product.ProductPrice,
                  ProductImage: product.ImageUrl,
                });
              }}
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

export default Home;
