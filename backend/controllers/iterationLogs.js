import {
    getAllIterationLog,
    insertIterationLog,
    findIterationLogByIterationId
  } from '../models/IterationLog.js'

  import check_token from "./functions.js";


  export const showAllIterationLog = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getAllIterationLog((err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

  export const showIterationLogByIterationId = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    findIterationLogByIterationId(req.params.id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }


  export const createIterationLog = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    insertIterationLog(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }