import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import emptyCartAnimation from "../Assets/empty-Cart.json";
import {
  setCart,
  fetchCartData,
  removeItem,
  increaseQuantityAsync,
  decreaseQuantityAsync,
  clearCartAsync,
} from "../Features/userSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cartItems) || [];
  const userId = useSelector((state) => state.cart.userId);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      // Load cart data from localStorage
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      dispatch(setCart(storedCart));

      // Fetch cart data from the backend if userId exists
      if (userId && !cart.length) {
        // Only fetch if cart is empty (or new data is needed)
        dispatch(fetchCartData(userId));
      }
    } else {
      dispatch(setCart([])); // Clear cart if not logged in
    }
  }, [dispatch, userId, cart.length]); // Add cart.length to avoid redundant fetches

  console.log(cart); // To check the cart data in console

  const handleCheckout = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      alert("You need to log in to proceed to checkout.");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty p-6 text-center min-h-screen">
        <Lottie
          animationData={emptyCartAnimation}
          className="w-70 h-60"
          loop={true}
        />
        <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
        <Link to="/" className="mt-4 text-blue-500 underline">
          Go back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold  mb-6 text-rose-600">Your Cart</h1>
      <div className="cart-items">
        {console.log(cart)}
        {cart.map((item) => (
          <div
            key={item.productId}
            className="cart-item flex items-center justify-between bg-white p-4 shadow rounded mb-4"
          >
            <div className="cart-item-info flex items-center">
              <img
                src={item.ProductImage}
                alt={item.ProductName}
                className="w-20 h-20 object-cover mr-4 rounded"
              />
              <div>
                <h2 className="text-xl font-semibold">{item.ProductName}</h2>
                <p className="text-gray-600">
                  ₹{item.Price || item.OrginalPrize}
                </p>
              </div>
            </div>
            <div className="cart-item-controls flex items-center space-x-4">
              <button
                onClick={() => dispatch(decreaseQuantityAsync(item.productId))}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className="text-lg font-semibold">{item.quantity}</span>
              <button
                onClick={() => dispatch(increaseQuantityAsync(item.productId))}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
              >
                +
              </button>
              <button
                onClick={() => {
                  console.log("Removing product with id:", item.productId);

                  dispatch(removeItem(item.productId));
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total mt-6 bg-white p-4 shadow rounded">
        {/* <h3 className="text-xl font-semibold">
          Total: ₹
          {cart.reduce((acc, item) => acc + item.Price||item.OrginalPrize * item.quantity, 0)}
        </h3> */}
        <h3 className="text-xl font-semibold">
          Total: ₹
          {cart.reduce(
            (acc, item) =>
              acc + (item.Price || item.OrginalPrize) * item.quantity,
            0
          )}
        </h3>

        <div className="cart-actions mt-4 flex space-x-4">
          <button
            onClick={() => dispatch(clearCartAsync(userId))}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear Cart
          </button>
          <button
            className="bg-rose-500 text-white px-4 py-2 rounded"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
