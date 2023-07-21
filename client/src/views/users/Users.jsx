import React, { Fragment, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Eye, CheckCircle, XCircle } from 'react-feather'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getUsersList, clearError } from '../../actions/userAction'
import moment from 'moment'
import { titleCase } from 'title-case'
import { useNavigate } from 'react-router-dom'
import customStyles from '../../utils/customStyles'
const Users = ({ User: { users, error }, getUsersList, clearError }) => {
  useEffect(() => {
    if (!error) getUsersList()

    if (error !== 'Internal Server Error') {
      setTimeout(() => {
        toast.error(error)
      }, 200)
    }
    //eslint-disable-next-line
  }, [error])

  useEffect(() => {
    return () => {
      clearError()
    }
    //eslint-disable-next-line
  }, [])

  const tableColumns = [
    {
      name: 'Joined Date',
      center: true,
      selector: (row) => moment(row.joined_at).format('YYYY-MM-DD'),
    },
    {
      name: 'User Name',
      selector: (row) => titleCase(row.first_name + ' ' + row.last_name),
      center: true,
    },

    {
      name: 'Email',
      selector: (row) => row.email,
      center: true,
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phone_number,
      center: true,
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
    {
      name: 'Added By',
      selector: (row) =>
        row.added_by_user
          ? titleCase(row.added_by_user.first_name + ' ' + row.added_by_user.last_name)
          : '',
      center: true,
    },

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
    redirectToDisplay(`/users/userdetails/:${row.id}`)
  }

  return (
    <Fragment>
      <ToastContainer />
      <DataTable
        data={users ? users : []}
        columns={tableColumns}
        striped={true}
        center={true}
        responsive={true}
        sortable={true}
        persistTableHead
        noHeader={true}
        pagination={true}
        title="Google Sheets-esque"
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
      />
    </Fragment>
  )
}

Users.propTypes = {
  User: PropTypes.object.isRequired,
  getUsersList: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  User: state.User,
})

export default connect(mapStateToProps, {
  getUsersList,
  clearError,
})(Users)
