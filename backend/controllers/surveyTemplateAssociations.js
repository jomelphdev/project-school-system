import {
  getAllSurveyTemplateAssociation,
  findSurveyTemplateAssociationById,
  findSurveyTemplateAssociationOrgId,
  insertSurveyTemplateAssociation,
  updateSurveyTemplateAssociationById,
  deleteSurveyTemplateAssociationById,
  deleteSurveyTemplateAssociationByOrgIdAndSuborgId,
  findSurveyTemplateAssociationBySuborgId,
  deleteSurveyTemplateAssociationBySuborgId,
  findSurveyUrlByOrgIdSurveyTemplateIdSuborgId,
} from '../models/SurveyTemplateAssociation.js'

// import function to check token
import check_token from './functions.js'

// Get All Survey Template Association
export const showAllSurveyTemplateAssociation = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllSurveyTemplateAssociation((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Get Single Survey Template Association
export const showSurveyTemplateAssociationById = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  findSurveyTemplateAssociationById(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Get All Survey Template Association By Org_id
export const showSurveyTemplateAssociationByOrgId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  findSurveyTemplateAssociationOrgId(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Get All Survey Template Association By Org_id
export const showSurveyTemplateAssociationBySuborgId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  findSurveyTemplateAssociationBySuborgId(orgId, suborgId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Get all Survey_URL by org_id, survey_template_id, suborg_id
export const showSurveyUrlByOrgIdSurveyTemplateIdSuborgId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const surveyTemplateId = req.params.survey_template_id
  const suborgId = req.params.suborg_id
  findSurveyUrlByOrgIdSurveyTemplateIdSuborgId(orgId, surveyTemplateId, suborgId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Create New Survey Template Association
export const createSurveyTemplateAssociation = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const data = req.body
  insertSurveyTemplateAssociation(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update Survey Template Association
export const updateSurveyTemplateAssociation = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateSurveyTemplateAssociationById(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Delete Survey Template Association
export const deleteSurveyTemplateAssociation = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  deleteSurveyTemplateAssociationById(id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Delete Survey Template Association By org_id
export const deleteSurveyTemplateAssociationByOrgAndSuborg = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const orgId = req.params.org_id
    const suborgId = req.params.suborg_id
  deleteSurveyTemplateAssociationByOrgIdAndSuborgId(orgId, suborgId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Delete Survey Template Association By org_id and suborg_id
export const deleteSurveyTemplateAssociationBySuborg = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  deleteSurveyTemplateAssociationBySuborgId(orgId, suborgId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
