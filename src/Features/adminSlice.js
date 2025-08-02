import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue("No authentication token found.");
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const productResponse = await axios.get(
        "https://localhost:7055/All Products",
        config
      );
      console.log(productResponse);
      return productResponse.data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch products.");
    }
  }
);

// export const fetchPaginated = createAsyncThunk(
//   "admin/fetchPaginated",
//   async ({ pageNumber, pageSize }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return rejectWithValue("No authentication token found.");
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.get(
//         `http://localhost:7055/api/Order/paginated-orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
//         config
//       );
//       console.log(response)
//       return response.data.Data;
//     } catch (error) {
//       return rejectWithValue("Failed to fetch paginated orders.");
//     }
//   }
// );



//fetch categories
export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(
        "https://localhost:7055/api/Category/getCategories",
        config
      );
      console.log("Fetched category", response);
      return response.data.Data; // adjust if needed
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch categories");
    }
  }
);

export const addProduct = createAsyncThunk(
  "admin/addProduct",
  async (product, thunkAPI) => {
    try {
      console.log("Product Data being sent:", product);
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      console.log(token);

      // Set up the config with Authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // 👈 necessary for FormData
        },
      };

      // API URL for adding products
      const url = "https://localhost:7055/Add-Products";

      // Send the product data with the token in the headers
      const response = await axios.post(url, product, config);
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to add product");
    }
  }
);

export const editProduct = createAsyncThunk(
  "admin/editProduct",
  async (product, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue("No token found. Please login.");
      }

      // Set up the config with Authorization header and Content-Type for FormData
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Necessary for FormData (if updating image)
        },
      };

      // URL for updating the product by ID
      const url = `https://localhost:7055/Update-Products/${product.Id}`;

      // Create FormData for sending product data (including files)
      const formData = new FormData();
      formData.append("ProductName", product.name);
      formData.append("ProductDescription", product.description);
      formData.append("Rating", product.rating);
      formData.append("ProductPrice", product.price);
      formData.append("OfferPrize", product.offerPrize);
      formData.append("CategoryId", product.categoryId);

      // If there's an image, append it to the FormData
      if (product.imageFile) {
        formData.append("image", product.imageFile); // Assuming 'imageFile' is a File object
      }

      // Send the product data with the token in the headers
      const response = await axios.put(url, formData, config);
      // console.log("UNDEFINED",response)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update product.");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async ({ id }) => {
    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const url = `https://localhost:7055/Delete/${id}`;

      await axios.delete(url, config);
      return id;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token"); // or sessionStorage if you used that
      const response = await axios.get(
        "https://localhost:7055/api/User/Get-All-Users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.Data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load user details.");
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (userId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://localhost:7055/api/Order/GetOrderDetailsAdmin-ByuserId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched Orders:", response.data); // Log response to check if orders exist

      if (response.data.Data && response.data.Data.length > 0) {
        return response.data.Data; // Assuming orders are in the 'Data' field
      } else {
        return thunkAPI.rejectWithValue("No orders found");
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      return thunkAPI.rejectWithValue("Failed to load orders.");
    }
  }
);
export const fetchOrdersAll = createAsyncThunk(
  "admin/fetchOrdersAll",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return thunkAPI.rejectWithValue("No authentication token found.");
      }

      console.log("Using token:", token);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "https://localhost:7055/api/Order/Get-order-Details-Admin",
        config
      );

      const orders = response.data.Data;
      console.log(orders);
      return orders;
    } catch (error) {
      console.error("fetchOrdersAll Error:", error);
      return thunkAPI.rejectWithValue("Failed to load orders.");
    }
  }
);

// export const updateOrderStatus = createAsyncThunk(
//   "admin/updateOrderStatus",
//   async ({ orderId }, thunkAPI) => {
//     try {
//       console.log("Updating order with ID:", orderId); // Debugging line
//       const token = localStorage.getItem("token");

