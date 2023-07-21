const express = require("express");
const sync = require("./routes/sync");
const sequelize = require("./config/database");
const user = require("./routes/users/users");
var cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const category = require("./routes/category/category");
const seeder = require("./routes/seeder/seeder");
const car = require("./routes/cars");
const { association } = require("./controllers/association");
require("dotenv").config();

app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
association();
app.use("/api/sync-database", sync);
app.use("/api/users", user);
app.use("/api/category", category);
app.use("/api/car", car);
app.use("/api/seeder", seeder);

//connect database connection
sequelize
  .authenticate()
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(`Error: ${err}`));

const port = process.env.PORT || 6062;

app.listen(port, () => console.log(`Server started on port ${port}`));

app.use(errorHandler);
