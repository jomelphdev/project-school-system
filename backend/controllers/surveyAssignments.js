import {
  updateSurveyAssignmentDates,
  postSurveyAssignment,
  getAllSurveyAssignments,
  findSingleSurveyAssignmentById,
  findSingleSurveyActiveRemindersById,
  updateStatementAnswerByAssignmentId,
  viewSurveyAssignmentById,
  findSingleSurveyAssignmentByIndID,
  getAllNominationsData,
  getAllNomineeData,
  updateSharedReports,
  getAllSurveyAssignmentNominees,
  getSurveyAssignmentByOrgAndSuborg,
  getSurveyAssignmentByOrg,
  updateCoachAccessGrantedByAssignmentId,
  updateCoachGroupAccessGrantedByAssignmentId,
  updateHrAccessGrantedByAssignmentId,
  updateNumberOfRespondentsByAssignmentId,
  updateEmails,
  updatesRelationshipId,
  findSingleSurveyAssignmentTagById,
  getSurveyAssignmentByOrgAndSuborgAndProgram,
  getSurveyAssignmentByOrgAndSuborgAndProgramAndIteration,
  getSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream,
  getSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate,
  getSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate,
  getSurveyAssignmentByOrgSuborgProgramSurveyTemplate,
  getSurveyAssignmentByOrgSuborgSurveyTemplate,
  getSurveyAssignmentBySurveyAssignmentId,
  getParticipantNameBySurveyAssignmentId,
  updateChangeGroupName,
  updateChangeStreamName,
  updateChangeIterationName,
  updateChangeProgramName,
  updateChangeSubOrgName,
  updateDropandUndrop,
  unSubmitSurvey,
  updateCoachName,
  updateCoachPermission,
  findSingleSurveyAssignmentByEmailAndParentID,
  updateSurveyOpenedStatus,
  updateCompleteSurveyStatus,
  updateNoDuplicateStatus,
  updateCompleteCalculationStatus,
  updateNomineeSuborgByParentSurveyAssignmentId,
  updateNomineeProgramByParentSurveyAssignmentId,
  updateNomineeIterationByParentSurveyAssignmentId,
  updateNomineeGroupByParentSurveyAssignmentId,
  updateNomineeStreamByParentSurveyAssignmentId,
  getAllSurveyStatisticsByIterationAndTemplate,
  getAllSurveyStatisticsByIteration,
  getClientSurveyAssignmentByOrg,
  getClientSurveyAssignmentByOrgAndSuborg,
  getClientSurveyAssignmentByOrgAndSuborgAndProgram,
  getClientSurveyAssignmentByOrgAndSuborgAndProgramAndIteration,
  getClientSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream,
  getClientSurveyAssignmentByOrgSuborgSurveyTemplate,
  getClientSurveyAssignmentByOrgSuborgProgramSurveyTemplate,
  getClientSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate,
  getClientSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate,
  getDataforCreatingCSVM,
  getRailroadStatusM,
  updateRailroadStatusM,
  updateRecipentEmailByIndId,
  getEarliestFinalDeadlineDateByIterationIdM,
  updateIsPdfAvailableBySurveyAssignmentIdM,
  updateSurveyPdfAvailableM
} from '../models/SurveyAssignment.js'

// import function to check token
import check_token from './functions.js'

// create survey template
export const createSurveyAssignment = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  postSurveyAssignment(req.body, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Get All Survey Assignment by joining other tables
export const showAllSurveyAssignment = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllSurveyAssignments(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Get Single Survey Assignment by survey_assignment_id
export const showSingleSurveyAssignmentById = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  findSingleSurveyAssignmentById(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Get all Surveys by ind_id
export const showAllSurveyAssignmentbyIndID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  findSingleSurveyAssignmentByIndID(req.params.ind_id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Get Survey Active Reminders by  survey_assignment_id
export const showSingleActiveRemindersById = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  findSingleSurveyActiveRemindersById(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Update statement answer by survey_assignment)_i
export const updateStmtAnswerByAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateStatementAnswerByAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// view single survey_assignment by survey_assingment_id
export const viewOneSurveyAssignmentById = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  viewSurveyAssignmentById(id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results[0])
    }
  })
}

