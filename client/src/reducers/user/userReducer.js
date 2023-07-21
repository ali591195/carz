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
  CLEAR_USER_DETAIL,
  CLEAR_USER_ERRORS,
  CLEAR_USER_MESSAGE,
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  message: null,
  users: null,
  usersWithoutStore: null,
  user: null,
  filtered: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload.data.user,
        error: null,
        loading: false,
      }
    case GET_USERS_WITHOUT_STORE:
      return {
        ...state,
        usersWithoutStore: action.payload.data.filteredUsers,
        error: null,
        loading: false,
      }
    case GET_USER_BY_ID:
      return {
        ...state,
        user: action.payload.data.user,
        error: null,
        loading: false,
      }
    case ADD_USER:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }
    case ASSIGNED_STORE_TO_USER:
    case UPDATE_ASSIGNED_STORE:
    case UPDATE_USER:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }

    case FREEZE_USER:
      return {
        ...state,
        message: action.payload,
        user: { ...state.user, active: !state.user.active },
        loading: false,
      }
    case USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CLEAR_USER_DETAIL:
      return {
        ...state,
        user: null,
      }
    case CLEAR_USER_ERRORS:
      return {
        ...state,
        error: null,
      }
    case CLEAR_USER_MESSAGE:
      return {
        ...state,
        message: null,
      }
    default:
      return state
  }
}

// } else
//   return {
//     ...state,
//     hunters: action.payload,
//     loading: false,
//   }
// case NOTIFIC_ORDERS_LOADED:
//   return {
//     ...state,
//     notificOrders: action.payload.data,
//     status: action.payload.status,
//     loading: false,
//   }

// case ORDER_DETAILS:
//   return {
//     ...state,
//     details: action.payload.order_detail,
//     totalAmount: action.payload.total_amount[0].total_amount,
//     loading: false,
//   }
// case APPROVE_ORDER:
//   return {
//     ...state,
//     loading: false,
//     message: action.payload.message,
//   }
// case APPROVE_ERROR:
// case USER_ERROR:
//   return {
//     ...state,
//     loading: false,
//     error: action.payload,
//   }
// case UPDATE_ORDER:
//   return {
//     ...state,
//     changeOrder: action.payload,
//   }
// case FILTER_ORDERS:
//   return {
//     ...state,
//     statusLabel: action.payload,
//     filtered: state.hunters.filter((order) => {
//       const regex = new RegExp(`${action.payload}`, 'gi')
//       return order.status.match(regex)
//     }),
//   }
// case CLEAR_FILTER:
//   return {
//     ...state,
//     filtered: null,
//     statusLabel: null,
//   }

// case SET_LOADING:
//   return {
//     ...state,
//     loading: true,
//   }
