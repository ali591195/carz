import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

import {
  GET_HUNTINGS,
  GET_ASIN,
  SET_ASIN,
  ADD_HUNTINGS,
  HUNTING_ERROR,
  SET_LOADING,
  CLEAR_HUNTING_ERRORS,
  CLEAR_HUNTING_MESSAGE,
  // CLEAR_UNIQUE_ASIN,
} from './types'

export const getHuntingList = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/huntings`)
    console.log('res:::', res)
    dispatch({
      type: GET_HUNTINGS,
      payload: res,
    })
  } catch (err) {
    console.log('error')
    dispatch({
      type: HUNTING_ERROR,
      payload: err.response.data.error,
    })
  }
}

// export const getUniqueASIN = (asin) => async (dispatch) => {
//   dispatch(setLoading())
//   setAuthToken(localStorage.token)

//   try {
//     const res = await axios.post(`${process.env.REACT_APP_API}/huntings/uniqueASIN`, { asin })

//     dispatch({
//       type: GET_ASIN,
//       payload: res,
//     })
//   } catch (err) {
//     console.log('error')
//     dispatch({
//       type: HUNTING_ERROR,
//       payload: 'ASIN Already EXISTED',
//     })
//   }
// }

export const setUniqueASIN = (asin) => async (dispatch) => {
  // dispatch(setLoading())
  // setAuthToken(localStorage.token)
  dispatch({
    type: SET_ASIN,
    payload: asin,
  })
}

// post
export const addHuntingData = (hunter) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/huntings`, hunter)
    dispatch({
      type: ADD_HUNTINGS,
      payload: res.data,
    })
  } catch (err) {
    console.log('error')
    dispatch({
      type: HUNTING_ERROR,
      payload: err.response.data.error,
    })
  }
}

// For cancel the Asin
// export const clearASIN = () => {
//   return {
//     type: CLEAR_UNIQUE_ASIN,
//   }
// }
// Clear Error
export const clearError = () => {
  return {
    type: CLEAR_HUNTING_ERRORS,
  }
}

// Clear Message
export const clearMessage = () => {
  return {
    type: CLEAR_HUNTING_MESSAGE,
  }
}

// Set loading to true
export const setLoading = () => {
  return {
    type: SET_LOADING,
  }
}

// //Filter Schools
// export const filterSchools = (text) => {
//   return {
//     type: FILTER_CITY_SCHOOLS,
//     payload: text,
//   }
// }

// // Clear Filter
// export const clearFilter = () => {
//   return { type: CLEAR_CITY_SCHOOLS_FILTER }
// }
// }
