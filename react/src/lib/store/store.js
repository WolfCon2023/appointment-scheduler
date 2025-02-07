import { configureStore } from '@reduxjs/toolkit'

//Slices
import appReducer from './slice/app-slice'
import customersReducer from './slice/customers-slice'

export const store = configureStore({
  reducer: {
    appReducer,
    customersReducer,
  }
})


