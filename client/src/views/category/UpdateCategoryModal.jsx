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
import { updateCategory, clearError, clearMessage } from '../../actions/categoryAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { X } from 'react-feather'
import Select from 'react-select'

const UpdateCategoryModal = ({
  Category: { activeCategorys, error, message },
  modal,
  toggle,
  showSelect,
  categoryDetails,
  getCategoryById,
  updateCategory,
  clearError,
  clearMessage,
}) => {
  // parentId: category.parent_category,
  // parentCategoryName: category.parent_categorys.name,
  const [name, setName] = useState(categoryDetails.name),
    [parentCategory, setParentCategory] = useState(null),
    [parentCategoryName, setParentCategoryName] = useState(categoryDetails.parentCategoryName),
    [id, setId] = useState(categoryDetails.id),
    [errors, setErrors] = useState('')

  useEffect(() => {
    if (activeCategorys && parentCategoryName) {
      const i = activeCategorys.findIndex((category) => category.name === parentCategoryName)
      setParentCategory({
        ...activeCategorys[i],
        label: activeCategorys[i].name,
        value: activeCategorys[i].name,
      })
    }
    if (error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
      clearError()
    }
    if (message !== null) {
      getCategoryById && getCategoryById(id)
      //clear fileds
      setName('')
      setParentCategory(null)
      setId('')
      toggle()

      clearMessage()
    }
    // eslint-disable-next-line
  }, [message, error, activeCategorys])

  const validate = () => {
    let errors = {}
    let isValid = true

    if (name === '') {
      isValid = false
      errors['name'] = 'Please enter Name of the Category.'
    }
    setErrors(errors)

    return isValid
  }

  const onUpdate = (e) => {
    e.preventDefault()

    if (validate()) {
      const categoryData = {
        name: name,
        parent_category: showSelect ? parentCategory && parentCategory.id : null,
      }
      updateCategory(categoryData, id)
    } else {
      setTimeout(() => {
        toast.error('Error occurs while Updating Category.')
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
        scrollable={false}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          Update {showSelect || id ? 'Sub' : 'Main'} Category
        </ModalHeader>
        <Form onSubmit={onUpdate}>
          <ModalBody>
            {' '}
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

UpdateCategoryModal.propTypes = {
  Category: PropTypes.object.isRequired,
  updateCategory: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Category: state.Category,
})

export default connect(mapStateToProps, {
  updateCategory,
  clearError,
  clearMessage,
})(UpdateCategoryModal)
