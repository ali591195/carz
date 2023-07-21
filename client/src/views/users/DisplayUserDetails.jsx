import React, { Fragment, useState, useEffect } from 'react'
import {
  Container,
  Card,
  CardBody,
  Label,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  clearError,
  clearMessage,
  clearUser,
  getUserById,
  addUserData,
  freezeUser,
} from '../../actions/userAction'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Switch from '../../components/Switch'
import { titleCase } from 'title-case'
import AssignedStore from './AssignedStore'

const DisplayUserDetails = ({
  User: { message, error, user },
  Auth: { permissions },
  getUserById,
  freezeUser,
  clearUser,
  clearError,
  clearMessage,
}) => {
  const [firstName, setFirstName] = useState(''),
    [id, setId] = useState(''),
    [lastName, setLastName] = useState(''),
    [createdBy, setCreatedBy] = useState(''),
    [updatedBy, setUpdatedBy] = useState(''),
    [createdAt, setCreatedAt] = useState(''),
    [updatedAt, setUpdatedAt] = useState(''),
    [email, setEmail] = useState(''),
    [phoneNumber, setPhoneNumber] = useState(''),
    [CNIC, setCNIC] = useState(''),
    [address, setAddress] = useState(''),
    [emailVerified, setEmailVerified] = useState(''),
    [isActive, setIsActive] = useState(''),
    [joinedAt, setJoinedAt] = useState(''),
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
    [createAndEditMarketPlace, setCreateAndEditMarketPlace] = useState(false),
    [viewMarketPlace, setViewMarketPlace] = useState(false),
    [createAndEditStore, setCreateAndEditStore] = useState(false),
    [viewStore, setViewStore] = useState(false),
    [commenting, setCommenting] = useState(false),
    [approvalProcess, setApprovalProcess] = useState(false),
    [storeAssignedToUser, setStoreAssignedToUser] = useState(''),
    [changeStore, setChangeStore] = useState(false)

  let location = useLocation()

  useEffect(() => {
    user
      ? (setFirstName(user.first_name),
        setId(user.id),
        setLastName(user.last_name),
        setStoreAssignedToUser(user.assigned_store_to_user),
        setCreatedBy(
          user.added_by_user && `${user.added_by_user.first_name} ${user.added_by_user.last_name}`,
        ),
        setUpdatedBy(
          user.updated_by_user &&
            `${user.updated_by_user.first_name} ${user.updated_by_user.last_name}`,
        ),
        setCreatedAt(user.createdAt),
        setUpdatedAt(user.updatedAt),
        setEmail(user.email),
        setPhoneNumber(user.phone_number),
        setCNIC(user.CNIC),
        setAddress(user.address),
        setEmailVerified(user.email_verified),
        setIsActive(user.active),
        setJoinedAt(user.joined_at),
        setDashboard(user.permission_settings.dashboard),
        setOrder(user.permission_settings.order),
        setInventory(user.permission_settings.inventory),
        setHuntingList(user.permission_settings.hunting_list),
        setOrderProcessing(user.permission_settings.order_processing),
        setHunting(user.permission_settings.hunting),
        setViewMarketPlace(user.permission_settings.view_marketplace),
        setViewStore(user.permission_settings.view_store),
        setViewUser(user.permission_settings.view_user),
        setViewCategory(user.permission_settings.view_category),
        setCreateAndEditMarketPlace(user.permission_settings.create_and_edit_marketplace),
        setCreateAndEditStore(user.permission_settings.create_and_edit_store),
        setCreateAndEditUser(user.permission_settings.create_and_edit_user),
        setCreateAndEditCategory(user.permission_settings.create_and_edit_category),
        setCommenting(user.permission_settings.commenting),
        setApprovalProcess(user.permission_settings.approval_process),
        setChangeStore(user.permission_settings.change_store))
      : location && !error && getUserById(location.pathname.split(':')[1])

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
      clearMessage()
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

  const navigate = useNavigate()

  const redirect = (redirect) => {
    navigate(redirect)
  }

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Container fluid={true}>
        <Row>
          {!error ? (
            user && (
              <Col sm={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm={12}>
                        <Row>
                          <Col lg={12} md={12} sm={12} xs={12} style={{ marginBottom: '15px' }}>
                            <Row>
                              <Col lg={6} md={6} sm={12} xs={12}>
                                <h3 style={{ float: 'left' }}>User Details</h3>
                              </Col>
                              <Col lg={6} md={6} sm={12} xs={12}>
                                <Button
                                  className="btn btn-md"
                                  color="dark"
                                  style={{ float: 'right', margin: '2px' }}
                                  onClick={() => redirect('/users')}
                                >
                                  Cancel
                                </Button>
                                {/* <Button
                           
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() => updateUser()}
                                >
                                  Reset Password
                                </Button> */}
                                {permissions.create_and_edit_user && (
                                  <>
                                    <Button
                                      className="btn btn-md"
                                      style={{ float: 'right', margin: '2px' }}
                                      color="primary"
                                      onClick={() =>
                                        confirm(
                                          `Are you sure you want to ${
                                            isActive ? 'freeze' : 'unFreeze'
                                          } this user.`,
                                        ) && freezeUser(user && { id: id, active: !isActive })
                                      }
                                    >
                                      {isActive ? 'Freeze' : 'UnFreeze'}
                                    </Button>
                                    <Button
                                      //   type="submit"
                                      className="btn btn-md"
                                      style={{ float: 'right', margin: '2px' }}
                                      color="primary"
                                      onClick={() => redirect(`/users/updateuser/:${id}`)}
                                    >
                                      Update
                                    </Button>
                                  </>
                                )}
                              </Col>
                            </Row>
                            <hr />
                          </Col>
                          <Col>
                            <ListGroup className="list-group-flush">
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>First Name</span>
                                  </Col>
                                  <Col sm={3}>{titleCase(firstName)}</Col>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Last Name</span>
                                  </Col>
                                  <Col sm={3}>{titleCase(lastName)}</Col>
                                </Row>
                              </ListGroupItem>
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Email</span>
                                  </Col>
                                  <Col sm={3}>{email}</Col>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Phone Number</span>
                                  </Col>
                                  <Col sm={3}>{phoneNumber}</Col>
                                </Row>
                              </ListGroupItem>
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>CNIC</span>
                                  </Col>
                                  <Col sm={3}>{CNIC}</Col>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Address</span>
                                  </Col>
                                  <Col sm={3}>{address}</Col>
                                </Row>
                              </ListGroupItem>
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Joined At</span>
                                  </Col>
                                  <Col sm={3}>{moment(joinedAt).format('YYYY/MM/DD, hh:mmA ')}</Col>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Email Verified</span>
                                  </Col>
                                  <Col sm={3}>
                                    <Input
                                      type="checkbox"
                                      name="emailVerified"
                                      checked={emailVerified}
                                      readOnly={true}
                                      disabled
                                    />
                                    {/* {emailVerified ? (
                                      <CheckCircle size={20} color="#535659" />
                                    ) : (
                                      <Circle size={20} color="#535659" />
                                    )} */}
                                  </Col>
                                </Row>
                              </ListGroupItem>
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Created By</span>
                                  </Col>
                                  <Col sm={3}>
                                    {createdBy && titleCase(createdBy)}{' '}
                                    {createdBy &&
                                      `(${moment(createdAt).format('YYYY/MM/DD, hh:mmA ')})`}
                                  </Col>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Updated By</span>
                                  </Col>
                                  <Col sm={3}>
                                    {updatedBy && titleCase(updatedBy)}{' '}
                                    {updatedBy &&
                                      `(${moment(updatedAt).format('YYYY/MM/DD, hh:mmA ')})`}
                                  </Col>
                                </Row>
                              </ListGroupItem>
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Active</span>
                                  </Col>
                                  <Col sm={3}>
                                    <Input
                                      type="checkbox"
                                      name="isActive"
                                      checked={isActive}
                                      readOnly={true}
                                      disabled
                                    />
                                  </Col>
                                </Row>
                              </ListGroupItem>
                            </ListGroup>
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
                                    isDisable={true}
                                    label={'dashboard'}
                                    isOn={dashboard}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={inventory}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={hunting}
                                    onColor="#06D6A0"
                                  />
                                </Col>
                              </Row>
                            </FormGroup>
                            <FormGroup>
                              <Row>
                                <Col xs={8}>
                                  <Label style={{ fontWeight: 'bold' }}>
                                    Change Vendors during Hunting
                                  </Label>
                                </Col>
                                <Col xs={4}>
                                  <Switch
                                    label={'changeStore'}
                                    isDisable={true}
                                    isOn={changeStore}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={huntingList}
                                    onColor="#06D6A0"
                                  />
                                </Col>
                              </Row>
                            </FormGroup>
                            <FormGroup>
                              <Row>
                                <Col xs={8}>
                                  <Label style={{ fontWeight: 'bold' }}>Allow Commenting</Label>
                                </Col>
                                <Col xs={4}>
                                  <Switch
                                    label={'commenting'}
                                    isDisable={true}
                                    isOn={commenting}
                                    onColor="#06D6A0"
                                  />
                                </Col>
                              </Row>
                            </FormGroup>
                            <FormGroup>
                              <Row>
                                <Col xs={8}>
                                  <Label style={{ fontWeight: 'bold' }}>Approval Process</Label>
                                </Col>
                                <Col xs={4}>
                                  <Switch
                                    label={'approvalProcess'}
                                    isDisable={true}
                                    isOn={approvalProcess}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={order}
                                    onColor="#06D6A0"
                                  />
                                </Col>
                              </Row>
                            </FormGroup>
                            <FormGroup>
                              <Row>
                                <Col xs={8}>
                                  <Label style={{ fontWeight: 'bold' }}>
                                    Allow Order Processing
                                  </Label>
                                </Col>
                                <Col xs={4}>
                                  <Switch
                                    label={'orderProcessing'}
                                    isDisable={true}
                                    isOn={orderProcessing}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={viewMarketPlace}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={createAndEditMarketPlace}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={viewStore}
                                    onColor="#06D6A0"
                                  />
                                </Col>
                              </Row>
                            </FormGroup>
                            <FormGroup>
                              <Row>
                                <Col xs={8}>
                                  <Label style={{ fontWeight: 'bold' }}>
                                    Create and Edit Vendor
                                  </Label>
                                </Col>
                                <Col xs={4}>
                                  <Switch
                                    label={'createAndEditStore'}
                                    isDisable={true}
                                    isOn={createAndEditStore}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={viewUser}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={createAndEditUser}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={viewCategory}
                                    onColor="#06D6A0"
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
                                    isDisable={true}
                                    isOn={createAndEditCategory}
                                    onColor="#06D6A0"
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
                              color="dark"
                              style={{ float: 'right', margin: '2px' }}
                              onClick={() => redirect('/users')}
                            >
                              Cancel
                            </Button>
                            {/* <Button
                           
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() => updateUser()}
                                >
                                  Reset Password
                                </Button> */}
                            {permissions.create_and_edit_user && (
                              <>
                                <Button
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() =>
                                    confirm(
                                      `Are you sure you want to ${
                                        isActive ? 'freeze' : 'unFreeze'
                                      } this user.`,
                                    ) && freezeUser(user && { id: id, active: !isActive })
                                  }
                                >
                                  {isActive ? 'Freeze' : 'UnFreeze'}
                                </Button>
                                <Button
                                  //   type="submit"
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() => redirect(`/users/updateuser/:${id}`)}
                                >
                                  Update
                                </Button>
                              </>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {hunting ? (
                  <AssignedStore
                    getUserById={getUserById}
                    userId={location.pathname.split(':')[1]}
                    stores={storeAssignedToUser}
                    permissions={permissions}
                    hunting={hunting}
                    id={id}
                  />
                ) : (
                  ''
                )}
              </Col>
            )
          ) : (
            <Col sm={12}>
              <Card>
                <CardBody>
                  <Col>{typeof error === 'object' ? error[0].msg : "User don't exist"}</Col>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </Fragment>
  )
}

DisplayUserDetails.propTypes = {
  User: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  clearUser: PropTypes.func.isRequired,
  addUserData: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
  freezeUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  User: state.User,
  Auth: state.Auth,
})

export default connect(mapStateToProps, {
  clearError,
  clearMessage,
  clearUser,
  getUserById,
  addUserData,
  freezeUser,
})(DisplayUserDetails)
