import React, { useState } from 'react'
import { Button, Row, Col, Card, CardBody } from 'reactstrap'
import { TransitionGroup } from 'react-transition-group'
import DataTable from 'react-data-table-component'
import Loader from '../../layout/Loader'
import { titleCase } from 'title-case'
import { Edit3, Delete, Eye } from 'react-feather'
import EditUserStoreModal from './EditUserStoreModal'
import customStyles from '../../utils/customStyles'
import { getActiveStore } from '../../actions/huntingStoreAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const AssignedStore = ({
  getActiveStore,
  getUserById,
  userId,
  stores = null,
  permissions,
  hunting,
  id,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const tableColumns = [
    {
      name: 'Name',
      center: true,
      selector: (row) => row.hunting_store_assigned && row.hunting_store_assigned.name,
    },
    {
      name: 'Link',
      center: true,
      selector: (row) =>
        row.hunting_store_assigned && (
          <a
            href={row.hunting_store_assigned.link}
            onMouseEnter={() => setIsHovered((prevState) => !prevState)}
            onMouseLeave={() => setIsHovered((prevState) => !prevState)}
            style={{ color: isHovered ? '#5141E0' : '#3399FF' }}
            target="_blank"
          >
            {row.hunting_store_assigned.link}
          </a>
        ),
    },
    {
      name: 'Discount',
      center: true,
      selector: (row) => row.hunting_store_assigned && row.hunting_store_assigned.discount,
    },

    {
      name: 'Added By',
      center: true,
      selector: (row) =>
        row.hunting_store_assigned &&
        `${titleCase(row.user_added_user_assigned_store.first_name)} ${titleCase(
          row.user_added_user_assigned_store.last_name,
        )}`,
    },
    {
      name: 'Updated By',
      center: true,
      selector: (row) =>
        row.user_updated_user_assigned_store &&
        `${titleCase(row.user_updated_user_assigned_store.first_name)} ${titleCase(
          row.user_updated_user_assigned_store.last_name,
        )}`,
    },
  ]

  permissions.create_and_edit_user &&
    permissions.view_store &&
    tableColumns.push({
      name: 'Action',
      // sortable: true,
      center: true,
      cell: (row) => (
        <button
          className="btn update-button"
          style={{ color: '#2CA98D' }}
          onClick={() => editToggle(row.hunting_store_assigned.name)}
        >
          <Edit3 />
        </button>
      ),
    })

  const [assignedOrUpdate, setAssignedOrUpdate] = useState(false)

  const [editModal, setEditModal] = useState(false)
  // true for  update and false for assigned store
  const editToggle = (value) => {
    getActiveStore()
    setAssignedOrUpdate(value)
    setEditModal(!editModal)
  }
  return (
    <Card style={{ marginTop: '24px' }}>
      {editModal && (
        <EditUserStoreModal
          assignedOrUpdate={assignedOrUpdate}
          getUserById={getUserById}
          userId={userId}
          modal={editModal}
          editToggle={editToggle}
          permissions={permissions}
          hunting={hunting}
          id={id}
          //   getStore={getActiveStore}
        />
      )}
      <CardBody>
        <Row>
          <Col xs={7}>
            <h2>Assigned Vendor</h2>
          </Col>
          {!stores && permissions.view_store && permissions.create_and_edit_user ? (
            <Col xs={5}>
              <Button
                className="btn btn-md "
                style={{
                  float: 'right',
                  marginTop: '5px',
                }}
                //   disabled={!permissions.create_and_edit_store}
                color="primary"
                onClick={() => editToggle(false)}
              >
                Assign Vendor
              </Button>
            </Col>
          ) : (
            <Col xs={5}></Col>
          )}
          <Col xs={12}>
            <hr />
          </Col>
          <Col xs={12}>
            <DataTable
              data={stores ? [stores] : []}
              columns={tableColumns}
              striped={true}
              center={true}
              responsive={true}
              sortable={true}
              //   selectableRows
              persistTableHead
              noHeader={true}
              pagination={true}
              title="Google Sheets-esque"
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
AssignedStore.propTypes = {
  getActiveStore: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {
  getActiveStore,
})(AssignedStore)
