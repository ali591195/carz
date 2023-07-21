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
import { X } from 'react-feather'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addCategory, clearError } from '../../actions/categoryAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'

const CreateCategoryModal = ({
  Category: { activeCategorys, error, message },
  modal,
  toggle,
  showSelect,
  getCategoryById = null,
  id = null,
  addCategory,
  clearError,
}) => {
  const [name, setName] = useState(''),
    [parentCategory, setParentCategory] = useState(null),
    [errors, setErrors] = useState('')

  useEffect(() => {
    if (error !== null) {
      clearError()
    }
    if (message !== null) {
      // it only run when we are creating category from parent display details page
      getCategoryById && getCategoryById(id)
      //clear fileds
      setName('')
      setParentCategory(null)
      toggle()
    }
    // eslint-disable-next-line
  }, [message, error])

  const validate = () => {
    let errors = {}
    let isValid = true

    if (name === '') {
      isValid = false
      errors['name'] = 'Please enter Name of the Category.'
    }
    if (name !== '') {
      if (name.length < 3) {
        isValid = false
        errors['name'] = 'The name must be 3 characters in length.'
      }
    }

    if (showSelect && parentCategory === null) {
      isValid = false
      errors['parentCategory'] = 'Please select a Category.'
    }

    setErrors(errors)

    return isValid
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // JSON.stringify(deliveryCharges)
    if (validate()) {
      const categoryData = {
        name: name,
        parent_category: showSelect ? parentCategory && parentCategory.id : id,
      }
      addCategory(categoryData)
    } else {
      setTimeout(() => {
        toast.error('Error occurs while adding Category.')
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
        size="md"
        fade={true}
        centered={true}
        // scrollable={true}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          Create {showSelect || id ? 'Sub' : 'Main'} Category
        </ModalHeader>
        <Form onSubmit={onSubmit}>
          <ModalBody>
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <Label htmlFor="name">
                    Name<span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    className="form-control"
                    type="text"
                    name="name"
                    value={name ? name : ''}
                    placeholder="Enter Name."
                    valid={name && !errors.name ? true : false}
                    invalid={errors.name ? true : false}
                    onChange={(e) => setName(e.target.value)}
                  ></Input>
                  <div className="text-danger">{errors.name}</div>
                </FormGroup>
              </Col>
              {showSelect && (
                <Col sm={12}>
                  <FormGroup>
                    <Label htmlFor="parentCategory">
                      Parent Category<span style={{ color: 'red' }}>*</span>{' '}
                    </Label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      value={parentCategory}
                      isLoading={activeCategorys == !null ? true : false}
                      isClearable={true}
                      isSearchable={true}
                      name="color"
                      options={
                        activeCategorys &&
                        activeCategorys.map((category) => ({
                          ...category,
                          label: category.name,
                          value: category.name,
                        }))
                      }
                      onChange={(opt) => setParentCategory(opt)}
                    />
                    <div className="text-danger">{errors.parentCategory}</div>
                  </FormGroup>
                </Col>
              )}
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

CreateCategoryModal.propTypes = {
  Category: PropTypes.object.isRequired,
  addCategory: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Category: state.Category,
})

export default connect(mapStateToProps, {
  addCategory,
  clearError,
})(CreateCategoryModal)
