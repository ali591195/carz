const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dzzjmzvrx',
  api_key: '991163458297585',
  api_secret: 'TSRh8_5mbgGJLaQ93QmcE2B0Wu0',
});
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

module.exports = { cloudinary };
