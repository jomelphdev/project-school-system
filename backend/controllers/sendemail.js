import {
    getAllSendEmail,
    insertSendEmail,
    updatesSendEmailBySurveyAssignmentId,
    handleEvent,
    getSendEmailbyIndId,
    getSendEmailbySendTo
  } from '../models/SendEmail.js'
  
  // import function to check token
  import check_token from "./functions.js";
  
  // Get All sendemails
  export const showAllSendEmail = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getAllSendEmail((err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }


  export const viewSendEmailByIndId = (req, res) => {
    if (check_token(req.header('token')) !== 200)
      return res.status(check_token(req.header('token'))).send('')
    const indId = req.params.ind_id
    getSendEmailbyIndId(indId, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

  export const viewSendEmailBySendTo = (req, res) => {
    if (check_token(req.header('token')) !== 200)
      return res.status(check_token(req.header('token'))).send('')
    const email = req.params.email
    getSendEmailbySendTo(email, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }
  
  // Create New Send Email
  export const createSendEmail = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    insertSendEmail(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

// update the status of email of send_email and survey_assignment 
export const updateSendEmailBySurveyAssignmentId = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  updatesSendEmailBySurveyAssignmentId(req.params.survey_assignment_id, req.body, (err, results) => {
    if (err) return res.json(err)
    res.json(results)
  });
};

export const sendEmailWebhook = (req, res) => {
  handleEvent(req.body, (err, results) => {
    if (err) {
      console.log("Send Email Webhook Error", err);
    }
    else {
      console.log(results);
    }
  })
};
  