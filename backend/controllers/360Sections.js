import { get360SectionM, get360withGlobalSectionM, getAll360SectionM, insert360SectionM, update360SectionM } from "../models/360SectionM.js"

import check_token from "./functions.js"

export const insert360Section = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    insert360SectionM(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }


  export const get360Section = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const {org_id,suborg_id,program_id,iteration_id} = req.params
    get360SectionM(org_id,suborg_id,program_id,iteration_id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

  export const getAll360Section = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const {org_id} = req.params
    getAll360SectionM(org_id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

  export const get360withGlobalSection = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    get360withGlobalSectionM(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

  export const update360Section = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    update360SectionM(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }