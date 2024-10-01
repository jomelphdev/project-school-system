import {
    createReportTemplateM,
    checkExistReportTemplateByNameM,
    getAllReportTemplates,
    updateReportTemplateM,
    updateReportTemplateByIdM,
    deleteReportTemplateM
} from "../models/reportTemplateM.js";

// import function to check token
import check_token from "./functions.js";
  
  // create report template
export const createReportTemplate = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    const data = req.body
    createReportTemplateM(data, (err, results) => {
        if (err) return res.send(err) 
        res.json(results)
    });
};

// check report template name if already exist 
export const checkExistReportTemplateByName = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    checkExistReportTemplateByNameM(req.params.report_template_name, (err, results) => {
        if (err) return res.send(err) 
        res.json(results)
    });
};

export const showAllReportTemplates = (req, res) => {
    if (check_token(req.header('token')) !== 200)
      return res.status(check_token(req.header('token'))).send('')
    getAllReportTemplates((err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }
  
// update report template by report template name
export const updateReportTemplate = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    const data = req.body
    updateReportTemplateM(data, (err, results) => {
        if (err) return res.send(err) 
        res.json(results)
    });
};

// update report template by report template id
export const updateReportTemplateById = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    const data = req.body
    const id = req.params.id
    updateReportTemplateByIdM(id, data, (err, results) => {
        if (err) return res.send(err) 
        res.json(results)
    });
};

// delete report template by report template id
export const deleteReportTemplate = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    deleteReportTemplateM(req.params.id, (err, results) => {
        if (err) return res.send(err) 
        res.json(results)
    });
};
  