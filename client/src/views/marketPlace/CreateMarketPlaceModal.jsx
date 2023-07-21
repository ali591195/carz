/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
} from 'reactstrap'
import { Trash2, PlusCircle, X } from 'react-feather'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  getMarketPlaces,
  addMarketPlace,
  clearError,
  clearMessage,
} from '../../actions/marketPlaceAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
const CreateMarketPlaceModal = ({
  Marketplace: { error, message },
  modal,
  toggle,
  getMarketPlaces,
  addMarketPlace,
  clearError,
}) => {
  const [marketPlaceId, setMarketPlaceId] = useState(''),
    [country, setCountry] = useState(''),
    [countryCode, setCountryCode] = useState(''),
    [symbol, setSymbol] = useState(''),
    [currency, setCurrency] = useState(''),
    [errors, setErrors] = useState('')

  useEffect(() => {
    if (error !== null) {
      clearError()
    }
    if (message !== null) {
      getMarketPlaces()
      //clear fileds
      setMarketPlaceId('')
      setCountry('')
      setCountryCode('')
      setSymbol('')
      setCurrency('')
      toggle()
    }
    // eslint-disable-next-line
  }, [message, error])

  const validate = () => {
    let errors = {}
    let isValid = true

    if (marketPlaceId === '') {
      isValid = false
      errors['marketPlaceId'] = 'Please enter Marketplace Id.'
    }
    if (marketPlaceId !== '') {
      if (marketPlaceId.length < 10) {
        isValid = false
        errors['marketPlaceId'] = 'The marketplace Id must be 10 characters in length.'
      }
    }
    if (country === '') {
      isValid = false
      errors['country'] = 'Please enter the Country Name.'
    }
    if (countryCode === '') {
      isValid = false
      errors['countryCode'] = 'Please enter the Country-Code.'
    }
    if (symbol === '') {
      isValid = false
      errors['symbol'] = 'Please enter the Symbol.'
    }
    if (currency === '') {
      isValid = false
      errors['currency'] = 'Please enter the Currency.'
    }

    setErrors(errors)

    return isValid
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // JSON.stringify(deliveryCharges)
    if (validate()) {
      const marketPlaceData = {
        marketplace_id: marketPlaceId,
        country: country,
        country_code: countryCode,
        currency: currency,
        symbol: symbol,
      }
      addMarketPlace(marketPlaceData)
    } else {
      setTimeout(() => {
        toast.error('Error occurs while adding MarketPlace.')
      }, 200)
    }
  }

  const closeBtn = (
    <Button color="danger" outline onClick={toggle}>
      <X style={{ width: 16, height: 16 }} />
    </Button>
  )
  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        size="xl"
        fade={true}
        centered={true}
        // scrollable={true}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          Create MarketPlace
        </ModalHeader>
        <Form onSubmit={onSubmit}>
          <ModalBody>
            <Row>
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label htmlFor="marketPlaceId">
                    MarketPlace ID<span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="marketPlaceId"
                    value={marketPlaceId ? marketPlaceId : ''}
                    placeholder="Enter Marketplace Id"
                    valid={marketPlaceId && !errors.marketPlaceId ? true : false}
                    invalid={errors.marketPlaceId ? true : false}
                    onChange={(e) => setMarketPlaceId(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.marketPlaceId}</div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label htmlFor="country">
                    Country<span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="country"
                    value={country ? country : ''}
                    placeholder="Enter Country"
                    valid={country && !errors.country ? true : false}
                    invalid={errors.country ? true : false}
                    onChange={(e) => setCountry(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.country}</div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label htmlFor="countryCode">
                    Country-Code<span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="countryCode"
                    value={countryCode ? countryCode : ''}
                    placeholder="Enter Country-Code"
                    valid={countryCode && !errors.countryCode ? true : false}
                    invalid={errors.countryCode ? true : false}
                    onChange={(e) => setCountryCode(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.countryCode}</div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label htmlFor="currency">
                    Currency<span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="currency"
                    value={currency ? currency : ''}
                    placeholder="Enter Currency"
                    valid={currency && !errors.currency ? true : false}
                    invalid={errors.currency ? true : false}
                    onChange={(e) => setCurrency(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.currency}</div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label htmlFor="symbol">
                    Symbol<span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="symbol"
                    value={symbol ? symbol : ''}
                    placeholder="Enter Symbol"
                    valid={symbol && !errors.symbol ? true : false}
                    invalid={errors.symbol ? true : false}
                    onChange={(e) => setSymbol(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.symbol}</div>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              className="btn btn-sm "
              style={{ float: 'right', margin: '2px' }}
              color="primary"
            >
              Submit
            </Button>
            <Button color="secondary" className="btn btn-sm" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

CreateMarketPlaceModal.propTypes = {
  Marketplace: PropTypes.object.isRequired,
  getMarketPlaces: PropTypes.func.isRequired,
  addMarketPlace: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Marketplace: state.Marketplace,
})

export default connect(mapStateToProps, {
  getMarketPlaces,
  addMarketPlace,
  clearError,
})(CreateMarketPlaceModal)
