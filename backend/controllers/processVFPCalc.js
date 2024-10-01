import {
  getVFPSurveyResultsM,
  deleteVFPRawM,
  insertVFPRawCalcM,
} from '../models/calculationVFP.js'

import check_token from "./functions.js"
import axios from 'axios'

export const getVFPSurveyResults = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  getVFPSurveyResultsM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const deleteVFPRaw = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  deleteVFPRawM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const insertVFPRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  insertVFPRawCalcM(surveyAssignmentId, req.body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const vfpCalculations = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id

  try {
    let step1_url = `${node_baseurl}delete-raw-calculation/vfp/${surveyAssignmentId}`
    await axios.delete(step1_url, { headers: { "token": valid_token } })
  } catch (error) {
    console.log(error)
  }
  
  try {
    let step2_url = `${node_baseurl}insert-raw-calculation/vfp/${surveyAssignmentId}`
    const response = await axios.post(step2_url, req.body, { headers: { "token": valid_token } })
    res.json(response.data)
  } catch (error) {
    console.log(error)
  }
}