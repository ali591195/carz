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
  getStores,
  addHuntingStore,
  clearError,
  clearMessage,
} from '../../actions/huntingStoreAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
const CreateHuntingStoreModal = ({
  HuntingStore: { error, message },
  modal,
  toggle,
  getStores,
  addHuntingStore,
  clearError,
}) => {
  const [name, setName] = useState(''),
    [discount, setDiscount] = useState(0),
    [storeLink, setStoreLink] = useState(''),
    [deliveryCharges, setDeliveryCharges] = useState([]),
    [errors, setErrors] = useState(''),
    [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (error !== null) {
      clearError()
    }
    if (message !== null) {
      getStores()
      //clear fileds
      setName('')
      setDiscount(0)
      setStoreLink('')
      setDeliveryCharges([])
      toggle()
    }
    // eslint-disable-next-line
  }, [message, error])

  const validate = () => {
    let errors = {}
    let isValid = true

    if (name === '') {
      isValid = false
      errors['name'] = 'Please enter your name.'
    }

    if (discount === 0) {
      isValid = false
      errors['discount'] = 'Please enter discount.'
    }
    if (discount > 100) {
      isValid = false
      errors['discount'] = 'Discount value must be less or equal to 100%.'
    }

    if (storeLink === '') {
      isValid = false
      errors['storeLink'] = 'Please enter your vendor link.'
    }

    if (deliveryCharges.length) {
      deliveryCharges.map((deliveryCharge, i) => {
        if (deliveryCharge.to == '') {
          isValid = false
          errors[`to${i}`] = `To is Required.`
        }
        if (deliveryCharge.from == '' && deliveryCharges.length - 1 !== i) {
          isValid = false
          errors[`from${i}`] = `From is Required.`
        }
        if (deliveryCharge.charges == '') {
          isValid = false
          errors[`charges${i}`] = `Charges is Required.`
        }
        if (deliveryCharge.from !== '' && Number(deliveryCharge.to) > Number(deliveryCharge.from)) {
          isValid = false
          errors[`deliveryCharges${i}`] = `To value must be smaller than From value.`
        }
        if (
          i !== 0 &&
          deliveryCharges[i - 1].from !== '' &&
          deliveryCharge.to !== '' &&
          Number(deliveryCharges[i - 1].from) > Number(deliveryCharge.to)
        ) {
          isValid = false
          errors[`to${i}`] = `To value must be greater or equal to previous From value.`
        }
      })
    }

    setErrors(errors)

    return isValid
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // JSON.stringify(deliveryCharges)
    if (validate()) {
      const storeData = {
        store_detail: {
          name,
          link: storeLink,
          discount,
        },
        shipping_charges: deliveryCharges,
      }

      addHuntingStore(storeData)
    } else {
      setTimeout(() => {
        toast.error('Error occurs while adding Vendor.')
      }, 200)
    }
  }

  const handleChange = (i, e) => {
    e.preventDefault()
    let newFormValues = [...deliveryCharges]
    newFormValues[i][e.target.name] = e.target.value
    setDeliveryCharges(newFormValues)
  }

  const addFormFields = (e) => {
    e.preventDefault()
    setDeliveryCharges([...deliveryCharges, { to: '', from: '', charges: '' }])
  }

  const removeFormFields = (i, e) => {
    e.preventDefault()
    let newFormValues = [...deliveryCharges]
    newFormValues.splice(i, 1)
    if (i !== 0) newFormValues[i - 1]['from'] = null
    setDeliveryCharges(newFormValues)
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
          Create Vendor
        </ModalHeader>
        <Form onSubmit={onSubmit}>
          <ModalBody>
            <Row>
              <Col xs={12}>
                <h5>Vendor Details</h5>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label htmlFor="Name">
                    Name <span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="name"
                    value={name ? name : ''}
                    placeholder="Enter name"
                    valid={name && !errors.name ? true : false}
                    invalid={errors.name ? true : false}
                    onChange={(e) => setName(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.name}</div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label htmlFor="discount">
                    Discount(%) <span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="number"
                    name="discount"
                    value={discount ? discount : ''}
                    placeholder="Enter Discount"
                    valid={discount && !errors.discount ? true : false}
                    invalid={errors.discount ? true : false}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                  <div className="text-danger">{errors.discount}</div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <FormGroup>
                  <Label htmlFor="storeLink">
                    Link <span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="storeLink"
                    value={storeLink ? storeLink : ''}
                    placeholder="Enter Link"
                    valid={storeLink && !errors.storeLink ? true : false}
                    invalid={errors.storeLink ? true : false}
                    onChange={(e) => setStoreLink(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.storeLink}</div>
                </FormGroup>
              </Col>
              <Col xs={12}>
                <h5>Shipping Charges</h5>
              </Col>
            </Row>

            {deliveryCharges.map((element, index) => (
              <Row key={index}>
                <Col sm={12} md={6} lg={3} style={{ margin: '10px 0px' }}>
                  <InputGroup>
                    <InputGroupText>To</InputGroupText>
                    <Input
                      className="form-control"
                      name="to"
                      type="number"
                      value={element.to || ''}
                      valid={
                        element.to && (!errors[`to${index}`] || !errors[`deliveryCharges${index}`])
                          ? true
                          : false
                      }
                      invalid={
                        errors[`to${index}`] || errors[`deliveryCharges${index}`] ? true : false
                      }
                      onChange={(e) => handleChange(index, e)}
                    />
                  </InputGroup>
                  <div className="text-danger" style={{ marginTop: '5px' }}>
                    {errors[`to${index}`]}
                  </div>
                </Col>
                <Col sm={12} md={6} lg={3} style={{ margin: '10px 0px' }}>
                  <InputGroup>
                    <InputGroupText>From</InputGroupText>
                    <Input
                      className="form-control"
                      name="from"
                      type="number"
                      disabled={deliveryCharges.length - 1 === index}
                      value={element.from || ''}
                      valid={
                        element.from &&
                        (!errors[`from${index}`] || !errors[`deliveryCharges${index}`])
                          ? true
                          : false
                      }
                      invalid={
                        errors[`from${index}`] || errors[`deliveryCharges${index}`] ? true : false
                      }
                      onChange={(e) => handleChange(index, e)}
                    />
                  </InputGroup>
                  <div className="text-danger" style={{ marginTop: '5px' }}>
                    {errors[`from${index}`]}
                  </div>
                </Col>
                <Col sm={12} md={6} lg={3} style={{ margin: '10px 0px' }}>
                  <InputGroup>
                    <InputGroupText>Charges</InputGroupText>
                    <Input
                      className="form-control"
                      name="charges"
                      type="number"
                      value={element.charges || ''}
                      valid={element.charges && !errors[`charges${index}`] ? true : false}
                      invalid={errors[`charges${index}`] ? true : false}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </InputGroup>
                  <div className="text-danger" style={{ marginTop: '5px' }}>
                    {errors[`charges${index}`]}
                  </div>
                </Col>
                <Col sm={12} md={6} lg={3} style={{ margin: '10px 0px' }}>
                  <Button color="danger" outline onClick={(e) => removeFormFields(index, e)}>
                    <Trash2 />
                  </Button>
                </Col>
                {errors[`deliveryCharges${index}`] && (
                  <div className="text-danger" style={{ marginTop: '-10px' }}>
                    {errors[`deliveryCharges${index}`]}
                  </div>
                )}
              </Row>
            ))}
            <Row>
              <Col>
                <Button
                  color="success"
                  outline
                  onMouseEnter={() => setIsHovered((prevState) => !prevState)}
                  onMouseLeave={() => setIsHovered((prevState) => !prevState)}
                  style={{
                    color: isHovered ? 'white' : '#58C67D',
                    backgroundColor: isHovered ? '#58C67D' : 'white',
                  }}
                  onClick={(e) => addFormFields(e)}
                >
                  <PlusCircle />
                </Button>
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

CreateHuntingStoreModal.propTypes = {
  HuntingStore: PropTypes.object.isRequired,
  getStores: PropTypes.func.isRequired,
  addHuntingStore: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  HuntingStore: state.HuntingStore,
})

export default connect(mapStateToProps, {
  getStores,
  addHuntingStore,
  clearError,
})(CreateHuntingStoreModal)
