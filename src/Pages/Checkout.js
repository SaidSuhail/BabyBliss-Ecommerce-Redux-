import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addOrder, clearCart } from "../Features/userSlice";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart.cartItems);
  const userId = localStorage.getItem("userid");
  const [showModal, setShowModal] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address1: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [user, setUser] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(
          "https://localhost:7055/api/Address/GetAddresses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAddresses(response.data.Data);
        console.log("Fetched addresses:", response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(userId);
        console.log(token);
        const response = await axiosInstance.get(
          `https://localhost:7055/api/User/UserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred while fetching user data.");
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddAddress = async () => {
    const token = localStorage.getItem("token");

    // Log the token and shippingDetails
    console.log("Token:", token);
    console.log("Shipping Details:", shippingDetails);
    console.log(userId);

    if (
      !shippingDetails.fullName ||
      !shippingDetails.address1 ||
      !shippingDetails.street ||
      !shippingDetails.city ||
      !shippingDetails.postalCode ||
      !shippingDetails.phone
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    if ((addresses || []).length >= 3) {
      toast.error("You can only save up to 3 addresses");
      return;
    }

    try {
      const addressPayload = {
        userId: userId,
        CustomerName: shippingDetails.fullName,
        HomeAddress: shippingDetails.address1,
        City: shippingDetails.city,
        StreetName: shippingDetails.street,
        CustomerPhone: shippingDetails.phone,
        PostalCode: shippingDetails.postalCode,
      };
      console.log("Address Payload:", addressPayload); // Log payload before sending
      console.log(shippingDetails);
      const response = await axiosInstance.post(
        "https://localhost:7055/api/Address/Add-new-Address",
        addressPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response); // Log response

      if (response.status === 200 || response.status === 201) {
        toast.success("Address added successfully");

        setUser({
          ...user,
          shippingAddresses: [
            ...(user.shippingAddresses || []), // Ensure it's an array, or default to an empty array
            addressPayload,
          ],
        });

        setShowAddressForm(false);
        setShippingDetails({
          fullName: "",
          address1: "",
          street: "",
          city: "",
          postalCode: "",
          phone: "",
        });
      } else {
        toast.error("Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("An error occurred while adding address.");
    }
  };

  const handlePlaceOrder = async () => {
    // Step 1: Validation
    if (selectedAddressIndex === null) {
      toast.warning("Please select an address");
      return;
    }

    if (cart.length === 0) {
      toast.warning("Your cart is empty. Please add items to your cart.");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    const selectedAddress = addresses[selectedAddressIndex];
    const addId = selectedAddress.Id;

    const totalAmount = cart.reduce(
      (acc, item) => acc + (item.Price || item.OrginalPrize) * item.quantity,
      0
    );

    const deliveryCharge = 40;
    const discount = totalAmount > 2000 ? (totalAmount * 5) / 100 : 0;
    // const finalTotal = totalAmount + deliveryCharge - discount;
    const finalTotal = Math.round(totalAmount + deliveryCharge - discount);

    console.log("Total Amount:", totalAmount);
    console.log("Final Total:", finalTotal);
    const orderString = cart
      .map((item) => `${item.ProductName} x${item.quantity}`)
      .join(", ");

    try {
      // Step 2: Create Razorpay order
      const { data } = await axiosInstance.post(
        `https://localhost:7055/api/Order/razor-order-create?price=${finalTotal}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("order id", data.Data); // Log the response data

      const razorOrderId = data.Data;
      console.log("razorOrderId:", razorOrderId); // Add this

      // Step 3: Configure Razorpay
      const options = {
        key: "rzp_test_FcbSmE4UB2l8CO", // 🔁 Replace with your Razorpay Key
        amount: finalTotal * 100,
        currency: "INR",
        name: "BabyBliss Store",
        description: "Product Purchase",
        order_id: razorOrderId,
        prefill: {
          name: "Saidsuhail", // dynamically insert if needed
          email: "said@g.com", // or user.email
          contact: selectedAddress.CustomerPhone, // or any valid mobile number
        },
        handler: async function (response) {
          console.log("the response is ", response);

          try {
            const paymentDto = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };
            console.log(paymentDto);

            // Step 4: Verify Razorpay payment
            await axiosInstance.post(
              "https://localhost:7055/api/Order/razor-payment-verify",
              paymentDto,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Step 5: Place Order
            const createOrderDto = {
              addId: addId,
              total: finalTotal,
              orderString,
              transactionId: razorOrderId,
            };

            await axiosInstance.post(
              "https://localhost:7055/api/Order/Place-order-all",
              createOrderDto,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Order placed successfully");
            dispatch(addOrder(createOrderDto));
            dispatch(clearCart());
            navigate("/payment-confirmation", {
              state: { cart, shippingDetails: selectedAddress },
            });
          } catch (err) {
            console.error(
              "Payment verification or order placement failed:",
              err
            );
            toast.error("Payment failed or not verified.");
          }
        },
        theme: {
          color: "#f97316", // Tailwind orange-500
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay order creation failed:", err);
      toast.error("Failed to initiate payment");
    }
  };

  const handleDeleteAddress = async (id) => {
    const token = localStorage.getItem("token");

    // Ensure the ID is available
    if (!id) {
      console.error("Address ID is missing");
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `https://localhost:7055/api/Address/delete-address/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Address deleted successfully");

        // Remove the deleted address from the state
        setAddresses((prevAddresses) => {
          const updatedAddresses = prevAddresses.filter(
            (address) => address.Id !== id
          );

          // If the deleted address was selected, reset the selectedAddressIndex
          if (updatedAddresses.length === prevAddresses.length - 1) {
            setSelectedAddressIndex(null); // Reset the selected index
          }

          return updatedAddresses;
        });
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("An error occurred while deleting address.");
    }
  };

  if (!user) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
      {/* Left Section - Product Details */}
      <div className="lg:flex-1 bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          Your Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-lg">No items in cart.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-700">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="py-3 px-6 text-lg font-semibold">Product</th>
                  <th className="py-3 px-6 text-lg font-semibold">Price</th>
                  <th className="py-3 px-6 text-lg font-semibold">Quantity</th>
                  <th className="py-3 px-6 text-lg font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6">{item.ProductName}</td>
                    <td className="py-4 px-6">
                      ₹{item.Price || item.OrginalPrize}
                    </td>
                    <td className="py-4 px-6">{item.quantity}</td>
                    <td className="py-4 px-6 font-semibold">
                      ₹{(item.Price || item.OrginalPrize) * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-300 flex justify-end">
            {/* Total Amount */}
            <h3 className="text-xl font-bold text-gray-900">
              Total: ₹
              {cart.reduce(
                (acc, item) =>
                  acc + (item.Price || item.OrginalPrize) * item.quantity,
                0
              )}
            </h3>
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-300">
            {/* Discount and Delivery Charge */}
            <div className="flex justify-between py-2">
              <span className="font-semibold">Delivery Charge:</span>
              <span>₹40</span>
            </div>

            {/* Apply 5% Discount if Total is above ₹200 */}
            {cart.reduce(
              (acc, item) =>
                acc + (item.Price || item.OrginalPrize) * item.quantity,
              0
            ) > 2000 && (
              <div className="flex justify-between py-2">
                <span className="font-semibold">5% Discount:</span>
                <span>
                  ₹
                  {(
                    (cart.reduce(
                      (acc, item) =>
                        acc + (item.Price || item.OrginalPrize) * item.quantity,
                      0
                    ) *
                      5) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
            )}

            {/* Final Total */}
            <div className="flex justify-between py-2 font-extrabold text-green-500 text-3xl">
              <span>Final Total:</span>
              <span>
                ₹
                {(
                  cart.reduce(
                    (acc, item) =>
                      acc + (item.Price || item.OrginalPrize) * item.quantity,
                    0
                  ) +
                  40 - // Adding Delivery Charge
                  (cart.reduce(
                    (acc, item) =>
                      acc + (item.Price || item.OrginalPrize) * item.quantity,
                    0
                  ) > 2000
                    ? (cart.reduce(
                        (acc, item) =>
                          acc +
                          (item.Price || item.OrginalPrize) * item.quantity,
                        0
                      ) *
                        5) /
                      100
                    : 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Address and Checkout */}
      <div className="lg:flex-1 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-3">
            Select Address
          </h4>

          <select
            value={selectedAddressIndex !== null ? selectedAddressIndex : ""}
            onChange={(e) => setSelectedAddressIndex(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            disabled={addresses.length === 0} // Disable if no addresses
          >
            <option value="" disabled>
              Select an address
            </option>
            {Array.isArray(addresses) && addresses.length > 0 ? (
              addresses.map((address, index) => (
                <option key={index} value={index}>
                  {address.CustomerName}, {address.StreetName}, {address.City}
                </option>
              ))
            ) : (
              <option disabled>No addresses available</option> // Fallback option
            )}
          </select>

          {selectedAddressIndex !== null && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Selected Shipping Address
                  </h3>
                </div>

                <button
                  onClick={() =>
                    handleDeleteAddress(addresses[selectedAddressIndex]?.Id)
                  }
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors duration-150"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>

              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="w-24 font-medium text-gray-700">Name:</span>
                  {addresses[selectedAddressIndex].CustomerName}
                </p>
                <p className="flex items-center">
                  <span className="w-24 font-medium text-gray-700">
                    Address:
                  </span>
                  {addresses[selectedAddressIndex].HomeAddress}
                </p>
                <p className="flex items-center">
                  <span className="w-24 font-medium text-gray-700">City:</span>
                  {addresses[selectedAddressIndex].City}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAddressForm(true)}
          className="w-full mb-6 bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Add New Address
        </button>
        {showAddressForm && (
          <div className="shipping-details mb-6 space-y-4 relative">
            <button
              onClick={() => setShowAddressForm(false)} // Closes the form
              className="absolute -top-2  right-5 text-gray-500 hover:text-gray-700 font-bold text-2xl p-2 rounded-full transition-colors duration-200"
            >
              &times; {/* This is the "X" mark */}
            </button>
            <h4 className="text-lg font-extrabold text-gray-700">
              New Address
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={shippingDetails.fullName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <input
                type="text"
                name="address1"
                placeholder="Home Address *"
                value={shippingDetails.address1}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <input
                type="text"
                name="street"
                placeholder="street Name"
                value={shippingDetails.street}
                onChange={handleInputChange}
                className="form-input"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code *"
                  value={shippingDetails.postalCode}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <button
              onClick={handleAddAddress}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Save Address
            </button>
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg text-lg font-medium transition-colors duration-200 flex items-center justify-between"
        >
          Go For Payment
          <span className="ml-2 text-xl font-extrabold">→</span>{" "}
        </button>

        {showModal && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Choose Payment Option
              </h2>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-medium transition-colors duration-200"
                onClick={() => {
                  setShowModal(false);
                  handlePlaceOrder("online");
                }}
              >
                Online Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
