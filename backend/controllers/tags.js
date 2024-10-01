import {
    getAllTag
  } from "../models/Tag.js";

import check_token from "./functions.js";

export const showAllTags = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getAllTag((err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  };