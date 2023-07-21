import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const OrdersListing = React.lazy(() => import('./views/order/OrdersListing'))
const HuntingForm = React.lazy(() => import('./views/hunting/HuntingForm'))
const HuntingList = React.lazy(() => import('./views/hunting/HuntingList'))
const UserList = React.lazy(() => import('./views/users/UserList'))
const UserForm = React.lazy(() => import('./views/users/UserForm'))
const UserUpdateForm = React.lazy(() => import('./views/users/UserUpdateForm'))
const DisplayUserDetails = React.lazy(() => import('./views/users/DisplayUserDetails'))
const HuntingStore = React.lazy(() => import('./views/huntingStore/HuntingStore'))
const DisplayHuntingStoreDetail = React.lazy(() =>
  import('./views/huntingStore/DisplayHuntingStoreDetail'),
)
const MarketPlace = React.lazy(() => import('./views/marketPlace/MarketPlace'))
const DisplayMarketPlaceDetails = React.lazy(() =>
  import('./views/marketPlace/DisplayMarketPlaceDetails'),
)

const Category = React.lazy(() => import('./views/category/Category'))
const DisplayCategoryDetails = React.lazy(() => import('./views/category/DisplayCategoryDetails'))

// const OrdersListing = React.lazy(() => import('./views/order/OrdersListing'))

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const routes = [
  { path: '/', exact: true, name: 'Home', permission: 'dashboard' },
  // Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, permission: 'dashboard' },
  // Order
  { path: '/orderlist', name: 'Order', element: OrdersListing, permission: 'order' },
  // Hunting
  { path: '/huntingForm', name: 'HuntingForm', element: HuntingForm, permission: 'hunting' },
  { path: '/huntings', name: 'Huntings', element: HuntingList, permission: 'hunting_list' },
  // User
  { path: '/users', name: 'User', element: UserList, permission: 'view_user' },
  {
    path: '/users/adduser',
    name: 'AddUser',
    element: UserForm,
    permission: 'create_and_edit_user',
  },
  // Vendor
  { path: '/vendor', name: 'Vendor', element: HuntingStore, permission: 'view_store' },
  {
    path: '/vendor/vendordetails/:id',
    name: 'VendorDetails',
    element: DisplayHuntingStoreDetail,
    permission: 'view_store',
  },
  // MarketPlace
  {
    path: '/marketplace',
    name: 'MarketPlace',
    element: MarketPlace,
    permission: 'view_marketplace',
  },
  {
    path: '/marketplace/marketplacedetails/:id',
    name: 'MarketPlaceDetails',
    element: DisplayMarketPlaceDetails,
    permission: 'view_marketplace',
  },
  // Category
  {
    path: '/category',
    name: 'Category',
    element: Category,
    permission: 'view_category',
  },
  {
    path: '/category/categorydetails/:id',
    name: 'CategoryDetails',
    element: DisplayCategoryDetails,
    permission: 'view_category',
  },
  // User
  {
    path: '/users/updateuser/:id',
    name: 'UpdateUser',
    element: UserUpdateForm,
    permission: 'create_and_edit_user',
  },
  {
    path: '/users/userdetails/:id',
    name: 'UserDetails',
    element: DisplayUserDetails,
    permission: 'view_user',
  },
  // { path: '/order/details', name: 'Order', element: DisplayOrder },

  { path: '/theme', name: 'Theme', element: Colors, exact: true, permission: 'dashboard' },
  { path: '/theme/colors', name: 'Colors', element: Colors, permission: 'dashboard' },
  { path: '/theme/typography', name: 'Typography', element: Typography, permission: 'dashboard' },
  { path: '/base', name: 'Base', element: Cards, exact: true, permission: 'dashboard' },
  { path: '/base/accordion', name: 'Accordion', element: Accordion, permission: 'dashboard' },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs, permission: 'dashboard' },
  { path: '/base/cards', name: 'Cards', element: Cards, permission: 'dashboard' },
  { path: '/base/carousels', name: 'Carousel', element: Carousels, permission: 'dashboard' },
  { path: '/base/collapses', name: 'Collapse', element: Collapses, permission: 'dashboard' },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups, permission: 'dashboard' },
  { path: '/base/navs', name: 'Navs', element: Navs, permission: 'dashboard' },
  { path: '/base/paginations', name: 'Paginations', element: Paginations, permission: 'dashboard' },
  {
    path: '/base/placeholders',
    name: 'Placeholders',
    element: Placeholders,
    permission: 'dashboard',
  },
  { path: '/base/popovers', name: 'Popovers', element: Popovers, permission: 'dashboard' },
  { path: '/base/progress', name: 'Progress', element: Progress, permission: 'dashboard' },
  { path: '/base/spinners', name: 'Spinners', element: Spinners, permission: 'dashboard' },
  { path: '/base/tables', name: 'Tables', element: Tables, permission: 'dashboard' },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips, permission: 'dashboard' },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true, permission: 'dashboard' },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons, permission: 'dashboard' },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns, permission: 'dashboard' },
  {
    path: '/buttons/button-groups',
    name: 'Button Groups',
    element: ButtonGroups,
    permission: 'dashboard',
  },
  { path: '/charts', name: 'Charts', element: Charts, permission: 'dashboard' },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true, permission: 'dashboard' },
  {
    path: '/forms/form-control',
    name: 'Form Control',
    element: FormControl,
    permission: 'dashboard',
  },
  { path: '/forms/select', name: 'Select', element: Select, permission: 'dashboard' },
  {
    path: '/forms/checks-radios',
    name: 'Checks & Radios',
    element: ChecksRadios,
    permission: 'dashboard',
  },
  { path: '/forms/range', name: 'Range', element: Range, permission: 'dashboard' },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup, permission: 'dashboard' },
  {
    path: '/forms/floating-labels',
    name: 'Floating Labels',
    element: FloatingLabels,
    permission: 'dashboard',
  },
  { path: '/forms/layout', name: 'Layout', element: Layout, permission: 'dashboard' },
  { path: '/forms/validation', name: 'Validation', element: Validation, permission: 'dashboard' },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons, permission: 'dashboard' },
  {
    path: '/icons/coreui-icons',
    name: 'CoreUI Icons',
    element: CoreUIIcons,
    permission: 'dashboard',
  },
  { path: '/icons/flags', name: 'Flags', element: Flags, permission: 'dashboard' },
  { path: '/icons/brands', name: 'Brands', element: Brands, permission: 'dashboard' },
  {
    path: '/notifications',
    name: 'Notifications',
    element: Alerts,
    exact: true,
    permission: 'dashboard',
  },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts, permission: 'dashboard' },
  { path: '/notifications/badges', name: 'Badges', element: Badges, permission: 'dashboard' },
  { path: '/notifications/modals', name: 'Modals', element: Modals, permission: 'dashboard' },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts, permission: 'dashboard' },
  { path: '/widgets', name: 'Widgets', element: Widgets, permission: 'dashboard' },
  { path: '/404', name: 'Page 404', element: Page404, permission: 'dashboard' },
  { path: '*', name: 'Page 404', element: Page404, permission: 'dashboard' },
]

export default routes
