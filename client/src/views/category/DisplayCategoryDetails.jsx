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
  clearCategoryDetail,
  getActiveMainCategorys,
  getCategoryById,
  disableCategory,
} from '../../actions/categoryAction'
import moment from 'moment'
import { titleCase } from 'title-case'
import UpdateCategoryModal from './UpdateCategoryModal'
import ChildCategoryList from './ChildCategoryList'

const DisplayCategoryDetails = ({
  Category: { message, error, category },
  Auth: { permissions },
  getActiveMainCategorys,
  getCategoryById,
  disableCategory,
  clearCategoryDetail,
  clearError,
  clearMessage,
}) => {
  const [name, setName] = useState(''),
    [id, setId] = useState(''),
    [parentCategory, setParentCategory] = useState(null),
    [parentCategoryAddedBy, setParentCategoryAddedBy] = useState(null),
    [childCategories, setChildCategories] = useState(null),
    [addedBy, setAddedBy] = useState(''),
    [updatedBy, setUpdatedBy] = useState(''),
    [createdAt, setCreatedAt] = useState(''),
    [updatedAt, setUpdatedAt] = useState(''),
    [showSelect, setShowSelect] = useState(false),
    [isActive, setIsActive] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  let location = useLocation()

  useEffect(() => {
    category
      ? (setParentCategory(category.parent_categorys && category.parent_categorys.name),
        setId(category.id),
        setParentCategoryAddedBy(
          category.parent_categorys &&
            `${category.parent_categorys.first_name} ${category.parent_categorys.last_name}`,
        ),
        setChildCategories(category.child_categories),
        setName(category.name),
        setIsActive(category.active),
        setAddedBy(
          category.user_added_categorys &&
            `${category.user_added_categorys.first_name} ${category.user_added_categorys.last_name}`,
        ),
        setUpdatedBy(
          category.user_updated_categorys &&
            `${category.user_updated_categorys.first_name} ${category.user_updated_categorys.last_name}`,
        ),
        setCreatedAt(category.createdAt),
        setUpdatedAt(category.updatedAt))
      : location && !error && getCategoryById(location.pathname.split(':')[1])

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
  }, [message, error, location, category])

  useEffect(() => {
    return () => {
      clearError()
      clearCategoryDetail()
    }
    //eslint-disable-next-line
  }, [])

  const navigate = useNavigate()

  const redirect = (redirect) => {
    navigate(redirect)
  }

  const [updateModal, setUpdateModal] = useState(false)

  const updateToggle = () => {
    setShowSelect(parentCategory ? true : false)
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
        <UpdateCategoryModal
          modal={updateModal}
          toggle={updateToggle}
          getCategoryById={getCategoryById}
          showSelect={showSelect}
          categoryDetails={{
            id: id,
            name: name,
            parentCategoryName: category.parent_categorys ? category.parent_categorys.name : null,
          }}
        />
      )}
      {/*{assignedStoreModal && (
        <AssignedStore
          modal={assignedStoreModal}
          toggle={assignedStoreToggle}
          getStoreById={getCategoryById}
          categoryDetails={{ id }}
        />
      )} */}
      <Container fluid={true}>
        <Row>
          {!error ? (
            category && (
              <Col sm={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm={12}>
                        <Row>
                          <Col lg={12} md={12} sm={12} xs={12} style={{ marginBottom: '15px' }}>
                            <Row>
                              <Col lg={6} md={6} sm={12} xs={12}>
                                <h3 style={{ float: 'left' }}>Category Details</h3>
                              </Col>
                              <Col lg={6} md={6} sm={12} xs={12}>
                                <Button
                                  className="btn btn-md"
                                  color="dark"
                                  style={{ float: 'right', margin: '2px' }}
                                  onClick={() => redirect('/category')}
                                >
                                  Cancel
                                </Button>
                                {permissions.create_and_edit_category && (
                                  <>
                                    <Button
                                      //   type="submit"
                                      className="btn btn-md"
                                      style={{ float: 'right', margin: '2px' }}
                                      color="primary"
                                      onClick={() =>
                                        confirm(
                                          `Are you sure you want to ${
                                            isActive ? 'Disable' : 'Enable'
                                          } this category.`,
                                        ) &&
                                        disableCategory(
                                          category && {
                                            id: category.id,
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
                                      onClick={() => getActiveMainCategorys() && updateToggle()}
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
                                  <Col sm={3}>{name}</Col>

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
                              {parentCategory && (
                                <ListGroupItem>
                                  <Row>
                                    <Col sm={3}>
                                      <span style={{ fontWeight: 'bold' }}>Parent Category</span>
                                    </Col>
                                    <Col sm={3}>{parentCategory}</Col>
                                  </Row>
                                </ListGroupItem>
                              )}
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
                              onClick={() => redirect('/category')}
                            >
                              Cancel
                            </Button>
                            {permissions.create_and_edit_category && (
                              <>
                                <Button
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() =>
                                    confirm(
                                      `Are you sure you want to ${
                                        isActive ? 'Disable' : 'Enable'
                                      } this Vendor.`,
                                    ) &&
                                    disableCategory(
                                      category && {
                                        id: category.id,
                                        active: !isActive,
                                      },
                                    )
                                  }
                                >
                                  {isActive ? 'Disable' : 'Enable'}
                                </Button>
                                <Button
                                  className="btn btn-md"
                                  style={{ float: 'right', margin: '2px' }}
                                  color="primary"
                                  onClick={() => getActiveMainCategorys() && updateToggle()}
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
                {!parentCategory && <ChildCategoryList childCategories={childCategories} id={id} />}
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

DisplayCategoryDetails.propTypes = {
  Category: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  clearCategoryDetail: PropTypes.func.isRequired,
  getActiveMainCategorys: PropTypes.func.isRequired,
  getCategoryById: PropTypes.func.isRequired,
  disableCategory: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  Category: state.Category,
})

export default connect(mapStateToProps, {
  clearError,
  clearMessage,
  clearCategoryDetail,
  getActiveMainCategorys,
  getCategoryById,
  disableCategory,
})(DisplayCategoryDetails)
