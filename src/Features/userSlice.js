import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";

export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async (userId) => {
    if (!userId) return [];

    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

    const response = await axiosInstance.get(
      `https://localhost:7055/api/User/UserById/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      }
    );

    console.log(response.data);
    return response.data.cart || [];
  }
);

export const fetchWishlistData = createAsyncThunk(
  "wishlist/fetchWishlistData",
  async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://localhost:7055/api/WishList/GetWishList",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Assuming backend returns wishlist array
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
  }
);
export const increaseQuantityAsync = createAsyncThunk(
  "cart/increaseQuantityAsync",
  async (productId, { dispatch }) => {
    await axios.patch(
      `https://localhost:7055/api/Cart/increment-product-qty/${productId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    dispatch(increaseQuantity(productId));
    toast.success("Quantity increased!");
  }
);
export const decreaseQuantityAsync = createAsyncThunk(
  "cart/decreaseQuantityAsync",
  async (productId, { dispatch }) => {
    await axios.patch(
      `https://localhost:7055/api/Cart/decrement-product-qty/${productId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    dispatch(decreaseQuantity(productId));
    toast.info("Quantity decreased!");
  }
);
export const clearCartAsync = (userId) => async (dispatch) => {
  try {
    await axios.delete(`https://localhost:7055/api/Cart/clear/${userId}`);
    dispatch(clearCart());
    toast.success("Cart cleared!");
  } catch (err) {
    console.error("Error clearing cart:", err);
    toast.error("Failed to clear cart");
  }
};

const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const initialState = {
  cartItems: storedCart,
  wishlistItems: storedWishlist,
  userId: localStorage.getItem("userid") || "",
  orders: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload;
      if (action.payload.length > 0) {
        localStorage.setItem("cart", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("cart");
      }
    },

    setWishlist: (state, action) => {
      state.wishlistItems = action.payload;
      if (action.payload.length > 0) {
        localStorage.setItem("wishlist", JSON.stringify(action.payload)); // Save to localStorage when wishlist has items
      } else {
        localStorage.removeItem("wishlist"); // Remove from localStorage when wishlist is empty
      }
    },

    addItem: (state, action) => {
      console.log("User ID from localStorage:", localStorage.getItem("userid"));

      const productId = action.payload.productId;
      const type = action.payload.type || "add"; // "add" | "decrement"

      if (!state.userId) {
        toast.error("You must be logged in to update the cart!");
        window.location.href = "/login";
        return;
      }

      if (!productId) {
        toast.error("You must provide a valid product ID!");
        return;
      }

      console.log("User ID:", state.userId);
      console.log("Product ID:", productId);
      console.log("Action Type:", type);

      const existingProduct = state.cartItems.find(
        (item) => item.productId === productId
      );
      const token = localStorage.getItem("token");

      if (type === "add") {
        if (existingProduct) {
          existingProduct.quantity += 1;
          toast.info("Quantity increased in the cart!");

          // 🔁 Increment quantity in DB
          axios
            .patch(
              `https://localhost:7055/api/Cart/increment-product-qty/${productId}`,
              null,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              console.log("Quantity incremented on server");
            })
            .catch((error) => {
              toast.error("Failed to update quantity on server");
              console.error(error);
            });
        } else {
          const newProduct = { ...action.payload, quantity: 1 };
          state.cartItems.push(newProduct);
          toast.success("Item added to the cart!");

          // ➕ Add item to DB
          axios
            .post(
              `https://localhost:7055/api/Cart/AddToCart/${productId}`,
              null,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              console.log("Item added to cart on server");
            })
            .catch((error) => {
              toast.error("Error adding item to cart on server");
              console.error(error);
            });
        }
      }

      if (type === "decrement") {
        if (!existingProduct) {
          toast.error("Product not found in cart");
          return;
        }

        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;
          toast.info("Quantity decreased");

          // 🔁 Decrease quantity in DB
          axios
            .patch(
              `https://localhost:7055/api/Cart/decrement-product-qty/${productId}`,
              null,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              console.log("Quantity decreased on server");
            })
            .catch((error) => {
              toast.error("Failed to decrease quantity on server");
              console.error(error);
            });
        } else {
          // 🗑️ Remove item from cart
          state.cartItems = state.cartItems.filter(
            (item) => item.productId !== productId
          );
          toast.info("Item removed from cart");

          // Remove item from DB
          axios
            .delete(`https://localhost:7055/api/Cart/remove/${productId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(() => {
              console.log("Item removed from cart on server");
            })
            .catch((error) => {
              toast.error("Failed to remove item from server");
              console.error(error);
            });
        }
      }

      // 💾 Save updated cart
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    removeItem: (state, action) => {
      const productId = action.payload; // Assuming productId is passed as a payload
      console.log("Removing product with ID:", action.payload);
      // const productId = action.payload.productId;
      console.log(`Removing item with productId: ${productId}`);

      // Update state and localStorage
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("cart", JSON.stringify(state.cartItems));

      // Send DELETE request to backend
      axios
        .delete(
          `https://localhost:7055/api/Cart/DeleteItemFromCart/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          console.log(`Item ${productId} removed from server cart`);
        })
        .catch((error) => {
          toast.error("Error removing item from server");
          console.error(error);
        });

      toast.error("Item removed from the cart!");
    },

    addItemToWishlist: (state, action) => {
      const productId = action.payload.Id; // Use 'Id' instead of 'productId'

      // Check if item already exists in wishlist
      const existingItem = state.wishlistItems.find(
        (item) => item && item.Id === productId // Check using 'Id' instead of 'productId'
      );

      if (!existingItem) {
        state.wishlistItems.push(action.payload); // Add product to wishlist
        toast.success("Item added to the wishlist!");
      } else {
        toast.info("Item is already in the wishlist.");
      }

      // Update localStorage
      localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));

      // Send request to backend
      axios
        .post(
          `https://localhost:7055/api/WishList/AddOrRemove/${productId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
          }
        )
        .then(() => {
          console.log("Wishlist updated on server");
        })
        .catch((error) => {
          toast.error("Error updating wishlist on server");
          console.error(error);
        });
    },
    removeItemFromWishlist: (state, action) => {
      const productId = action.payload; // Assuming action.payload is the product ID
      console.log("Removing product with ID:", productId);

      // Check if item exists in the wishlist
      const itemIndex = state.wishlistItems.findIndex(
        (item) => item && item.Id === productId
      );

      if (itemIndex !== -1) {
        // Item exists, remove it from wishlist
        state.wishlistItems.splice(itemIndex, 1);
        toast.success("Item removed from the wishlist!");

        // Update localStorage
        localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));

        // Send DELETE request to backend
        axios
          .delete(
            `https://localhost:7055/api/WishList/RemoveWishlist/${productId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            console.log("Wishlist updated on server");
          })
          .catch((error) => {
            toast.error("Error removing item from server");
            console.error(error);
          });
      } else {
        // Item is not in the wishlist
        toast.info("Item is not in the wishlist.");
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem("wishlist");
      axios.patch(`http://localhost:3001/users/${state.userId}`, {
        wishlist: [],
      });
      toast.info("Wishlist cleared!");
    },

    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.productId === action.payload
      );
      if (item) {
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.productId === action.payload
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },

    addOrder: (state, action) => {
      state.orders.push(action.payload);
      localStorage.setItem("orders", JSON.stringify(state.orders));
      // toast.success("Order placed successfully!");
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("userid", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        console.log("Cart Data Fetched:", action.payload); // 👈 Check this
        state.loading = false;
        state.cartItems = action.payload;
        localStorage.setItem("cart", JSON.stringify(action.payload));
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWishlistData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWishlistData.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
        localStorage.setItem("wishlist", JSON.stringify(action.payload));
      })
      .addCase(fetchWishlistData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setCart,
  setWishlist,
  addItem,
  removeItem,
  addItemToWishlist,
  removeItemFromWishlist,
  addOrder,
  clearCart,
  clearWishlist,
  increaseQuantity,
  decreaseQuantity,
  setUserId,
} = userSlice.actions;

export default userSlice.reducer;
