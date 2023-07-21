import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

import {
  GET_ACTIVE_HUNTING_STORES,
  GET_HUNTING_STORES,
  GET_HUNTING_STORE_BY_ID,
  ADD_HUNTING_STORE,
  UPDATE_HUNTING_STORE,
  DISABLE_HUNTING_STORE,
  ASSIGNED_STORE,
  DELETE_ASSIGNED_STORE,
  HUNTING_STORE_ERROR,
  SET_LOADING,
  CLEAR_HUNTING_STORE_ERRORS,
  CLEAR_HUNTING_STORE_MESSAGE,
  CLEAR_HUNTING_STORES,
  CLEAR_HUNTING_STORE_DETAIL,
} from './types'
// Get all Active store
export const getActiveStore = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/store/active`)
    dispatch({
      type: GET_ACTIVE_HUNTING_STORES,
      payload: res.data.store,
    })
  } catch (err) {
    console.log('error')
    dispatch({
      type: HUNTING_STORE_ERROR,
      payload: err.response.data.error,
    })
  }
}
// Get all store
export const getStores = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/store`)
    dispatch({
      type: GET_HUNTING_STORES,
      payload: res.data.stores,
    })
  } catch (err) {
    console.log('error')
    dispatch({
      type: HUNTING_STORE_ERROR,
      payload: err.response.data.error,
    })
  }
}

export const getHuntingStoreById = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/store/${data}`)

    dispatch({
      type: GET_HUNTING_STORE_BY_ID,
      payload: res.data.store,
    })
  } catch (err) {
    // console.log('err::', err)
    dispatch({
      type: HUNTING_STORE_ERROR,
      payload: err && err.response.data.message,
    })
  }
}

// Add Hunting Store by ID
export const addHuntingStore = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/store`, data)
    console.log('res::>', res)
    dispatch({
      type: ADD_HUNTING_STORE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: HUNTING_STORE_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Update Hunting Store by ID
export const updateHuntingStore = (data, id) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/store/${id}`, data)
    console.log('res, res', res)
    dispatch({
      type: UPDATE_HUNTING_STORE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: HUNTING_STORE_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Assign store to user
export const assignStore = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/assign_store`, data)

    dispatch({
      type: ASSIGNED_STORE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: HUNTING_STORE_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Delete Assign store
export const deleteAssignStore = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/assign_store/delete/${data}`)
    console.log('res, res', res)
    dispatch({
      type: DELETE_ASSIGNED_STORE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: HUNTING_STORE_ERROR,
      payload: err.response.data.message,
    })
  }
}

export const disableHuntingStore = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/store/disable/${data.id}`, {
      active: data.active,
    })

    dispatch({
      type: DISABLE_HUNTING_STORE,
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

// Clear Hunting Stores
export const clearHuntingStores = () => {
  return {
    type: CLEAR_HUNTING_STORES,
  }
}
// Clear Hunting Stores Details
export const clearHuntingStoreDetail = () => {
  return {
    type: CLEAR_HUNTING_STORE_DETAIL,
  }
}
// Clear Error
export const clearError = () => {
  return {
    type: CLEAR_HUNTING_STORE_ERRORS,
  }
}

// Clear Message
export const clearMessage = () => {
  return {
    type: CLEAR_HUNTING_STORE_MESSAGE,
  }
}

// Set loading to true
export const setLoading = () => {
  return {
    type: SET_LOADING,
  }
}
