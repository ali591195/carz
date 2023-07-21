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
} from 'reactstrap'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { updateHuntingStore, clearError, clearMessage } from '../../actions/huntingStoreAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { X } from 'react-feather'
const UpdateHuntingStoreModal = ({
  HuntingStore: { error, message },
  modal,
  toggle,
  StoreDetails,
  getStoreById,
  updateHuntingStore,

  clearError,
  clearMessage,
}) => {
  const [name, setName] = useState(StoreDetails.name),
    [id, setId] = useState(StoreDetails.id),
    [discount, setDiscount] = useState(StoreDetails.discount),
    [storeLink, setStoreLink] = useState(StoreDetails.storeLink),
    [errors, setErrors] = useState('')

  useEffect(() => {
    if (error !== null) {
      clearError()
    }
    if (message !== null) {
      getStoreById && getStoreById(id)
      //clear fileds
      setName('')
      setDiscount(0)
      setStoreLink('')
      toggle()

      clearMessage()
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
      errors['storeLink'] = 'Please enter your storeLink.'
    }

    setErrors(errors)

    return isValid
  }

  const onUpdate = (e) => {
    e.preventDefault()

    if (validate()) {
      const storeData = {
        name,
        link: storeLink,
        discount,
      }

      updateHuntingStore(storeData, id)
    } else {
      setTimeout(() => {
        toast.error('Error occurs while Updating Store.')
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
      <Modal isOpen={modal} toggle={toggle} size="xl" fade={true} centered={true} scrollable={true}>
        <ModalHeader toggle={toggle} close={closeBtn}>
          Update Vendor
        </ModalHeader>
        <Form onSubmit={onUpdate}>
          <ModalBody>
            <Row>
              <Col sm={12} md={6}>
                <FormGroup>
                  <Label htmlFor="Name">
                    Name <span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="firstName"
                    value={name ? name : ''}
                    placeholder="Enter name"
                    valid={name && !errors.name ? true : false}
                    invalid={errors.name ? true : false}
                    onChange={(e) => setName(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.name}</div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6}>
                <FormGroup>
                  <Label htmlFor="discount">
                    Discount <span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="number"
                    name="discount"
                    value={discount ? discount : ''}
                    placeholder="discount"
                    invalid={errors.discount ? true : false}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                  <div className="text-danger">{errors.discount}</div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6}>
                <FormGroup>
                  <Label htmlFor="storeLink">
                    Link <span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="storeLink"
                    value={storeLink ? storeLink : ''}
                    placeholder="Enter storeLink"
                    valid={storeLink && !errors.storeLink ? true : false}
                    invalid={errors.storeLink ? true : false}
                    onChange={(e) => setStoreLink(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.storeLink}</div>
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
              Update
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

UpdateHuntingStoreModal.propTypes = {
  HuntingStore: PropTypes.object.isRequired,
  updateHuntingStore: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  HuntingStore: state.HuntingStore,
})

export default connect(mapStateToProps, {
  updateHuntingStore,
  clearError,
  clearMessage,
})(UpdateHuntingStoreModal)