//get data to use in making a nomination
export const showNominationsData = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllNominationsData(req.params.survey_assignment_id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

export const showNomineeData = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllNomineeData(req.params.survey_assignment_id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Update shared report with coach
export const updateSharedReport = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  updateSharedReports(req.params.id, req.body, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

//get nominees by parent_survey_assignment_id
export const showSurveyAssignmentNominees = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllSurveyAssignmentNominees(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}
export const viewSurveyAssignmentByOrg = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  getSurveyAssignmentByOrg(orgId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update coach_access_granted by survey_assignment_id
export const updateCoachGrantedByAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateCoachAccessGrantedByAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const updateSurveyAssignmentDatesAndTime = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateSurveyAssignmentDates(id, data, (err, results) => {
    console.log(results)
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const updateCoachPermissionStatus = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateCoachPermission(id, data, (err, results) => {
    console.log(results)
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Update coach_group_access_granted by survey_assignment_id
export const updateCoachGroupGrantedByAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateCoachGroupAccessGrantedByAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update hr_access_granted by survey_assignment_id
export const updateHrGrantedByAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateHrAccessGrantedByAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update number_of_respondents by survey_assignment_id
export const updateNumberofRespondentsByAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateNumberOfRespondentsByAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// update email and recipient_email in individual and survey assignment
export const updateEmail = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  updateEmails(req.params.id, req.body, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// update relationship_id in survey assignment
export const updateRelationshipId = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  updatesRelationshipId(req.params.id, req.body, (err, results) => {
    if (err) return res.json(err)
    res.json(results)
  })
}

// check tags if existing in survey_assignment for hide/show shared reports
export const showSurveyAssignmentTag = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  findSingleSurveyAssignmentTagById(req.params.sharedreport, req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

export const UpdateChangeGroupNamebyID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateChangeGroupName(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const UpdateStreamNamebyID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateChangeStreamName(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const UpdateIterationNamebyID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateChangeIterationName(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const UpdateProgramNamebyID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateChangeProgramName(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const UpdateSubOrgNamebyID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateChangeSubOrgName(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const UpdateDropandUndropbyID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateDropandUndrop(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const UpdateSubmitSurveybyID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  unSubmitSurvey(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const UpdateCoachNameByID = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateCoachName(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentByOrgAndSuborg = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  getSurveyAssignmentByOrgAndSuborg(orgId, suborgId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentByOrgAndSuborgAndProgram = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  getSurveyAssignmentByOrgAndSuborgAndProgram(orgId, suborgId, programId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentByOrgAndSuborgAndProgramAndIteration = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  const iterationId = req.params.iteration_id
  getSurveyAssignmentByOrgAndSuborgAndProgramAndIteration(orgId, suborgId, programId, iterationId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  const iterationId = req.params.iteration_id
  const streamId = req.params.stream_id
  getSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream(orgId, suborgId, programId, iterationId, streamId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentBySurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  getSurveyAssignmentBySurveyAssignmentId(id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  const iterationId = req.params.iteration_id
  const streamId = req.params.stream_id
  const surveyTemplateId = req.params.template_id
  getSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate(orgId, suborgId, programId, iterationId, streamId, surveyTemplateId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  const iterationId = req.params.iteration_id
  const surveyTemplateId = req.params.template_id
  getSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate(orgId, suborgId, programId, iterationId, surveyTemplateId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentByOrgSuborgProgramSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  const surveyTemplateId = req.params.template_id
  getSurveyAssignmentByOrgSuborgProgramSurveyTemplate(orgId, suborgId, programId, surveyTemplateId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewSurveyAssignmentByOrgSuborgSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const surveyTemplateId = req.params.template_id
  getSurveyAssignmentByOrgSuborgSurveyTemplate(orgId, suborgId, surveyTemplateId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// check email and parent survey assigment id if exist
export const showSingleSurveyAssignmentByEmailAndParentID = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  findSingleSurveyAssignmentByEmailAndParentID(req.params.id, req.params.email, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  });
};

export const viewParticipantNameBySurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  getParticipantNameBySurveyAssignmentId(id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Update survey_opened status
export const updateSurveyOpenedStatusBySurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const survey_assignment_id = req.params.survey_assignment_id
  const data = req.body
  updateSurveyOpenedStatus(survey_assignment_id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update complete_survey status
export const updateCompleteSurveyStatusBySurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const survey_assignment_id = req.params.survey_assignment_id
  const data = req.body
  updateCompleteSurveyStatus(survey_assignment_id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update no_duplicate status
export const updateNoDuplicateStatusBySurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const survey_assignment_id = req.params.survey_assignment_id
  const data = req.body
  updateNoDuplicateStatus(survey_assignment_id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update complete_calculation status
export const updateCompleteCalcualtionBySurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    updateCompleteCalculationStatus(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//update nominee suborg by parent survey assignment id//update nominee suborg by parent survey assignment id
export const changeSuborgByParentSurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateNomineeSuborgByParentSurveyAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//update nominee program by parent survey assignment id//update nominee suborg by parent survey assignment id
export const changeProgramByParentSurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateNomineeProgramByParentSurveyAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//update nominee iteration by parent survey assignment id//update nominee suborg by parent survey assignment id
export const changeIterationByParentSurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateNomineeIterationByParentSurveyAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//update nominee stream by parent survey assignment id//update nominee suborg by parent survey assignment id
export const changeStreamByParentSurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateNomineeStreamByParentSurveyAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//update nominee group by parent survey assignment id//update nominee suborg by parent survey assignment id
export const changeGroupByParentSurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateNomineeGroupByParentSurveyAssignmentId(id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


export const showSurveyStatisticsByIterationAndTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllSurveyStatisticsByIterationAndTemplate(req.params.iteration_id, req.params.template_id, req.params.nominee_template_id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

export const showSurveyStatisticsByIteration = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllSurveyStatisticsByIteration(req.params.iteration_id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}


export const viewClientSurveyAssignmentByOrg = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  getClientSurveyAssignmentByOrg(orgId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewClientSurveyAssignmentByOrgAndSuborg = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const orgId = req.params.org_id
    const suborgId = req.params.suborg_id
  getClientSurveyAssignmentByOrgAndSuborg(orgId, suborgId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewClientSurveyAssignmentByOrgAndSuborgAndProgram = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const orgId = req.params.org_id
    const suborgId = req.params.suborg_id
    const programId = req.params.program_id
  getClientSurveyAssignmentByOrgAndSuborgAndProgram(orgId, suborgId, programId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewClientSurveyAssignmentByOrgAndSuborgAndProgramAndIteration = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const orgId = req.params.org_id
    const suborgId = req.params.suborg_id
    const programId = req.params.program_id
    const iterationId = req.params.iteration_id
  getClientSurveyAssignmentByOrgAndSuborgAndProgramAndIteration(orgId, suborgId, programId, iterationId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewClientSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const programId = req.params.program_id
  const iterationId = req.params.iteration_id
  const streamId = req.params.stream_id
  getClientSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream(orgId, suborgId, programId, iterationId, streamId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewClientSurveyAssignmentByOrgSuborgSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const orgId = req.params.org_id
  const suborgId = req.params.suborg_id
  const surveyTemplateId = req.params.template_id
  getClientSurveyAssignmentByOrgSuborgSurveyTemplate(orgId, suborgId, surveyTemplateId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewClientSurveyAssignmentByOrgSuborgProgramSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const orgId = req.params.org_id
    const suborgId = req.params.suborg_id
    const programId = req.params.program_id
    const surveyTemplateId = req.params.template_id
  getClientSurveyAssignmentByOrgSuborgProgramSurveyTemplate(orgId, suborgId, programId, surveyTemplateId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewClientSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const orgId = req.params.org_id
    const suborgId = req.params.suborg_id
    const programId = req.params.program_id
    const iterationId = req.params.iteration_id
    const surveyTemplateId = req.params.template_id
  getClientSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate(orgId, suborgId, programId, iterationId, surveyTemplateId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const viewClientSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const orgId = req.params.org_id
    const suborgId = req.params.suborg_id
    const programId = req.params.program_id
    const iterationId = req.params.iteration_id
    const streamId = req.params.stream_id
    const surveyTemplateId = req.params.template_id
  getClientSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate(orgId, suborgId, programId, iterationId, streamId, surveyTemplateId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// for creating CSV
export const getDataforCreatingCSV = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const iteration_id = req.params.iteration_id
  const survey_template_id = req.params.survey_template_id
  getDataforCreatingCSVM(iteration_id,survey_template_id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// get railroad_status
export const getRailroadStatus = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const surveyAssignmentId = req.params.survey_assignment_id
    getRailroadStatusM(surveyAssignmentId,(err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// Update railroad_status
export const updateRailroadStatus = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const body = req.body
    const surveyAssignmentId = req.params.survey_assignment_id
    updateRailroadStatusM(body, surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const changeRecipentEmailByIndId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const id = req.params.id;
  const data = req.body;
  updateRecipentEmailByIndId(id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const getEarliestFinalDeadlineDateByIterationId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const iterationId = req.params.id;

  getEarliestFinalDeadlineDateByIterationIdM(iterationId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results[0]);
    }
  });
};

export const updateIsPdfAvailableBySurveyAssignmentId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const id = req.params.id
  const data = req.body
  updateIsPdfAvailableBySurveyAssignmentIdM(id, data, (err, results) => {
    console.log(results)
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}
// make pdf available
export const updateSurveyPdfAvailable = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

  updateSurveyPdfAvailableM(req.params.survey_assignment_id, (err, results) => {
    if (err) return res.json(err);
    res.json(results);
  });
};
