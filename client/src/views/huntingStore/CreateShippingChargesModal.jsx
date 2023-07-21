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
  Input,
  InputGroup,
  InputGroupText,
} from 'reactstrap'
import { Trash2, X, PlusCircle } from 'react-feather'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { clearError, clearMessage, addShippingCharges } from '../../actions/shippingChargesAction'
import { getHuntingStoreById } from '../../actions/huntingStoreAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const UpdateShippingChargesModal = ({
  ShippingCharges: { message, error },
  addShippingCharges,
  modal,
  toggle,
  id,
  getHuntingStoreById,
  clearError,
  clearMessage,
}) => {
  const [deliveryCharges, setDeliveryCharges] = useState([]),
    [errors, setErrors] = useState(''),
    [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
    }
    if (message !== null) {
      setTimeout(() => {
        toast.success(message)
      }, 200)

      getHuntingStoreById(id)
      setDeliveryCharges([])
      toggle()
      clearMessage()
    }

    // eslint-disable-next-line
  }, [message, error])

  useEffect(() => {
    return () => {
      clearError()
    }
    //eslint-disable-next-line
  }, [])

  const validate = () => {
    let errors = {}
    let isValid = true

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

  const handleChange = (i, e) => {
    e.preventDefault()
    let newFormValues = [...deliveryCharges]
    newFormValues[i][e.target.name] = e.target.value
    setDeliveryCharges(newFormValues)
  }

  const addFormFields = (e) => {
    e.preventDefault()
    setDeliveryCharges([...deliveryCharges, { to: null, from: null, charges: null }])
  }

  const removeFormFields = (i, e) => {
    e.preventDefault()
    let newFormValues = [...deliveryCharges]
    newFormValues.splice(i, 1)
    if (i !== 0) newFormValues[i - 1]['from'] = null
    setDeliveryCharges(newFormValues)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // JSON.stringify(deliveryCharges)
    if (validate()) {
      const storeData = {
        store_id: id,
        shipping_charges: deliveryCharges,
      }

      addShippingCharges(storeData)
    } else {
      setTimeout(() => {
        toast.error('Error occurs while adding Vendor.')
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
        //   scrollable={true}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          Create Shipping Charges
        </ModalHeader>
        <Form onSubmit={onSubmit}>
          <ModalBody>
            <Row>
              <Col sm={12} md={12}>
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
                            element.to &&
                            (!errors[`to${index}`] || !errors[`deliveryCharges${index}`])
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
                            errors[`from${index}`] || errors[`deliveryCharges${index}`]
                              ? true
                              : false
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

UpdateShippingChargesModal.propTypes = {
  ShippingCharges: PropTypes.object.isRequired,
  addShippingCharges: PropTypes.func.isRequired,
  getHuntingStoreById: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({ ShippingCharges: state.ShippingCharges })

export default connect(mapStateToProps, {
  addShippingCharges,
  getHuntingStoreById,
  clearError,
  clearMessage,
})(UpdateShippingChargesModal)
