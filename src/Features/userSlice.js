import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Fetch cart data from backend
export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async (userId) => {
    if (!userId) return [];
    const response = await axios.get(`http://localhost:3001/users/${userId}`);
    return response.data.cart || [];
  }
);

// Fetch wishlist data from backend
export const fetchWishlistData = createAsyncThunk(
  "wishlist/fetchWishlistData",
  async (userId) => {
    if (!userId) return [];
    const response = await axios.get(`http://localhost:3001/users/${userId}`);
    return response.data.wishlist || [];
  }
);

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
    // setCart: (state, action) => {
    //   state.cartItems = action.payload;
    //   localStorage.setItem("cart", JSON.stringify(action.payload));
    // },
    setCart: (state, action) => {
      state.cartItems = action.payload;
      if (action.payload.length > 0) {
        localStorage.setItem("cart", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("cart");
      }
    },
    // setWishlist: (state, action) => {
    //   state.wishlistItems = action.payload;
    //   localStorage.setItem("wishlist", JSON.stringify(action.payload));
    // },
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload;
      if (action.payload.length > 0) {
        localStorage.setItem("wishlist", JSON.stringify(action.payload)); // Save to localStorage when wishlist has items
      } else {
        localStorage.removeItem("wishlist"); // Remove from localStorage when wishlist is empty
      }
    },
    addItem: (state, action) => {
      if (!state.userId) {
        toast.error("You must be logged in to add items to the cart!");
        window.location.href = "/login"; // Redirect to the login page
        return;
      }
      const existingProduct = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
        toast.info("Quantity increased in the cart!");
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
        toast.success("Item added to the cart!");
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      axios.patch(`http://localhost:3001/users/${state.userId}`, {
        cart: state.cartItems,
      });
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      axios.patch(`http://localhost:3001/users/${state.userId}`, {
        cart: state.cartItems,
      });
      toast.error("Item removed from the cart!");
    },
    addItemToWishlist: (state, action) => {
      if (!state.userId) {
        toast.error("You must be logged in to add items to the wishlist!");
        window.location.href = "/login"; // Redirect to login page
        return;
      }
      const existingItem = state.wishlistItems.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.wishlistItems.push(action.payload);
        toast.success("Item added to the wishlist!");
      } else {
        toast.info("Item is already in the wishlist.");
      }
      localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));
      axios.patch(`http://localhost:3001/users/${state.userId}`, {
        wishlist: state.wishlistItems,
      });
    },
    removeItemFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));
      axios.patch(`http://localhost:3001/users/${state.userId}`, {
        wishlist: state.wishlistItems,
      });
      toast.error("Item removed from the wishlist!");
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
      axios.patch(`http://localhost:3001/users/${state.userId}`, { cart: [] });
      toast.info("Cart cleared!");
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
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
        axios.patch(`http://localhost:3001/users/${state.userId}`, {
          cart: state.cartItems,
        });
        toast.info("Quantity increased!");
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
        axios.patch(`http://localhost:3001/users/${state.userId}`, {
          cart: state.cartItems,
        });
        toast.info("Quantity decreased!");
      }
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      localStorage.setItem("orders", JSON.stringify(state.orders));
      toast.success("Order placed successfully!");
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
