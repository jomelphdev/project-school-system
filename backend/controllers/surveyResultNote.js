import {
    insertSurveyResultNote,
    getAllSurveyResultNoteBySurveyIdAndSectionAndResolvedStatus,
    updateSurveyResultNoteById,
    updateSurveyResultNoteResolvedStatusById
  } from '../models/SurveyResultNote.js'
  
  // import function to check token
  import check_token from "./functions.js";
  
  // Create New SurveyResult
  export const createSurveyResultNote = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    insertSurveyResultNote(data, (err, results) => {
      if (err) return res.send(err)
      res.json(results)
    })
  }

  // get survey result note by survey assignment id and section_num
  export const showAllSurveyResultNoteBySurveyIdAndSectionAndResolvedStatus = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getAllSurveyResultNoteBySurveyIdAndSectionAndResolvedStatus(req.params.id, req.params.section_num, req.params.resolved_status, (err, results) => {
      if (err) return res.send(err)
      res.json(results)
    })
  }

  // Update Survey Result Note
export const updateSurveyResultNote = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  updateSurveyResultNoteById(req.params.id, req.body, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// update note status to resolved by id
export const updateSurveyResultNoteResolvedStatus = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  updateSurveyResultNoteResolvedStatusById(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}


  