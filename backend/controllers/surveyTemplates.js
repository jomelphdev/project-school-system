import {
  getAllSurveyTemplates,
  getOrgSurveyTemplates,
  insertSurveyTemplate,
  deleteSurveyTemplateById,
  updateSurveyTemplateById,
  getAllTemplates,
  showSurveyTemplateNameM,
  getAllDataSurveyTemplates,
  getPrepolupateEndpointTemplatesM,
  getCalculateEndpointTemplatesM,
  getSurveyTemplateBySurveyTemplateId,
  getSurveyTemplateBySurveyTemplateNameM,
  updateNomineeSuveytemplateIdM,
  getSurveyTemplateByVersionM,
  checkExistSurveyTemplateByNameM
} from '../models/SurveyTemplate.js'

// import function to check token
import check_token from './functions.js'

// Get All SubOrganization
export const showAllSurveyTemplates = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllSurveyTemplates(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Get All Survey Template
export const showAllTemplates = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getAllTemplates((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Get All Survey Template
export const showSurveyTemplateName = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  
  showSurveyTemplateNameM((err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Get Org Survey Templates
export const showOrgSurveyTemplates = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getOrgSurveyTemplates(req.params.id, req.params.suborg_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//get survey templates by survey template id
export const showSurveyTemplateBySurveyTemplateId = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  getSurveyTemplateBySurveyTemplateId(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Create New Survey Template
export const createSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  insertSurveyTemplate(req.body, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Delete Survey Template
export const deleteSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  deleteSurveyTemplateById(req.params.id, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}

// Update Survey Template
export const updateSurveyTemplate = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
  const data = req.params
  updateSurveyTemplateById(req.params.id, req.body, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}


export const showAllDataSurveyTemplates = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getAllDataSurveyTemplates((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

// Get pre populate survey endpoint
export const getPrepolupateEndpointTemplates = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    getPrepolupateEndpointTemplatesM(req.params.surveyTemplateId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// Get pre populate survey endpoint
export const getCalculateEndpointTemplates = (req, res) => {
  if (check_token(req.header('token')) !== 200)
    return res.status(check_token(req.header('token'))).send('')
    getCalculateEndpointTemplatesM(req.params.surveyTemplateId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// get survey_template_id by survey_template_name
export const getSurveyTemplateBySurveyTemplateName = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

  getSurveyTemplateBySurveyTemplateNameM(req.params.survey_template_name, (err, results) => {
      if (err) return res.send(err) 
      res.json(results)
  });
};
// Update nominee_survey_template_id
export const updateNomineeSuveytemplateId = (req, res) => {
  if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
  const survey_template_id = req.params.survey_template_id
  const data = req.body
  updateNomineeSuveytemplateIdM(survey_template_id, data, (err, results) => {
    if (err) {
      res.send(err)
    } else { 
      res.json(results)
    }
  })
}
// get survey template with version 2
export const getSurveyTemplateByVersion = (req, res) => {
    if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')
    getSurveyTemplateByVersionM((err, results) => {
        if (err) {
            res.send(err)
        } else { 
            res.json(results)
        }
    })
}


export const checkExistSurveyTemplateByName = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

  checkExistSurveyTemplateByNameM(req.params.survey_template_name, (err, results) => {
      if (err) return res.send(err) 
      res.json(results)
  });
};