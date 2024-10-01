import {
  get360InstructionM,
} from '../models/360InstructionM.js'

import check_token from "./functions.js"

//todo Get 360 Instruction
export const get360Instruction = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  get360InstructionM(req.body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}