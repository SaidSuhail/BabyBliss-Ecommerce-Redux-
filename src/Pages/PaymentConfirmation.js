import React from "react";
import Lottie from "lottie-react";
import successAnimation from "../Assets/orderSuccess.json"
const PaymentConfirmation = () => {
  return (
    <div className="payment-confirmation p-6 bg-gray-100 min-h-screen">
  <div className="flex justify-center items-center mb-8"> 
  <Lottie animationData={successAnimation} loop={false} className="w-48 h-48" />
  </div>
  <p className="text-lg text-center">Thank you for your order with Baby Bliss!</p>
  <p className="text-lg text-center mt-4">
    Your order will be processed shortly. Stay tuned for updates.
  </p>
</div>

  
  );
};

export default PaymentConfirmation;
