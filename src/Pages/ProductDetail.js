import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../Features/userSlice";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "../Features/userSlice"; // Update your slice
import { Heart } from "lucide-react";
const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.cart?.wishlistItems || []);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/fashion/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching product details: " + error.message);
        setLoading(false);
      });
  }, [productId]);
  // useEffect(() => {
  //   // Check if the product is in the wishlist
  //   if (product && wishlist.some(item => item.id === product.id)) {
  //     setIsWishlisted(true);
  //   }
  // }, [wishlist, product]);
  useEffect(() => {
    if (product) {
      setIsWishlisted(wishlist.some((item) => item.id === product.id));
    }
  }, [wishlist, product]);

  const handleAddToCart = () => {
    dispatch(addItem(product));
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      dispatch(addItemToWishlist(product));
    } else {
      dispatch(removeItemFromWishlist(product.id));
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Product Gallery */}
        <div className="flex flex-col gap-6 items-center relative">
          {/* Main Product Image */}
          <div className="relative w-full max-w-[70%] aspect-square bg-gray-100 rounded-xl shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />

            {/* Heart Icon for Wishlist */}
            {/* <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-2 rounded-full shadow-lg 
                          ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-gray-600'} 
                          hover:bg-rose-500 hover:text-white transition duration-300`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill={isWishlisted ? 'currentColor' : 'none'}
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" 
                />
              </svg>
            </button> */}
          </div>

          {/* Thumbnail Gallery */}
          <div className="w-full max-w-[70%] grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={`${product.name} thumbnail ${item}`}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Product Details Card */}
        <div className="flex justify-end">
          <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 md:p-8 lg:p-10 relative">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-rose-600">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-500">INR</span>
              </div>

              <button
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-4 px-8 rounded-xl 
                          transition-all duration-200 transform hover:scale-[1.02] focus:outline-none 
                          focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition 
          ${
            wishlist.some((item) => item.id === product.id)
              ? "bg-rose-600 text-white"
              : "bg-white text-rose-500 hover:bg-rose-100"
          }`}
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`transition duration-300 ${
                    wishlist.some((item) => item.id === product.id)
                      ? "fill-white"
                      : "hover:fill-rose-500"
                  }`}
                />
              </button>
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Highlights
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-rose-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Free shipping
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-rose-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    Good Quality Product
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
