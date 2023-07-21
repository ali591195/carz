import React, { Fragment, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getMarketPlaces, clearError, clearMessage } from '../../actions/marketPlaceAction'
import moment from 'moment'
import { Eye, CheckCircle, XCircle } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import customStyles from '../../utils/customStyles'

const MarketPlaceList = ({
  Marketplace: { marketplaces, error, message },
  getMarketPlaces,
  clearError,
  clearMessage,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  useEffect(() => {
    if (!error) getMarketPlaces()

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
      // clearmarketplaces()
    }
    //eslint-disable-next-line
  }, [])

  //   added_by
  //   createdAt
  //   deletedAt
  //   updatedAt
  //   updated_by
  //   user_added_marketplace

  const tableColumns = [
    // {
    //   name: 'Date',
    //   center: true,
    //   selector: (row) => moment(row.createdAt).format('YYYY-MM-DD'),
    // },
    {
      name: 'Marketplace ID',
      center: true,
      selector: (row) => row.marketplace_id,
    },
    {
      name: 'Country',
      center: true,
      selector: (row) => row.country,
    },
    {
      name: 'Country Code',
      center: true,
      selector: (row) => row.country_code,
    },
    {
      name: 'Currency',
      center: true,
      selector: (row) => row.currency,
    },
    {
      name: 'Symbol',
      center: true,
      selector: (row) => row.symbol,
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
    redirectToDisplay(`/marketplace/marketplacedetails/:${row.id}`)
  }
  return (
    <Fragment>
      <DataTable
        data={marketplaces ? marketplaces : []}
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

MarketPlaceList.propTypes = {
  Marketplace: PropTypes.object.isRequired,
  getMarketPlaces: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Marketplace: state.Marketplace,
})

export default connect(mapStateToProps, {
  getMarketPlaces,

  clearError,
  clearMessage,
})(MarketPlaceList)
