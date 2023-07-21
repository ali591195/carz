import {
  GET_MARKETPLACES,
  GET_MARKETPLACE_BY_ID,
  ADD_MARKETPLACE,
  UPDATE_MARKETPLACE,
  DISABLE_MARKETPLACE,
  MARKETPLACES_ERROR,
  CLEAR_MARKETPLACE_DETAIL,
  CLEAR_MARKETPLACES_ERRORS,
  CLEAR_MARKETPLACES_MESSAGE,
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  message: null,
  marketplaces: null,
  marketplace: null,
  filtered: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MARKETPLACES:
      return {
        ...state,
        marketplaces: action.payload,
        error: null,
        loading: false,
      }
    case GET_MARKETPLACE_BY_ID:
      return {
        ...state,
        marketplace: action.payload,
        error: null,
        loading: false,
      }
    case ADD_MARKETPLACE:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }
    case UPDATE_MARKETPLACE:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }
    case DISABLE_MARKETPLACE:
      return {
        ...state,
        message: action.payload,
        marketplace: { ...state.marketplace, active: !state.marketplace.active },
        loading: false,
      }

    case CLEAR_MARKETPLACE_DETAIL:
      return {
        ...state,
        marketplace: null,
      }
    case MARKETPLACES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CLEAR_MARKETPLACES_ERRORS:
      return {
        ...state,
        error: null,
      }
    case CLEAR_MARKETPLACES_MESSAGE:
      return {
        ...state,
        message: null,
      }
    default:
      return state
  }
}
