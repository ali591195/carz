import React, { Fragment, useState } from 'react'
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap'
import MarketPlaceList from './MarketPlaceList'
import CreateMarketPlaceModal from './CreateMarketPlaceModal'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MarketPlace = ({ Auth: { permissions } }) => {
  const [createModal, setCreateModal] = useState(false)

  const createToggle = () => {
    setCreateModal(!createModal)
  }

  return (
    <Fragment>
      <ToastContainer />
      {createModal && <CreateMarketPlaceModal modal={createModal} toggle={createToggle} />}
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <h2>MarketPlace</h2>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    {permissions.create_and_edit_marketplace && (
                      <Button
                        type="submit"
                        className="btn btn-md"
                        style={{ float: 'right' }}
                        color="primary"
                        onClick={() => createToggle()}
                      >
                        Create Marketplace
                      </Button>
                    )}
                  </Col>

                  <Col sm={12}>
                    <hr />
                  </Col>

                  <Col sm={12}>
                    <MarketPlaceList />
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
MarketPlace.propTypes = {
  Auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})

export default connect(mapStateToProps, {})(MarketPlace)
