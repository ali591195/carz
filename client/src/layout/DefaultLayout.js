import React, {useEffect} from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Navigate, useNavigate } from 'react-router-dom'

const DefaultLayout = ({ Auth: { isAuthenticated} }) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
    
  }, [ isAuthenticated])
  return (
    <>
     {!isAuthenticated ? <Navigate to="/login"/> : 
     
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
     }
    </>
  )
}


DefaultLayout.propTypes = {
  Auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})

export default connect(mapStateToProps, {})(DefaultLayout)
