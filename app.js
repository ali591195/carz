const express = require("express");
const sync = require("./routes/sync");
const sequelize = require("./config/database");
const user = require("./routes/users/users");
const bodyParser = require("body-parser");
var cors = require("cors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const orders = require("./routes/orders/orders");
const huntings = require("./routes/huntings/huntings");
const assignStore = require("./routes/huntings/assignStore");
const store = require("./routes/huntings/huntingStore");
const shippingCharges = require("./routes/huntings/shippingCharges");
const marketPlace = require("./routes/marketplaces/marketplaces");
const category = require("./routes/category/category");
const vatAndReferralfee = require("./routes/vatAndReferralfee/vatAndReferralfee");
const seeder = require("./routes/seeder/seeder");
const { association } = require("./controllers/association");

app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
association();
app.use("/api/sync-database", sync);
app.use("/api/users", user);

app.use("/api/seeder", seeder);
app.use("/api/store", store);
app.use("/api/shipping_charges", shippingCharges);
app.use("/api/market_place", marketPlace);
app.use("/api/category", category);
app.use("/api/vat_and_referralfee", vatAndReferralfee);
app.use("/api/orders", orders);
app.use("/api/huntings", huntings);
app.use("/api/assign_store", assignStore);

//connect database connection
sequelize
  .authenticate()
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(`Error: ${err}`));

const port = process.env.PORT || 6062;

app.listen(port, () => console.log(`Server started on port ${port}`));

app.use(errorHandler);
