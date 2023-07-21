import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PrivateRoutes from '../components/routing/PrivateRoutes'
import { useNavigate } from 'react-router-dom'
import routes from '../routes'
import { loadUser } from 'src/actions/authAction'

const AppContent = ({ Auth: { isAuthenticated, permissions }, loadUser }) => {
  let location = useLocation()
  const [locationArray, setLocationArray] = useState('')
  const navigate = useNavigate()

  const redirectTo404 = (redirect) => {
    navigate(redirect)
  }

  const currentRoute = routes.find((route) => {
    return locationArray[0] === route.path.split(':')[0]
  })

  useEffect(() => {
    loadUser()
    setLocationArray(location.pathname.split(':'))
    location === undefined
      ? currentRoute === undefined
        ? redirectTo404('/404')
        : permissions && permissions[currentRoute.permission] === false && redirectTo404('/404')
      : ''

    // eslint-disable-next-line
  }, [location])

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            {routes.map((route, idx) => {
              return (
                permissions &&
                permissions[route.permission] &&
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    // exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              )
            })}
          </Route>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

AppContent.propTypes = {
  Auth: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})

export default connect(mapStateToProps, { loadUser })(React.memo(AppContent))
