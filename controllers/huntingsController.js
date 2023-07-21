const asyncHandler = require("express-async-handler");
const { Huntings, validate } = require("../models/huntings");
const { json } = require("body-parser");
const debug = require("debug")("app:startup");

// @desc Get hunter data
// @route GET /api/huntings
// @access Private
const getHuntings = asyncHandler(async (req, res) => {
  const hunter = await Huntings.findAll();
  if (!hunter) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  res.status(200).json([...hunter]);
});

// @desc Check the ASIN is Unique or Not
// @route POST /api/uniqueASIN
// @access Private
const uniqueASIN = asyncHandler(async (req, res) => {
  console.log("req.body::::;", req.body);
  const asinExists = await Huntings.findOne({
    where: {
      asin: req.query.asin,
    },
  });

  if (asinExists) {
    res.status(400);
    throw new Error("ASIN already Existed...");
  }
  res.status(200).json({ uniqueAsin: true });
});

// @desc Check the SKU is Unique or Not
// @route POST /api/uniqueSKU
// @access Private
const uniqueSKU = asyncHandler(async (req, res) => {
  const skuExists = await Huntings.findOne({
    where: {
      source_sku: req.query.sku,
    },
  });

  if (skuExists) {
    res.status(400);
    throw new Error("SKU already Existed...");
  }
  res.status(200).json({ uniqueSKU: true });
});

// @desc Post hunter data
// @route POST /api/huntings
// @access Private
const createHuntings = asyncHandler(async (req, res) => {
  //   const date = new moment(new Date(req.body.date), [
  //     'MM-DD-YYYY',
  //     'YYYY-MM-DD',
  //   ]).format();

  console.log(req.body);
  const huntingDetail = {
    asin: req.body.asin,
    source_sku: req.body.source_sku,
    bsr: req.body.bsr,
    amazon_link: req.body.amazon_link,
    source_link: req.body.source_link,
    variant_type: req.body.variant_type,
    title: req.body.title,
    units: req.body.units,
    amazon_price: req.body.amazon_price,
    source_price: req.body.source_price,
    currency: req.body.currency,
    after_discount: req.body.after_discount,
    delivery_charges: req.body.delivery_charges,
    refer_fee: req.body.refer_fee,
    vat: req.body.vat,
    profit: req.body.profit,
    margin: req.body.margin,
    roi: req.body.roi,
  };

  //validate huntingDetail
  if (huntingDetail) {
    const { error } = validate(huntingDetail);

    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    const hunter = await Huntings.create(huntingDetail);
    if (!hunter) {
      res.status(400);
      throw new Error(
        "hunter could not be created. Rollback initiated in hunter"
      );
    }

    return res.status(200).json({ ...hunter, message: "successfully added" });
  } catch (error) {
    debug("something went wrong in person create: ", error.message);
    return res
      .status(500)
      .send("something went wrong in person create: ", error.message);
  }
});

// route.put('/', protect, async (req, res) => {
//   debug('req.user.id::', req.user.id);
//   debug('req::', req.body);
//   const date = new moment(new Date(req.body.date), [
//     'MM-DD-YYYY',
//     'YYYY-MM-DD',
//   ]).format();

//   let uploadResponse = null;
//   if (req.body.imageUpdate) {
//     try {
//       const image = req.body.image;
//       uploadResponse = await cloudinary.uploader.upload(image, {
//         folder: 'persons',
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ err: 'Something went wrong in image uploading' });
//     }
//   }
//   const image = req.body.image;
//   const huntingDetail = {
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     image: uploadResponse ? uploadResponse.url : image,
//     gender: req.body.gender,
//     cnic: req.body.cnic,
//     height: req.body.height,
//     privacy: req.body.privacy,
//     age: req.body.age,
//   };

//   //validate huntingDetail
//   if (huntingDetail) {
//     const { error } = validateDetails(huntingDetail);

//     if (error) return res.status(400).send(error.details[0].message);
//   }

//   try {
//     sequelize.transaction(async (t) => {
//       const personDetails = await PersonDetails.update(
//         huntingDetail,
//         {
//           where: { id: req.body.personDetailsId },
//         },
//         {
//           transaction: t,
//         }
//       );

//       if (personDetails[0] === 0)
//         return res.status(404).send(`Person Details could not be updated.`);

//       let person = {
//         userId: req.user.id,
//         personDetailsId: req.body.personDetailsId,
//         date: date,
//         status: req.body.status,
//         country: req.body.country,
//         state: req.body.state,
//         city: req.body.city,
//         address: req.body.address,
//         postalCode: req.body.postalCode,
//       };

//       //validate person
//       if (person) {
//         const { error } = validate(person);
//         if (error) return res.status(400).send(error.details[0].message);
//       }

//       //person
//       person = await Person.update(
//         person,
//         {
//           where: { id: req.body.id },
//         },
//         { transaction: t }
//       );

//       if (person[0] === 0)
//         return res.status(404).send(`Person could not be updated.`);

//       return res.status(200).json({ message: 'successfully updated' });
//     });
//   } catch (error) {
//     debug('something went wrong in person create: ', error.message);
//     return res
//       .status(500)
//       .send('something went wrong in person create: ', error.message);
//   }
// });

module.exports = {
  getHuntings,
  createHuntings,
  uniqueASIN,
  uniqueSKU,
};
