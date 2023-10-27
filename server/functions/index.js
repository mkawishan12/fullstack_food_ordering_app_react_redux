//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccountKey = require('./serviceAccountKey.json')

const express = require('express');
const app = express();

//Body parser for json data
app.use(express.json());

//cross middleware
//cors is a mechanism by which a front-end client can make requests for resources to an external back-end server

const cors = require("cors");
app.use(cors({origin: true}));
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin","*");
    next();
});

//firebase credentials 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });

  //api endpoints
  app.get("/", (req, res) =>{
        return res.send('helloworld');
  });

  const userRoute = require('./routes/user');
  app.use("/api/users", userRoute);
  
  exports.app = functions.https.onRequest(app);