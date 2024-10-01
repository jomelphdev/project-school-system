import {
  getSurveyActiveMessageById,
  getParticipantReportsByIdM,
  getCoachReportsByIdM,
  getNotEligible360M,
  getParticipantReportsByIdAdmin,
  getCoachReportsByIdAdmin,
  getFacultyReportsByIdM,
} from '../models/SurveyActiveMessage.js'

// import function to check token
import check_token from "./functions.js";

// get active messages for a survey
export const showSurveyActiveMessageById = (req, res) => {
if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
getSurveyActiveMessageById(req.params.id, (err, results) => {
  if (err) {
    res.send(err)
  } else {
    res.json(results)
  }
})
}


// get participant reports by ind id
export const getParticipantReportsById = (req, res) => {
if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
getParticipantReportsByIdM(req.params.id, (err, results) => {
  if (err) {
    res.send(err)
  } else {
    res.json(results)
  }
})
}

export const getFacultyReportsById = (req, res) => {
if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
getFacultyReportsByIdM(req.params.org_id, req.params.suborg, (err, results) => {
  if (err) {
    res.send(err)
  } else {
    res.json(results)
  }
})
}




// get participant reports by ind id
export const getCoachReportsById = (req, res) => {
if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
getCoachReportsByIdM(req.params.id, (err, results) => {
  if (err) {
    res.send(err)
  } else {
    res.json(results)
  }
})
}



export const getNotEligible360 = (req, res) => {
if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
getNotEligible360M(req.params.id, (err, results) => {
  if (err) {
    res.send(err)
  } else {
    res.json(results[0])
  }
})
}


export const showParticipantReportsByIdAdmin = (req, res) => {
if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
getParticipantReportsByIdAdmin(req.params.id, (err, results) => {
  if (err) {
    res.send(err)
  } else {
    res.json(results)
  }
})
}

export const showCoachReportsByIdAdmin = (req, res) => {
if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
getCoachReportsByIdAdmin(req.params.id, (err, results) => {
  if (err) {
    res.send(err)
  } else {
    res.json(results)
  }
})
}