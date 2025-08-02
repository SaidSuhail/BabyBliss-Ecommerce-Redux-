import React, {useState} from "react";
import { useLocation } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";


const BillingPage = () => {
  const { cart, shippingDetails } = useLocation().state; 
  const navigate = useNavigate();
  const [showOnlinePayment, setShowOnlinePayment] = useState(false);
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = (totalAmount * 5) / 100;
  const deliveryCharge = 40;
  const grandTotal = totalAmount + tax + deliveryCharge;


  const handlePaymentOption = (method) => {
    if (method === "Online Payment") {
      setShowOnlinePayment(true);
    } else {
    alert(`You selected ${method} as your payment method.`);
    navigate("/payment-confirmation");
    }
  };
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(); 
  const formattedTime = currentDate.toLocaleTimeString(); 

  return (
    <div className="billing-page p-6 bg-gray-100 min-h-screen relative">
       {/* Payment Method Modal */}
       {showOnlinePayment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowOnlinePayment(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
            <button
              onClick={() => handlePaymentOption("Credit/Debit Card")}
              className="w-full bg-blue-600 text-white p-3 rounded-lg mb-3 hover:bg-blue-700 flex items-center justify-center"
            >
              Credit/Debit Card
            </button>
            <button
              onClick={() => handlePaymentOption("UPI")}
              className="w-full bg-purple-600 text-white p-3 rounded-lg mb-3 hover:bg-purple-700 flex items-center justify-center"
            >
              UPI
            </button>
            <button
              onClick={() => handlePaymentOption("Net Banking")}
              className="w-full bg-green-600 text-white p-3 rounded-lg mb-3 hover:bg-green-700 flex items-center justify-center"
            >
              Net Banking
            </button>
            <button
              onClick={() => setShowOnlinePayment(false)}
              className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-semibold mb-8">Bill Details</h1>

      {/* Company Info */}
      <div className="company-info mb-6">
        <h2 className="text-2xl font-bold">Baby Bliss</h2>
        <p>Your go-to destination for baby products!</p>
      </div>

      {/* Order Details */}
      
      {/* Order Details */}
      <div className="order-details bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <span className="text-sm text-gray-600">
            {formattedDate} - {formattedTime}
          </span>
        </div>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="my-4" />
        {/* Price Details */}
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax (5%):</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Charges:</span>
          <span>₹{deliveryCharge.toFixed(2)}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="shipping-details bg-white p-6 rounded shadow mb-6">
        <h2 className="text-2xl font-semibold mb-6">Shipping Details</h2>

        {/* Name and Phone */}
        <div className="flex justify-between">
          <p>
            <strong>Name:</strong> {shippingDetails.fullName}
          </p>
        </div>
        <div className="flex justify-between">
          <p>
            <strong>Phone:</strong> {shippingDetails.phone}
          </p>
        </div>

        <div className="flex justify-between">
          <p>
            <strong>Address: </strong>
            {shippingDetails.address1}
          </p>
        </div>

        <div className="flex justify-between">
          <p>
            <strong>City:</strong> {shippingDetails.city}
          </p>
        </div>
        <div className="flex justify-between">
          <p>
            <strong>State:</strong> {shippingDetails.state}
          </p>
        </div>
        <div className="flex justify-between">
          <p>
            <strong>Postal Code:</strong> {shippingDetails.postalCode}
          </p>
        </div>
        <div className="flex justify-between">
          <p>
            <strong>Country:</strong> {shippingDetails.country}
          </p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="payment-options bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Payment Options</h2>
        <button
          onClick={() => handlePaymentOption("Cash on Delivery")}
          className="w-full bg-gray-700 text-white py-2 rounded mb-4 hover:bg-gray-800 transition"
        >
          Cash on Delivery
        </button>
        <button
          onClick={() => handlePaymentOption("Online Payment")}
          className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition"
        >
          Online Payment
        </button>
      </div>
    </div>
  );
};

export default BillingPage;
