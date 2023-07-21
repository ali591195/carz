import React, { Fragment, useState, useEffect } from 'react'
import { TransitionGroup } from 'react-transition-group'
import DataTable from 'react-data-table-component'
import { Edit3, Trash, Eye } from 'react-feather'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  getHuntingList,
  //   deleteBlog,
  clearError,
  clearMessage,
} from '../../actions/huntingAction'
// import EditBlogModal from './EditBlogModal'
import ViewHuntingModal from './ViewHuntingModal'
import Loader from '../../layout/Loader'
import moment from 'moment'
import customStyles from '../../utils/customStyles'
const Huntings = ({
  Hunting: { huntings, filtered, loading, error, message },
  getHuntingList,
  //   deleteBlog,
  clearError,
  clearMessage,
}) => {
  useEffect(() => {
    getHuntingList()
    if (message) {
      setTimeout(() => {
        toast.success(message)
      }, 200)
      clearMessage()
    }
    if (error !== 'Internal Server Error') {
      setTimeout(() => {
        toast.error(error)
      }, 200)

      clearError()
    }
    //eslint-disable-next-line
  }, [error, message])

  const tableColumns = [
    // {
    //   name: 'Image',
    //   selector: 'image',
    //   center: true,
    //   cell: (huntings) => {
    //     return (
    //       <img
    //         className="image css-img-object"
    //         src={huntings.image}
    //         alt="Hunter"
    //         style={{
    //           width: '30px',
    //           height: '30px',
    //           borderRadius: '50%',
    //         }}
    //       />
    //     )
    //   },
    // },

    // {
    //   name: 'ID',
    //   selector: (row) => row.id,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'ASIN',
    //   selector: (row) => row.asin,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Source_SKU',
    //   selector: (row) => row.source_sku,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'Amazon_Link',
    //   selector: (row) => row.amazon_link,
    //   sortable: true,
    //   center: true,
    // },

    // {
    //   name: 'Source_Link',
    //   selector: (row) => row.source_link,
    //   sortable: true,
    //   center: true,
    // },

    // {
    //   name: 'Variant_Type',
    //   selector: (row) => row.variant_type,
    //   sortable: true,
    //   center: true,
    // },

    // {
    //   name: 'Units',
    //   selector: (row) => row.units,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   cell: () => <Icon style={{ fill: '#43a047' }} />,
    //   width: '56px', // custom width for icon button
    //   style: {
    //     borderBottom: '1px solid #FFFFFF',
    //     marginBottom: '-1px',
    //   },
    // },
    {
      name: 'Date',
      // sortable: true,
      center: true,
      selector: (row) => moment(row.created_on).format('YYYY-MM-DD'),
    },
    {
      name: 'User',
      center: true,
      // selector: (row) => moment(row.created_on).format('YYYY-MM-DD'),
    },

    {
      name: 'BSR',
      selector: (row) => row.bsr,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => 'Pending',
      center: true,
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      center: true,
    },

    {
      name: 'Amazon_Price',
      selector: (row) => row.amazon_price,
      center: true,
    },

    {
      name: 'Source_Price',
      selector: (row) => row.source_price,
      center: true,
    },

    {
      name: 'Profit',
      selector: (row) => row.profit,
      center: true,
    },
    {
      name: 'Action',
      center: true,
      // width: '300px',
      cell: (row) => (
        <div>
          <button
            className="btn view-button"
            style={{ color: '#2CA98D' }}
            onClick={() => viewToggle(row)}
          >
            <Eye />
          </button>

          {/* <button className="btn update-button" onClick={() => updateToggle(row)}> */}
          {/* <Edit3 /> */}
          {/* </button> */}
          {/* 
          <button className="btn delete-button" onClick={() => deleteBlog(row.id)}>
            <Trash />
          </button> */}
        </div>
      ),
    },

    // {
    //   name: 'Currency',
    //   selector: (row) => row.currency,
    //   sortable: true,
    //   center: true,
    // },

    // {
    //   name: 'After_10%',
    //   selector: (row) => row.after_discount,
    //   sortable: true,
    //   center: true,
    // },

    // {
    //   name: 'Delivery_Charges',
    //   selector: (row) => row.delivery_charges,
    //   sortable: true,
    //   center: true,
    // },

    // {
    //   name: 'Refer_Fee',
    //   selector: (row) => row.refer_fee,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'VAT',
    //   selector: (row) => row.vat,
    //   sortable: true,
    //   center: true,
    // },

    // {
    //   name: 'Margin%',
    //   selector: (row) => row.margin,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: 'ROI%',
    //   selector: (row) => row.roi,
    //   sortable: true,
    //   center: true,
    // },
  ]

  //   const [updateModal, setUpdateModal] = useState(false)

  //   const updateToggle = (row) => {
  //     setUpdateModal(!updateModal)
  //     setData(row)
  //   }

  const [data, setData] = useState(null)
  const [viewModal, setViewModal] = useState(false)
  const viewToggle = (row) => {
    setViewModal(!viewModal)
    setData(row)
  }

  return (
    <Fragment>
      {/* {updateModal && <EditBlogModal modal={updateModal} toggle={updateToggle} data={data} />} */}
      {viewModal && <ViewHuntingModal modal={viewModal} toggle={viewToggle} data={data} />}

      {huntings !== null ? (
        <TransitionGroup>
          {filtered === null ? (
            <DataTable
              data={huntings}
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
          ) : (
            <DataTable
              data={filtered}
              columns={tableColumns}
              striped={true}
              center={true}
              persistTableHead
              noHeader={true}
              pagination={true}
            />
          )}
        </TransitionGroup>
      ) : (
        <Loader />
      )}
    </Fragment>
  )
}

Huntings.propTypes = {
  Hunting: PropTypes.object.isRequired,
  getHuntingList: PropTypes.func.isRequired,
  //   deleteBlog: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Hunting: state.Hunting,
})

export default connect(mapStateToProps, {
  getHuntingList,
  //   deleteBlog,
  clearMessage,
  clearError,
})(Huntings)
