import {
    getAllRole,
    findRoleById,
    getAllRespondentsM,
  } from '../models/Role.js'

// import function to check token
import check_token from "./functions.js";

export const showAllRole = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getAllRole((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const showRoleById = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findRoleById(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const getAllRespondents = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getAllRespondentsM((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
  