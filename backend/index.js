//import environment variables
//line 3 must always be the first code to be run
import {} from "dotenv/config";

// import express
import express from "express";
// import cors
import cors from "cors";
// import routes
import Router from "./routes/routes.js";

//add https support
import https from "https";

import fs from "fs";

// init express
const app = express();

// use express json
//app.use(express.json());
app.use(express.json({limit: '50mb'}));

// use cors
app.use(cors());

// use router
//
app.use(Router);

let host = process.env.HOST;
let port = process.env.PORT;
global.valid_token = process.env.VALID_TOKEN;
global.node_baseurl = process.env.NODE_BASEURL

https
  .createServer(
    {
      key: fs.readFileSync("keys/privkey.pem"),
      cert: fs.readFileSync("keys/fullchain.pem"),
     // key: fs.readFileSync("/opt/bitnami/apache/conf/mnetdemo.gcm3.com.key"),
     // cert: fs.readFileSync("/opt/bitnami/apache/conf/mnetdemo.gcm3.com.crt"),
    },
    app
  )
  .listen(port, () => console.log(`Server running at https://${host}:${port}`));
  
  // for local
  // app.listen(port, () => console.log(`Server running at http://${host}:${port}`));