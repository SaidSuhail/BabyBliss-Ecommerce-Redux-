import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addItem } from "../Features/userSlice"; 

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;

  const handleAddToCart=()=>{
    dispatch(addItem(product))
  }
  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Side - Product Gallery */}
      <div className="flex flex-col gap-6 items-center">
        {/* Main Product Image */}
        <div className="w-full max-w-[70%] aspect-square bg-gray-100 rounded-xl shadow-lg overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
  
        {/* Thumbnail Gallery */}
        <div className="w-full max-w-[70%] grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
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
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 md:p-8 lg:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
  
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            {product.description}
          </p>
  
          <div className="space-y-6">
            {/* Price Section */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-rose-600">₹{product.price}</span>
              <span className="text-sm text-gray-500">INR</span>
            </div>
  
            {/* Add to Cart Button */}
            <button
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-4 px-8 rounded-xl 
                        transition-all duration-200 transform hover:scale-[1.02] focus:outline-none 
                        focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
  
            {/* Product Highlights */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Free shipping
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
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
