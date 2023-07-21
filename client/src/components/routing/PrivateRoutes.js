import React, { useEffect } from 'react'
import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadUser } from '../../actions/authAction'

const PrivateRoutes = ({
  Auth: { isAuthenticated, loading },
  loadUser,
  component: Component,
  ...rest
}) => {
  useEffect(() => {
    loadUser()
    // eslint-disable-next-line
  }, [isAuthenticated])

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />

  // <Route {...rest} element={!isAuthenticated && <Navigate to="/login" replace={true} />} />
  //     ) : (
  //       <Route rest={rest} element={<Component />} props={props} />
  //     )
  //   }
}

PrivateRoutes.propTypes = {
  Auth: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})
export default connect(mapStateToProps, { loadUser })(PrivateRoutes)
