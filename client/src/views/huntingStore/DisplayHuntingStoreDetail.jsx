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
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  clearError,
  clearMessage,
  clearHuntingStoreDetail,
  getHuntingStoreById,
  //   addUserData,
  disableHuntingStore,
} from '../../actions/huntingStoreAction'
import moment from 'moment'
import { titleCase } from 'title-case'
import UpdateHuntingStoreModal from './UpdateHuntingStoreModal'
import AssignedStore from './AssignedStoreModal'
import AssignedUser from './AssignedUser'
import ShippingChargesList from './ShippingChargesList'

const DisplayHuntingStoreDetail = ({
  HuntingStore: { message, error, huntingStore, filtered },
  Auth: { permissions },
  getHuntingStoreById,
  disableHuntingStore,
  clearHuntingStoreDetail,
  clearError,
  clearMessage,
}) => {
  const [name, setName] = useState(''),
    [id, setId] = useState(''),
    [discount, setDiscount] = useState(''),
    [storeLink, setStoreLink] = useState(''),
    [addedBy, setAddedBy] = useState(''),
    [updatedBy, setUpdatedBy] = useState(''),
    [createdAt, setCreatedAt] = useState(''),
    [updatedAt, setUpdatedAt] = useState(''),
    [storeAssignedToUser, setStoreAssignedToUser] = useState(''),
    [shippingCharges, setShippingCharges] = useState([]),
    [isActive, setIsActive] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  let location = useLocation()

  useEffect(() => {
    huntingStore
      ? (setId(huntingStore.id),
        setName(huntingStore.name),
        setDiscount(huntingStore.discount),
        setStoreLink(huntingStore.link),
        setIsActive(huntingStore.active),
        setStoreAssignedToUser(huntingStore.assigned_store),
        setAddedBy(
          huntingStore.user_added_hunting_store &&
            `${huntingStore.user_added_hunting_store.first_name} ${huntingStore.user_added_hunting_store.last_name}`,
        ),
        setUpdatedBy(
          huntingStore.user_updated_hunting_store &&
            `${huntingStore.user_updated_hunting_store.first_name} ${huntingStore.user_updated_hunting_store.last_name}`,
        ),
        setShippingCharges(huntingStore.store_shipping_charges),
        setCreatedAt(huntingStore.createdAt),
        setUpdatedAt(huntingStore.updatedAt))
      : location && !error && getHuntingStoreById(location.pathname.split(':')[1])

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
  }, [message, error, location, huntingStore])

  useEffect(() => {
    return () => {
      clearError()
      clearHuntingStoreDetail()
    }
    //eslint-disable-next-line
  }, [])

  const navigate = useNavigate()

  const redirect = (redirect) => {
    navigate(redirect)
  }

  const [updateModal, setUpdateModal] = useState(false)

  const updateToggle = () => {
    setUpdateModal(!updateModal)
  }

  const [assignedStoreModal, setAssignedStoreModal] = useState(false)

  const assignedStoreToggle = () => {
    setAssignedStoreModal(!assignedStoreModal)
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
      {updateModal && (
        <UpdateHuntingStoreModal
          modal={updateModal}
          toggle={updateToggle}
          getStoreById={getHuntingStoreById}
          StoreDetails={{ id, name, discount, storeLink }}
        />
      )}
      {assignedStoreModal && (
        <AssignedStore
          modal={assignedStoreModal}
          toggle={assignedStoreToggle}
          getStoreById={getHuntingStoreById}
          StoreDetails={{ id }}
        />
      )}
      <Container fluid={true}>
        <Row>
          {!error ? (
            huntingStore && (
              <Col sm={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm={12}>
                        <Row>
                          <Col lg={12} md={12} sm={12} xs={12} style={{ marginBottom: '15px' }}>
                            <Row>
                              <Col lg={6} md={6} sm={12} xs={12}>
                                <h3 style={{ float: 'left' }}>Vendor Details</h3>
                              </Col>
                              <Col lg={6} md={6} sm={12} xs={12}>
                                <Button
                                  className="btn btn-md"
                                  color="dark"
                                  style={{ float: 'right', margin: '2px' }}
                                  onClick={() => redirect('/vendor')}
                                >
                                  Cancel
                                </Button>
                                {permissions.create_and_edit_store && (
                                  <>
                                    <Button
                                      //   type="submit"
                                      className="btn btn-md"
                                      style={{ float: 'right', margin: '2px' }}
                                      color="primary"
                                      onClick={() => assignedStoreToggle()}
                                    >
                                      Assigned
                                    </Button>
                                    <Button
                                      //   type="submit"
                                      className="btn btn-md"
                                      style={{ float: 'right', margin: '2px' }}
                                      color="primary"
                                      onClick={() =>
                                        confirm(
                                          `Are you sure you want to ${
                                            isActive ? 'Disable' : 'Enable'
                                          } this Vendor.`,
                                        ) &&
                                        disableHuntingStore(
                                          huntingStore && {
                                            id: huntingStore.id,
                                            active: !isActive,
                                          },
                                        )
                                      }
                                    >
                                      {isActive ? 'Disable' : 'Enable'}
                                    </Button>
                                    <Button
                                      //   type="submit"
                                      className="btn btn-md"
                                      style={{ float: 'right', margin: '2px' }}
                                      color="primary"
                                      onClick={() => updateToggle()}
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
                                    <span style={{ fontWeight: 'bold' }}>Name</span>
                                  </Col>
                                  <Col sm={3}>{titleCase(name)}</Col>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Link</span>
                                  </Col>
                                  <Col sm={3}>
                                    <a
                                      href={storeLink}
                                      onMouseEnter={() => setIsHovered((prevState) => !prevState)}
                                      onMouseLeave={() => setIsHovered((prevState) => !prevState)}
                                      style={{ color: isHovered ? '#5141E0' : '#3399FF' }}
                                      target="_blank"
                                    >
                                      {storeLink}
                                    </a>
                                  </Col>
                                </Row>
                              </ListGroupItem>
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Discount</span>
                                  </Col>
                                  <Col sm={3}>{discount}%</Col>
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
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Created By</span>
                                  </Col>
                                  <Col sm={3}>
                                    {addedBy && titleCase(addedBy)}{' '}
                                    {addedBy &&
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
                            </ListGroup>
                          </Col>
                          <Col xs={12}>
                            <hr />
                          </Col>
                          <Col lg={12} md={12} sm={12} xs={12}>
                            <Button
                              className="btn btn-md"
                              color="dark"
                              style={{ float: 'right', margin: '2px' }}
                              onClick={() => redirect('/vendor')}
                            >
                              Cancel
                            </Button>
                            {permissions.create_and_edit_store && (
                              <>
                                <Button
                                  //   type="submit"
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() => assignedStoreToggle()}
                                >
                                  Assigned
                                </Button>
                                <Button
                                  //   type="submit"
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() =>
                                    confirm(
                                      `Are you sure you want to ${
                                        isActive ? 'Disable' : 'Enable'
                                      } this Vendor.`,
                                    ) &&
                                    disableHuntingStore(
                                      huntingStore && {
                                        id: huntingStore.id,
                                        active: !isActive,
                                      },
                                    )
                                  }
                                >
                                  {isActive ? 'Disable' : 'Enable'}
                                </Button>
                                <Button
                                  //   type="submit"
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() => updateToggle()}
                                >
                                  Update
                                </Button>
                              </>
                            )}
                          </Col>{' '}
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <ShippingChargesList
                  users={storeAssignedToUser}
                  storeShippingCharges={shippingCharges}
                  id={huntingStore.id}
                  permissions={permissions}
                />
                <AssignedUser
                  users={storeAssignedToUser}
                  permissions={permissions}
                  id={location.pathname.split(':')[1]}
                />
              </Col>
            )
          ) : (
            <Col sm={12}>
              <Card>
                <CardBody>
                  <Col>{error}</Col>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </Fragment>
  )
}

DisplayHuntingStoreDetail.propTypes = {
  HuntingStore: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  //   clearHuntingStoreDetail: PropTypes.func.isRequired,
  //   addUserData: PropTypes.func.isRequired,
  getHuntingStoreById: PropTypes.func.isRequired,
  disableHuntingStore: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  HuntingStore: state.HuntingStore,
})

export default connect(mapStateToProps, {
  clearError,
  clearMessage,
  clearHuntingStoreDetail,
  getHuntingStoreById,
  //   addUserData,
  disableHuntingStore,
})(DisplayHuntingStoreDetail)
