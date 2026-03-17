import { configureStore, createSlice } from '@reduxjs/toolkit'
import { shipmentApi } from './api/shipApi'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    JSON.parse(localStorage.getItem('user'))    || null,
    token:   localStorage.getItem('token')               || null,
    partner: JSON.parse(localStorage.getItem('partner')) || null,  // ← new
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user  = action.payload.user
      state.token = action.payload.access_token
      localStorage.setItem('token', action.payload.access_token)
      localStorage.setItem('user',  JSON.stringify(action.payload.user))
    },
    setPartnerCredentials: (state, action) => {        // ← new
      state.partner = action.payload.partner
      state.token   = action.payload.access_token
      localStorage.setItem('token',   action.payload.access_token)
      localStorage.setItem('partner', JSON.stringify(action.payload.partner))
    },
    logout: (state) => {
      state.user    = null
      state.token   = null
      state.partner = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('partner')
    },
  },
})

export const { setCredentials, setPartnerCredentials, logout } = authSlice.actions

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [shipmentApi.reducerPath]: shipmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shipmentApi.middleware),
})