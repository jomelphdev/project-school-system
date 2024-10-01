import {
  get360NetPromoterScoreM,
  insert360NetPromoterScoreM,
  update360NetPromoterScoreM,
  borrowNetPromoterScoreM,
  get360NetPromoterScoreByIdM
} from '../models/360NetPromoterScoreM.js'

import check_token from "./functions.js"

//todo Get 360 Org Climate
export const get360NetPromoterScore = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  get360NetPromoterScoreM(req.body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const insert360NetPromoterScore = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insert360NetPromoterScoreM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const update360NetPromoterScore = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id
  const data = req.body
  update360NetPromoterScoreM(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const borrowNetPromoterScore = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  borrowNetPromoterScoreM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//todo Get 360 Org Climate
export const get360NetPromoterScoreById = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  get360NetPromoterScoreByIdM(req.params.survey_assignment_id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}