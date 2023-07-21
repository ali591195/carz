import React, { useEffect } from 'react'
import { Row, Col, Card, CardBody } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { titleCase } from 'title-case'
import { Trash2 } from 'react-feather'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { deleteAssignStore, getHuntingStoreById } from '../../actions/huntingStoreAction'
import customStyles from '../../utils/customStyles'
const AssignedUser = ({
  HuntingStore: { message },
  users = null,
  permissions,
  id,
  deleteAssignStore,
  getHuntingStoreById,
}) => {
  useEffect(() => {
    if (message !== null) {
      getHuntingStoreById(id)
    }
    // eslint-disable-next-line
  }, [message])

  const tableColumns = [
    {
      name: 'Vendor Assigned To',
      center: true,
      reorder: true,
      selector: (row) =>
        `${titleCase(row.store_assigned_to_user.first_name)} ${titleCase(
          row.store_assigned_to_user.last_name,
        )}`,
    },
    {
      name: 'Assigned By',
      center: true,
      reorder: true,
      selector: (row) =>
        row.user_added_user_assigned_store &&
        `${titleCase(row.user_added_user_assigned_store.first_name)} ${titleCase(
          row.user_added_user_assigned_store.last_name,
        )}`,
    },
    {
      name: 'Updated By',
      center: true,
      reorder: true,
      selector: (row) =>
        row.user_updated_user_assigned_store &&
        `${titleCase(row.user_updated_user_assigned_store.first_name)} ${titleCase(
          row.user_updated_user_assigned_store.last_name,
        )}`,
    },
  ]

  permissions.create_and_edit_store &&
    tableColumns.push({
      name: 'Action',
      center: true,
      cell: (row) => (
        <button
          className="btn update-button"
          style={{ color: '#ff3d3d' }}
          onClick={() => deleteAssignStore(row.id)}
        >
          <Trash2 />
        </button>
      ),
    })

  return (
    <Card style={{ marginTop: '24px' }}>
      <CardBody>
        <Row>
          <Col xs={12}>
            <h2>Assigned User</h2>
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
          <Col xs={12}>
            {users && (
              <DataTable
                data={users}
                columns={tableColumns}
                // title="Desserts"
                // onColumnOrderChange={(cols) => console.log(cols)}
                // striped={true}
                center={true}
                responsive={true}
                sortable={true}
                //   selectableRows
                persistTableHead
                noHeader={true}
                pagination={true}
                title="Assigned User"
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
              />
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

AssignedUser.propTypes = {
  HuntingStore: PropTypes.object.isRequired,
  deleteAssignStore: PropTypes.func.isRequired,
  getHuntingStoreById: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  HuntingStore: state.HuntingStore,
})

export default connect(mapStateToProps, {
  deleteAssignStore,
  getHuntingStoreById,
})(AssignedUser)
