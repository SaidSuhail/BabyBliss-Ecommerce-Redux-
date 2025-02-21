import React from "react";

const PaymentConfirmation = () => {
  return (
    <div className="payment-confirmation p-6 bg-gray-100 min-h-screen">
  <div className="flex justify-center items-center mb-8"> 
    <h1 className="text-3xl font-semibold">Payment Confirmation</h1>
    <i className="fas fa-check-circle text-green-500 text-2xl ml-2"></i> 
  </div>
  <p className="text-lg text-center">Thank you for your order with Baby Bliss!</p>
  <p className="text-lg text-center mt-4">
    Your order will be processed shortly. Stay tuned for updates.
  </p>
</div>

  
  );
};

export default PaymentConfirmation;
