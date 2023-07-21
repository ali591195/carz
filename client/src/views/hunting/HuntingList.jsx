import React, { Fragment } from 'react'
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap'
// import { AddBlog } from '../../constant'
// import BlogFilter from './BlogFilter'
import Huntings from './Huntings'

const HuntingList = () => {
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Huntings />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default HuntingList

{
  /* <Row className="justify-content-end">
                  <Col sm={12} md={6} style={{ marginTop: '10px' }}>
                    <Button
                      color="primary"
                      className="btn btn-sm"
                      onClick={() => AddBlogRedirect(`/blog/add-blog`)}
                    >
                      <span>{AddBlog}</span>
                    </Button>
                  </Col>
                  <Col sm={12} md={6} style={{ marginTop: '10px' }}>
                    <BlogFilter />
                  </Col>
                </Row> */
}
