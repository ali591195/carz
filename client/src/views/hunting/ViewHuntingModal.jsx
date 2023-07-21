/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useEffect, useState } from 'react'

// import ReactHtmlParser from 'react-html-parser'

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Media,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import moment from 'moment'
import { X } from 'react-feather'
const ViewHuntingModal = ({ modal, toggle, data }) => {
  // const [title, setTitle] = useState('')
  // const [description, setDescription] = useState('')
  // let [body, setBody] = useState('')

  useEffect(() => {
    // if (data) {
    //   setTitle(data.title)
    //   setDescription(data.description)
    //   setBody(data.body)
    // }
    // eslint-disable-next-line
  }, [data])

  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  console.log(data)

  const closeBtn = (
    <Button color="danger" outline onClick={toggle}>
      <X style={{ width: 16, height: 16 }} />
    </Button>
  )
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="xl" fade={true} centered={true} scrollable={true}>
        <ModalHeader toggle={toggle} close={closeBtn}>
          Hunting Details
        </ModalHeader>
        <ModalBody>
          {/* <div className='user-profile'> */}

          <Row>
            <Col sm="8">
              <div className="media">
                <div className="media-body align-self-center">
                  <h5 className="mt-0 user-name">{data.title}</h5>
                </div>
              </div>
            </Col>

            <Col sm="4" className="d-sm-flex justify-content-sm-end">
              <div
              // className="me-md-2"

              // className="float-sm-right"
              >
                <small>{moment(data.created_on).format('YYYY-MM-DD')}</small>
              </div>
            </Col>
          </Row>
          {/* <Row className="justify-content-center">
            <Col md="4">
              <Media body className="img-fluid rounded" src={data.image} alt="gallery" />
            </Col>
          </Row> */}
          <ListGroup className="list-group-flush">
            <ListGroupItem>
              <Row>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>ASIN</span>
                </Col>
                <Col sm={3}>{data.asin}</Col>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>BSR</span>
                </Col>
                <Col sm={3}>{data.bsr}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Source_SKU</span>
                </Col>
                <Col sm={3}>{data.source_sku}</Col>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Units</span>
                </Col>
                <Col sm={3}>{data.units}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Variation</span>
                </Col>
                <Col sm={9}>{data.variant_type}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col sm={3} className="link">
                  <span style={{ fontWeight: 'bold' }}>Source_Link</span>
                </Col>
                <Col sm={9}>
                  <a
                    href={data.source_link}
                    onMouseEnter={() => setIsHovered((prevState) => !prevState)}
                    onMouseLeave={() => setIsHovered((prevState) => !prevState)}
                    style={{ color: isHovered ? '#5141E0' : '#3399FF' }}
                    target="_blank"
                  >
                    {data.source_link}
                  </a>
                </Col>
              </Row>
            </ListGroupItem>

            <ListGroupItem>
              <Row>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Amazon_Link</span>
                </Col>
                <Col sm={9}>
                  <a
                    href={data.amazon_link}
                    onMouseEnter={() => setIsHovered2((prevState) => !prevState)}
                    onMouseLeave={() => setIsHovered2((prevState) => !prevState)}
                    style={{ color: isHovered2 ? '#918E9B' : '#c5c3ca' }}
                    target="_blank"
                  >
                    {data.amazon_link}
                  </a>
                </Col>
              </Row>
            </ListGroupItem>

            <ListGroupItem>
              <Row>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Discount(10%)</span>
                </Col>
                <Col
                  style={
                    data.after_discount < 0
                      ? {
                          background: '#E04A47',
                          padding: '0.25em 0.4em',
                          fontWeight: '700',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }
                      : {}
                  }
                  sm={3}
                >
                  £{data.after_discount}
                </Col>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Delivery</span>
                </Col>
                <Col
                  style={
                    data.delivery_charges < 0
                      ? {
                          background: '#E04A47',
                          padding: '0.25em 0.4em',
                          fontWeight: '700',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }
                      : {}
                  }
                  sm={3}
                >
                  £{data.delivery_charges}
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Refer Fee(15.3%)</span>
                </Col>
                <Col
                  style={
                    data.refer_fee < 0
                      ? {
                          background: '#E04A47',
                          padding: '0.25em 0.4em',
                          fontWeight: '700',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }
                      : {}
                  }
                  sm={3}
                >
                  £{data.refer_fee}
                </Col>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>VAT(7%)</span>
                </Col>
                <Col
                  style={
                    data.vat < 0
                      ? {
                          background: '#E04A47',
                          padding: '0.25em 0.4em',
                          fontWeight: '700',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }
                      : {}
                  }
                  sm={3}
                >
                  £{data.vat}
                </Col>
              </Row>
            </ListGroupItem>

            <ListGroupItem>
              <Row>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Profit</span>
                </Col>
                <Col
                  style={
                    data.profit < 0
                      ? {
                          background: '#E04A47',
                          padding: '0.25em 0.4em',
                          fontWeight: '700',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }
                      : {}
                  }
                  sm={3}
                >
                  {data.profit}%
                </Col>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>Margin%</span>
                </Col>
                <Col
                  sm={3}
                  style={
                    data.margin < 0
                      ? {
                          background: '#E04A47',
                          padding: '0.25em 0.4em',
                          fontWeight: '700',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }
                      : {}
                  }
                >
                  {data.margin}%
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col sm={3}>
                  <span style={{ fontWeight: 'bold' }}>ROI%</span>
                </Col>
                <Col
                  style={
                    data.roi < 0
                      ? {
                          background: '#E04A47',
                          padding: '0.25em 0.4em',
                          fontWeight: '700',
                          borderRadius: '0.375rem',
                          color: 'white',
                        }
                      : {}
                  }
                  sm={3}
                >
                  {data.roi}%
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn btn-sm" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ViewHuntingModal
