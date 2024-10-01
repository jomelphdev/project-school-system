 import {
  authIndividual,
  authLastLogin,
  resetPasswordLog,
  generate2FACode,
  get2FAcode,
  } from '../models/Auth.js'
// import function to check token
import check_token from "./functions.js";

export const authResultIndividual = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    authIndividual(req.body.email, req.body.password, (err, results) => {
      if (err) {
        res.send(err)
      }
      else {
        res.json(results)
      }
    })
  }

  export const authResultLastLogin = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    authLastLogin(req.body.email, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

  // Log reset password process
export const logResetPassword = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body;
  resetPasswordLog(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const generateResult2FACode = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const id = req.params.id
    generate2FACode(id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};

export const getResult2FAcode = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const id = req.params.id
    get2FAcode(id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};