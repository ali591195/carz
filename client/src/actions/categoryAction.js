import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

import {
  GET_CATEGORYS,
  GET_SUB_CATEGORYS,
  GET_ACTIVE_CATEGORYS,
  GET_CATEGORY_BY_ID,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DISABLE_CATEGORY,
  CATEGORYS_ERROR,
  SET_LOADING,
  CLEAR_CATEGORY_DETAIL,
  CLEAR_CATEGORY_ERRORS,
  CLEAR_CATEGORY_MESSAGE,
} from './types'

// Get all Categorys
export const getCategorys = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/category/main`)

    dispatch({
      type: GET_CATEGORYS,
      payload: res.data.categorys,
    })
  } catch (err) {
    dispatch({
      type: CATEGORYS_ERROR,
      payload: err.response.data.error,
    })
  }
}
// Get all Sub-Categorys
export const getSubCategorys = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/category/sub`)

    dispatch({
      type: GET_SUB_CATEGORYS,
      payload: res.data.categorys,
    })
  } catch (err) {
    dispatch({
      type: CATEGORYS_ERROR,
      payload: err.response.data.error,
    })
  }
}
// Get all Active Main Categorys
export const getActiveMainCategorys = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/category/active/main`)

    dispatch({
      type: GET_ACTIVE_CATEGORYS,
      payload: res.data.categorys,
    })
  } catch (err) {
    dispatch({
      type: CATEGORYS_ERROR,
      payload: err.response.data.error,
    })
  }
}
// Get Category By ID
export const getCategoryById = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/category/${data}`)

    dispatch({
      type: GET_CATEGORY_BY_ID,
      payload: res.data.category,
    })
  } catch (err) {
    // console.log('err::', err)
    dispatch({
      type: CATEGORYS_ERROR,
      payload: err && err.response.data.message,
    })
  }
}

// Add Category
export const addCategory = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/category`, data)

    dispatch({
      type: ADD_CATEGORY,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: CATEGORYS_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Update Category by ID
export const updateCategory = (data, id) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/category/${id}`, data)

    dispatch({
      type: UPDATE_CATEGORY,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: CATEGORYS_ERROR,
      payload: err.response.data.message,
    })
  }
}
// Disable Category
export const disableCategory = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/category/disable/${data.id}`, {
      active: data.active,
    })

    dispatch({
      type: DISABLE_CATEGORY,
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

// Clear Category Details
export const clearCategoryDetail = () => {
  return {
    type: CLEAR_CATEGORY_DETAIL,
  }
}

// Clear Error
export const clearError = () => {
  return {
    type: CLEAR_CATEGORY_ERRORS,
  }
}

// Clear Message
export const clearMessage = () => {
  return {
    type: CLEAR_CATEGORY_MESSAGE,
  }
}

// Set loading to true
export const setLoading = () => {
  return {
    type: SET_LOADING,
  }
}
