import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component'
import { Edit3, Delete, Eye } from 'react-feather'
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import CollectFeeFilter from './CollectFeeFilter'
// import Breadcrumb from '../../layout/breadcrumb'
import AddSellerIDModal from './AddSellerIDModal'
// import CriteriaFilter from './CriteriaFilter'
import { getOrders } from '../../actions/orderAction'
import DisplayOrder from './DisplayOrder'

const OrdersListing = ({
  Order: { error, message, orders, nextToken, createdBefore },
  getOrders,
}) => {
  useEffect(() => {
    if (!orders) {
      getOrders()
    }
    if (message !== null) {
      setTimeout(() => {
        toast.success(message)
      }, 200)
    }
    if (error !== null) {
      setTimeout(() => {
        toast.error(error)
      }, 200)
      clearError()
    }
    // eslint-disable-next-line
  }, [error, message])

  //   {
  //     BuyerInfo: {
  //       BuyerEmail: '90yt35py86h7rpt@marketplace.amazon.co.uk'
  //     },
  //     EarliestShipDate: '2022-10-01T22:59:59Z',
  //     SalesChannel: 'Amazon.co.uk',

  //     NumberOfItemsShipped: 2,
  //     OrderType: 'StandardOrder',
  //     IsPremiumOrder: false,
  //     IsPrime: false,
  //     FulfillmentChannel: 'AFN',
  //     NumberOfItemsUnshipped: 0,
  //     HasRegulatedItems: false,
  //     IsReplacementOrder: 'false',
  //     IsSoldByAB: false,
  //     LatestShipDate: '2022-10-01T22:59:59Z',
  //     ShipServiceLevel: 'Expedited',
  //     IsISPU: false,
  //     MarketplaceId: 'A1F83G8C2ARO7P',

  //     ShippingAddress: {
  //       StateOrRegion: 'Devon',
  //       PostalCode: 'PL3 6SU',
  //       City: 'PLYMOUTH',
  //       CountryCode: 'GB'
  //     },
  //     IsAccessPointOrder: false,
  //     SellerOrderId: '204-1953551-1557966',
  //     PaymentMethod: 'Other',
  //     IsBusinessOrder: false,
  //     OrderTotal: {
  //       CurrencyCode: 'GBP',
  //       Amount: '34.74'
  //     },
  //     PaymentMethodDetails: [
  //       'Standard'
  //     ],
  //     IsGlobalExpressEnabled: false,
  //     LastUpdateDate: '2022-10-01T16:20:12Z',
  //     ShipmentServiceLevelCategory: 'Expedited'
  //   },

  const tableColumns = [
    {
      name: 'Purchase-Date',
      selector: 'PurchaseDate',
      // sortable: true,
      center: true,
    },
    {
      name: 'Amazon-Order-Id',
      selector: 'AmazonOrderId',
      // sortable: true,
      center: true,
    },
    {
      name: 'Seller-Order-Id',
      selector: 'SellerOrderId',
      // sortable: true,
      center: true,
      cell: (row) =>
        row.SellerOrderId ? (
          <p className={'f-12'}>{row.SellerOrderId}</p>
        ) : (
          <button
            className="btn update-button"
            style={{ color: '#2CA98D' }}
            onClick={() => addToggle(row)}
          >
            <Edit3 />
          </button>
        ),
    },
    {
      name: 'Action',
      center: true,
      // width: '200px',
      cell: (row) => (
        <div>
          <button
            className="btn view-button"
            style={{ color: '#FD7E17' }}
            onClick={() => viewToggle(row)}
          >
            <Eye />
          </button>
        </div>
      ),
    },

    // {
    //   name: 'Fulfillment-Channel',
    //   selector: 'FulfillmentChannel',
    // sortable: true,
    //   center: true,
    // },

    {
      name: 'Order-Status',
      selector: 'OrderStatus',
      // sortable: true,
      center: true,
      cell: (row) => (
        <p
          className={'f-12'}
          style={{
            background:
              row.OrderStatus === 'Pending'
                ? '#F7BD29'
                : row.OrderStatus === 'Unshipped'
                ? '#3E8AB4'
                : row.OrderStatus === 'Shipped'
                ? '#2CA98D'
                : row.OrderStatus === 'PartiallyShipped'
                ? 'purple'
                : row.OrderStatus === 'Canceled'
                ? '#bd3330'
                : 'black',
            padding: '0.25em 0.4em',
            fontWeight: '700',
            borderRadius: '25px',
            color: 'white',
          }}
        >
          {row.OrderStatus === 'Pending'
            ? 'Pending'
            : row.OrderStatus === 'Unshipped'
            ? 'Unshipped'
            : row.OrderStatus === 'Shipped'
            ? 'Shipped'
            : row.OrderStatus === 'PartiallyShipped'
            ? 'PartiallyShipped'
            : row.OrderStatus === 'Canceled'
            ? 'Canceled'
            : 'Nothing'}
        </p>
      ),
    },
  ]

  //   const onDelete = (data) => {
  //     // deleteCategory(data.id);
  //   }

  //   const [homeWorkModal, setHomeWorkModal] = useState(false)

  const [SellerIDModal, setSellerIDModal] = useState(false)
  const [data, setData] = useState(null)

  const addToggle = (row) => {
    setSellerIDModal(!SellerIDModal)
    setData(row)
  }

  const [viewModal, setViewModal] = useState(false)
  const viewToggle = (row) => {
    setViewModal(!viewModal)
    setData(row)
  }
  //   const homeWorkToggle = () => setHomeWorkModal(!homeWorkModal)

  return (
    <Fragment>
      <ToastContainer />
      {SellerIDModal && <AddSellerIDModal modal={SellerIDModal} toggle={addToggle} data={data} />}
      {viewModal && <DisplayOrder modal={viewModal} toggle={viewToggle} data={data} />}

      <Container fluid={true}>
        <Row>
          <Col sm={12} md={12}>
            <Card>
              <CardBody>
                {/* <Row className="justify-content-end">
                  <Col sm={12} md={8} style={{ marginTop: '10px' }}>
                    <CriteriaFilter />
                  </Col>

                  <Col sm={12} md={4} style={{ marginTop: '10px' }}>
                    <CollectFeeFilter />
                  </Col>
                </Row> */}
                {orders && (
                  <DataTable
                    style={{ marginTop: '10px' }}
                    data={orders}
                    columns={tableColumns}
                    // striped={true}
                    center={true}
                    pagination={true}
                    persistTableHead
                    noHeader={true}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

OrdersListing.propTypes = {
  Order: PropTypes.object.isRequired,
  getOrders: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Order: state.Order,
})

export default connect(mapStateToProps, {
  getOrders,
})(OrdersListing)
