import {
  GET_CATEGORYS,
  GET_SUB_CATEGORYS,
  GET_ACTIVE_CATEGORYS,
  GET_CATEGORY_BY_ID,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DISABLE_CATEGORY,
  CATEGORYS_ERROR,
  CLEAR_CATEGORY_DETAIL,
  CLEAR_CATEGORY_ERRORS,
  CLEAR_CATEGORY_MESSAGE,
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  message: null,
  categorys: null,
  subCategorys: null,
  activeCategorys: null,
  category: null,
  filtered: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORYS:
      return {
        ...state,
        categorys: action.payload,
        error: null,
        loading: false,
      }
    case GET_SUB_CATEGORYS:
      return {
        ...state,
        subCategorys: action.payload,
        error: null,
        loading: false,
      }
    case GET_ACTIVE_CATEGORYS:
      return {
        ...state,
        activeCategorys: action.payload,
        error: null,
        loading: false,
      }
    case GET_CATEGORY_BY_ID:
      return {
        ...state,
        category: action.payload,
        error: null,
        loading: false,
      }
    case ADD_CATEGORY:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }
    case UPDATE_CATEGORY:
      return {
        ...state,
        message: action.payload.message,
        loading: false,
      }
    case DISABLE_CATEGORY:
      return {
        ...state,
        message: action.payload,
        category: { ...state.category, active: !state.category.active },
        loading: false,
      }

    case CLEAR_CATEGORY_DETAIL:
      return {
        ...state,
        category: null,
      }
    case CATEGORYS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CLEAR_CATEGORY_ERRORS:
      return {
        ...state,
        error: null,
      }
    case CLEAR_CATEGORY_MESSAGE:
      return {
        ...state,
        message: null,
      }
    default:
      return state
  }
}
