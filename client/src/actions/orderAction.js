import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

import {
  GET_ORDERS,
  ORDER_ERROR,
  CLEAR_ORDER_ERRORS,
  CLEAR_ORDER_MESSAGE,
  //   FILTER_CITY_SCHOOLS,
  //   CLEAR_CITY_SCHOOLS_FILTER,
  //   SET_CITY_SCHOOLS_LOADING,
} from './types'

// get schools from specific city
export const getOrders = (data) => async (dispatch) => {
  //   dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/orders`)
    console.log('res:::', res)
    dispatch({
      type: GET_ORDERS,
      payload: res,
    })
  } catch (err) {
    console.log('error')
    dispatch({
      type: ORDER_ERROR,
      payload: err.response.data.error,
    })
  }
}
// Clear Error
export const clearError = () => {
  return {
    type: CLEAR_ORDER_ERRORS,
  }
}

// Clear Message
export const clearMessage = () => {
  return {
    type: CLEAR_ORDER_MESSAGE,
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

// // Set loading to true
// export const setLoading = () => {
//   return {
//     type: SET_CITY_SCHOOLS_LOADING,
//   }
// }

// }
