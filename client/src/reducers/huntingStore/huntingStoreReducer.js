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
  CLEAR_HUNTING_STORES,
  CLEAR_HUNTING_STORE_DETAIL,
  CLEAR_HUNTING_STORE_ERRORS,
  CLEAR_HUNTING_STORE_MESSAGE,
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  message: null,
  huntingStores: null,
  huntingStore: null,
  filtered: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    //   return {
    //     ...state,
    //     huntingStores: action.payload,
    //     error: null,
    //     loading: false,
    //   }
    case GET_HUNTING_STORES:
    case GET_ACTIVE_HUNTING_STORES:
      return {
        ...state,
        huntingStores: action.payload,
        error: null,
        loading: false,
      }
    case GET_HUNTING_STORE_BY_ID:
      return {
        ...state,
        huntingStore: action.payload,
        error: null,
        loading: false,
      }
    case ADD_HUNTING_STORE:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }
    case DELETE_ASSIGNED_STORE:
    case ASSIGNED_STORE:
    case UPDATE_HUNTING_STORE:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }

    case DISABLE_HUNTING_STORE:
      return {
        ...state,
        message: action.payload,
        huntingStore: { ...state.huntingStore, active: !state.huntingStore.active },
        loading: false,
      }

    case HUNTING_STORE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CLEAR_HUNTING_STORES:
      return {
        ...state,
        huntingStores: null,
      }
    case CLEAR_HUNTING_STORE_DETAIL:
      return {
        ...state,
        huntingStore: null,
      }
    case CLEAR_HUNTING_STORE_ERRORS:
      return {
        ...state,
        error: null,
      }
    case CLEAR_HUNTING_STORE_MESSAGE:
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
// case HUNTING_STORE_ERROR:
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
