import React, { Fragment, useState, useEffect } from 'react'
import {
  Container,
  Card,
  CardBody,
  Label,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  InputGroup,
} from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  clearError,
  clearUser,
  clearMessage,
  updateUser,
  getUserById,
} from '../../actions/userAction'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import Switch from '../../components/Switch'
import { HelpCircle } from 'react-feather'
import { CTooltip } from '@coreui/react'

const UserUpdateForm = ({
  User: { message, error, user },
  clearError,
  clearUser,
  clearMessage,
  getUserById,
  updateUser,
}) => {
  const [firstName, setFirstName] = useState(''),
    [userId, setUserId] = useState(''),
    [lastName, setLastName] = useState(''),
    [email, setEmail] = useState(''),
    [phoneNumber, setPhoneNumber] = useState(''),
    [CNIC, setCNIC] = useState(''),
    [address, setAddress] = useState(null),
    [joinedAt, setJoinedAt] = useState(moment(new Date())),
    [dashboard, setDashboard] = useState(false),
    [order, setOrder] = useState(false),
    [inventory, setInventory] = useState(false),
    [huntingList, setHuntingList] = useState(false),
    [orderProcessing, setOrderProcessing] = useState(false),
    [hunting, setHunting] = useState(false),
    [createAndEditUser, setCreateAndEditUser] = useState(false),
    [viewUser, setViewUser] = useState(false),
    [createAndEditCategory, setCreateAndEditCategory] = useState(false),
    [viewCategory, setViewCategory] = useState(false),
    [commenting, setCommenting] = useState(false),
    [approvalProcess, setApprovalProcess] = useState(false),
    [createAndEditMarketPlace, setCreateAndEditMarketPlace] = useState(false),
    [viewMarketPlace, setViewMarketPlace] = useState(false),
    [createAndEditStore, setCreateAndEditStore] = useState(false),
    [viewStore, setViewStore] = useState(false),
    [changeStore, setChangeStore] = useState(false),
    [togglePassword, setTogglePassword] = useState(false),
    [errors, setErrors] = useState('')
  let location = useLocation()

  useEffect(() => {
    user
      ? (setFirstName((prevState) => (prevState ? prevState : user.first_name)),
        setLastName((prevState) => (prevState ? prevState : user.last_name)),
        setEmail((prevState) => (prevState ? prevState : user.email)),
        setPhoneNumber((prevState) => (prevState ? prevState : user.phone_number || '')),
        setCNIC((prevState) => (prevState ? prevState : user.CNIC || '')),
        setAddress((prevState) => (prevState ? prevState : user.address)),
        setJoinedAt((prevState) => (prevState ? prevState : user.joined_at)),
        setDashboard((prevState) => (prevState ? prevState : user.permission_settings.dashboard)),
        setOrder((prevState) => (prevState ? prevState : user.permission_settings.order)),
        setInventory((prevState) => (prevState ? prevState : user.permission_settings.inventory)),
        setHuntingList((prevState) =>
          prevState ? prevState : user.permission_settings.hunting_list,
        ),
        setOrderProcessing((prevState) =>
          prevState ? prevState : user.permission_settings.order_processing,
        ),
        setHunting((prevState) => (prevState ? prevState : user.permission_settings.hunting)),
        setViewMarketPlace((prevState) =>
          prevState ? prevState : user.permission_settings.view_marketplace,
        ),
        setViewStore((prevState) => (prevState ? prevState : user.permission_settings.view_store)),
        setViewUser((prevState) => (prevState ? prevState : user.permission_settings.view_user)),
        setViewCategory((prevState) =>
          prevState ? prevState : user.permission_settings.view_category,
        ),
        setCreateAndEditMarketPlace((prevState) =>
          prevState ? prevState : user.permission_settings.create_and_edit_marketplace,
        ),
        setCreateAndEditStore((prevState) =>
          prevState ? prevState : user.permission_settings.create_and_edit_store,
        ),
        setCreateAndEditUser((prevState) =>
          prevState ? prevState : user.permission_settings.create_and_edit_user,
        ),
        setCreateAndEditCategory((prevState) =>
          prevState ? prevState : user.permission_settings.create_and_edit_category,
        ),
        setCommenting((prevState) => (prevState ? prevState : user.permission_settings.commenting)),
        setApprovalProcess((prevState) =>
          prevState ? prevState : user.permission_settings.approval_process,
        ),
        setChangeStore((prevState) =>
          prevState ? prevState : user.permission_settings.change_store,
        ))
      : location &&
        !error &&
        getUserById(location.pathname.split(':')[1]) &&
        setUserId(location.pathname.split(':')[1])

    if (error !== null) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    }

    if (message !== null) {
      setTimeout(() => {
        toast.success(message)
      }, 200)

      //clear fileds
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhoneNumber('')
      setCNIC('')
      setAddress('')
      setJoinedAt(moment(new Date()))
      setDashboard(false)
      setOrder(false)
      setOrderProcessing(false)
      setInventory(false)
      setHuntingList(false)
      setHunting(false)
      setViewUser(false)
      setCreateAndEditUser(false)
      setViewCategory(false)
      setCreateAndEditCategory(false)
      setViewMarketPlace(false)
      setCreateAndEditMarketPlace(false)
      setCommenting(false)
      setApprovalProcess(false)
      setViewStore(false)
      setCreateAndEditStore(false)
      setChangeStore(false)
      clearMessage()
      // Redirect to user Details
      redirectBack(`/users/userdetails/:${userId}`)
    }
    // eslint-disable-next-line
  }, [message, error, location, user])

  useEffect(() => {
    return () => {
      clearError()
      clearUser()
    }
    //eslint-disable-next-line
  }, [])
  const validate = () => {
    let errors = {}
    let isValid = true

    if (firstName === '') {
      isValid = false
      errors['firstName'] = 'Please enter your first name.'
    }

    if (lastName === '') {
      isValid = false
      errors['lastName'] = 'Please enter your last name.'
    }

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

    if (phoneNumber !== '') {
      let pattern = new RegExp(/^(\d{11})$/)
      if (!pattern.test(phoneNumber)) {
        isValid = false
        errors['phoneNumber'] = 'Please enter a valid phone number.'
      }
    }

    if (CNIC !== '') {
      let pattern = new RegExp(/^(\d{13})$/)
      if (!pattern.test(CNIC)) {
        isValid = false
        errors['CNIC'] = 'Please enter a valid CNIC.'
      }
    }

    setErrors(errors)

    return isValid
  }

  const navigate = useNavigate()

  const redirectBack = (redirect) => {
    navigate(redirect)
  }

  const onUpdate = (e) => {
    e.preventDefault()

    if (validate()) {
      const userData = {
        user: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber ? phoneNumber : null,
          CNIC: CNIC ? CNIC : null,
          address: address,
          joined_at: moment(joinedAt).format('YYYY-MM-DD'),
        },
        permissions: {
          dashboard: dashboard,
          inventory: inventory,
          hunting: hunting,
          change_store: changeStore,
          hunting_list: huntingList,
          commenting: commenting,
          approval_process: approvalProcess,
          order: order,
          order_processing: orderProcessing,
          view_marketplace: viewMarketPlace,
          create_and_edit_marketplace: createAndEditMarketPlace,
          view_store: viewStore,
          create_and_edit_store: createAndEditStore,
          view_user: viewUser,
          create_and_edit_user: createAndEditUser,
          view_category: viewCategory,
          create_and_edit_category: createAndEditCategory,
        },
      }

      updateUser(userData, userId)
    } else {
      setTimeout(() => {
        toast.error('Error occurs while Update User.')
      }, 200)
    }
  }

  return (
    <Fragment>
      <ToastContainer />
      <Container fluid={true}>
        <Row>
          <Col sm={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col sm={12}>
                    <Form onSubmit={onUpdate}>
                      <Row>
                        <Col lg={12} md={12} sm={12} xs={12} style={{ marginBottom: '15px' }}>
                          <Row>
                            <Col lg={6} md={6} sm={12} xs={12}>
                              <h3 style={{ float: 'left' }}>User Update Form</h3>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12}>
                              <Button
                                className="btn btn-md"
                                color="dark"
                                style={{ float: 'right', margin: '2px' }}
                                onClick={() => redirectBack(`/users/userdetails/:${userId}`)}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="btn btn-md"
                                style={{ float: 'right', margin: '2px' }}
                                color="primary"
                              >
                                Update
                              </Button>
                            </Col>
                          </Row>
                          <hr />
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                          <FormGroup>
                            <Label htmlFor="email">
                              Email <span style={{ color: 'red' }}>*</span>{' '}
                            </Label>
                            <Input
                              className="form-control"
                              type="text"
                              name="email"
                              value={email ? email : ''}
                              placeholder="Enter first name"
                              disabled
                              valid={email && !errors.email ? true : false}
                              invalid={errors.email ? true : false}
                              onChange={(e) => setEmail(e.target.value)}
                            ></Input>
                            <div className="text-danger">{errors.email}</div>
                          </FormGroup>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                          <FormGroup>
                            <Label htmlFor="firstName">
                              First Name <span style={{ color: 'red' }}>*</span>{' '}
                            </Label>
                            <Input
                              className="form-control"
                              type="text"
                              name="firstName"
                              value={firstName ? firstName : ''}
                              placeholder="Enter first name"
                              valid={firstName && !errors.firstName ? true : false}
                              invalid={errors.firstName ? true : false}
                              onChange={(e) => setFirstName(e.target.value)}
                            ></Input>
                            <div className="text-danger">{errors.firstName}</div>
                          </FormGroup>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                          <FormGroup>
                            <Label htmlFor="lastName">
                              Last Name <span style={{ color: 'red' }}>*</span>{' '}
                            </Label>
                            <Input
                              className="form-control"
                              type="text"
                              name="lastName"
                              value={lastName ? lastName : ''}
                              placeholder="Enter last name"
                              valid={lastName && !errors.lastName ? true : false}
                              invalid={errors.lastName ? true : false}
                              onChange={(e) => setLastName(e.target.value)}
                            ></Input>
                            <div className="text-danger">{errors.lastName}</div>
                          </FormGroup>
                        </Col>

                        <Col sm={12} md={6} lg={4}>
                          <FormGroup>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                              className="form-control"
                              type="text"
                              name="phoneNumber"
                              value={phoneNumber ? phoneNumber : ''}
                              placeholder="Enter phone number"
                              valid={phoneNumber && !errors.phoneNumber ? true : false}
                              invalid={errors.phoneNumber ? true : false}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            ></Input>
                            <div className="text-danger">{errors.phoneNumber}</div>
                          </FormGroup>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                          <FormGroup>
                            <Label htmlFor="CNIC">CNIC</Label>
                            <Input
                              className="form-control"
                              type="text"
                              name="CNIC"
                              value={CNIC ? CNIC : ''}
                              placeholder="Enter CNIC"
                              valid={CNIC && !errors.CNIC ? true : false}
                              invalid={errors.CNIC ? true : false}
                              onChange={(e) => setCNIC(e.target.value)}
                            ></Input>
                            <div className="text-danger">{errors.CNIC}</div>
                          </FormGroup>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                          <FormGroup>
                            <Label htmlFor="address">Address</Label>
                            <Input
                              className="form-control"
                              type="text"
                              name="address"
                              value={address ? address : ''}
                              placeholder="Enter address"
                              valid={address && !errors.address ? true : false}
                              invalid={errors.address ? true : false}
                              onChange={(e) => setAddress(e.target.value)}
                            ></Input>
                            <div className="text-danger">{errors.address}</div>
                          </FormGroup>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                          <FormGroup>
                            <Label htmlFor="joinedAt">Joined At</Label>
                            <DatePicker
                              className="form-control"
                              selected={new Date(joinedAt)}
                              onChange={(date) => setJoinedAt(date)}
                            />
                            <div className="text-danger">{errors.joinedAt}</div>
                          </FormGroup>
                        </Col>
                        <Col xs={12}>
                          <hr />
                        </Col>
                        <Col xs={12}>
                          <h3>Permission Setting</h3>
                        </Col>

                        <Col xs={6}>
                          <hr />
                          <h4>Dashboard</h4>
                          <hr />
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>View Dashboard</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'dashboard'}
                                  isOn={dashboard}
                                  onColor="#06D6A0"
                                  handleToggle={() => setDashboard((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <hr />
                          <h4>Inventory</h4>
                          <hr />
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>View Inventory</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'inventory'}
                                  isOn={inventory}
                                  onColor="#06D6A0"
                                  handleToggle={() => setInventory((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>

                        <Col xs={6}>
                          <hr />
                          <h4>Hunting</h4>
                          <hr />
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>Allow Hunting</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'hunting'}
                                  //   style={{ float: 'right', marginRight: '25px' }}
                                  isOn={hunting}
                                  onColor="#06D6A0"
                                  handleToggle={() => setHunting((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>
                                  Change Vendors during Hunting{' '}
                                  <CTooltip content="Hunters can change their default vendor during hunting. To enable this option you have to allow hunting first.">
                                    <HelpCircle size={15} color="orange" />
                                  </CTooltip>
                                </Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'changeStore'}
                                  isDisable={
                                    hunting == false
                                      ? (function () {
                                          changeStore && setChangeStore((prevState) => !prevState)
                                          return true
                                        })()
                                      : false
                                  }
                                  isOn={changeStore}
                                  onColor="#06D6A0"
                                  handleToggle={() => setChangeStore((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>View Hunting List</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'huntingList'}
                                  isOn={huntingList}
                                  onColor="#06D6A0"
                                  handleToggle={() => setHuntingList((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>
                                  Allow Commenting{' '}
                                  <CTooltip content="People can comment on hunting. To enable this option you have to allow user to view hunting list.">
                                    <HelpCircle size={15} color="orange" />
                                  </CTooltip>
                                </Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'commenting'}
                                  isDisable={
                                    huntingList == false
                                      ? (function () {
                                          commenting && setCommenting((prevState) => !prevState)
                                          return true
                                        })()
                                      : false
                                  }
                                  isOn={commenting}
                                  onColor="#06D6A0"
                                  handleToggle={() => setCommenting((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>
                                  Approval Process{' '}
                                  <CTooltip content="Only people with this option can approve a hunting and live it on amazon. To enable this option you have to allow user to view hunting list.">
                                    <HelpCircle size={15} color="orange" />
                                  </CTooltip>
                                </Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'approvalProcess'}
                                  isDisable={
                                    huntingList == false
                                      ? (function () {
                                          approvalProcess &&
                                            setApprovalProcess((prevState) => !prevState)
                                          return true
                                        })()
                                      : false
                                  }
                                  isOn={approvalProcess}
                                  onColor="#06D6A0"
                                  handleToggle={() => setApprovalProcess((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>

                        <Col xs={6}>
                          <hr />
                          <h4>Orders</h4>
                          <hr />
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>View Orders</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'order'}
                                  isOn={order}
                                  onColor="#06D6A0"
                                  handleToggle={() => setOrder((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>Allow Order Processing</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'orderProcessing'}
                                  isOn={orderProcessing}
                                  onColor="#06D6A0"
                                  handleToggle={() => setOrderProcessing((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>

                        <Col xs={6}>
                          <hr />
                          <h4>Market Place</h4>
                          <hr />

                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>View Market Places</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'viewMarketPlace'}
                                  isDisable={createAndEditMarketPlace}
                                  //   style={{ float: 'right', marginRight: '25px' }}
                                  isOn={viewMarketPlace}
                                  onColor="#06D6A0"
                                  handleToggle={() => setViewMarketPlace((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>
                                  Create and Edit Market Place
                                </Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'createAndEditMarketPlace'}
                                  isOn={createAndEditMarketPlace}
                                  onColor="#06D6A0"
                                  handleToggle={() =>
                                    setCreateAndEditMarketPlace((prevState) => {
                                      !prevState && setViewMarketPlace(!prevState)
                                      return !prevState
                                    })
                                  }
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>

                        <Col xs={6}>
                          <hr />
                          <h4>Vendor</h4>
                          <hr />
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>View Vendors</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'viewStore'}
                                  //   style={{ float: 'right', marginRight: '25px' }}
                                  isOn={viewStore}
                                  isDisable={createAndEditStore}
                                  onColor="#06D6A0"
                                  handleToggle={() => setViewStore((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>Create and Edit Vendor</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'createAndEditStore'}
                                  //   style={{ float: 'right', marginRight: '25px' }}
                                  isOn={createAndEditStore}
                                  onColor="#06D6A0"
                                  handleToggle={() =>
                                    setCreateAndEditStore((prevState) => {
                                      !prevState && setViewStore(!prevState)
                                      return !prevState
                                    })
                                  }
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <hr />
                          <h4>User</h4>
                          <hr />

                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>View Users</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'viewUser'}
                                  //   style={{ float: 'right', marginRight: '25px' }}
                                  isOn={viewUser}
                                  isDisable={createAndEditUser}
                                  onColor="#06D6A0"
                                  handleToggle={() => setViewUser((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>Create and Edit User</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'createAndEditUser'}
                                  isOn={createAndEditUser}
                                  onColor="#06D6A0"
                                  handleToggle={() => {
                                    setCreateAndEditUser((prevState) => {
                                      !prevState && setViewUser(!prevState)
                                      return !prevState
                                    })
                                  }}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <hr />
                          <h4>Category</h4>
                          <hr />

                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>View Categorys</Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'viewCategory'}
                                  //   style={{ float: 'right', marginRight: '25px' }}
                                  isOn={viewCategory}
                                  isDisable={createAndEditCategory}
                                  onColor="#06D6A0"
                                  handleToggle={() => setViewCategory((prevState) => !prevState)}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Row>
                              <Col xs={8}>
                                <Label style={{ fontWeight: 'bold' }}>
                                  Create and Edit Category
                                </Label>
                              </Col>
                              <Col xs={4}>
                                <Switch
                                  label={'createAndEditCategory'}
                                  isOn={createAndEditCategory}
                                  onColor="#06D6A0"
                                  handleToggle={() => {
                                    setCreateAndEditCategory((prevState) => {
                                      !prevState && setViewCategory(!prevState)
                                      return !prevState
                                    })
                                  }}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col sm={12}>
                          <hr />
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12}>
                          <Button
                            className="btn btn-md"
                            style={{ float: 'right', margin: '2px' }}
                            color="dark"
                            onClick={() => redirectBack(`/users/userdetails/:${userId}`)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="btn btn-md "
                            style={{ float: 'right', margin: '2px' }}
                            color="primary"
                          >
                            Update
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

UserUpdateForm.propTypes = {
  User: PropTypes.object.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  clearUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  User: state.User,
})

export default connect(mapStateToProps, {
  clearError,
  clearMessage,
  clearUser,
  getUserById,
  updateUser,
})(UserUpdateForm)
