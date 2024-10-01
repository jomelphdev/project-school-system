import {
  getQsortSurveyResultsM,
  deleteQsortRawM,
  insertQsortRawCalcM,
  getQsortRawM,
  getQsortCoefficientCorrelationM,
  getQsortReportDataM,
  getQsortCoachReportDataM,
} from '../models/calculationQsortM.js'

import check_token from "./functions.js"
import axios from 'axios'

export const getQsortSurveyResults = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  getQsortSurveyResultsM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const deleteQsortRaw = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  deleteQsortRawM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const insertQsortRawCalc = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  const qsortType = req.params.qsort_type
  insertQsortRawCalcM(qsortType, surveyAssignmentId, req.body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const qsortCalculation = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let s1_survey_assignment_id = req.params.survey_assignment_id
  let qsort_type = req.params.qsort_type
  
  //! step0
  // let surveyAssignmentList = [3327];

  // for (let i = 0; i < surveyAssignmentList.length; i++) {
  // let step1_url = node_baseurl + 'big5-get-survey-result/' + surveyAssignmentList[i]
  let step1_url = node_baseurl + 'delete-raw-calculation/qsort/' + s1_survey_assignment_id
  axios.delete(step1_url, { headers: { "token": valid_token } })
    .then(resp => {

      let step2_url = node_baseurl + `insert-raw-calculation/qsort/${qsort_type}/${s1_survey_assignment_id}`
      axios.post(step2_url, req.body, { headers: { "token": valid_token } })
        .then(resp => {
          res.json(resp.data)
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        })
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
  // }
}

export const getQsortRaw = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  getQsortRawM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const getQsortCoefficientCorrelation = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  getQsortCoefficientCorrelationM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Individual Qsort Report
export const getQsortReportData = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  const iterationId = req.params.iteration_id
  const qsort_type = req.params.qsort_type
  getQsortReportDataM(surveyAssignmentId, iterationId, qsort_type, (err, results) => {
    if (err) res.json(err)
    res.json(results)
  })
}

// Cohort Qsort Report
export const getQsortCoachReportData = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const iterationId = req.params.iteration_id
  const qsort_type = req.params.qsort_type
  getQsortCoachReportDataM(iterationId, qsort_type, (err, results) => {
    if (err) res.json(err)
    res.json(results)
  })
}
