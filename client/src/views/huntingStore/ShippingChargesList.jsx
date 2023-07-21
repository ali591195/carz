import React, { useEffect, useState } from 'react'
import { Row, Col, Card, CardBody, Button } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { titleCase } from 'title-case'
import { Trash2 } from 'react-feather'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import UpdateShippingChargesModal from './UpdateShippingChargesModal'
import CreateShippingChargesModal from './CreateShippingChargesModal'
const ShippingChargesList = ({ permissions, storeShippingCharges, id }) => {
  const [chargesList, setChargesList] = useState(null)

  const customStyles = {
    headCells: {
      style: {
        color: '#202124',
        fontSize: '14px',
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: 'rgb(230, 244, 244)',
        borderBottomColor: '#FFFFFF',
        borderRadius: '25px',
        outline: '1px solid #FFFFFF',
      },
    },
    pagination: {
      style: {
        border: 'none',
      },
    },
  }

  useEffect(() => {
    storeShippingCharges &&
      storeShippingCharges.map((shipping, i) => {
        setChargesList((prevState) => ({ ...prevState, [`charge${i}`]: shipping.charges }))
        delete shipping.index
        delete shipping.user_added_shipping_charges
        delete shipping.user_updated_shipping_charges
      })

    // eslint-disable-next-line
  }, [storeShippingCharges])

  const tableColumns = []

  storeShippingCharges.map((shippingCharge, i) =>
    tableColumns.push({
      name: `$${Number(shippingCharge.to)}${
        shippingCharge.from ? ` - $${Number(shippingCharge.from)}` : ''
      }`,
      center: true,
      reorder: true,
      Selector: () => `charge${i}`,
      cell: () => `${shippingCharge.charges}`,
    }),
  )

  const [createModal, setCreateModal] = useState(false)

  const createToggle = () => {
    setCreateModal(!createModal)
  }

  const [updateModal, setUpdateModal] = useState(false)

  const updateToggle = () => {
    setUpdateModal(!updateModal)
  }

  return (
    <Card style={{ marginTop: '24px' }}>
      {updateModal && (
        <UpdateShippingChargesModal
          modal={updateModal}
          toggle={updateToggle}
          storeShippingCharges={storeShippingCharges}
          id={id}
        />
      )}
      {createModal && (
        <CreateShippingChargesModal modal={createModal} toggle={createToggle} id={id} />
      )}
      <CardBody>
        <Row>
          <Col xs={6}>
            <h2>Shipping Charges</h2>
          </Col>
          <Col xs={6}>
            {permissions.create_and_edit_store &&
              (storeShippingCharges.length ? (
                <Button
                  className="btn btn-md"
                  style={{ float: 'right', margin: '2px' }}
                  color="primary"
                  onClick={() => updateToggle()}
                >
                  Update
                </Button>
              ) : (
                <Button
                  className="btn btn-md"
                  style={{ float: 'right', margin: '2px' }}
                  color="primary"
                  onClick={() => createToggle()}
                >
                  Create
                </Button>
              ))}
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
          <Col xs={12}>
            <DataTable
              data={chargesList ? [chargesList] : []}
              columns={tableColumns}
              center={true}
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

ShippingChargesList.propTypes = {}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(ShippingChargesList)
