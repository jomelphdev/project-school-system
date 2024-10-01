import {
    findEmailTemplateByIds,
    findSingleEmailTemplateByIds,
    findSingleEmailTemplateForNominationByIds,
    insertEmailTemplate,
    deleteEmailTemplateById,
    updateEmailTemplateByIds
} from '../models/EmailTemplate.js'

// import function to check token
import check_token from "./functions.js";

// Get All Email Template By IDs
export const showEmailTemplateByIds = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    findEmailTemplateByIds(req.params.org_id, req.params.suborg_id, req.params.program_id, (err, results) => {
        if (err) return res.send(err)
        res.json(results)
    })
}

// Get Single Email Template
export const showSingleEmailTemplateByIds = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.params
    findSingleEmailTemplateByIds(data.template_type, data.org_id, data.suborg_id, data.program_id, (err, results) => {
        if (err) return res.send(err)
        res.json(results)
    })
}

// Get Single Email Template
export const showSingleEmailTemplateForNomminationByIds = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.params
    findSingleEmailTemplateForNominationByIds(data.template_type, data.org_id, data.suborg_id, data.program_id, (err, results) => {
        if (err) return res.send(err)
        res.json(results)
    })
}

// Create New Email Template
export const createEmailTemplate = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    insertEmailTemplate(req.body, (err, results2) => {
        if (err) return res.send(err)
        res.json({message:"added", paylaod:results2})
    })
    
}

// Update Email Template
export const updateEmailTemplate = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.params
    updateEmailTemplateByIds(data.template_type, data.org_id, data.suborg_id, data.program_id, req.body, (err, results) => {
        if (err) return res.send(err)
        res.json(results)
    })
}

// Delete Email Template
export const deleteEmailTemplate = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    deleteEmailTemplateById(req.params.template_type,req.params.org_id,req.params.suborg_id,req.params.program_id, (err, results) => {
        if (err) return res.send(err)
        res.json(results)
    })
}