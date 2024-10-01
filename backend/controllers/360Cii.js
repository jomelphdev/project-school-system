import {
  get360CiiM,
} from '../models/360CiiM.js'

import check_token from "./functions.js"

//todo Get 360 CII
export const get360Cii = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  get360CiiM(req.body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}