/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useEffect, useState } from 'react'

import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'

import { X } from 'react-feather'

const AddSellerIDModal = ({ modal, toggle, data }) => {
  const [sellerOrderId, setSellerOrderId] = useState('')
  //   useEffect(() => {
  // if (data) {
  //   setAmount(data.amount)
  //   setPercentage(data.percentage)
  //   setFineAmount(data.fineAmount)
  //   setFineType(data.fineType)
  //   setSelectedFeeGroup(data.selectedFeeGroup)
  //   setSelectedFeeType(data.selectedFeeType)
  // }

  // eslint-disable-next-line
  //   }, [])

  //   const onFeeGroupChange = (feeGroup) => {
  //     setSelectedFeeGroup(feeGroup)
  //   }
  //   const onFeeTypeChange = (feeType) => {
  //     setSelectedFeeType(feeType)
  //   }
  const [errors, setErrors] = useState('')

  const validate = () => {
    let errors = {}
    let isValid = true

    if (sellerOrderId === '') {
      isValid = false
      errors['sellerOrderId'] = 'Please add Seller-Order-ID.'
    }

    setErrors(errors)

    return isValid
  }

  const onUpdate = (e) => {
    e.preventDefault()

    if (validate()) {
    }
  }

  const closeBtn = (
    <Button color="danger" outline onClick={toggle}>
      <X style={{ width: 16, height: 16 }} />
    </Button>
  )

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="md">
        <ModalHeader toggle={toggle} close={closeBtn}>
          Add Seller Order ID
        </ModalHeader>
        <Form onSubmit={onUpdate}>
          <ModalBody>
            <Row>
              <Col sm={12} md={12}>
                <FormGroup>
                  <Input
                    name="amount"
                    type="text"
                    className="form-control digits"
                    placeholder="Enter Seller Order Id"
                    value={sellerOrderId && sellerOrderId}
                    onChange={(e) => setSellerOrderId(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.sellerOrderId}</div>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn btn-sm float-right  btn-air-primary"
              color="primary"
              type="submit"
            >
              Add
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

export default AddSellerIDModal
