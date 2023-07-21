import React, { Fragment } from 'react'
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap'
import Users from './Users'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const UserList = ({ Auth: { permissions } }) => {
  const navigate = useNavigate()

  const RedirectToUser = (redirect) => {
    navigate(redirect)
  }

  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <h2>Users</h2>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    {permissions.create_and_edit_user && (
                      <Button
                        type="submit"
                        onClick={() => RedirectToUser('/users/adduser')}
                        className="btn btn-md"
                        style={{ float: 'right' }}
                        color="primary"
                      >
                        Add User
                      </Button>
                    )}
                  </Col>

                  <Col sm={12}>
                    <hr />
                  </Col>

                  <Col sm={12}>
                    <Users />
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

UserList.propTypes = {
  Auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})

export default connect(mapStateToProps, {})(UserList)
