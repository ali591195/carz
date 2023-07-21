import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

import {
  GET_SHIPPING_CHARGES,
  GET_SHIPPING_CHARGES_BY_ID,
  ADD_SHIPPING_CHARGES,
  UPDATE_SHIPPING_CHARGES,
  DELETE_SHIPPING_CHARGES,
  SHIPPING_CHARGES_ERROR,
  SET_LOADING,
  CLEAR_SHIPPING_CHARGES_ERRORS,
  CLEAR_SHIPPING_CHARGES_MESSAGE,
} from './types'

// Get all Shipping Charges
export const getShippingCharges = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/store`)
    dispatch({
      type: GET_SHIPPING_CHARGES,
      payload: res.data.stores,
    })
  } catch (err) {
    console.log('error')
    dispatch({
      type: SHIPPING_CHARGES_ERROR,
      payload: err.response.data.error,
    })
  }
}
// Get Shipping Charge By ID
export const getShippingChargeById = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/store/${data}`)

    dispatch({
      type: GET_SHIPPING_CHARGES_BY_ID,
      payload: res.data.store,
    })
  } catch (err) {
    // console.log('err::', err)
    dispatch({
      type: SHIPPING_CHARGES_ERROR,
      payload: err && err.response.data.message,
    })
  }
}

// Add Shipping Charge
export const addShippingCharges = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/shipping_charges`, data)

    dispatch({
      type: ADD_SHIPPING_CHARGES,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: SHIPPING_CHARGES_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Update Shipping Charges by ID
export const updateShippingCharges = (data, id) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/shipping_charges/${id}`, data)

    dispatch({
      type: UPDATE_SHIPPING_CHARGES,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: SHIPPING_CHARGES_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Delete shipping charge
export const deleteShippingCharges = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/assign_store/delete/${data}`)

    dispatch({
      type: DELETE_SHIPPING_CHARGES,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: SHIPPING_CHARGES_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Clear Error
export const clearError = () => {
  return {
    type: CLEAR_SHIPPING_CHARGES_ERRORS,
  }
}

// Clear Message
export const clearMessage = () => {
  return {
    type: CLEAR_SHIPPING_CHARGES_MESSAGE,
  }
}

// Set loading to true
export const setLoading = () => {
  return {
    type: SET_LOADING,
  }
}
