const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("express-jwt"); // Validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA keys from a JSON Web Key set (JWKS) endpoint
const checkScope = require("express-jwt-authz"); // Validate JWT scopes
const Products = require("./models/products.model");
const Cart = require("./models/cart.model");

/******** Authentication Functions *******/
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
  algorithms: ["RS256"],
});
function checkRole(role) {
  return function (req, res, next) {
    const assignedRoles = req.user["http://localhost:3000/roles"];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send("Insufficient role");
    }
  };
}

const app = express();

//----Tell server to use whatever port you have available
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/******** MongoDB Connection *******/
//----Use the url if available
mongoose.connect(
  process.env.URL ||
    "mongodb://admin:admins1@ds217099.mlab.com:17099/phone-store",
  { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;

//Runs once when connection is open
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//Bind connection to error event (to get notification of connection errors)
connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

/******** Routes *******/
app.get("/", function (req, res) {
  Products.find().then((products) => res.json(products));
});

const cartsRouter = require("./routes/cart");
app.use("/cart", cartsRouter);

app.get("/public", function (req, res) {
  res.json({
    message: "Hello from a public API!",
  });
});

app.get("/private", checkJwt, function (req, res) {
  res.json({
    message: "Hello from a private API!",
  });
});

app.get("/course", checkJwt, checkScope(["read:courses"]), function (req, res) {
  res.json({
    courses: [
      { id: 1, title: "Building Apps with React and Redux" },
      { id: 2, title: "Creating Reusable React Components" },
    ],
  });
});

app.get("/admin", checkJwt, checkRole("admin"), function (req, res) {
  res.json({
    message: "Hello from an admin API!",
  });
});

/******** Start Server *******/
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
