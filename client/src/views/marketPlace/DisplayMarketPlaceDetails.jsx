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
  clearMarketPlaceDetail,
  getMarketPlaceById,
  //   addUserData,
  disableMarketPlace,
} from '../../actions/marketPlaceAction'
import moment from 'moment'
import { titleCase } from 'title-case'
import UpdateMarketPlaceModal from './UpdateMarketPlaceModal'

const DisplayMarketPlaceDetails = ({
  Marketplace: { message, error, marketplace },
  Auth: { permissions },
  getMarketPlaceById,
  disableMarketPlace,
  clearMarketPlaceDetail,
  clearError,
  clearMessage,
}) => {
  const [marketPlaceId, setMarketPlaceId] = useState(''),
    [id, setId] = useState(''),
    [country, setCountry] = useState(''),
    [countryCode, setCountryCode] = useState(''),
    [currency, setCurrency] = useState(''),
    [symbol, setSymbol] = useState(''),
    [addedBy, setAddedBy] = useState(''),
    [updatedBy, setUpdatedBy] = useState(''),
    [createdAt, setCreatedAt] = useState(''),
    [updatedAt, setUpdatedAt] = useState(''),
    [isActive, setIsActive] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  let location = useLocation()

  useEffect(() => {
    marketplace
      ? (setId(marketplace.id),
        setMarketPlaceId(marketplace.marketplace_id),
        setCountry(marketplace.country),
        setCountryCode(marketplace.country_code),
        setCurrency(marketplace.currency),
        setSymbol(marketplace.symbol),
        setIsActive(marketplace.active),
        setAddedBy(
          marketplace.user_added_marketplace &&
            `${marketplace.user_added_marketplace.first_name} ${marketplace.user_added_marketplace.last_name}`,
        ),
        setUpdatedBy(
          marketplace.user_updated_marketplace &&
            `${marketplace.user_updated_marketplace.first_name} ${marketplace.user_updated_marketplace.last_name}`,
        ),
        setCreatedAt(marketplace.createdAt),
        setUpdatedAt(marketplace.updatedAt))
      : location && !error && getMarketPlaceById(location.pathname.split(':')[1])

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
  }, [message, error, location, marketplace])

  useEffect(() => {
    return () => {
      clearError()
      clearMarketPlaceDetail()
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
        <UpdateMarketPlaceModal
          modal={updateModal}
          toggle={updateToggle}
          getMarketPlaceById={getMarketPlaceById}
          MarketPlaceDetails={{ id, marketPlaceId, country, countryCode, currency, symbol }}
        />
      )}
      {/*{assignedStoreModal && (
        <AssignedStore
          modal={assignedStoreModal}
          toggle={assignedStoreToggle}
          getStoreById={getMarketPlaceById}
          MarketPlaceDetails={{ id }}
        />
      )} */}
      <Container fluid={true}>
        <Row>
          {!error ? (
            marketplace && (
              <Col sm={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm={12}>
                        <Row>
                          <Col lg={12} md={12} sm={12} xs={12} style={{ marginBottom: '15px' }}>
                            <Row>
                              <Col lg={6} md={6} sm={12} xs={12}>
                                <h3 style={{ float: 'left' }}>MarketPlace Details</h3>
                              </Col>
                              <Col lg={6} md={6} sm={12} xs={12}>
                                <Button
                                  className="btn btn-md"
                                  color="dark"
                                  style={{ float: 'right', margin: '2px' }}
                                  onClick={() => redirect('/marketplace')}
                                >
                                  Cancel
                                </Button>
                                {permissions.create_and_edit_marketplace && (
                                  <>
                                    <Button
                                      //   type="submit"
                                      className="btn btn-md"
                                      style={{ float: 'right', margin: '2px' }}
                                      color="primary"
                                      //   onClick={() => assignedStoreToggle()}
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
                                          } this MarketPlace.`,
                                        ) &&
                                        disableMarketPlace(
                                          marketplace && {
                                            id: marketplace.id,
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
                                    <span style={{ fontWeight: 'bold' }}>MarketPlace ID</span>
                                  </Col>
                                  <Col sm={3}>{marketPlaceId}</Col>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Country</span>
                                  </Col>
                                  <Col sm={3}>{country}</Col>
                                </Row>
                              </ListGroupItem>
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Country-Code</span>
                                  </Col>
                                  <Col sm={3}>{countryCode}</Col>

                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Currency</span>
                                  </Col>
                                  <Col sm={3}>{currency}</Col>
                                </Row>
                              </ListGroupItem>
                              <ListGroupItem>
                                <Row>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Symbol</span>
                                  </Col>
                                  <Col sm={3}>{symbol}</Col>
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
                                      `(${moment(createdAt).format('YYYY/MM/DD, hh:mmA')})`}
                                  </Col>
                                  <Col sm={3}>
                                    <span style={{ fontWeight: 'bold' }}>Updated By</span>
                                  </Col>
                                  <Col sm={3}>
                                    {updatedBy && titleCase(updatedBy)}{' '}
                                    {updatedBy &&
                                      `(${moment(updatedAt).format('YYYY/MM/DD, hh:mmA')})`}
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
                              onClick={() => redirect('/marketplace')}
                            >
                              Cancel
                            </Button>
                            {permissions.create_and_edit_marketplace && (
                              <>
                                <Button
                                  //   type="submit"
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  //   onClick={() => assignedStoreToggle()}
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
                                    disableMarketPlace(
                                      marketplace && {
                                        id: marketplace.id,
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
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {/* <ShippingChargesList
                  users={storeAssignedToUser}
                  storeShippingCharges={shippingCharges}
                  id={marketplace.id}
                  permissions={permissions}
                />
                <AssignedUser
                  users={storeAssignedToUser}
                  permissions={permissions}
                  id={location.pathname.split(':')[1]}
                /> */}
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

DisplayMarketPlaceDetails.propTypes = {
  Marketplace: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  clearMarketPlaceDetail: PropTypes.func.isRequired,
  getMarketPlaceById: PropTypes.func.isRequired,
  disableMarketPlace: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  Marketplace: state.Marketplace,
})

export default connect(mapStateToProps, {
  clearError,
  clearMessage,
  clearMarketPlaceDetail,
  getMarketPlaceById,
  disableMarketPlace,
})(DisplayMarketPlaceDetails)
