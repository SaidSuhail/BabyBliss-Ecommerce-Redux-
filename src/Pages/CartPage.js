import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import emptyCartAnimation from "../Assets/empty-Cart.json";
import {
  setCart,
  fetchCartData,
  removeItem,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../Features/userSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cartItems) || [];
  const userId = useSelector((state) => state.cart.userId);

  // Load cart data from backend & localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      dispatch(setCart(storedCart));

      if (userId) {
        dispatch(fetchCartData(userId));
      }
    } else {
      dispatch(setCart([]));
    }
  }, [dispatch, userId]);

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
        {cart.map((item) => (
          <div
            key={item.id}
            className="cart-item flex items-center justify-between bg-white p-4 shadow rounded mb-4"
          >
            <div className="cart-item-info flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover mr-4 rounded"
              />
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
            </div>
            <div className="cart-item-controls flex items-center space-x-4">
              <button
                onClick={() => dispatch(decreaseQuantity(item.id))}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className="text-lg font-semibold">{item.quantity}</span>
              <button
                onClick={() => dispatch(increaseQuantity(item.id))}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
              >
                +
              </button>
              <button
                onClick={() => dispatch(removeItem(item.id))}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total mt-6 bg-white p-4 shadow rounded">
        <h3 className="text-xl font-semibold">
          Total: ₹
          {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
        </h3>
        <div className="cart-actions mt-4 flex space-x-4">
          <button
            onClick={() => dispatch(clearCart())}
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