//       const response = await axios.patch(
//         `https://localhost:7055/api/Order/Manage-order-status/${orderId}`,
//         null, // ❌ No body — backend doesn't expect any
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return response.data;
//     } catch (err) {
//       console.error("Update Order Status Error:", err);
//       return thunkAPI.rejectWithValue("Failed to update order status.");
//     }
//   }
// );
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId }, thunkAPI) => {
    try {
      console.log("Updating order with ID:", orderId); // Debugging line
      if (!orderId) {
        return thunkAPI.rejectWithValue("Order ID is missing.");
      }
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `https://localhost:7055/api/Order/Manage-order-status/${orderId}`,
        null, // ❌ No body — backend doesn't expect any
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error("Update Order Status Error:", err);
      return thunkAPI.rejectWithValue("Failed to update order status.");
    }
  }
);

export const blockUnblockUser = createAsyncThunk(
  "admin/blockUnblockUser",
  async ({ userId, IsBlocked }, thunkAPI) => {
    try {
      console.log("UserId:", userId); // Check that userId is being passed correctly
      const token = localStorage.getItem("token"); // Get token from local storage

      const response = await axios.patch(
        `https://localhost:7055/api/User/Block/Unblock/${userId}`,
        { IsBlocked: !IsBlocked }, // Only pass isBlocked here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in header
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.Data; // Return API response
    } catch (err) {
      console.error("Error:", err);
      return thunkAPI.rejectWithValue("Failed to update user status.");
    }
  }
);

// Fetch Dashboard Data
export const fetchDashboardData = createAsyncThunk(
  "admin/fetchDashboardData",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue("No authentication token found.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch users
      const userResponse = await axios.get(
        "https://localhost:7055/api/User/Get-All-Users",
        config
      );

      // Fetch products
      const productResponse = await axios.get(
        "https://localhost:7055/All Products",
        config
      );

      // Fetch orders
      const orderResponse = await axios.get(
        "https://localhost:7055/api/Order/Get-order-Details-Admin",
        config
      );
      const orders = orderResponse.data.Data;
      console.log(orders);

      //Fetch Revenue
      const revenueResponse = await axios.get(
        "https://localhost:7055/api/Order/Total Revenue",
        config
      );

      return {
        userCount: userResponse.data.Data.length,
        productCount: productResponse.data.Data.length,
        totalOrderAmount: revenueResponse.data.Data,
        recentOrders: orders,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to load dashboard data.");
    }
  }
);

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

      //Block Unblock User
      .addCase(blockUnblockUser.fulfilled, (state, action) => {
        const { userId, IsBlocked } = action.payload; // Use exact casing from backend
        state.users = state.users.map((user) =>
          user.id === userId ? { ...user, IsBlocked } : user
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
      //Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //Fetch category
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const categoryList = action.payload;
        if (Array.isArray(categoryList)) {
          state.categories = categoryList.map(
            (category) => category.CategoryName
          );
        } else {
          state.categories = [];
          console.error("Invalid category response:", action.payload);
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Add Edit Delete Produtct
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const idToDelete = action.payload;
        state.products = state.products.filter(
          (product) => product.id !== idToDelete
        );
      })
      // Handle other cases like pending or rejected (if needed)
      .addCase(deleteProduct.rejected, (state, action) => {
        // Handle the error if necessary
      });
    //Orders Management
    builder.addCase(fetchOrdersAll.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
    builder
      .addCase(fetchOrdersAll.rejected, (state, action) => {
        state.orders = [];
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order.OrderId === updatedOrder.OrderId
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder; // Replace the order in the state
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(fetchPaginated.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchPaginated.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.orders = action.payload.data; // Assuming API returns paginated order list here
      //   state.totalCount = action.payload.totalCount;
      // })
      // .addCase(fetchPaginated.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // });
  },
});

export const { toggleSidebar, setSelectedUser } = adminSlice.actions;

export default adminSlice.reducer;
