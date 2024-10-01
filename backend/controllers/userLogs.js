import {
  insertLog,
  getLogByIndIdAndisLoggedInM,
} from '../models/UserLog.js'

import check_token from './functions.js'


// Create New UserLog
export const createUserLog = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insertLog(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const getLogByIndIdAndisLoggedIn = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const indId = req.params.ind_id
  getLogByIndIdAndisLoggedInM(indId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}