import {
  getAllOrganization,
  findOrganizationById,
  insertOrganization,
  updateOrganizationById,
  deleteOrganizationById,
  getLastestOrgId,
} from '../models/Organization.js'

// import function to check token
import check_token from "./functions.js";

// Get All Organization
export const showAllOrganization = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getAllOrganization((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Get Single Organization
export const showOrganizationById = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findOrganizationById(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Create New Organization
export const createOrganization = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insertOrganization(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update Organization
export const updateOrganization = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id
  const data = req.body
  updateOrganizationById(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Delete Organization
export const deleteOrganization = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id
  deleteOrganizationById(id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// get latest org_id
export const showLatestOrgId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getLastestOrgId((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}