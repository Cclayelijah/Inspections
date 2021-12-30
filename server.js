const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const mainRoute = require("./routes/main");
//const authRoute = require("./routes/auth")
const inspectionsRoute = require("./routes/inspections");
const accountRoutes = require("./routes/account");

const urlencodedParser = express.urlencoded({ extended: false });
app.use(express.json(), urlencodedParser);
app.use("/api/", mainRoute);
app.use("/api/inspections", inspectionsRoute);
app.use("/api/account", accountRoutes);

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    //only listen for requests once db has loaded
    app.listen(process.env.PORT, () =>
      console.log(`server started on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
