import React, { Fragment, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  getStores,
  clearHuntingStores,
  clearError,
  clearMessage,
} from '../../actions/huntingStoreAction'
import moment from 'moment'
import { Eye, CheckCircle, XCircle } from 'react-feather'
import { titleCase } from 'title-case'
import { useNavigate } from 'react-router-dom'
import customStyles from '../../utils/customStyles'
const HuntingStoreList = ({
  HuntingStore: { huntingStores, error, message },
  getStores,
  clearHuntingStores,
  clearError,
  clearMessage,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  useEffect(() => {
    if (!error) getStores()

    if (message !== null) {
      setTimeout(() => {
        toast.success(message)
      }, 200)

      clearMessage()
    }

    if (error !== 'Internal Server Error' && error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
    }

    //eslint-disable-next-line
  }, [error, message])

  useEffect(() => {
    return () => {
      clearError()
      // clearHuntingStores()
    }
    //eslint-disable-next-line
  }, [])

  const tableColumns = [
    {
      name: 'Date',
      center: true,
      selector: (row) => moment(row.createdAt).format('YYYY-MM-DD'),
    },
    {
      name: 'Name',
      center: true,
      selector: (row) => row.name,
    },
    {
      name: 'Link',
      center: true,
      selector: (row) => (
        <a
          href={row.link}
          onMouseEnter={() => setIsHovered((prevState) => !prevState)}
          onMouseLeave={() => setIsHovered((prevState) => !prevState)}
          style={{ color: isHovered ? '#5141E0' : '#3399FF' }}
          target="_blank"
        >
          {row.link}
        </a>
      ),
    },
    {
      name: 'Discount',
      center: true,
      selector: (row) => row.discount,
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
        row.user_added_hunting_store
          ? titleCase(
              row.user_added_hunting_store.first_name +
                ' ' +
                row.user_added_hunting_store.last_name,
            )
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
    redirectToDisplay(`/vendor/vendordetails/:${row.id}`)
  }
  return (
    <Fragment>
      <DataTable
        data={huntingStores ? huntingStores : []}
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

HuntingStoreList.propTypes = {
  HuntingStore: PropTypes.object.isRequired,
  getStores: PropTypes.func.isRequired,
  clearHuntingStores: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  HuntingStore: state.HuntingStore,
})

export default connect(mapStateToProps, {
  getStores,
  clearHuntingStores,
  clearError,
  clearMessage,
})(HuntingStoreList)
