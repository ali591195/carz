const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");

const { Marketplaces } = require("../models/marketplaces");
const { Stores } = require("../models/stores");
const { Users } = require("../models/users");
const { PermissionSettings } = require("../models/permissionSettings");

const debug = require("debug")("app:startup");
// const { protect } = require('../../middleware/authMiddleware');

// const marketplaceData = [
//   {
//     marketplace_id: 'A2EUQ1WTGCTBG2',
//     country: 'Canada',
//     country_code: 'CA',
//   },
//   {
//     marketplace_id: 'ATVPDKIKX0DER',
//     country: 'United States of America',
//     country_code: 'US',
//   },
//   {
//     marketplace_id: 'A1AM78C64UM0Y8',
//     country: 'Mexico',
//     country_code: 'MX',
//   },
//   {
//     marketplace_id: 'A2Q3Y263D00KWC',
//     country: 'Brazil',
//     country_code: 'BR',
//   },
//   {
//     marketplace_id: 'A1RKKUPIHCS9HS',
//     country: 'Spain',
//     country_code: 'ES',
//   },
//   {
//     marketplace_id: 'A1F83G8C2ARO7P',
//     country: 'United Kingdon',
//     country_code: 'UK',
//   },
//   {
//     marketplace_id: 'A13V1IB3VIYZZH',
//     country: 'France',
//     country_code: 'FR',
//   },
//   {
//     marketplace_id: 'A1805IZSGTT6HS',
//     country: 'Netherlands',
//     country_code: 'NL',
//   },
//   {
//     marketplace_id: 'A1PA6795UKMFR9',
//     country: 'Germany',
//     country_code: 'DE',
//   },
//   {
//     marketplace_id: 'APJ6JRA9NG5V4',
//     country: 'Italy',
//     country_code: 'IT',
//   },
//   {
//     marketplace_id: 'A2NODRKZP88ZB9',
//     country: 'Sweden',
//     country_code: 'SE',
//   },
//   {
//     marketplace_id: 'A1C3SOZRARQ6R3',
//     country: 'Poland',
//     country_code: 'PL',
//   },
//   {
//     marketplace_id: 'ARBP9OOSHTCHU',
//     country: 'Egypt',
//     country_code: 'EG',
//   },
//   {
//     marketplace_id: 'A33AVAJ2PDY3EV',
//     country: 'Turkey',
//     country_code: 'TR',
//   },
//   {
//     marketplace_id: 'A17E79C6D8DWNP',
//     country: 'Saudi Arabia',
//     country_code: 'SA',
//   },
//   {
//     marketplace_id: 'A2VIGQ35RCS4UG',
//     country: 'United Arab Emirates',
//     country_code: 'AE',
//   },
//   {
//     marketplace_id: 'A21TJRUUN4KGV',
//     country: 'India',
//     country_code: 'IN',
//   },
//   {
//     marketplace_id: 'A19VAU5U5O7RUS',
//     country: 'Singapore',
//     country_code: 'SG',
//   },
//   {
//     marketplace_id: 'A39IBJ37TRP1C6',
//     country: 'Australia',
//     country_code: 'AU',
//   },
//   {
//     marketplace_id: 'A1VC38T7YXB528',
//     country: 'Japan',
//     country_code: 'JP',
//   },
// ];

const marketplaceData = [
  {
    marketplace_id: "A2EUQ1WTGCTBG2",
    country: "Canada",
    country_code: "CA",
    currency: "CAD",
    symbol: "C$",
  },
  {
    marketplace_id: "ATVPDKIKX0DER",
    country: "United States of America",
    country_code: "US",
    currency: "USD",
    symbol: "$",
  },
  {
    marketplace_id: "A1AM78C64UM0Y8",
    country: "Mexico",
    country_code: "MX",
    currency: "MXN",
    symbol: "Mex$",
  },
  {
    marketplace_id: "A2Q3Y263D00KWC",
    country: "Brazil",
    country_code: "BR",
    currency: "BRL",
    symbol: "R$",
  },
  {
    marketplace_id: "A1RKKUPIHCS9HS",
    country: "Spain",
    country_code: "ES",
    currency: "EUR",
    symbol: "€",
  },
  {
    marketplace_id: "A1F83G8C2ARO7P",
    country: "United Kingdon",
    country_code: "UK",
    currency: "GBP",
    symbol: "£",
  },
  {
    marketplace_id: "A13V1IB3VIYZZH",
    country: "France",
    country_code: "FR",
    currency: "EUR",
    symbol: "€",
  },
  {
    marketplace_id: "A1805IZSGTT6HS",
    country: "Netherlands",
    country_code: "NL",
    currency: "EUR",
    symbol: "€",
  },
  {
    marketplace_id: "A1PA6795UKMFR9",
    country: "Germany",
    country_code: "DE",
    currency: "EUR",
    symbol: "€",
  },
  {
    marketplace_id: "APJ6JRA9NG5V4",
    country: "Italy",
    country_code: "IT",
    currency: "EUR",
    symbol: "€",
  },
  {
    marketplace_id: "A2NODRKZP88ZB9",
    country: "Sweden",
    country_code: "SE",
    currency: "SEK",
    symbol: "kr",
  },
  {
    marketplace_id: "A1C3SOZRARQ6R3",
    country: "Poland",
    country_code: "PL",
    currency: "PLN",
    symbol: "zł",
  },
  {
    marketplace_id: "ARBP9OOSHTCHU",
    country: "Egypt",
    country_code: "EG",
    currency: "EGP",
    symbol: "E£",
  },
  {
    marketplace_id: "A33AVAJ2PDY3EV",
    country: "Turkey",
    country_code: "TR",
    currency: "TRY",
    symbol: "₺",
  },
  {
    marketplace_id: "A17E79C6D8DWNP",
    country: "Saudi Arabia",
    country_code: "SA",
    currency: "SAR",
    symbol: "﷼",
  },
  {
    marketplace_id: "A2VIGQ35RCS4UG",
    country: "United Arab Emirates",
    country_code: "AE",
    currency: "AED",
    symbol: "د.إ",
  },
  {
    marketplace_id: "A21TJRUUN4KGV",
    country: "India",
    country_code: "IN",
    currency: "INR",
    symbol: "₹",
  },
  {
    marketplace_id: "A19VAU5U5O7RUS",
    country: "Singapore",
    country_code: "SG",
    currency: "SGD",
    symbol: "S$",
  },
  {
    marketplace_id: "A39IBJ37TRP1C6",
    country: "Australia",
    country_code: "AU",
    currency: "AUD",
    symbol: "A$",
  },
  {
    marketplace_id: "A1VC38T7YXB528",
    country: "Japan",
    country_code: "JP",
    currency: "JPY",
    symbol: "¥",
  },
];

