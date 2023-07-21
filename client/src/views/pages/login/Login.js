import React, { useState, useEffect } from 'react'

// UserEmail

import { login, clearError, clearMessage } from '../../../actions/authAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, Navigate, useNavigate } from 'react-router-dom'
// import logo from '../assets/images/login.png';
// import ReCaptchaV2 from 'react-google-recaptcha';
// import logo from '../../assets/images/logo/login.png'
// PUBLIC_URL = /cuba

import { EyeOff } from 'react-feather'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = ({ Auth: { isAuthenticated, error, message }, login, clearError, clearMessage }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
    if (error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
      clearError()
    }

    if (message !== null) {
      setTimeout(() => {
        toast.success(message)
      }, 200)
      clearMessage()
    }
    // setUser({
    //   email: '',
    //   password: '',
    // })
    // if (localStorage.getItem('layout_version') === 'dark-only') {
    //   document.body.className = 'dark-only'
    // } else {
    //   document.body.className = 'light'
    // }

    // eslint-disable-next-line
  }, [error, isAuthenticated, message])

  const [togglePassword, setTogglePassword] = useState(false)

  const [user, setUser] = useState({
    email: '',
    password: '',
  })
  const { email, password } = user
  const [errors, setErrors] = useState('')

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value })

  const validate = () => {
    let errors = {}
    let isValid = true

    if (email === '') {
      isValid = false
      errors['email'] = 'Please enter your email Address.'
    }

    if (email !== '') {
      let pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
      )
      if (!pattern.test(email)) {
        isValid = false
        errors['email'] = 'Please enter a valid email address(e.g. jane@gmail.com).'
      }
    }

    if (password === '') {
      isValid = false
      errors['password'] = 'Please enter password.'
    }
    if (password !== '') {
      if (password.length < 5 || password.length > 50) {
        isValid = false
        errors['password'] = 'The password must be between 8-16 charters in length.'
      }
    }
    setErrors(errors)

    return isValid
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      login({
        email,
        password,
      })
    }
  }
  return (
    <>
    {isAuthenticated ? <Navigate to="/dashboard"/> : 
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Enter user email"
                        autoComplete="username"
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                      />
                    </CInputGroup>
                    <div className="text-danger mb-3">{errors.email}</div>
                    <CInputGroup>
                      <CInputGroupText
                        onClick={() => setTogglePassword(!togglePassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        // type="password"
                        // placeholder="Password"
                        autoComplete="current-password"
                        type={togglePassword ? 'text' : 'password'}
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Enter password"
                      />
                    </CInputGroup>
                    <div className="text-danger mb-4">{errors.password}</div>

                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={onSubmit}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    
    }
    </>
  )
}

Login.propTypes = {
  Auth: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})

export default connect(mapStateToProps, {
  login,
  clearError,
  clearMessage,
})(Login)
