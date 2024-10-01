import {
  get360LikertM,
} from '../models/360LikertM.js'

import check_token from "./functions.js"

//todo Get 360 Likert
export const get360Likert = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  get360LikertM((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}