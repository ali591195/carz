import { combineReducers } from 'redux'
import authReducer from './auth/authReducer'
import huntingReducer from './hunting/huntingReducer'
import huntingStoreReducer from './huntingStore/huntingStoreReducer'
import shippingChargesReducer from './shippingCharges/shippingChargesReducer'
import marketplaceReducer from './marketplace/marketPlaceReducer'
import categoryReducer from './category/categoryReducer'
import orderReducer from './order/orderReducer'
import userReducer from './user/userReducer'
export default combineReducers({
  Auth: authReducer,
  Hunting: huntingReducer,
  HuntingStore: huntingStoreReducer,
  ShippingCharges: shippingChargesReducer,
  Marketplace: marketplaceReducer,
  Category: categoryReducer,
  Order: orderReducer,
  User: userReducer,
})
