import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHeart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setWishlist } from "../Features/userSlice";

function Navbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUserName] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Fetch login state and username from localStorage when the component mounts
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUserName = localStorage.getItem("username");
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    setIsLoggedIn(loggedIn);
    setUserName(storedUserName || "");

    if (loggedIn) {
      dispatch(setCart(storedCart));
      dispatch(setWishlist(storedWishlist));
    } else {
      dispatch(setCart([]));
      dispatch(setWishlist([]));
    }
  }, [dispatch, isLoggedIn]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLoginLogout = (event) => {
    event.preventDefault();

    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Clear login state, user info, cart, and myOrders

      localStorage.setItem("isLoggedIn", false);
      localStorage.removeItem("username");
      localStorage.removeItem("userid");
      localStorage.removeItem("myOrders");
      localStorage.removeItem("cart");
      localStorage.removeItem("role");
      localStorage.removeItem("wishlist");
      // Clear cart state
      setIsLoggedIn(false);
      setUserName("");

      dispatch(setCart([]));
      dispatch(setWishlist([]));

      navigate("/");
      alert("Logged out successfully");
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/product")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const searchProduct = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const searched = products.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(searched);
  };

  return (
    <header className="bg-rose-600 text-white p-4  z-30 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl font-extrabold">Baby Bliss</h1>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-4 hidden md:block relative">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={searchProduct}
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {search && (
          <div className="absolute top-16 bg-white text-black border rounded-md shadow-lg w-96 ml-64 p-4 z-50 max-h-60 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  onClick={() => setSearch("")}
                  className="block p-2 hover:bg-gray-100 transition duration-200"
                >
                  {product.name}
                </Link>
              ))
            ) : (
              <div className="p-2 text-gray-500">No products found</div>
            )}
          </div>
        )}

        {/* Hamburger menu and Cart Icon */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
            <div className="relative">
              <FaShoppingCart className="h-5 w-5 text-white hover:text-pink-200" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">
                  {cartItems.length}
                </span>
              )}
            </div>
          </Link>
          <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
            <div className="relative">
              <FaHeart className="h-5 w-5 text-white hover:text-pink-200" />
            </div>
          </Link>
          <button
            className="text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navbar Links */}
        <nav
          className={`fixed top-0 left-0 font-cursive h-full w-3/4 bg-rose-600 transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:relative md:transform-none md:h-auto md:w-auto md:bg-transparent md:flex md:flex-row md:space-x-6 p-4 md:p-0 space-y-4 md:space-y-0`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 mt-2 mr-14 space-y-4 md:space-y-0">
            <li>
              <Link
                to="/"
                className="text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/fashion"
                className="text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Fashion
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/my-orders"
                className="text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                My orders
              </Link>
            </li>
          </ul>

          {/* Login, Register Links */}
          <div className="flex items-center space-x-4 ml-auto">
            <Link to="/cart" className="hidden md:block">
              <div className="relative">
                <FaShoppingCart className="h-5 w-5 text-white hover:text-pink-200" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-white-500 text-red text-xs  px-1 py-0.5">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </Link>

            <Link to="/wishlist" className="hidden md:block">
              <div className="relative">
                <FaHeart className="h-5 w-5 text-white hover:text-pink-200" />
              </div>
            </Link>

            <div className="absolute top-4 left-44 md:left-0 md:top-0 md:relative md:ml-6">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center justify-center text-white bg-transparent border-2 border-white p-2 rounded-full"
              >
                <FaUserCircle className="h-7 w-7" />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute top-full mt-2 w-32 bg-white text-rose-600 rounded-lg shadow-lg">
                  <ul className="space-y-2 p-2">
                    {isLoggedIn ? (
                      <>
                        <li className="px-4 py-2 text-black">
                          Welcome, {username || "Guest"}
                        </li>
                        <li>
                          <button
                            onClick={(event) => {
                              handleLoginLogout(event);
                              setIsProfileMenuOpen(false);
                            }}
                            className="block px-8 py-2 rounded-lg hover:bg-pink-100 transition duration-300"
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            to="/login"
                            className="block px-4 py-2 rounded-lg hover:bg-pink-100 transition duration-300"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Login
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/register"
                            className="block px-4 py-2 rounded-lg hover:bg-pink-100 transition duration-300"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Register
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
