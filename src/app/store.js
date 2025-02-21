import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../Features/userSlice'
import adminReducer from '../Features/adminSlice'

const store = configureStore({
    reducer:{
        cart:userReducer,
        admin:adminReducer,
    }
})

export default store