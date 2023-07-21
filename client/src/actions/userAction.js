import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

import {
  GET_USERS,
  GET_USERS_WITHOUT_STORE,
  GET_USER_BY_ID,
  ADD_USER,
  UPDATE_USER,
  ASSIGNED_STORE_TO_USER,
  UPDATE_ASSIGNED_STORE,
  FREEZE_USER,
  USER_ERROR,
  SET_LOADING,
  CLEAR_USER_ERRORS,
  CLEAR_USER_MESSAGE,
  CLEAR_USER_DETAIL,
  // CLEAR_UNIQUE_ASIN,
} from './types'

export const getUsersList = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/users/all`)
    dispatch({
      type: GET_USERS,
      payload: res,
    })
  } catch (err) {
    console.log('error')
    dispatch({
      type: USER_ERROR,
      payload: err.response.data.error,
    })
  }
}
export const getActiveUsersWithoutStore = () => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/users/active/without_store`)
    console.log('res?>>>', res)
    dispatch({
      type: GET_USERS_WITHOUT_STORE,
      payload: res,
    })
  } catch (err) {
    console.log('error')
    dispatch({
      type: USER_ERROR,
      payload: err.response.data.error,
    })
  }
}
export const getUserById = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    // ?id=${data}
    // , { params: { id: data }
    const res = await axios.get(`${process.env.REACT_APP_API}/users/${data}`)

    dispatch({
      type: GET_USER_BY_ID,
      payload: res,
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err && err.response.data.message,
    })
  }
}

export const freezeUser = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/users/freeze/${data.id}`, {
      active: data.active,
    })

    dispatch({
      type: FREEZE_USER,
      payload: res.data.message,
    })
  } catch (err) {
    console.log(err)
    dispatch({
      type: USER_ERROR,
      payload: err && err.response.data.message,
    })
  }
}
// export const getUniqueASIN = (asin) => async (dispatch) => {
//   dispatch(setLoading())
//   setAuthToken(localStorage.token)

//   try {
//     const res = await axios.post(`${process.env.REACT_APP_API}/hunters/uniqueASIN`, { asin })

//     dispatch({
//       type: GET_ASIN,
//       payload: res,
//     })
//   } catch (err) {
//     console.log('error')
//     dispatch({
//       type: USER_ERROR,
//       payload: 'ASIN Already EXISTED',
//     })
//   }
// }

// post
export const addUserData = (user) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/users`, user)
    dispatch({
      type: ADD_USER,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Update user by ID
export const updateUser = (user, id) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/users/${id}`, user)

    dispatch({
      type: UPDATE_USER,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response.data.message,
    })
  }
}
// Assigned default Store to user
export const assignedStoreToUser = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)
  console.log('assignedStoreToUser')
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/assign_store`, data)

    dispatch({
      type: ASSIGNED_STORE_TO_USER,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response.data.message,
    })
  }
}

// Update default Store that assigned to user
export const updateUserAssignedStore = (data) => async (dispatch) => {
  dispatch(setLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API}/assign_store/${data.assigned_user}`,
      {
        assigned_store: data.assigned_store,
      },
    )

    dispatch({
      type: UPDATE_ASSIGNED_STORE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response.data.message,
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
export const clearUser = () => {
  return {
    type: CLEAR_USER_DETAIL,
  }
}
// Clear Error
export const clearError = () => {
  return {
    type: CLEAR_USER_ERRORS,
  }
}

// Clear Message
export const clearMessage = () => {
  return {
    type: CLEAR_USER_MESSAGE,
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
