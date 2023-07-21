import {
  GET_HUNTINGS,
  GET_ASIN,
  SET_ASIN,
  ADD_HUNTINGS,
  HUNTING_ERROR,
  CLEAR_HUNTING_ERRORS,
  CLEAR_HUNTING_MESSAGE,
  CLEAR_UNIQUE_ASIN,
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  message: null,
  huntings: null,
  filtered: null,
  uniqueAsin: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_HUNTINGS:
      // if (state.statusLabel) {
      return {
        ...state,
        huntings: action.payload.data,
        loading: false,
      }
    case GET_ASIN:
      return {
        ...state,
        uniqueAsin: action.payload.data.uniqueAsin,
        loading: false,
      }
    case SET_ASIN:
      return {
        ...state,
        uniqueAsin: action.payload,
        // loading: false,
      }

    case ADD_HUNTINGS:
      return {
        ...state,
        uniqueAsin: false,
        message: action.payload.message,
        loading: false,
      }

    case HUNTING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case CLEAR_UNIQUE_ASIN:
      return {
        ...state,
        uniqueAsin: false,
      }
    case CLEAR_HUNTING_ERRORS:
      return {
        ...state,
        error: null,
      }

    case CLEAR_HUNTING_MESSAGE:
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
// case HUNTING_ERROR:
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
