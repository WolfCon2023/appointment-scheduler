import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pageViewId: 'dashboard',
  previousPageViewId: 'dashboard'
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPageViewId: (state, action) => {
      state.previousPageViewId = state.pageViewId
      state.pageViewId = action.payload
    },
    goBack: (state, action) => {
        state.pageViewId = state.previousPageViewId
    }
  },
})

export const selectApp = state => state.appReducer

// Action creators are generated for each case reducer function
export const { setPageViewId, goBack } = appSlice.actions

export default appSlice.reducer