import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Async Thunks for Fetching, Adding, Editing, and Deleting Products
export const fetchProducts = createAsyncThunk("admin/fetchProducts", async () => {
    try {
      const fashionResponse = await axios.get("http://localhost:3001/fashion");
      const productResponse = await axios.get("http://localhost:3001/product");
  
      const combinedProducts = [...fashionResponse.data, ...productResponse.data];
      return combinedProducts;
    } catch (error) {
      throw error;
    }
  });
  export const addProduct = createAsyncThunk("admin/addProduct", async (product) => {
    try {
      const url =
        product.category === "boys" || product.category === "girls" || product.category === "common"
          ? "http://localhost:3001/fashion"
          : "http://localhost:3001/product";
  
      const response = await axios.post(url, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  });

  export const editProduct = createAsyncThunk("admin/editProduct", async (product) => {
    try {
      const url =
        product.category === "boys" || product.category === "girls" || product.category === "common"
          ? `http://localhost:3001/fashion/${product.id}`
          : `http://localhost:3001/product/${product.id}`;
  
      const response = await axios.put(url, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  });

  export const deleteProduct = createAsyncThunk("admin/deleteProduct", async ({ id, category }) => {
    try {
      const url =
        category === "boys" || category === "girls" || category === "common"
          ? `http://localhost:3001/fashion/${id}`
          : `http://localhost:3001/product/${id}`;
  
      await axios.delete(url);
      return id;
    } catch (error) {
      throw error;
    }
  });

// Fetch users data from the backend
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:3001/users");
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to load user details.");
  }
});

// Fetch orders for a selected user
export const fetchOrders = createAsyncThunk("admin/fetchOrders", async (userId, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:3001/orders");
    return response.data.filter((order) => order.userId === userId);
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to load orders.");
  }
});

// Block or unblock a user
export const blockUnblockUser = createAsyncThunk(
  "admin/blockUnblockUser",
  async ({ userId, isBlocked }, thunkAPI) => {
    try {
      await axios.patch(`http://localhost:3001/users/${userId}`, {
        blocked: !isBlocked,
      });
      return { userId, isBlocked: !isBlocked };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to update user status.");
    }
  }
);

// Fetch Dashboard Data
export const fetchDashboardData = createAsyncThunk("admin/fetchDashboardData", async (_, thunkAPI) => {
  try {
    // Fetch users count
    const userResponse = await axios.get("http://localhost:3001/users");

    // Fetch products from both "products" and "fashion"
    const productResponse1 = await axios.get("http://localhost:3001/product");
    const productResponse2 = await axios.get("http://localhost:3001/fashion");

    // Combine product counts from both endpoints
    const combinedProducts = [...productResponse1.data, ...productResponse2.data];

    // Fetch orders
    const orderResponse = await axios.get("http://localhost:3001/orders");
    const orders = orderResponse.data;

    // Calculate total revenue
    const totalAmount = orders.reduce((acc, order) => {
      const orderAmount = parseFloat(order.totalAmount);
      return !isNaN(orderAmount) ? acc + orderAmount : acc;
    }, 0);

    return {
      userCount: userResponse.data.length,
      productCount: combinedProducts.length,
      totalOrderAmount: totalAmount,
      recentOrders: orders,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to load dashboard data.");
  }
});

const initialState = {
  sidebarOpen: false,
  dashboardStats: {
    userCount: 0,
    productCount: 0,
    totalOrderAmount: 0,
    recentOrders: [],
  },
  users: [],
  selectedUser: null,
  orders: [],
  products: [],
  categories: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch orders for selected user
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Block/Unblock user
      .addCase(blockUnblockUser.fulfilled, (state, action) => {
        const { userId, isBlocked } = action.payload;
        state.users = state.users.map((user) =>
          user.id === userId ? { ...user, blocked: isBlocked } : user
        );
      })
      .addCase(blockUnblockUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.categories = Array.from(
          new Set(
            action.payload
              .map((product) =>
                typeof product.category === "string" ? product.category.trim().toLowerCase() : null
              )
              .filter(Boolean)
          )
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      });
  }
});

export const { toggleSidebar, setSelectedUser } = adminSlice.actions;

export default adminSlice.reducer;
