import {
    getVFPReportM,
  } from '../models/vfpM.js'
  
  import check_token from "./functions.js"
  
  //todo Delete qsort cohort record
  export const getVFPReport = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getVFPReportM(req.params.survey_assignment_id, (err, results) => {
      if (err) return res.send(err)
      res.json(results)
    })
  }