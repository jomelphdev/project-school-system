import db from "../config/database.js";

// Get all email template by ids
export const findEmailTemplateByIds = (org_id,suborg_id,program_id, result) => {
    db.query(
        "SELECT * FROM email_template WHERE org_id=? AND suborg_id=? AND program_id=? ",
        [org_id,suborg_id,program_id],
        (err, results) => {
            if (err) return result(err, null);
            result(null, results);
        }
    );
};

//? Get Single Email Template
export const findSingleEmailTemplateByIds = (template_type,org_id,suborg_id,program_id, result) => {
    db.query(
        "SELECT * FROM email_template WHERE template_type=? AND org_id=? AND suborg_id=? AND program_id=?",
        [template_type,org_id,suborg_id,program_id],
        (err, results) => {
            if (err) return result(err, null)
            result(null, results[0])
        }
    );
};

//? Get Single Email Template For Making Nomination
export const findSingleEmailTemplateForNominationByIds = (template_type,org_id,suborg_id,program_id, result) => {
    db.query(
        "SELECT * FROM email_template WHERE template_type=? AND org_id=? AND suborg_id=? AND program_id=?",
        [template_type,org_id,suborg_id,program_id],
        (err, results) => {
            if (err) return result(err, null)

            if(!results[0]) {
                return db.query(
                    "SELECT * FROM email_template WHERE template_type=? AND org_id=? AND suborg_id=0 AND program_id=0",
                    [template_type,org_id],
                    (err, results2) => {
                        if (err) return result(err, null)
                        
                        if(!results2[0]) return result({message:'error',payload: 'Please create an email template first'}) 
                        result({message:'success', payload: results2[0]})
                    }
                );
            }
            result({message:'success', payload: results[0]})

        }
    );
};

//? Create New Email Template
export const insertEmailTemplate = (data, result) => {
    db.query(
        "INSERT INTO email_template (template_type, org_id, suborg_id, program_id, subject, email_body, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)",
        [ data.template_type, data.org_id, data.suborg_id, data.program_id, data.subject, data.email_body, data.created_by, data.modified_by ],
        (err, results) => {
            if (err) return result(err, null);
            result(null, results);
        }
    );
};

//? Update Email Template
export const updateEmailTemplateByIds = (template_type, org_id, suborg_id, program_id, data, result) => {
    db.query(
        `UPDATE email_template SET subject = ?, email_body = ?, modified_at = NOW(), modified_by = ? 
        WHERE template_type = ? AND org_id=? AND suborg_id=? AND program_id=?`,
        [data.subject,data.email_body,data.modified_by,template_type,org_id,suborg_id,program_id],
        (err, results) => {
            if (err) return result(err, null);
            result(null, results);
        }
    );
};

//? Delete Individual
export const deleteEmailTemplateById = (template_type,org_id,suborg_id,program_id, result) => {
    db.query("DELETE FROM email_template WHERE template_type=? AND org_id=? AND suborg_id=? AND program_id=? ", 
    [template_type,org_id,suborg_id,program_id], (err, results) => {
        if (err) return result(err, null);
        result(null, results);
    });
};