import React, { Fragment, useState, useEffect } from 'react'
import {
  Container,
  Card,
  CardBody,
  Label,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { clearError, clearMessage, addHuntingData } from '../../actions/huntingAction'
import { search, clearResource } from '../../utils/searchUtils'
// import { titleCase } from 'title-case'

const HuntingForm = ({ Hunting: { message, error }, clearError, clearMessage, addHuntingData }) => {
  const [ASIN, setASIN] = useState(''),
    [sourceSKU, setSourceSKU] = useState(''),
    [BSR, setBSR] = useState(''),
    [amazonLink, setAmazonLink] = useState(''),
    [sourceLink, setSourceLink] = useState(''),
    [variantType, setVariantType] = useState(''),
    [title, setTitle] = useState(''),
    [units, setUnits] = useState(0),
    [amazonPrice, setAmazonPrice] = useState(0.0),
    [sourcePrice, setSourcePrice] = useState(0.0),
    [currency, setCurrency] = useState('GBP'),
    [disableASIN, setDisableASIN] = useState(false),
    [uniqueAsin, setUniqueASIN] = useState(false),
    [errors, setErrors] = useState('')

  // ASIN
  // sourceSKU
  // BSR
  // amazonLink
  // sourceLink
  // variantType
  // title
  // units
  // amazonPrice
  // sourcePrice
  // currency
  // afterPercentage
  // deliveryCharges
  // referFee
  // VAT
  // profit
  // margin
  // ROI

  useEffect(() => {
    if (error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
      clearError()
    }
    if (message !== null) {
      setTimeout(() => {
        toast.success(message)
      }, 200)
      //clear fileds
      setASIN('')
      setSourceSKU('')
      setBSR('')
      setAmazonLink('')
      setSourceLink('')
      setVariantType('')
      setTitle('')
      setUnits(0)
      setAmazonPrice(0.0)
      setSourcePrice(0.0)
      setCurrency('GBP')
      setUniqueASIN(false)
      setDisableASIN(false)
      clearResource()
      clearMessage()
    }
    if (!uniqueAsin) {
      setASIN('')
    }
    // setSourceSKU('')
    // setBSR('')
    // setAmazonLink('')
    // setSourceLink('')
    // setVariantType('')
    // setTitle('')
    // setUnits(0)
    // setAmazonPrice(0.0)
    // setSourcePrice(0.0)
    // setCurrency('GBP')
    // setUniqueASIN(false)

    // eslint-disable-next-line
  }, [message, error])

  const validate = () => {
    let errors = {}
    let isValid = true

    if (ASIN === '') {
      isValid = false
      errors['ASIN'] = 'Please enter ASIN.'
    }

    if (sourceSKU === '') {
      isValid = false
      errors['sourceSKU'] = 'Please enter Source SKU.'
    }

    if (BSR === '') {
      isValid = false
      errors['BSR'] = 'Please enter BSR.'
    }

    if (amazonLink === '') {
      isValid = false
      errors['amazonLink'] = 'Please enter Amazon Link.'
    }

    if (sourceLink === '') {
      isValid = false
      errors['sourceLink'] = 'Please enter Source Link.'
    }

    if (variantType === '') {
      isValid = false
      errors['variantType'] = 'Please enter variation.'
    }

    if (title === '') {
      isValid = false
      errors['title'] = 'Please enter title.'
    }

    if (units === 0) {
      isValid = false
      errors['units'] = 'Please enter units.'
    }

    if (amazonPrice === 0.0) {
      isValid = false
      errors['amazonPrice'] = 'Please enter Amazon Price.'
    }

    if (sourcePrice === 0.0) {
      isValid = false
      errors['sourcePrice'] = 'Please enter Source Price.'
    }

    if (currency === '') {
      isValid = false
      errors['currency'] = 'Please enter currency.'
    }
    setErrors((prevState) => ({ ...prevState, ...errors }))

    return isValid
  }

  const AfterPercentage = () => (sourcePrice * 0.9).toFixed(2)
  const DeliveryCharges = () => (sourcePrice <= 28.99 ? 2.99 : 0).toFixed(2)
  const ReferFee = () => (amazonPrice * 0.153).toFixed(2)
  const VAT = () => ((amazonPrice / 1.07) * 0.07).toFixed(2)
  const Profit = () =>
    (amazonPrice - AfterPercentage() - DeliveryCharges() - ReferFee() - VAT()).toFixed(2)
  const Margin = () => ((Profit() / amazonPrice) * 100).toFixed(2)
  const ROI = () => ((Profit() / (sourcePrice * 0.9)) * 100).toFixed(2)

  const submitASIN = (e) => {
    e.preventDefault()
    let errors = {}
    if (ASIN === '') {
      errors['ASIN'] = 'Please enter ASIN.'
      setErrors(errors)
    } else if (uniqueAsin) {
      setDisableASIN((prevState) => !prevState)
      clearResource()
    } else {
      setTimeout(() => {
        toast.error('Error occurs while adding Hunter.')
      }, 200)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (validate() && !errors.sourceSKU) {
      const hunting = {
        asin: ASIN,
        source_sku: sourceSKU,
        bsr: BSR,
        amazon_link: amazonLink,
        source_link: sourceLink,
        variant_type: variantType,
        title: title,
        units: units,
        amazon_price: amazonPrice,
        source_price: sourcePrice,
        currency: currency,
        after_discount: AfterPercentage(),
        delivery_charges: DeliveryCharges(),
        refer_fee: ReferFee(),
        vat: VAT(),
        profit: Profit(),
        margin: Margin(),
        roi: ROI(),
      }
      // titleCase(label),
      addHuntingData(hunting)
    } else {
      setTimeout(() => {
        toast.error('Error occurs while adding Hunter.')
      }, 200)
    }
  }

  const validateSKU = async (val) => {
    try {
      await search(`${process.env.REACT_APP_API}/hunters/uniqueSKU?sku=${val}`)
      setErrors('')
    } catch (err) {
      let errors = {}
      errors['sourceSKU'] = err.message
      setErrors(errors)
    }
  }

  const onChangeHandlerSKU = async (e) => {
    validateSKU(e.target.value)
    setSourceSKU(e.target.value)
  }

  const validateASIN = async (val) => {
    try {
      const res = await search(`${process.env.REACT_APP_API}/hunters/uniqueASIN?asin=${val}`)
      setUniqueASIN(res.uniqueAsin)
      setErrors('')
    } catch (err) {
      let errors = {}
      errors['ASIN'] = err.message
      setUniqueASIN(false)
      setErrors(errors)
    }
  }

  const onChangeHandlerASIN = async (e) => {
    validateASIN(e.target.value)
    setASIN(e.target.value)
  }

  const onCancel = () => {
    setASIN((prevState) => prevState)
    setSourceSKU('')
    setBSR('')
    setAmazonLink('')
    setSourceLink('')
    setVariantType('')
    setTitle('')
    setUnits(0)
    setAmazonPrice(0.0)
    setSourcePrice(0.0)
    setCurrency('GBP')
    setErrors('')
    // setUniqueASIN(false)
    setDisableASIN(false)
    // clearResource()
  }

  return (
    <Fragment>
      <ToastContainer />
      <Container fluid={true}>
        <Row>
          <Col sm={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col sm={12}>
                    <Form onSubmit={!disableASIN ? submitASIN : onSubmit}>
                      <Row>
                        {disableASIN ? (
                          <>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <h5>Hunting Form</h5>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Button
                                className="btn btn-md"
                                color="dark"
                                style={{ float: 'right', margin: '2px' }}
                                onClick={() => onCancel()}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="btn btn-md"
                                style={{ float: 'right', margin: '2px' }}
                                color="primary"
                              >
                                Submit
                              </Button>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <h5>Hunting Form</h5>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Button
                                type="submit"
                                className="btn btn-md float-right"
                                color="primary"
                                style={{ float: 'right' }}
                              >
                                Submit
                              </Button>
                            </Col>
                          </>
                        )}
                        <Col sm={12}>
                          <hr />
                        </Col>

                        <Col sm={12} md={6}>
                          <FormGroup>
                            <Label htmlFor="ASIN">
                              ASIN <span style={{ color: 'red' }}>*</span>{' '}
                            </Label>
                            <Input
                              className="form-control"
                              type="text"
                              name="ASIN"
                              value={ASIN ? ASIN : ''}
                              disabled={disableASIN}
                              placeholder="ASIN"
                              valid={ASIN && !errors.ASIN ? true : false}
                              invalid={errors.ASIN ? true : false}
                              onChange={(e) => onChangeHandlerASIN(e)}
                            />
                            <div className="text-danger">{errors.ASIN}</div>
                          </FormGroup>
                        </Col>

                        {!disableASIN ? (
                          <Col sm={12} md={12}>
                            <Button
                              type="submit"
                              className="btn btn-md float-right"
                              color="primary"
                              style={{ float: 'right' }}
                            >
                              Submit
                            </Button>
                          </Col>
                        ) : (
                          <>
                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="sourceSKU">
                                  Source SKU <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="text"
                                  name="sourceSKU"
                                  value={sourceSKU ? sourceSKU : ''}
                                  placeholder="SKU"
                                  valid={sourceSKU && !errors.sourceSKU ? true : false}
                                  invalid={errors.sourceSKU ? true : false}
                                  onChange={(e) => onChangeHandlerSKU(e)}
                                ></Input>
                                <div className="text-danger">{errors.sourceSKU}</div>
                              </FormGroup>
                            </Col>
                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="BSR">
                                  BSR <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="text"
                                  name="BSR"
                                  value={BSR ? BSR : ''}
                                  placeholder="BSR"
                                  invalid={errors.BSR ? true : false}
                                  onChange={(e) => setBSR(e.target.value)}
                                />
                                <div className="text-danger">{errors.BSR}</div>
                              </FormGroup>
                            </Col>
                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="amazonLink">
                                  Amazon Link <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="text"
                                  name="amazonLink"
                                  value={amazonLink ? amazonLink : ''}
                                  placeholder="Amazon Link"
                                  invalid={errors.amazonLink ? true : false}
                                  onChange={(e) => setAmazonLink(e.target.value)}
                                  min="0"
                                />
                                <div className="text-danger">{errors.amazonLink}</div>
                              </FormGroup>
                            </Col>
                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="sourceLink">
                                  Source Link <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="text"
                                  name="sourceLink"
                                  value={sourceLink ? sourceLink : ''}
                                  placeholder="Source Link"
                                  invalid={errors.sourceLink ? true : false}
                                  onChange={(e) => setSourceLink(e.target.value)}
                                  min="0"
                                />
                                <div className="text-danger">{errors.sourceLink}</div>
                              </FormGroup>
                            </Col>

                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="variantType">
                                  Variation <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="text"
                                  name="variantType"
                                  value={variantType ? variantType : ''}
                                  placeholder="variation"
                                  invalid={errors.variantType ? true : false}
                                  onChange={(e) => setVariantType(e.target.value)}
                                />
                                <div className="text-danger">{errors.variantType}</div>
                              </FormGroup>
                            </Col>
                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="title">
                                  Title <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="text"
                                  name="title"
                                  value={title ? title : ''}
                                  placeholder="title"
                                  invalid={errors.title ? true : false}
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className="text-danger">{errors.title}</div>
                              </FormGroup>
                            </Col>
                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="units">
                                  Units <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="number"
                                  name="units"
                                  value={units ? units : ''}
                                  placeholder="units"
                                  invalid={errors.units ? true : false}
                                  onChange={(e) => setUnits(e.target.value)}
                                />
                                <div className="text-danger">{errors.units}</div>
                              </FormGroup>
                            </Col>
                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="amazonPrice">
                                  Amazon Price <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="number"
                                  name="amazonPrice"
                                  value={amazonPrice ? amazonPrice : ''}
                                  placeholder="Amazon Price"
                                  invalid={errors.amazonPrice ? true : false}
                                  onChange={(e) => setAmazonPrice(e.target.value)}
                                />
                                <div className="text-danger">{errors.amazonPrice}</div>
                              </FormGroup>
                            </Col>
                            <Col sm={12} md={6}>
                              <FormGroup>
                                <Label htmlFor="sourcePrice">
                                  Source Price <span style={{ color: 'red' }}>*</span>{' '}
                                </Label>
                                <Input
                                  className="form-control"
                                  type="number"
                                  name="sourcePrice"
                                  value={sourcePrice ? sourcePrice : ''}
                                  placeholder="sourcePrice"
                                  invalid={errors.sourcePrice ? true : false}
                                  onChange={(e) => setSourcePrice(e.target.value)}
                                />
                                <div className="text-danger">{errors.sourcePrice}</div>
                              </FormGroup>
                            </Col>
                            {amazonPrice && sourcePrice ? (
                              <Col sm={12}>
                                <ListGroup className="list-group-flush">
                                  <ListGroupItem>
                                    <Row>
                                      <Col sm={3}>
                                        <h6>Discount(10%) :</h6>
                                      </Col>
                                      <Col
                                        style={
                                          AfterPercentage() < 0
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
                                        £{AfterPercentage()}
                                      </Col>
                                      <Col sm={3}>
                                        <h6>Delivery :</h6>
                                      </Col>
                                      <Col
                                        style={
                                          DeliveryCharges() < 0
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
                                        £{DeliveryCharges()}
                                      </Col>
                                    </Row>
                                  </ListGroupItem>
                                  <ListGroupItem>
                                    <Row>
                                      <Col sm={3}>
                                        <h6>Refer Fee(15.3%) :</h6>
                                      </Col>
                                      <Col
                                        style={
                                          ReferFee() < 0
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
                                        £{ReferFee()}
                                      </Col>
                                      <Col sm={3}>
                                        <h6>VAT(7%) :</h6>
                                      </Col>
                                      <Col
                                        style={
                                          VAT() < 0
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
                                        £{VAT()}
                                      </Col>
                                    </Row>
                                  </ListGroupItem>
                                  <ListGroupItem>
                                    <Row>
                                      <Col sm={3}>
                                        <h6>Profit :</h6>
                                      </Col>
                                      <Col
                                        style={
                                          Profit() < 0
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
                                        {Profit()}%
                                      </Col>

                                      <Col sm={3}>
                                        <h6>Margin% :</h6>
                                      </Col>
                                      <Col
                                        sm={3}
                                        style={
                                          Margin() < 0
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
                                        {Margin()}%
                                      </Col>
                                    </Row>
                                  </ListGroupItem>
                                  <ListGroupItem>
                                    <Row>
                                      <Col sm={3}>
                                        <h6>ROI% :</h6>
                                      </Col>
                                      <Col
                                        style={
                                          ROI() < 0
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
                                        {ROI()}%
                                      </Col>
                                    </Row>
                                  </ListGroupItem>
                                </ListGroup>
                              </Col>
                            ) : (
                              ''
                            )}

                            <Col sm={12}>
                              <hr />
                            </Col>

                            <Col lg={12} md={12} sm={12} xs={12}>
                              <Button
                                className="btn btn-md"
                                style={{ float: 'right', margin: '2px' }}
                                color="dark"
                                onClick={() => onCancel()}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="btn btn-md "
                                style={{ float: 'right', margin: '2px' }}
                                color="primary"
                              >
                                Submit
                              </Button>
                            </Col>
                          </>
                        )}
                      </Row>
                    </Form>
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

HuntingForm.propTypes = {
  Hunting: PropTypes.object.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  addHuntingData: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Hunting: state.Hunting,
})

export default connect(mapStateToProps, {
  clearError,
  clearMessage,
  addHuntingData,
})(HuntingForm)
