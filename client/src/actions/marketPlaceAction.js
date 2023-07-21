import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

import {
  GET_MARKETPLACES,
  GET_MARKETPLACE_BY_ID,
  ADD_MARKETPLACE,
  UPDATE_MARKETPLACE,
  DISABLE_MARKETPLACE,
  MARKETPLACES_ERROR,
  SET_LOADING,
  CLEAR_MARKETPLACE_DETAIL,
  CLEAR_MARKETPLACES_ERRORS,
  CLEAR_MARKETPLACES_MESSAGE,
} from './types'

// Get all Marketplaces
export const getMarketPlaces = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/market_place`)

    dispatch({
      type: GET_MARKETPLACES,
      payload: res.data.marketPlaces,
    })
  } catch (err) {
    dispatch({
      type: MARKETPLACES_ERROR,
      payload: err.response.data.error,
    })
  }
}
// Get Marketplace By ID
export const getMarketPlaceById = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/market_place/${data}`)

    dispatch({
      type: GET_MARKETPLACE_BY_ID,
      payload: res.data.marketPlace,
    })
  } catch (err) {
    // console.log('err::', err)
    dispatch({
      type: MARKETPLACES_ERROR,
      payload: err && err.response.data.message,
    })
  }
}

// Add Marketplace
export const addMarketPlace = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/market_place`, data)

    dispatch({
      type: ADD_MARKETPLACE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: MARKETPLACES_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Update Marketplace by ID
export const updateMarketPlace = (data, id) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/market_place/${id}`, data)

    dispatch({
      type: UPDATE_MARKETPLACE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: MARKETPLACES_ERROR,
      payload: err.response.data.message,
    })
  }
}
// Disable Market Place
export const disableMarketPlace = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/market_place/disable/${data.id}`, {
      active: data.active,
    })

    dispatch({
      type: DISABLE_MARKETPLACE,
      payload: res.data.message,
    })
  } catch (err) {
    console.log(err)
    dispatch({
      type: HUNTING_STORE_ERROR,
      payload: err && err.response.data.message,
    })
  }
}

// Clear Market Place Details
export const clearMarketPlaceDetail = () => {
  return {
    type: CLEAR_MARKETPLACE_DETAIL,
  }
}

// Clear Error
export const clearError = () => {
  return {
    type: CLEAR_MARKETPLACES_ERRORS,
  }
}

// Clear Message
export const clearMessage = () => {
  return {
    type: CLEAR_MARKETPLACES_MESSAGE,
  }
}

// Set loading to true
export const setLoading = () => {
  return {
    type: SET_LOADING,
  }
}
