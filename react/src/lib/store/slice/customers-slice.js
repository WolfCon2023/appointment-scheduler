import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  customerList: []
}

export const getCustomers = createAsyncThunk(
  'customers/getCustomers',
  async () => {
    const res = await axios.get('vital-backoffice-apps-7a0e798b/api/customers')
    return res.data
  }
)

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async data => {
    console.log('add customer')
    console.log(data)
    const res = await axios.post('vital-backoffice-apps-7a0e798b/api/customers', data)
    return res.data
  }
)

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCustomers.pending, (state, { payload }) => {
        console.log('getCustomers pending')
      })
      .addCase(getCustomers.fulfilled, (state, { payload }) => {
        console.log('getCustomers fulfilled')
        state.customerList = payload
      })
      .addCase(getCustomers.rejected, (state, { payload }) => {
        console.log('getCustomers rejected')
      })
      .addCase(addCustomer.pending, (state, { payload }) => {
        console.log('addCustomer pending')
      })
      .addCase(addCustomer.fulfilled, (state, { payload }) => {
        console.log('addCustomer fulfilled')
      })
      .addCase(addCustomer.rejected, (state, { payload }) => {
        console.log('addCustomer rejected')
      })
  }
})

export const selectCustomers = state => state.customersReducer

export const {} = customersSlice.actions

export default customersSlice.reducer