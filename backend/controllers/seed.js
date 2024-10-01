import {  
    seedDataTag,
  } from '../models/SeedData.js';
  
  // import function to check token
  import check_token from "./functions.js";
  
  
  // Create New Organization
  export const seedTag = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    seedDataTag(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }
  