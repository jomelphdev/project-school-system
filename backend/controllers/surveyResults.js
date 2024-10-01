import {
  getAllSurveyResult,
  findSurveyResultByStamentNum,
  insertSurveyResult,
  updateSurveyResultByStatementNum,
  deleteSurveyResultByStatementNum,
  getReOrderResult,
  getSexAndCountry,
  calculateSurveyResults,
  prePopulateSurveyBig5,
  prePopulateSurveyTeamLeaderP,
  prePopulateSurveyTeamLeaderN,
  prePopulateSurveyGeneralManagerP,
  prePopulateSurveyGeneralManagerN,
  prePopulateSurveySeniorExecProgramP,
  prePopulateSurveySeniorExecProgramN,
  prePopulateSurveyTalentsageP,
  prePopulateSurveyTalentsageN,
  getEmptyAnswerCount,
  getDuplciateAnswer,
  deleteDuplicateSurveyResultM,
  prePopulateSurveyHelpP,
  prePopulateSurveyHelpN,
  prePopulateSurveyConfirmationM,
  prePopulateSurveyEuroNavP,
  prePopulateSurveyEuroNavN,
  prePopulateSurveyQsort,
  prePopulateSurveyVFP,
  surveyBuilderPrepopulateM,
} from '../models/SurveyResult.js'

// import function to check token
import check_token from "./functions.js";

// Get All SurveyResult
export const showAllSurveyResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  getAllSurveyResult(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Get SurveyResult by survey_assignment_id and statement_num
export const showSurveyResultByStamentNum = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  const statementNum = req.params.statement_num
  findSurveyResultByStamentNum(surveyAssignmentId, statementNum, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  }
  )
}
// Create New SurveyResult
export const createSurveyResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  insertSurveyResult(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update SurveyResult
export const updateSurveyResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  const statementNum = req.params.statement_num
  const data = req.body
  updateSurveyResultByStatementNum(surveyAssignmentId, statementNum, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Delete SurveyResult
export const deleteSurveyResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id
  deleteSurveyResultByStatementNum(id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const calculateSurveyResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id
  calculateSurveyResults(id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Get reorder values
export const showReOrderResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  const recordType = req.params.record_type
  getReOrderResult(surveyAssignmentId, recordType, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// get sex and country by survey_assignment_id
export const showSexAndCountry = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id
  getSexAndCountry(surveyAssignmentId, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Get empty answers
export const showEmptyAnswerCount = (req, res) => {
  if ((check_token(req.header('token'))) !== 200) return res.status(check_token(req.header('token'))).send('')
  getEmptyAnswerCount(req.body.survey_assignment_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Get duplicate answers
export const showDuplicateAnswer = (req, res) => {
  if ((check_token(req.header('token'))) !== 200) return res.status(check_token(req.header('token'))).send('')
  getDuplciateAnswer(req.body.survey_assignment_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Delete duplicate answer
export const deleteDuplicateSurveyResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  deleteDuplicateSurveyResultM(req.body.survey_result_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Pre Populate SurveyResult
export const populateBig5 = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyBig5(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateTeamLeaderParticipant = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyTeamLeaderP(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateTeamLeaderNominee = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyTeamLeaderN(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateGeneralManagerParticipant = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyGeneralManagerP(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateGeneralManagerNominee = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyGeneralManagerN(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateSeniorExecParticipant = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveySeniorExecProgramP(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateSeniorExecNominee = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveySeniorExecProgramN(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateTalentsagePaticipant = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyTalentsageP(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateTalentsageNominee = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyTalentsageN(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateHelpPaticipant = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyHelpP(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateHelpNominee = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyHelpN(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const prePopulateSurveyConfirmation = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyConfirmationM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateEuroNavPaticipant = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyEuroNavP(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateEuroNavNominee = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyEuroNavN(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateSurveyQsort = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyQsort(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const populateSurveyVFP = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  prePopulateSurveyVFP(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
export const surveyBuilderPrepopulate = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  const surveyAssignmentId = req.params.survey_assignment_id
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  surveyBuilderPrepopulateM(surveyAssignmentId, orgId, suborgId, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
