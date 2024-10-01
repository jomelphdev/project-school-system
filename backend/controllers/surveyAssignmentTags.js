import {
  findSharingTags,
  insertSurveyAssignmentTag,
  deleteTagBySurveyAssignmentId
} from '../models/SurveyAssignmentTag.js'

import check_token from './functions.js'

export const showSharingTags = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  findSharingTags(
    req.params.org_id,
    req.params.survey_assignment_id,
    (err, results) => {
      if (err) return res.send(err)
      res.json(results)
    }
  )
}

export const createSurveyAssignmentTag = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    const data = req.body;
  insertSurveyAssignmentTag(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
}

export const removeTagBySurveyAssignmentId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id;
  const tagId = req.params.tag_id;
  deleteTagBySurveyAssignmentId(surveyAssignmentId, tagId, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};