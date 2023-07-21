const _ = require('lodash');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const { Order, validate } = require('../models/orders');
// const { json } = require('body-parser');
// const debug = require('debug')('app:startup');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv').config();

const SellingPartnerAPI = require('amazon-sp-api');

const { default: axios } = require('axios');
const cryptoJS = require('crypto-js');

let sellingPartnerNewInstance;

// @desc Get order data
// @route GET /api/orders
// @access Private
const getOrder = asyncHandler(async (req, res) => {
  console.log('starting::>>');
  let sellingPartner = new SellingPartnerAPI({
    region: 'eu',
    refresh_token:
      'Atzr|IwEBIEeJaZMZT9bpmoXwO6jXfDeIliaRNqjq69eP9WeR4tZ0_sqlmpAzTOLsHNtg5J1v8Q7AjLLwfu3D280sD0a3Iz9mn7HmSmXBLyu1p2baULLJdLdN-a5hABJUN07WYKHOuTfXAL2H2VueQqh1VYIXPZEuxriNQsEPwnegrSgfuRxUORrFhBXTkze-su7b82OGIMeH8qoDbF4rd8EC3nWOaYMeap0GGTIf0tTWca1GGNx62yC0gRADTpmZzbxm390GGlINlfuHSgm712GDEaAZ9xq8thWBS_V_wDlRr3TAyoYDiQ_Hn-4sicRMyikyGhoBHNmxDM7l4ceMSPjA5Rp-16Rx',
    options: {
      auto_request_tokens: false,
    },
  });
  // console.log('sellingPartner::>', sellingPartner);
  await sellingPartner.refreshAccessToken();
  await sellingPartner.refreshRoleCredentials();

  // let access_token = sellingPartner.access_token;
  // let role_credentials = sellingPartner.role_credentials;
  // console.log('sellingPartner::>444', sellingPartner);

  // sellingPartnerNewInstance = new SellingPartnerAPI({
  //   region: 'eu',
  //   refresh_token:
  //     'Atzr|IwEBIEeJaZMZT9bpmoXwO6jXfDeIliaRNqjq69eP9WeR4tZ0_sqlmpAzTOLsHNtg5J1v8Q7AjLLwfu3D280sD0a3Iz9mn7HmSmXBLyu1p2baULLJdLdN-a5hABJUN07WYKHOuTfXAL2H2VueQqh1VYIXPZEuxriNQsEPwnegrSgfuRxUORrFhBXTkze-su7b82OGIMeH8qoDbF4rd8EC3nWOaYMeap0GGTIf0tTWca1GGNx62yC0gRADTpmZzbxm390GGlINlfuHSgm712GDEaAZ9xq8thWBS_V_wDlRr3TAyoYDiQ_Hn-4sicRMyikyGhoBHNmxDM7l4ceMSPjA5Rp-16Rx',
  //   access_token: access_token,
  //   role_credentials: role_credentials,
  // });

  // console.log("sellingPartnerNewInstance", sellingPartnerNewInstance)

  // console.log(sellingPartner.endpoints);

  try {
    // const orders = await Order.findAll({
    //   where: { FulfillmentChannel: 'MFN' },
    // });

    // ************** Request For report  ****************
    const temp = await sellingPartner.callAPI({
      endpoint: 'reports',
      operation: 'createReport',
      body: {
        marketplaceIds: ['A1PA6795UKMFR9', 'A13V1IB3VIYZZH', 'A1F83G8C2ARO7P'],
        reportType: 'GET_MERCHANT_LISTINGS_ALL_DATA',
        dataStartTime: '2021-12-10T20:11:24.000Z',
      },
    });
    console.log(temp);
    const reportId = temp.reportId;
    // ******************** Check the status if done than get document ****************
    let resp = await sellingPartner.callAPI({
      endpoint: 'reports',
      operation: 'getReport',
      path: {
        reportId: reportId,
      },
    });
    let report_data;

    (function myLoop() {
      setTimeout(async () => {
        resp = await sellingPartner.callAPI({
          endpoint: 'reports',
          operation: 'getReport',
          path: {
            reportId: reportId,
          },
        });
        if (
          !_.includes(['DONE', 'FATAL', 'CANCELLED'], resp.processingStatus)
        ) {
          myLoop();

          console.log(resp);
          console.log('Sleeping......');
        } else if (_.includes(['FATAL', 'CANCELLED'], resp.processingStatus)) {
          console.log('Report Failed....');
          report_data = resp;
        } else {
          console.log(resp);

          report_data = await sellingPartner.download(
            await sellingPartner.callAPI({
              endpoint: 'reports',
              operation: 'getReportDocument',
              path: {
                reportDocumentId: resp && resp.reportDocumentId,
              },
            })
          );

          console.log('Document\n', report_data);
          return res.status(200).json({
            report_data,
          });
        }
      }, 5000);
    })();

    // return res.status(200).json({ orders });
  } catch (e) {
    console.log(e);
    return res.status(500);
    //   throw new Error('Invalid credentials');
  }
});

