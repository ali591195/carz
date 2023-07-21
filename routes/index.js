// const express = require('express'),
//   router = express.Router(),
//   sequelize = require('../config/database');
// const path = require('path');

// const marketplaces = require('../models/marketplaces');
// const users = require('../models/users');
// const stores = require('../models/stores');

// // /* Sync Database. */
// // router.get('/:id', (req, res) => {
// //   console.log('req :dsfdsafadssafd');
// //   if (req.params.id === '60dea1e6-feb9-4d53-a5f5-542886c3e2ec') {
// //     console.log(
// //       'req :',
// //       req.params.id === '60dea1e6-feb9-4d53-a5f5-542886c3e2ec'
// //     );
// //     sequelize
// //       .sync({ force: true })
// //       .then(() =>
// //         marketplaces.create([
// //           {
// //             marketplace_id: 'A2EUQ1WTGCTBG2',
// //             country: 'Canada',
// //             country_code: 'CA',
// //           },
// //           {
// //             marketplace_id: 'ATVPDKIKX0DER',
// //             country: 'United States of America',
// //             country_code: 'US',
// //           },
// //           {
// //             marketplace_id: 'A1AM78C64UM0Y8',
// //             country: 'Mexico',
// //             country_code: 'MX',
// //           },
// //           {
// //             marketplace_id: 'A2Q3Y263D00KWC',
// //             country: 'Brazil',
// //             country_code: 'BR',
// //           },
// //           {
// //             marketplace_id: 'A1RKKUPIHCS9HS',
// //             country: 'Spain',
// //             country_code: 'ES',
// //           },
// //           {
// //             marketplace_id: 'A1F83G8C2ARO7P',
// //             country: 'United Kingdon',
// //             country_code: 'UK',
// //           },
// //           {
// //             marketplace_id: 'A13V1IB3VIYZZH',
// //             country: 'France',
// //             country_code: 'FR',
// //           },
// //           {
// //             marketplace_id: 'A1805IZSGTT6HS',
// //             country: 'Netherlands',
// //             country_code: 'NL',
// //           },
// //           {
// //             marketplace_id: 'A1PA6795UKMFR9',
// //             country: 'Germany',
// //             country_code: 'DE',
// //           },
// //           {
// //             marketplace_id: 'APJ6JRA9NG5V4',
// //             country: 'Italy',
// //             country_code: 'IT',
// //           },
// //           {
// //             marketplace_id: 'A2NODRKZP88ZB9',
// //             country: 'Sweden',
// //             country_code: 'SE',
// //           },
// //           {
// //             marketplace_id: 'A1C3SOZRARQ6R3',
// //             country: 'Poland',
// //             country_code: 'PL',
// //           },
// //           {
// //             marketplace_id: 'ARBP9OOSHTCHU',
// //             country: 'Egypt',
// //             country_code: 'EG',
// //           },
// //           {
// //             marketplace_id: 'A33AVAJ2PDY3EV',
// //             country: 'Turkey',
// //             country_code: 'TR',
// //           },
// //           {
// //             marketplace_id: 'A17E79C6D8DWNP',
// //             country: 'Saudi Arabia',
// //             country_code: 'SA',
// //           },
// //           {
// //             marketplace_id: 'A2VIGQ35RCS4UG',
// //             country: 'United Arab Emirates',
// //             country_code: 'AE',
// //           },
// //           {
// //             marketplace_id: 'A21TJRUUN4KGV',
// //             country: 'India',
// //             country_code: 'IN',
// //           },
// //           {
// //             marketplace_id: 'A19VAU5U5O7RUS',
// //             country: 'Singapore',
// //             country_code: 'SG',
// //           },
// //           {
// //             marketplace_id: 'A39IBJ37TRP1C6',
// //             country: 'Australia',
// //             country_code: 'AU',
// //           },
// //           {
// //             marketplace_id: 'A1VC38T7YXB528',
// //             country: 'Japan',
// //             country_code: 'JP',
// //           },
// //         ])
// //       )
// //       .then(() =>
// //         stores.create({
// //           title: 'Alifant App',
// //           address: '',
// //           lwa_client_id:
// //             'amzn1.application-oa2-client.0d8f9bc1ddd54106bc90df81afccfe30',
// //           lwa_client_secret:
// //             'b4c1d75c2ace6e57918f9e1187a045d8a0a9ff235c1dc28e68c49f3c6e8ace77',
// //           lwa_refresh_token:
// //             'Atzr|IwEBIEeJaZMZT9bpmoXwO6jXfDeIliaRNqjq69eP9WeR4tZ0_sqlmpAzTOLsHNtg5J1v8Q7AjLLwfu3D280sD0a3Iz9mn7HmSmXBLyu1p2baULLJdLdN-a5hABJUN07WYKHOuTfXAL2H2VueQqh1VYIXPZEuxriNQsEPwnegrSgfuRxUORrFhBXTkze-su7b82OGIMeH8qoDbF4rd8EC3nWOaYMeap0GGTIf0tTWca1GGNx62yC0gRADTpmZzbxm390GGlINlfuHSgm712GDEaAZ9xq8thWBS_V_wDlRr3TAyoYDiQ_Hn-4sicRMyikyGhoBHNmxDM7l4ceMSPjA5Rp-16Rx',
// //           aws_access_key_id: 'AKIAX5PBIN37M3MZYWJL',
// //           aws_secret_access_key: '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',
// //           role_arn: 'arn:aws:iam::544322645758:role/sp-api-role',
// //           seller_id: '849242213',
// //         })
// //       )
// //       .then(() =>
// //         users.create({
// //           first_name: 'Super1',
// //           last_name: 'Admin',
// //           email: 'admin@admin.com',
// //           email_verified_at: now(),
// //           password: 'Secret123',
// //           type: SUPER_ADMIN,
// //           is_super_admin: YES,
// //           is_active: YES,
// //         })
// //       )
// //       .then(() => {
// //         return res.render('databaseSync', {
// //           message: 'Database Synced successfully',
// //         });
// //       })
// //       .catch((err) =>
// //         res.render('databaseSync', {
// //           message: err,
// //         })
// //       )

// //       .catch((error) => {
// //         res.render('databaseSync', {
// //           message: error,
// //         });
// //       });
// //   } else {
// //     res.render('databaseSync', {
// //       message: 'You are not authenticated for this action',
// //     });
// //   }
// // });
// module.exports = router;
