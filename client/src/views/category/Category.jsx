import React, { Fragment, useState, useEffect } from 'react'
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap'
import CategoryList from './CategoryList'
import SubCategoryList from './SubCategoryList'
import CreateCategoryModal from './CreateCategoryModal'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  getCategorys,
  getSubCategorys,
  getActiveMainCategorys,
  clearError,
  clearMessage,
} from '../../actions/categoryAction'

const Category = ({
  Auth: { permissions },
  Category: { error, message },
  getCategorys,
  getSubCategorys,
  getActiveMainCategorys,
  clearError,
  clearMessage,
}) => {
  const [createModal, setCreateModal] = useState(false)
  const [showSelect, setShowSelect] = useState(false)

  useEffect(() => {
    if (!error) {
      getCategorys()
      getSubCategorys()
    }

    if (message !== null) {
      setTimeout(() => {
        toast.success(message)
      }, 200)

      clearMessage()
    }

    if (error !== 'Internal Server Error' && error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
    }

    //eslint-disable-next-line
  }, [error, message])

  useEffect(() => {
    return () => {
      clearError()
      // clearcategorys()
    }
    //eslint-disable-next-line
  }, [])

  const createToggle = () => {
    setCreateModal(!createModal)
  }

  return (
    <Fragment>
      <ToastContainer />
      {createModal && (
        <CreateCategoryModal modal={createModal} toggle={createToggle} showSelect={showSelect} />
      )}
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <h2>Main Categorys</h2>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    {permissions.create_and_edit_category && (
                      <Button
                        type="submit"
                        className="btn btn-md"
                        style={{ float: 'right' }}
                        color="primary"
                        onClick={() => {
                          setShowSelect(false)
                          createToggle()
                        }}
                      >
                        Create
                      </Button>
                    )}
                  </Col>

                  <Col sm={12}>
                    <hr />
                  </Col>

                  <Col sm={12}>
                    <CategoryList />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col sm="12" style={{ marginTop: '20px' }}>
            <Card>
              <CardBody>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <h2>Sub Categorys</h2>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    {permissions.create_and_edit_category && (
                      <Button
                        type="submit"
                        className="btn btn-md"
                        style={{ float: 'right' }}
                        color="primary"
                        onClick={() => {
                          setShowSelect(true)
                          getActiveMainCategorys()
                          createToggle()
                        }}
                      >
                        Create
                      </Button>
                    )}
                  </Col>

                  <Col sm={12}>
                    <hr />
                  </Col>

                  <Col sm={12}>
                    <SubCategoryList />
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
Category.propTypes = {
  Auth: PropTypes.object.isRequired,
  Category: PropTypes.object.isRequired,
  getCategorys: PropTypes.func.isRequired,
  getSubCategorys: PropTypes.func.isRequired,
  getActiveMainCategorys: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  Category: state.Category,
})

export default connect(mapStateToProps, {
  getCategorys,
  getSubCategorys,
  getActiveMainCategorys,
  clearError,
  clearMessage,
})(Category)
