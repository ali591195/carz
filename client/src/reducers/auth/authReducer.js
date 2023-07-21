import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  CLEAR_LOGIN_ERRORS,
  LOGOUT,
  SET_LOGIN_LOADING,
  CLEAR_LOGIN_MESSAGE,
  FORGET_REQUEST,
  REQUEST_ERROR,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_ERROR,
  CHANGE_IMAGE,
  CHANGE_IMAGE_ERROR,
  UPDATE_ADMIN,
  UPDATE_ADMIN_ERROR,
  CHANGE_DARK_MODE,
  SIDEBAR,
} from '../../actions/types'

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated:
    localStorage.getItem('token') && localStorage.getItem('token') !== undefined ? true : false,
  loginLoading: false,
  userId: null,
  user: null,
  permissions: null,
  // {
  //   add_user: false,
  //   approval_process: false,
  //   change_store: false,
  //   commenting: false,
  //   create_and_edit_store: false,
  //   dashboard: false,
  //   hunting: false,
  //   hunting_list: false,
  //   inventory: false,
  //   order: false,
  //   order_processing: false,
  // },
  // userType: localStorage.getItem('userType'),
  error: null,
  message: null,
  sidebarShow: true,
  //   dark_mode:
  //     localStorage.getItem('layout_version') &&
  //     localStorage.getItem('layout_version') !== undefined &&
  //     localStorage.getItem('layout_version') === 'dark-only'
  //       ? 'dark-only'
  //       : 'light',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SIDEBAR:
      return {
        ...state,
        sidebarShow: !state.sidebarShow,
      }
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.data.token)

      return {
        ...state,
        ...action.payload.data,
        isAuthenticated: true,
        loginLoading: false,
        sidebarShow: true,
        message: action.payload.message,
        error: null,
      }

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loginLoading: false,
        userId: action.payload.data.id,
        user: action.payload.data,
        permissions: action.payload.data.permission_settings,
        assignedStore: action.payload.data.assigned_store_to_user,
      }

    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        isAdmin: null,
        isAuthenticated: false,
        loginLoading: false,
        user: null,
        permissions: null,
        userId: null,
        error: action.payload,
        // dark_mode: 'light',
      }
    case RESET_PASSWORD:
    case FORGET_REQUEST:
      return {
        ...state,
        message: action.payload.message,
      }
    case CHANGE_PASSWORD:
    case CHANGE_IMAGE:
    case UPDATE_ADMIN:
      return {
        ...state,
        message: action.payload.message,
        loginLoading: false,
      }
    case CHANGE_PASSWORD_ERROR:
    case CHANGE_IMAGE_ERROR:
    case UPDATE_ADMIN_ERROR:
      return {
        ...state,
        error: action.payload,
        loginLoading: false,
      }
    case REQUEST_ERROR:
      return {
        ...state,
        error: action.payload,
      }

    case CLEAR_LOGIN_ERRORS:
      return {
        ...state,
        error: null,
      }
    case CLEAR_LOGIN_MESSAGE:
      return {
        ...state,
        message: null,
      }
    case SET_LOGIN_LOADING:
      return {
        ...state,
        loginLoading: true,
      }
    // case CHANGE_DARK_MODE:
    //   localStorage.setItem('layout_version', action.payload)
    //   return {
    //     ...state,
    //     dark_mode: action.payload,
    //     lodaing: false,
    //   }

    default:
      return state
  }
}
