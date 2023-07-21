import {
  GET_SHIPPING_CHARGES,
  GET_SHIPPING_CHARGES_BY_ID,
  ADD_SHIPPING_CHARGES,
  UPDATE_SHIPPING_CHARGES,
  DELETE_SHIPPING_CHARGES,
  SHIPPING_CHARGES_ERROR,
  CLEAR_SHIPPING_CHARGES_ERRORS,
  CLEAR_SHIPPING_CHARGES_MESSAGE,
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  message: null,
  shippingCharges: null,
  shippingCharge: null,
  filtered: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SHIPPING_CHARGES:
      return {
        ...state,
        shippingCharges: action.payload,
        error: null,
        loading: false,
      }
    case GET_SHIPPING_CHARGES_BY_ID:
      return {
        ...state,
        shippingCharge: action.payload,
        error: null,
        loading: false,
      }
    case ADD_SHIPPING_CHARGES:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }
    case UPDATE_SHIPPING_CHARGES:
    case DELETE_SHIPPING_CHARGES:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }

    case SHIPPING_CHARGES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CLEAR_SHIPPING_CHARGES_ERRORS:
      return {
        ...state,
        error: null,
      }
    case CLEAR_SHIPPING_CHARGES_MESSAGE:
      return {
        ...state,
        message: null,
      }
    default:
      return state
  }
}