const storeData = [
  {
    title: "Alifant App",
    address: "",
    lwa_client_id:
      "amzn1.application-oa2-client.0d8f9bc1ddd54106bc90df81afccfe30",
    lwa_client_secret:
      "b4c1d75c2ace6e57918f9e1187a045d8a0a9ff235c1dc28e68c49f3c6e8ace77",
    lwa_refresh_token:
      "Atzr|IwEBIEeJaZMZT9bpmoXwO6jXfDeIliaRNqjq69eP9WeR4tZ0_sqlmpAzTOLsHNtg5J1v8Q7AjLLwfu3D280sD0a3Iz9mn7HmSmXBLyu1p2baULLJdLdN-a5hABJUN07WYKHOuTfXAL2H2VueQqh1VYIXPZEuxriNQsEPwnegrSgfuRxUORrFhBXTkze-su7b82OGIMeH8qoDbF4rd8EC3nWOaYMeap0GGTIf0tTWca1GGNx62yC0gRADTpmZzbxm390GGlINlfuHSgm712GDEaAZ9xq8thWBS_V_wDlRr3TAyoYDiQ_Hn-4sicRMyikyGhoBHNmxDM7l4ceMSPjA5Rp-16Rx",
    aws_access_key_id: "AKIAX5PBIN37M3MZYWJL",
    aws_secret_access_key: "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",
    role_arn: "arn:aws:iam::544322645758:role/sp-api-role",
    seller_id: "849242213",
  },
];

// email_verified_at: 'now()',

// const bcrypt = require('bcryptjs');
// const fun =
//   console.log('hashPassword ::: ', hashPassword);
// };
// fun();

const userData = [
  {
    first_name: "Super1",
    last_name: "Admin",
    email: "admin@admin.com",
    password: "$2a$10$KdPPIi0pHoY.kBSN9e1tF.V0ZIRsrSzKpt.0ZIppSgTVXEI7Lgtq6",
    email_verified: true,
    email_verified_at: Date.now(),
    active: true,
  },
];

// @desc Store data in database
// @route GET /api/Seeder
// @access Public
const saveSeeder = asyncHandler(async (req, res) => {
  try {
    //create marketplaces
    const marketplace = await Marketplaces.bulkCreate(marketplaceData);
    if (!marketplace) {
      res.status(400).send("market place could not be created.");
      throw new Error("Rollback initiated in personDetails");
    }

    // //store
    // const store = await Stores.bulkCreate(storeData);
    // if (!store) {
    //   res.status(400).send('Store could not be created.');
    //   throw new Error('Rollback initiated in person');
    // }

    //create admin
    const user = await Users.bulkCreate(userData);
    if (!user) {
      res.status(400);
      throw new Error(
        "User could not be created. Rollback initiated in person"
      );
    } // with permissions
    const permissionSettings = [
      {
        user_id: user[0].id,
        dashboard: true,
        order: true,
        order_processing: true,
        inventory: true,
        hunting_list: true,
        hunting: true,
        view_user: true,
        create_and_edit_user: true,
        commenting: true,
        approval_process: true,
        view_store: true,
        create_and_edit_store: true,
        view_marketplace: true,
        create_and_edit_marketplace: true,
        view_vat_and_referralfee: true,
        create_and_edit_vat_and_referralfee: true,
        view_category: true,
        create_and_edit_category: true,
        change_store: true,
      },
    ];
    const permission = await PermissionSettings.bulkCreate(permissionSettings);
    if (!permission) {
      res.status(400);
      throw new Error(
        "Permission could not be created. Rollback initiated in person"
      );
    }

    return res.status(200).json({ message: "successfully added" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    debug("something went wrong in person create: ", error.message);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong during seeding data: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = { saveSeeder };
