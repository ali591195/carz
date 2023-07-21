import React, { Fragment, useState } from 'react'
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap'
import HuntingStoreList from './HuntingStoreList'
import { useNavigate } from 'react-router-dom'
import CreateHuntingStoreModal from './CreateHuntingStoreModal'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const HuntingStore = ({ Auth: { permissions } }) => {
  const navigate = useNavigate()

  const RedirectToUser = (redirect) => {
    navigate(redirect)
  }

  const [createModal, setCreateModal] = useState(false)

  const createToggle = () => {
    setCreateModal(!createModal)
  }

  return (
    <Fragment>
      <ToastContainer />
      {createModal && <CreateHuntingStoreModal modal={createModal} toggle={createToggle} />}
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <h2>Vendors</h2>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    {permissions.create_and_edit_store && (
                      <Button
                        type="submit"
                        className="btn btn-md"
                        style={{ float: 'right' }}
                        color="primary"
                        onClick={() => createToggle()}
                      >
                        Create Vendor
                      </Button>
                    )}
                  </Col>

                  <Col sm={12}>
                    <hr />
                  </Col>

                  <Col sm={12}>
                    <HuntingStoreList />
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
HuntingStore.propTypes = {
  Auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})

export default connect(mapStateToProps, {})(HuntingStore)
