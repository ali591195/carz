/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useRef, useState, useEffect } from 'react'

import {
  Label,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { X } from 'react-feather'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DisplayOrder = ({ modal, toggle, data }) => {
  const [errors, setErrors] = useState('')

  useEffect(() => {
    // eslint-disable-next-line
  }, [])

  const validate = () => {
    let errors = {}
    let isValid = true
    setErrors(errors)

    return isValid
  }

  //   const onSubmit = (e) => {
  //     e.preventDefault()

  //     if (validate()) {
  //       let image = null
  //       let pictureDataURLs = null
  //       let imageArray = []
  //       // let active = true;

  //       if (selectSingleImage) {
  //         image = new FormData()
  //         image.append('image', selectSingleImage.pictureFiles[0])
  //       }

  //       if (selectFile) {
  //         // if (selectFile.pictureDataURLs.length > 3) {
  //         //   const msg = 'Only 3 images can be uploaded at a time';
  //         //   setTimeout(() => {
  //         //     toast.error(msg);
  //         //   }, 200);
  //         //   active = false;
  //         // }
  //         // else if (selectFile.pictureDataURLs.length < imageFile.length) {
  //         //   const msg = `Must upload ${imageFile.length} image.`;
  //         //   setTimeout(() => {
  //         //     toast.error(msg);
  //         //   }, 200);
  //         //   active = false;
  //         // }
  //         // else {
  //         pictureDataURLs = selectFile.pictureDataURLs

  //         for (let x = 0; x < selectFile.pictureFiles.length; x++) {
  //           const images = new FormData()
  //           images.append('image', selectFile.pictureFiles[x])
  //           imageArray.push(images)
  //         }
  //       }
  //       // }
  //       const product = {
  //         id: data.id,
  //         label: titleCase(label),
  //         weight: weight,
  //         part_no: partNo,
  //         sale_price: salePrice,
  //         type,
  //         make: make,
  //         model_name: modelName,
  //         model_year: modelYear,
  //         category: category,
  //         subcategory: subCategory,
  //         description: editorRef.current && editorRef.current.getContent(),
  //         // stock_alert: stockAlert,
  //         image1,
  //         image2: null,
  //         image3: null,
  //         image4: null,
  //         x_axis_dimension: x_axis,
  //         y_axis_dimension: y_axis,
  //         unit_dimension: unit,
  //       }
  //       // if (active) {
  //       updateProduct(product, imageArray, pictureDataURLs, image)

  //       // clear fileds
  //       setLabel('')
  //       setWeight('')
  //       setPartNo('')
  //       setMake('')
  //       setType('')
  //       setModelName('')
  //       setCategory('')
  //       setSubCategory('')
  //       setDescription('')
  //       setSalePrice(0)

  //       setX_axis(0)
  //       setY_axis(0)
  //       setUnit('')

  //       clearFile()

  //       toggle()
  //     } else {
  //       setTimeout(() => {
  //         toast.error('Error occurs while updating product.')
  //       }, 200)
  //     }
  //     // }
  //   }

  const closeBtn = (
    <Button color="danger" outline onClick={toggle}>
      <X style={{ width: 16, height: 16 }} />
    </Button>
  )

  return (
    <Modal isOpen={modal} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} close={closeBtn}>
        Product
      </ModalHeader>

      <ModalBody>
        <Row>
          <Col sm="12">
            <div className="user-profile">
              <div className="card hovercard text-center">
                <div className="user-image">
                  <div className="product">
                    <Media
                      body
                      alt=""
                      //   src={
                      //     data.image1 ? data.image1 : require('../../assets/images/defaultTool.jpeg')
                      //   }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-img-style">
              <Row>
                <Col sm="8">
                  <div className="media">
                    <div className="media-body align-self-center">
                      <h5 className="mt-0 user-name">data.label</h5>
                      <p>data.type_label</p>
                    </div>
                  </div>
                </Col>
                <Col sm="4" className="align-self-center">
                  <div className="float-sm-right">
                    {/* <small>{moment(data.created_on).format('YYYY-MM-DD')}</small> */}
                  </div>
                </Col>
              </Row>
              <hr />
              <Row className="justify-content-center">
                {/* {data.image2 && ( */}
                <Col sm="4">
                  <div id="aniimated-thumbnials-3">
                    <Media
                      body
                      className="img-fluid rounded"
                      //   src={data.image2}
                      alt="gallery"
                    />
                  </div>
                  <br />
                </Col>
                {/* )} */}
                {/* {data.image3 && ( */}
                <Col sm="4">
                  <div id="aniimated-thumbnials-3">
                    <Media
                      body
                      className="img-fluid rounded"
                      //   src={data.image3}
                      alt="gallery"
                    />
                  </div>
                  <br />
                </Col>
                {/* )} */}
                {/* {data.image4 && ( */}
                <Col sm="4">
                  <div id="aniimated-thumbnials-3">
                    <Media
                      body
                      className="img-fluid rounded"
                      //   src={data.image4}
                      alt="gallery"
                    />
                  </div>
                  <br />
                </Col>
                {/* )} */}
              </Row>
              <Row>
                <Col sm={12}>
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Make :</h6>
                        </Col>
                        {/* <Col sm={7}>{data.make}</Col> */}
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Model :</h6>
                        </Col>
                        {/* <Col sm={7}>{data.model_name}</Col> */}
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Type of Vehicle :</h6>
                        </Col>
                        {/* <Col sm={7}>{data.model_year}</Col> */}
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Part No:</h6>
                        </Col>
                        {/* <Col sm={7}>{data.part_no}</Col> */}
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Sale Price:</h6>
                        </Col>
                        {/* <Col sm={7}>{data.sale_price}</Col> */}
                      </Row>
                    </ListGroupItem>

                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Type :</h6>
                        </Col>
                        {/* <Col sm={7}>{data.type_label}</Col> */}
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Category :</h6>
                        </Col>
                        {/* <Col sm={7}>{data.category}</Col> */}
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Sub-Category :</h6>
                        </Col>
                        {/* <Col sm={7}>{data.subcategory ? data.subcategory : 'No sub-category'}</Col> */}
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Dimension :</h6>
                        </Col>
                        <Col sm={7}>
                          {/* {data.x_axis_dimension || data.y_axis_dimension || data.unit_dimension
                            ? data.x_axis_dimension +
                              ' x ' +
                              data.y_axis_dimension +
                              ' ' +
                              data.unit_dimension
                            : ''} */}
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col sm={5}>
                          <h6>Weight :</h6>
                        </Col>
                        {/* <Col sm={7}>{data.weight}</Col> */}
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </Col>

                <Col sm="12" style={{ padding: '0px 25px;' }}>
                  <br />
                  <h6>Description</h6>
                  <div
                    className="like-comment mt-4 like-comment-lg-mb"
                    style={{
                      maxHeight: 'calc(100vh - 210px)',
                      overflowY: 'auto',
                    }}
                  >
                    {/* {ReactHtmlParser(data.description)} */}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </ModalBody>

      <ModalFooter>
        <Button type="submit" color="primary" className="btn btn-sm">
          Submit
        </Button>
        <Button color="secondary" onClick={toggle} className="btn btn-sm">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

DisplayOrder.propTypes = {}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(DisplayOrder)
