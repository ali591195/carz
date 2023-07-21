import React, { useState } from 'react'
import { Row, Col, Card, CardBody, Button } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { titleCase } from 'title-case'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import customStyles from '../../utils/customStyles'
import CreateCategoryModal from './CreateCategoryModal'
import { getCategoryById } from '../../actions/categoryAction'
const ChildCategoryList = ({ Auth: { permissions }, childCategories, id, getCategoryById }) => {
  const tableColumns = [
    {
      name: 'Name',
      center: true,
      selector: (row) => row.name,
    },
    {
      name: 'Added By',
      center: true,
      selector: (row) =>
        row.user_added_categorys
          ? `${titleCase(row.user_added_categorys.first_name)} ${titleCase(
              row.user_added_categorys.last_name,
            )}`
          : '',
    },
  ]

  const [createModal, setCreateModal] = useState(false)
  const [showSelect, setShowSelect] = useState(false)

  const createToggle = () => {
    setCreateModal(!createModal)
  }

  return (
    <Card style={{ marginTop: '24px' }}>
      {createModal && (
        <CreateCategoryModal
          modal={createModal}
          toggle={createToggle}
          showSelect={showSelect}
          getCategoryById={getCategoryById}
          id={id}
        />
      )}
      <CardBody>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h2>Child Categorys</h2>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            {permissions.create_and_edit_category && (
              <Button
                type="submit"
                className="btn btn-md"
                style={{ float: 'right' }}
                color="primary"
                onClick={() => {
                  setShowSelect(false)
                  createToggle()
                }}
              >
                Create
              </Button>
            )}
          </Col>

          <Col xs={12}>
            <hr />
          </Col>
          <Col xs={12}>
            {childCategories && (
              <DataTable
                data={childCategories || []}
                columns={tableColumns}
                center={true}
                responsive={true}
                sortable={true}
                persistTableHead
                noHeader={true}
                pagination={true}
                title="Child Category"
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

ChildCategoryList.propTypes = {
  Auth: PropTypes.object.isRequired,
  getCategoryById: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Auth: state.Auth,
})

export default connect(mapStateToProps, { getCategoryById })(ChildCategoryList)
