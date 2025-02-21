import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CarouselCustomNavigation } from "./CarouselCustomNavigation";
import { useDispatch } from "react-redux";
import { addItem } from "../Features/userSlice"; 

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch(); 

  useEffect(() => {
    // Fetch products and categories from the JSON server
    axios
      .get("http://localhost:3001/product")
      .then((response) => {
        setProducts(response.data);
        const uniqueCategories = [
          ...new Set(response.data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (loading) {
    return <p>Loading...</p>;
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
            key={product.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 relative"
          >
            <Link to={`/product/${product.id}`} className="block">
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
              className="mt-4 w-full px-4 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-600 transition duration-300"
              onClick={() => dispatch(addItem(product))} 
            >
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
