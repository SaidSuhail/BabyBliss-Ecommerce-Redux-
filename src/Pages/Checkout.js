import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addOrder, clearCart } from "../Features/userSlice"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Correctly accessing cart from Redux store
  const cart = useSelector((state) => state.cart.cartItems); 
  
  const userId = localStorage.getItem("userid");

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingDetails.fullName ||
      !shippingDetails.address1 ||
      !shippingDetails.city ||
      !shippingDetails.state ||
      !shippingDetails.postalCode ||
      !shippingDetails.country ||
      !shippingDetails.phone
    ) {
      toast.warning("Please fill in the required fields");
      return;
    }

    try {
      const orderDateTime = new Date();
      const formattedDateTime = orderDateTime.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const orderDetails = {
        cart,
        userId,
        shippingDetails,
        totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        orderDate: formattedDateTime,
      };

      const response = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        toast.success("Order placed successfully");
        
        // Dispatch actions to add order and clear cart from Redux store
        dispatch(addOrder(orderDetails)); 
        dispatch(clearCart()); 
        
        // Navigate to BillingPage and pass the order details
        navigate("/billing", { state: { cart, shippingDetails } });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to place order: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="checkout-page p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      {/* Order Summary */}
      <div className="order-summary bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>
            ₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
          </span>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="shipping-details bg-white p-4 rounded shadow mt-6">
        <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
        <form>
          {[ 
            { name: "fullName", placeholder: "Full Name" },
            { name: "address1", placeholder: "Address Line 1" },
            { name: "address2", placeholder: "Address Line 2 (Optional)" },
            { name: "city", placeholder: "City" },
            { name: "state", placeholder: "State" },
            { name: "postalCode", placeholder: "Postal Code" },
            { name: "country", placeholder: "Country" },
            { name: "phone", placeholder: "Phone Number" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={shippingDetails[field.name]}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded"
            />
          ))}
        </form>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition"
      >
        Place Order
      </button>
      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
