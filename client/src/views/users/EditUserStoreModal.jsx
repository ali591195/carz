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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { X } from 'react-feather'
import {
  updateUserAssignedStore,
  assignedStoreToUser,
  clearError,
  clearMessage,
} from '../../actions/userAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { getActiveStore } from '../../actions/huntingStoreAction'
import CreateHuntingStoreModal from '../huntingStore/CreateHuntingStoreModal'

const EditUserStoreModal = ({
  HuntingStore: { huntingStores },
  User: { error, message },
  getUserById,
  userId,
  id,
  assignedOrUpdate,
  modal,
  editToggle,
  permissions,
  hunting,
  getActiveStore,
  assignedStoreToUser,
  updateUserAssignedStore,
  clearError,
  clearMessage,
}) => {
  const [assignStore, setAssignStore] = useState(null),
    [errors, setErrors] = useState('')

  useEffect(() => {
    if (huntingStores && assignedOrUpdate) {
      const i = huntingStores.findIndex((store) => store.name === assignedOrUpdate)
      setAssignStore({
        ...huntingStores[i],
        label: huntingStores[i].name,
        value: huntingStores[i].name,
      })
    }
    if (error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
      clearError()
    }
    if (message !== null) {
      setAssignStore(null)
      getUserById(userId)
      editToggle()

      // editToggle()

      clearMessage()
    }
    // eslint-disable-next-line
  }, [message, error, huntingStores])

  const validate = () => {
    let errors = {}
    let isValid = true

    if (assignStore === '' || assignStore === null) {
      isValid = false
      errors['assignStore'] = 'Select Store.'
    }

    setErrors(errors)

    return isValid
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      const storeData = {
        assigned_store: assignStore.id,
        assigned_user: id,
      }
      assignedOrUpdate ? updateUserAssignedStore(storeData) : assignedStoreToUser(storeData)

      //clear fileds
    } else {
      setTimeout(() => {
        toast.error('Error occurs while adding Store.')
      }, 200)
    }
  }

  const closeBtn = (
    <Button color="danger" outline onClick={editToggle}>
      <X style={{ width: 16, height: 16 }} />
    </Button>
  )
  const [createModal, setCreateModal] = useState(false)

  const createToggle = () => {
    setCreateModal(!createModal)
  }

  return (
    <div>
      {createModal && (
        <CreateHuntingStoreModal
          modal={createModal}
          toggle={createToggle}
          getStore={getActiveStore}
        />
      )}
      <Modal isOpen={modal} toggle={editToggle} size="md" fade={true} centered={true}>
        <ModalHeader toggle={editToggle} close={closeBtn}>
          {assignedOrUpdate ? 'Update Vendor' : 'Assigned Vendor'}
        </ModalHeader>
        <Form onSubmit={onSubmit}>
          <ModalBody>
            <FormGroup>
              <Row>
                <Col md={8} xs={12}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    value={assignStore}
                    isDisabled={!hunting || !permissions.view_store}
                    isLoading={permissions.view_store && huntingStores == !null ? true : false}
                    isClearable={true}
                    // isRtl={isRtl}
                    isSearchable={true}
                    name="color"
                    options={
                      huntingStores &&
                      huntingStores.map((store) => ({
                        ...store,
                        label: store.name,
                        value: store.name,
                      }))
                    }
                    onChange={(opt) => setAssignStore(opt)}
                  />
                  <div className="text-danger">{errors.assignStore}</div>
                </Col>
                <Col md={4} xs={12}>
                  <Button
                    className="btn btn-sm "
                    style={{
                      float: 'right',
                      marginTop: '5px',
                    }}
                    disabled={!permissions.create_and_edit_store}
                    color="primary"
                    onClick={() => createToggle()}
                  >
                    Create Vendor
                  </Button>
                </Col>
              </Row>
            </FormGroup>
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
            <Button color="secondary" className="btn btn-sm" onClick={editToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

EditUserStoreModal.propTypes = {
  HuntingStore: PropTypes.object.isRequired,
  User: PropTypes.object.isRequired,
  assignedStoreToUser: PropTypes.func.isRequired,
  updateUserAssignedStore: PropTypes.func.isRequired,
  getActiveStore: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  User: state.User,
  HuntingStore: state.HuntingStore,
})

export default connect(mapStateToProps, {
  assignedStoreToUser,
  updateUserAssignedStore,
  getActiveStore,
  clearError,
  clearMessage,
})(EditUserStoreModal)
