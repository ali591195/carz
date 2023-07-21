import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_LOGIN_ERRORS,
  SET_LOGIN_LOADING,
  CLEAR_LOGIN_MESSAGE,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR,
  // FORGET_REQUEST,
  // REQUEST_ERROR,
  // RESET_PASSWORD,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_ERROR,
  // CHANGE_IMAGE,
  // CHANGE_IMAGE_ERROR,
  // UPDATE_ADMIN,
  // UPDATE_ADMIN_ERROR,
  CHANGE_DARK_MODE,
  SIDEBAR,
} from './types'

import jwt from 'jwt-decode'

// sidebarShow
export const sidebarShow = () => async (dispatch) => {
  dispatch({
    type: SIDEBAR,
  })
}

// Load User
export const loadUser = () => async (dispatch) => {
  const token = localStorage.token

  if (token === undefined) {
    dispatch({
      type: AUTH_ERROR,
      payload: 'No token, authorization denied',
    })
  } else {
    dispatch(setLoginLoading())
    setAuthToken(localStorage.token)
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/users`)
      dispatch({
        type: USER_LOADED,
        payload: res,
      })
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
        payload: 'Token is invalid',
      })
    }
  }
}
// Load Admin
export const loadAdmin = () => async (dispatch) => {
  const token = localStorage.token

  if (token === undefined) {
    dispatch({
      type: AUTH_ERROR,
      payload: 'No token, authorization denied',
    })
  } else {
    dispatch(setLoginLoading())

    setAuthToken(localStorage.token)
    try {
      const user = jwt(token)
      const data = {
        id: user.id,
      }
      try {
        const res = await axios.post('http://159.89.172.36/super_admin/user_profile', data)
        dispatch({
          type: USER_LOADED,
          payload: {
            id: user.id,
            user_type: user.user_type,
            data: res.data.data[0],
          },
        })
      } catch (err) {
        dispatch({
          type: AUTH_ERROR,
          payload: err.response.data.error,
        })
      }
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
        payload: 'Token is invalid',
      })
    }
  }
}

// Login Admin
export const login = (formData) => async (dispatch) => {
  dispatch(setLoginLoading())
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/users/login`, formData)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        // admin: true,
        data: res.data,
      },
    })
    // dispatch(loadAdmin());
  } catch (err) {
    const message =
      (err.response && err.response.data && err.response.data.message) ||
      err.message ||
      err.toString()
    dispatch({
      type: LOGIN_FAIL,
      payload: message,
    })
  }
}

// Register User
export const signUp = (formData) => async (dispatch) => {
  dispatch(setLoginLoading())

  try {
    const res = await axios.post(`http://localhost:8000/api/users/`, formData)

    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        // admin: true,
        data: res.data,
      },
    })

    // dispatch(loadAdmin());
  } catch (err) {
    const message =
      (err.response && err.response.data && err.response.data.message) ||
      err.message ||
      err.toString()
    dispatch({
      type: REGISTER_FAIL,
      payload: message,
    })
  }
}

//Is Authenticated
// export const loadUser = () => async (dispatch) => {
//   // dispatch(setLoginLoading());
//   setAuthToken(localStorage.token);

//   try {

//     const res = await axios.get('http://174.138.48.157/Findmyparts/admin_data');
//     dispatch({
//       type: USER_LOADED,
//       payload: res.data.data[0],
//     });
//   } catch (err) {
//     dispatch({
//       type: AUTH_ERROR,
//       payload: err.response.data.error,
//     });
//   }
// };
//forget password
// export const forgetPassword = (data) => async (dispatch) => {
//   try {
//     const res = await axios.post(
//       `http://174.138.48.157/Findmyparts/forgot`,
//       data,
//       {
//         headers: {
//           'content-type': 'multipart/form-data',
//         },
//       }
//     );

//     dispatch({
//       type: FORGET_REQUEST,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: REQUEST_ERROR,
//       payload: err.response.data.error,
//     });
//   }
// };

//Reset password
// export const resetPassword = (data) => async (dispatch) => {
//   try {
//     const res = await axios.post(
//       `http://174.138.48.157/Findmyparts/reset`,
//       data,
//       {
//         headers: {
//           'content-type': 'mult ipart/form-data',
//         },
//       }
//     );

//     dispatch({
//       type: RESET_PASSWORD,
//       payload: res.data.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: REQUEST_ERROR,
//       payload: err.response.data.error,
//     });
//   }
// };

//Change password
export const onChangePassword = (data) => async (dispatch) => {
  dispatch(setLoginLoading())
  setAuthToken(localStorage.token)

  try {
    const res = await axios.post('http://159.89.172.36/super_admin/change_password', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
    dispatch(logout())
    dispatch({
      type: CHANGE_PASSWORD,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: CHANGE_PASSWORD_ERROR,
      payload: err.response.data.error,
    })
  }
}

//Image Update
// export const imageUpdate = (data) => async (dispatch) => {
//   dispatch(setLoginLoading());
//   // setAuthToken(localStorage.token);

//   try {
//     const res = await axios.post(
//       'http://174.138.48.157/Findmyparts/admin_image_update',
//       data,
//       {
//         headers: {
//           'content-type': 'multipart/form-data',
//         },
//       }
//     );
//     dispatch({
//       type: CHANGE_IMAGE,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: CHANGE_IMAGE_ERROR,
//       payload: err.response.data.error,
//     });
//   }
// };

//Admin Update
// export const adminUpdate = (data) => async (dispatch) => {
//   dispatch(setLoginLoading());
//   // setAuthToken(localStorage.token);

//   try {
//     const res = await axios.post(
//       'http://174.138.48.157/Findmyparts/admin_user_update',
//       data,
//       {
//         headers: {
//           'content-type': 'multipart/form-data',
//         },
//       }
//     );
//     dispatch({
//       type: UPDATE_ADMIN,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: UPDATE_ADMIN_ERROR,
//       payload: err.response.data.error,
//     });
//   }
// };

// Logout
export const logout = () => {
  return {
    type: LOGOUT,
  }
}

// Set loading to true
export const setLoginLoading = () => {
  return {
    type: SET_LOGIN_LOADING,
  }
}

// Clear Error
export const clearError = () => {
  return {
    type: CLEAR_LOGIN_ERRORS,
  }
}
// Clear Message
export const clearMessage = () => {
  return {
    type: CLEAR_LOGIN_MESSAGE,
  }
}

//Change dark mode
export const changeDarkMode = (data) => {
  return {
    type: CHANGE_DARK_MODE,
    payload: data,
  }
}
