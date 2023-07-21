import React, { Fragment, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { Eye, CheckCircle, XCircle } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import customStyles from '../../utils/customStyles'
import { titleCase } from 'title-case'

const CategoryList = ({ Category: { categorys } }) => {
  const [isHovered, setIsHovered] = useState(false)

  //   added_by
  //   createdAt
  //   deletedAt
  //   updatedAt
  //   updated_by
  //   user_added_marketplace

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

    {
      name: 'Active',
      center: true,
      cell: (row) => (
        <div>
          {row.active ? (
            <CheckCircle size={20} color="#535659" />
          ) : (
            <XCircle size={20} color="red" />
          )}
        </div>
      ),
    },
    // {
    //   name: 'Added By',
    //   selector: (row) =>
    //     row.user_added_hunting_store
    //       ? titleCase(
    //           row.user_added_hunting_store.first_name +
    //             ' ' +
    //             row.user_added_hunting_store.last_name,
    //         )
    //       : '',
    //   center: true,
    // },

    {
      name: 'Action',
      center: true,
      cell: (row) => (
        <div>
          <button
            className="btn view-button"
            style={{ color: '#2CA98D' }}
            onClick={() => viewToggle(row)}
          >
            <Eye />
          </button>
        </div>
      ),
    },
  ]
  const navigate = useNavigate()

  const redirectToDisplay = (redirect) => {
    navigate(redirect)
  }

  const viewToggle = (row) => {
    redirectToDisplay(`/category/categorydetails/:${row.id}`)
  }
  return (
    <Fragment>
      <DataTable
        data={categorys ? categorys : []}
        columns={tableColumns}
        striped={true}
        center={true}
        responsive={true}
        sortable={true}
        persistTableHead
        noHeader={true}
        pagination={true}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
      />
    </Fragment>
  )
}

CategoryList.propTypes = {
  Category: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  Category: state.Category,
})

export default connect(mapStateToProps, {})(CategoryList)
