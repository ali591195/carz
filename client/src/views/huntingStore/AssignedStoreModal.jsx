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
import { clearError, clearMessage } from '../../actions/huntingStoreAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { getActiveUsersWithoutStore } from '../../actions/userAction'
import { assignStore } from '../../actions/huntingStoreAction'

const AssignedStoreModal = ({
  User: { usersWithoutStore },
  HuntingStore: { message, error },
  modal,
  toggle,
  StoreDetails,
  getStoreById,
  getActiveUsersWithoutStore,
  assignStore,
  clearError,
  clearMessage,
}) => {
  const [id, setId] = useState(StoreDetails.id),
    [assignUser, setAssignUser] = useState(null),
    [errors, setErrors] = useState('')

  useEffect(() => {
    getActiveUsersWithoutStore()
    if (error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
      clearError()
    }
    if (message !== null) {
      getStoreById && getStoreById(id)
      //clear fileds
      setAssignUser('')
      setId('')
      toggle()

      clearMessage()
    }
    // eslint-disable-next-line
  }, [message, error])

  const validate = () => {
    let errors = {}
    let isValid = true

    if (assignUser === null) {
      isValid = false
      errors['assignUser'] = 'Please select a user.'
    }

    setErrors(errors)

    return isValid
  }

  const onAssigned = (e) => {
    e.preventDefault()

    if (validate()) {
      const storeData = {
        assigned_store: id,
        assigned_user: assignUser.id,
      }
      assignStore(storeData)
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
        size="md"
        fade={true}
        centered={true}
        //   scrollable={true}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          Assigned Vendor
        </ModalHeader>
        <Form onSubmit={onAssigned}>
          <ModalBody>
            <Row>
              <Col sm={12} md={12}>
                <FormGroup>
                  <Label htmlFor="Name">
                    User <span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isLoading={!usersWithoutStore}
                    isClearable={true}
                    isSearchable={true}
                    name="color"
                    options={
                      usersWithoutStore &&
                      usersWithoutStore.map((user) => ({
                        ...user,
                        label: `${user.first_name} ${user.last_name}`,
                        value: `${user.first_name} ${user.last_name}`,
                      }))
                    }
                    onChange={(opt) => setAssignUser(opt)}
                  />
                  <div className="text-danger">{errors.assignUser}</div>
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
              Assign
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

AssignedStoreModal.propTypes = {
  User: PropTypes.object.isRequired,
  HuntingStore: PropTypes.object.isRequired,
  getActiveUsersWithoutStore: PropTypes.func.isRequired,
  assignStore: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  User: state.User,
  HuntingStore: state.HuntingStore,
})

export default connect(mapStateToProps, {
  getActiveUsersWithoutStore,
  assignStore,
  clearError,
  clearMessage,
})(AssignedStoreModal)
