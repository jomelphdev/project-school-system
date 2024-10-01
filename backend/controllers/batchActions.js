import {
    getAllBatchAction
  } from "../models/BatchAction.js";

import check_token from "./functions.js";

  export const showAllBatchActions = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getAllBatchAction((err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  };