// const getOrder = asyncHandler(async (req, res) => {
//   let sellingPartner = new SellingPartnerAPI({
//     region: 'eu',
//     refresh_token:
//       'Atzr|IwEBIEeJaZMZT9bpmoXwO6jXfDeIliaRNqjq69eP9WeR4tZ0_sqlmpAzTOLsHNtg5J1v8Q7AjLLwfu3D280sD0a3Iz9mn7HmSmXBLyu1p2baULLJdLdN-a5hABJUN07WYKHOuTfXAL2H2VueQqh1VYIXPZEuxriNQsEPwnegrSgfuRxUORrFhBXTkze-su7b82OGIMeH8qoDbF4rd8EC3nWOaYMeap0GGTIf0tTWca1GGNx62yC0gRADTpmZzbxm390GGlINlfuHSgm712GDEaAZ9xq8thWBS_V_wDlRr3TAyoYDiQ_Hn-4sicRMyikyGhoBHNmxDM7l4ceMSPjA5Rp-16Rx',
//     options: {
//       auto_request_tokens: false,
//     },
//   });
//   await sellingPartner.refreshAccessToken();
//   await sellingPartner.refreshRoleCredentials();

//   let access_token = sellingPartner.access_token;
//   let role_credentials = sellingPartner.role_credentials;

//   sellingPartnerNewInstance = new SellingPartnerAPI({
//     region: 'eu',
//     refresh_token:
//       'Atzr|IwEBIEeJaZMZT9bpmoXwO6jXfDeIliaRNqjq69eP9WeR4tZ0_sqlmpAzTOLsHNtg5J1v8Q7AjLLwfu3D280sD0a3Iz9mn7HmSmXBLyu1p2baULLJdLdN-a5hABJUN07WYKHOuTfXAL2H2VueQqh1VYIXPZEuxriNQsEPwnegrSgfuRxUORrFhBXTkze-su7b82OGIMeH8qoDbF4rd8EC3nWOaYMeap0GGTIf0tTWca1GGNx62yC0gRADTpmZzbxm390GGlINlfuHSgm712GDEaAZ9xq8thWBS_V_wDlRr3TAyoYDiQ_Hn-4sicRMyikyGhoBHNmxDM7l4ceMSPjA5Rp-16Rx',
//     access_token: access_token,
//     role_credentials: role_credentials,
//   });
//   console.log(sellingPartner.endpoints);

//   try {
//     // const orders = await Order.findAll({
//     //   where: { FulfillmentChannel: 'MFN' },
//     // });
//     let resp = await sellingPartner.callAPI({
//       operation: 'getOrders',
//       endpoint: 'orders',
//       query: {
//         MarketplaceIds: ['A1F83G8C2ARO7P'],
//         CreatedAfter: '2022-10-30T00:00:00-07:00',
//       },
//     });
//     console.log('resp::>>>>', resp);
//     // const orders = await Order.bulkCreate(resp.Orders);
//     return res.status(200).json({
//       NextToken: resp.NextToken,
//       CreatedBefore: resp.CreatedBefore,
//       orders: [...resp.Orders],
//     });
//     // return res.status(200).json({ orders });
//   } catch (e) {
//     console.log(e);
//     return res.status(500);
//     //   throw new Error('Invalid credentials');
//   }
// });

module.exports = {
  getOrder,
};

// **************** Search catelog item ***********
// let resp = await sellingPartner.callAPI({
//   endpoint: 'catalogItems',
//   operation: 'searchCatalogItems',
//   query: {
//     marketplaceIds: ['A1PA6795UKMFR9'],
//     keywords: ['a'],
//   },
// });

// **************** catelog item ************
// let resp = await sellingPartner.callAPI({
//   operation: 'getCatalogItem',
//   endpoint: 'catalogItems',
//   path: { asin: 'B01LTIOD36' },
//   query: {
//     marketplaceIds: ['A1PA6795UKMFR9'],
//     includedData: [
//       'identifiers',
//       'attributes',
//       'variations',
//       'summaries',
//       'images',
//     ],
//   },
// });

// &&&&&&&&&&&&&&&&&&&&& REPORT &&&&&&&&&&&&&&&&&&&&&&&&&

// ************** Request For report  ****************
// const temp = await sellingPartner.callAPI({
//   endpoint: 'reports',
//   operation: 'createReport',
//   body: {
//     marketplaceIds: ['A1PA6795UKMFR9'],
//     reportType: 'GET_MERCHANT_LISTINGS_ALL_DATA',
//   },
// });
// console.log(temp);
// const reportId = temp.reportId;
// // ******************** Check the status if done than get document ****************
// let resp = await sellingPartner.callAPI({
//   endpoint: 'reports',
//   operation: 'getReport',
//   path: {
//     reportId: reportId,
//   },
// });
// let report_data;

// (function myLoop() {
//   setTimeout(async () => {
//     resp = await sellingPartner.callAPI({
//       endpoint: 'reports',
//       operation: 'getReport',
//       path: {
//         reportId: reportId,
//       },
//     });
//     if (
//       !_.includes(['DONE', 'FATAL', 'CANCELLED'], resp.processingStatus)
//     ) {
//       myLoop();

//       console.log(resp);
//       console.log('Sleeping......');
//     } else if (_.includes(['FATAL', 'CANCELLED'], resp.processingStatus)) {
//       console.log('Report Failed....');
//       report_data = resp;
//     } else {
//       console.log(resp);

//       report_data = await sellingPartner.download(
//         await sellingPartner.callAPI({
//           endpoint: 'reports',
//           operation: 'getReportDocument',
//           path: {
//             reportDocumentId: resp && resp.reportDocumentId,
//           },
//         })
//       );

//       console.log('Document\n', report_data);
//       return res.status(200).json({
//         report_data,
//       });
//     }
//   }, 5000);
// })();
