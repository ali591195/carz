import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const AppBreadcrumb = ({ Auth: { permissions } }) => {
  const navigate = useNavigate()

  const Redirect = (redirect) => {
    navigate(redirect)
  }

  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute && permissions && permissions[currentRoute.permission]
      ? currentRoute.name
      : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem
        style={{ textDecoration: 'underline', cursor: 'pointer', color: '#5856d6' }}
        onClick={() => Redirect('/dashboard')}
      >
        Home
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active
              ? { active: true }
              : {
                  style: { textDecoration: 'underline', cursor: 'pointer', color: '#5856d6' },
                  onClick: () => Redirect(breadcrumb.pathname),
                })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

AppBreadcrumb.propTypes = {
  Auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})

export default connect(mapStateToProps, {})(React.memo(AppBreadcrumb))
