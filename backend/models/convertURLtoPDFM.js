import db from '../config/database.js';
import axios, * as others from 'axios';
import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import pdf from 'html-pdf';
import moment from 'moment'

export const addMultiplePDFGeneratedData = (dataList, result) => {
    const values = dataList.map(data => [
        data.pdf_file_name,
        data.pdf_path,
        data.report_template_id,
        data.ind_id,
        data.coach_id,
        data.faculty_id,
        data.org_id,
        data.suborg_id,
        data.program_id,
        data.iteration_id,
        data.group_id,
        data.created_by,
        data.modified_by,
        new Date(),
        new Date()
    ]);

    db.query(
        'INSERT INTO pdf_generated (pdf_file_name, pdf_path, report_template_id, ind_id, coach_id, org_id, suborg_id, program_id, iteration_id, steam_id, group_id, created_by, modified_by, created_at, modified_at) VALUES ?',
        [values],
        (err, results) => {
            if (err) {
                console.error(err);
                result(err, null);
            } else {
                result(null, results);
            }
        }
    );
};

export const getAllParameters = (result) => {

    /* 
        process here if iteration meets the final deadline date 
    */

    const iterationId = 186
    const templateType = "Participant survey launch"

    // get data from survey assignment
    db.query(`
        SELECT i.ind_id, s.survey_template_id, CONCAT(i.first_name, ' ', i.last_name) AS full_name, s.survey_assignment_id, s.org_id, s.suborg_id, s.program_id, s.iteration_id, s.group_id, s.coach_id
        FROM survey_assignment s
        JOIN individual i ON s.ind_id = i.ind_id
        WHERE iteration_id = ${iterationId}
    `,
        (err, surveyAssignmentOutput) => {
            if (err) {
                console.log(err)
                result(err, null)
            }
            else {
                // get data from brand
                const orgId = surveyAssignmentOutput[0].org_id
                const suborgId = surveyAssignmentOutput[0].suborg_id
                const programId = surveyAssignmentOutput[0].program_id
                const surveyAssignmentIds = surveyAssignmentOutput.map(row => row.survey_assignment_id);
                db.query(`
            SELECT *
            FROM brand b
            JOIN (
                SELECT COALESCE(
                    (
                        SELECT brand_id FROM brand
                        WHERE org_id = ${orgId}
                        AND suborg_id = ${suborgId}
                        LIMIT 1
                    ),
                    (
                        SELECT brand_id FROM brand
                        WHERE org_id = ${orgId}
                        AND suborg_id = 0
                        LIMIT 1
                    )
                ) AS brand_id
            ) AS bid ON bid.brand_id = b.brand_id
        `,
                    (err, brandOutput) => {
                        if (err) {
                            console.log(err)
                            result(err, null)
                        }
                        else {
                            // get email template
                            db.query(`
                    SELECT et.email_template_id, et.template_type, et.subject, et.email_body FROM email_template et,
                    (
                        SELECT
                            IF(
                                (	
                                    SELECT email_template_id FROM email_template et
                                    WHERE et.template_type = '${templateType}'
                                    AND et.org_id = ${orgId} 
                                    AND et.suborg_id = ${suborgId} 
                                    AND et.program_id = ${programId}
                                    LIMIT 1
                                )  IS NULL, 
                                (
                                IF(	
                                    (	
                                        SELECT email_template_id FROM email_template et
                                        WHERE et.template_type = '${templateType}'
                                        AND et.org_id = ${orgId} 
                                        AND et.suborg_id = ${suborgId} 
                                        AND et.program_id = 0
                                        LIMIT 1
                                    ) IS NULL,
                                    (
                                        SELECT email_template_id FROM email_template et
                                        WHERE et.template_type = '${templateType}'
                                        AND et.org_id = ${orgId} 
                                        AND et.suborg_id = 0 
                                        AND et.program_id = 0
                                        LIMIT 1
                                    ),
                                    (
                                        SELECT email_template_id FROM email_template et
                                        WHERE et.template_type = '${templateType}'
                                        AND et.org_id = ${orgId} 
                                        AND et.suborg_id = ${suborgId} 
                                        AND et.program_id = 0
                                        LIMIT 1
                                    )
                                )
                            ), 
                            (
                                SELECT email_template_id FROM email_template et
                                WHERE et.template_type = '${templateType}'
                                AND et.org_id = ${orgId} 
                                AND et.suborg_id = ${suborgId} 
                                AND et.program_id = ${programId}
                                LIMIT 1
                            )
                        ) AS email_template_id
                    ) AS etid
                    WHERE etid.email_template_id = et.email_template_id
                `,
                                (err, emailTemplateOutput) => {
                                    if (err) {
                                        console.log(err)
                                        result(err, null)
                                    }
                                    else {
                                        // get sex and country
                                        db.query(`
                            SELECT
                            sa.survey_assignment_id,
                            (SELECT sr.answer
                            FROM survey_result sr
                            WHERE sr.statement_num = 'Q121' AND sr.survey_assignment_id = sa.survey_assignment_id) AS country,
                            (SELECT sr.answer
                            FROM survey_result sr
                            WHERE sr.statement_num = 'Q122' AND sr.survey_assignment_id = sa.survey_assignment_id) AS gender
                            FROM survey_assignment sa
                            WHERE sa.survey_assignment_id 
                            IN (${surveyAssignmentIds})
                        `,
                                            (err, surveyResultOutput) => {
                                                if (err) {
                                                    console.log(err)
                                                    result(err, null)
                                                }
                                                else {
                                                    const additionalInfoArray = surveyResultOutput

                                                    // viewer_fullname is logged in user so I set it to null 

                                                    // Create a map for quick lookup based on survey_assignment_id
                                                    const additionalInfoMap = new Map(additionalInfoArray.map(info => [info.survey_assignment_id, info]));

                                                    const currentReport = surveyAssignmentOutput.flatMap(cr => {
                                                        const additionalInfo = additionalInfoMap.get(cr.survey_assignment_id) || {};
                                                        const countryParam = additionalInfo.country ? `&country=${additionalInfo.country}` : '&country=null';
                                                        const genderParam = additionalInfo.gender ? `&sex=${additionalInfo.gender}` : '&sex=null';

                                                        return `${brandOutput[0].website_url}&survey_assignment_id=${cr.survey_assignment_id}&viewer_fullname=${cr.full_name}&org_id=${cr.org_id}&subOrg_id=${cr.suborg_id}&program_id=${cr.program_id}&iteration_id=${cr.iteration_id}${countryParam}${genderParam}&expand_all=true`;
                                                    }).map(str => str.trim());

                                                    result(null, { "current_report": currentReport });
                                                    // result(null, surveyResultOutput)
                                                    // result(null, surveyAssignmentIds)
                                                    // result(null, surveyAssignmentOutput)
                                                }
                                            })


                                        // get the current report
                                        // const currentReport = surveyAssignmentOutput.flatMap(cr => `
                                        //     ${brandOutput[0].website_url}&survey_assignment_id=${cr.survey_assignment_id}&org_id=${cr.org_id}&subOrg_id=${cr.suborg_id}&program_id=${cr.program_id}&iteration_id=${cr.iteration_id}&expand_all=true
                                        // `).map(str => str.trim());

                                        // result(null, 
                                        //     { "current_report" : currentReport } 
                                        // )
                                        // result(null, emailTemplateOutput)
                                    }
                                })

                            // result(null, brandOutput)
                        }
                    })

                // result(null, surveyAssignmentOutput)
            }
        })
}

// remove spacing of pdf file name
function removeSpaces(inputString) {
    return inputString.replace(/\s/g, '');
}

// insert pdf data
export const insertPDFdataM = (data, result) => {
    // Start a transaction
    db.beginTransaction((beginErr) => {
        if (beginErr) {
            console.log(beginErr);
            result(beginErr, null);
            return;
        }

        db.query(`
            SELECT * FROM pdf_generated 
            WHERE report_template_id = ?
            AND survey_assignment_id = ?
            LIMIT 1
        `,
        [data.report_template_id, data.survey_assignment_id],
        (selectErr, results) => {
            if (selectErr) {
                console.log(selectErr);
                return db.rollback(() => result(selectErr, null)); // Rollback on error
            }

            if (results.length !== 0) {
                // Data exists, delete and then insert new
                deletePDFdata(data, (deleteErr, deleteResult) => {
                    if (deleteErr) {
                        console.log(deleteErr);
                        return db.rollback(() => result(deleteErr, null)); // Rollback on error
                    }

                    // Deletion successful, now insert new data
                    insertPDFdata(data, (insertErr, insertResult) => {
                        if (insertErr) {
                            console.log(insertErr);
                            return db.rollback(() => result(insertErr, null)); // Rollback on error
                        }

                        // Both delete and insert successful, commit the transaction
                        db.commit((commitErr) => {
                            if (commitErr) {
                                console.log(commitErr);
                                return db.rollback(() => result(commitErr, null)); // Rollback on error during commit
                            }

                            // Transaction committed successfully
                            result(null, {
                                status: "success",
                                message: "Data has been updated",
                                payload: insertResult
                            });
                        });
                    });
                });
            } else {
                // No data exists, insert new data only
                insertPDFdata(data, (insertErr, insertResult) => {
                    if (insertErr) {
                        console.log(insertErr);
                        return db.rollback(() => result(insertErr, null)); // Rollback on error
                    }
                    result(null, {
                        status: "success",
                        message: "Data has been inserted",
                        payload: insertResult
                    });
                });
            }
        });
    });
};

// insert pdf data function
function insertPDFdata(data, result) {
    db.query(
        `INSERT INTO pdf_generated (pdf_file_name, pdf_path, report_template_id, ind_id, survey_assignment_id, coach_id, s3_bucket, org_id, suborg_id, program_id, iteration_id, stream_id, group_id, created_by, modified_by, created_at, modified_at) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(), NOW())
        `,
        [
            removeSpaces(data.pdf_file_name),
            removeSpaces(data.pdf_path),
            data.report_template_id,
            data.ind_id,
            data.survey_assignment_id,
            data.coach_id,
            process.env.S3_BUCKET_NAME,
            data.org_id,
            data.suborg_id,
            data.program_id,
            data.iteration_id,
            data.stream_id,
            data.group_id,
            data.created_by,
            data.modified_by
        ],
        (err, results) => {
            if (err) {
                console.log(err)
                result(err, null)
            } else {
                result(null, results)
            }
        }
    )
}

// delete pdf data function
function deletePDFdata(data, result) {
    db.query(`
        DELETE FROM pdf_generated 
        WHERE report_template_id = ?
        AND survey_assignment_id = ?
    `, 
    [data.report_template_id, data.survey_assignment_id], 
    (err, results) => {
        if (err) {
            console.log(err)
            result(err, null)
        } else {
            result(null, results)
        }
    })
}

// function to combine Front page, Current report and Back page
async function combineHTMLandURL(urlReport, htmlFrontPage, htmlBackPage) {
    const browser = await puppeteer.launch({
        executablePath: process.env.S3_EXECUTABLE_PATH,
        args: ['--no-sandbox']
    });

    const pdfDoc = await PDFDocument.create();

    async function waitForImagesToLoad(page) {
        await page.waitForSelector('img', { waitUntil: 'networkidle0' });
    }
    // Convert Front Page HTML text to PDF
    const frontPagePdfBytes = await new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                executablePath: process.env.S3_EXECUTABLE_PATH,
                args: ['--no-sandbox']
            });
            const page = await browser.newPage();

            // Set the content of the page with your HTML
            await page.setContent(htmlFrontPage);

            // Wait for images to load
            await waitForImagesToLoad(page);

            // Convert the page to PDF buffer
            const pdfBuffer = await page.pdf({
                format: 'A4',
                displayHeaderFooter: true,
                printBackground: true,
                scale: 0.8
            }
            );

            // Close the browser
            await browser.close();

            resolve(pdfBuffer);
        } catch (err) {
            reject(err);
        }
    });

    const frontPagePdfDoc = await PDFDocument.load(frontPagePdfBytes);
    const frontPageCopiedPages = await pdfDoc.copyPages(frontPagePdfDoc, frontPagePdfDoc.getPageIndices());
    frontPageCopiedPages.forEach((copiedPage) => {
        pdfDoc.addPage(copiedPage);
    });

    // Add Current Report from URL
    const page = await browser.newPage();

    try {
        await page.goto(urlReport, { waitUntil: 'networkidle0', timeout: 60000 }); // Increase the timeout duration
        await page.waitForTimeout(2000); // Additional wait to ensure all dynamic content is loaded
    } catch (error) {
        console.error(`Error navigating to ${urlReport}:`, error.message);
        await browser.close();
        throw error; // Re-throw the error to indicate the failure
    }

    const urlReportPdfBytes = await page.pdf({
        format: 'A4',
        displayHeaderFooter: true,
        printBackground: true,
        scale: 0.8
    });

    const urlReportPdfDoc = await PDFDocument.load(urlReportPdfBytes);
    const urlReportCopiedPages = await pdfDoc.copyPages(urlReportPdfDoc, urlReportPdfDoc.getPageIndices());
    urlReportCopiedPages.forEach((copiedPage) => {
        pdfDoc.addPage(copiedPage);
    });

    await page.close();

    // Convert Back Page HTML text to PDF
    const backPagePdfBytes = await new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                executablePath: process.env.S3_EXECUTABLE_PATH,
                args: ['--no-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(htmlBackPage);
            await waitForImagesToLoad(page);
            const pdfBuffer = await page.pdf({
                format: 'A4',
                displayHeaderFooter: true,
                printBackground: true,
                scale: 0.8
            });
            await browser.close();

            resolve(pdfBuffer);
        } catch (err) {
            reject(err);
        }
    });

    const backPagePdfDoc = await PDFDocument.load(backPagePdfBytes);
    const backPageCopiedPages = await pdfDoc.copyPages(backPagePdfDoc, backPagePdfDoc.getPageIndices());
    backPageCopiedPages.forEach((copiedPage) => {
        pdfDoc.addPage(copiedPage);
    });

    await browser.close();

    return pdfDoc.save();
}

// convert tokens
async function convertTokenData(params) {
    let mergedSubjectAndBody = []

    for (const [index, surveyID] of params.surveyAssignmentIDs.entries()) {
        let getTemplate = node_baseurl + 'get-email-template-by-template-type/' + params.templateType + '/org/' + params.org_id + '/suborg/' + params.suborg_id + '/program/' + params.program_id;
        await axios.get(getTemplate, { headers: { "token": valid_token } })
            .then(async resp => {

                let s2_subject = resp.data.subject;
                let s2_email_body = resp.data.email_body;
                let s2_email_template_id = resp.data.email_template_id;

                let tokenValues = node_baseurl + 'get-token-values/' + surveyID
                // console.log("tokenValues: " + tokenValues);
                await axios.get(tokenValues, { headers: { "token": valid_token } })
                    .then(resp => {

                        let s3_user_full_name = resp.data.user_full_name;
                        let s3_email = resp.data.email;
                        let s3_logged_in = resp.data.logged_in;
                        let s3_recipient_email = resp.data.recipient_email;
                        let s3_nominee_salutation = resp.data.nominee_salutation;
                        let s3_nominee_message = resp.data.nominee_message;
                        let s3_program_name = resp.data.program_name;
                        let s3_org_name = resp.data.org_name;
                        let s3_website_url = resp.data.website_url;
                        let s3_website_sender_email = resp.data.website_sender_email;
                        let s3_website_terms_url = resp.data.website_terms_url;
                        let s3_website_privacy_url = resp.data.website_privacy_url;
                        let s3_website_contact_email = resp.data.website_contact_email;
                        let s3_survey_initial_close_date = resp.data.survey_initial_close_date;
                        let s3_survey_template_name = resp.data.survey_template_name;
                        let s3_survey_description = resp.data.survey_description;
                        let s3_suborg_name = resp.data.suborg_name;
                        let s3_days_until_survey_close_date = resp.data.days_until_survey_close_date;
                        let s3_survey_subject_full_name = resp.data.survey_subject_full_name;
                        let s3_survey_subject_first_name = resp.data.survey_subject_first_name;
                        let s3_iteration_name = resp.data.iteration_name;
                        let s3_survey_active_reminders = resp.data.survey_active_reminders;
                        let s3_brand_path = resp.data.brand_path;
                        let s3_header_bg_color = resp.data.header_bg_color;

                        let s3_participant_report_release_date = moment(resp.data.participant_report_start_date).format('MMM D, YYYY [at] h:mmA')
                        let s3_pdf_date_created = moment().format('MMM D, YYYY')
                        let s3_pdf_time_created = moment().format('h:mmA');
                        let s3_report_title = params.reportTemplateNames[index]

                        if (s2_subject == null) {
                            s2_subject = "Please inform your email template manager to create an email template for " + email_template_type;
                        }

                        if (s3_user_full_name == null) {
                            s3_user_full_name = " ";
                        }
                        if (s3_nominee_salutation == null) {
                            s3_nominee_salutation = " ";
                        }
                        if (s3_nominee_message == null) {
                            s3_nominee_message = " ";
                        }
                        if (s3_program_name == null) {
                            s3_program_name = " ";
                        }

                        if (s3_survey_initial_close_date == null) {
                            s3_survey_initial_close_date = " ";
                        }
                        if (s3_days_until_survey_close_date < 0) {
                            s3_days_until_survey_close_date = "already closed";
                        }
                        if (s3_survey_subject_full_name == null) {
                            s3_survey_subject_full_name = " ";
                        }
                        if (s3_survey_subject_first_name == null) {
                            s3_survey_subject_first_name = " ";
                        }
                        if (s3_iteration_name == null) {
                            s3_iteration_name = " ";
                        }

                        s2_subject = s2_subject.replaceAll("$USER_FULL_NAME$", s3_user_full_name);
                        s2_subject = s2_subject.replaceAll("$USER_EMAIL$", s3_email);
                        s2_subject = s2_subject.replaceAll("$RECIPIENT_EMAIL$", s3_recipient_email);
                        s2_subject = s2_subject.replaceAll("$NOMINEE_SALUTATION$", s3_nominee_salutation);
                        s2_subject = s2_subject.replaceAll("$NOMINEE_MESSAGE$", s3_nominee_message);
                        s2_subject = s2_subject.replaceAll("$SURVEY_PROGRAM_NAME$", s3_program_name);
                        s2_subject = s2_subject.replaceAll("$ORG_NAME$", s3_org_name);
                        s2_subject = s2_subject.replaceAll("$WEBSITE_URL$", s3_website_url);
                        s2_subject = s2_subject.replaceAll("$WEBSITE_SENDER_EMAIL$", s3_website_sender_email);
                        s2_subject = s2_subject.replaceAll("$WEBSITE_TERMS_URL$", s3_website_terms_url);
                        s2_subject = s2_subject.replaceAll("$WEBSITE_PRIVACY_URL$", s3_website_privacy_url);
                        s2_subject = s2_subject.replaceAll("$WEBSITE_CONTACT_EMAIL$", s3_website_contact_email);
                        s2_subject = s2_subject.replaceAll("$SURVEY_INITIAL_CLOSE_DATE$", s3_survey_initial_close_date);
                        s2_subject = s2_subject.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);
                        s2_subject = s2_subject.replaceAll("$SURVEY_DESCRIPTION$", s3_survey_description);
                        s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                        s2_subject = s2_subject.replaceAll("$DAYS_UNTIL_SURVEY_CLOSE_DATE$", s3_days_until_survey_close_date);
                        s2_subject = s2_subject.replaceAll("$SURVEY_SUBJECT_FULL_NAME$", s3_survey_subject_full_name);
                        s2_subject = s2_subject.replaceAll("$SURVEY_SUBJECT_FIRST_NAME$", s3_survey_subject_first_name);
                        s2_subject = s2_subject.replaceAll("$SURVEY_ITERATION_NAME$", s3_iteration_name);
                        s2_subject = s2_subject.replaceAll("$SURVEY_ACTIVE_REMINDERS$", s3_survey_active_reminders);
                        s2_subject = s2_subject.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);
                        s2_subject = s2_subject.replaceAll("$PARTICIPANT_REPORT_RELEASE_DATE$", s3_participant_report_release_date);
                        s2_subject = s2_subject.replaceAll("$PDF_DATE_CREATED$", s3_pdf_date_created);
                        s2_subject = s2_subject.replaceAll("$PDF_TIME_CREATED$", s3_pdf_time_created);
                        s2_subject = s2_subject.replaceAll("$REPORT_TITLE$", s3_report_title);

                        let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";

                        if (s3_logged_in == 1) {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                        }

                        //SURVEY_SUB_ORGANIZATION_NAME
                        //SUBORG_NAME
                        if (s2_email_template_id == null) {
                            s2_email_template_id = 0;
                        }
                        if (s3_website_sender_email == null) {
                            s3_website_sender_email = "help@talentsage.com";
                        }
                        if (s3_recipient_email == null) {
                            s3_recipient_email = "help@talentsage.com";
                        }

                        if (s2_email_body == null) {
                            s2_email_body = "Please inform your email template manager to create an email template for " + email_template_type;
                        }
                        //logo 
                        if (s3_header_bg_color == null) {
                            s3_header_bg_color = "#ffffff";
                        }

                        let s3_logo = `<div style='background: ${s3_header_bg_color}; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);'><img style='max-width: 100%; height: 60px;' src='${s3_website_url}${s3_brand_path}/logo.png' alt='Brand Logo'/></div>`;

                        s2_email_body = s2_email_body.replaceAll("$LOGO$", s3_logo);

                        s2_email_body = s2_email_body.replaceAll("$USER_FULL_NAME$", s3_user_full_name);
                        s2_email_body = s2_email_body.replaceAll("$USER_EMAIL$", s3_email);
                        s2_email_body = s2_email_body.replaceAll("$RECIPIENT_EMAIL$", s3_recipient_email);
                        s2_email_body = s2_email_body.replaceAll("$NOMINEE_SALUTATION$", s3_nominee_salutation);
                        s2_email_body = s2_email_body.replaceAll("$NOMINEE_MESSAGE$", s3_nominee_message);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_PROGRAM_NAME$", s3_program_name);
                        s2_email_body = s2_email_body.replaceAll("$ORG_NAME$", s3_org_name);
                        s2_email_body = s2_email_body.replaceAll("$WEBSITE_URL$", s3_website_url);
                        s2_email_body = s2_email_body.replaceAll("$WEBSITE_SENDER_EMAIL$", s3_website_sender_email);
                        s2_email_body = s2_email_body.replaceAll("$WEBSITE_TERMS_URL$", s3_website_terms_url);
                        s2_email_body = s2_email_body.replaceAll("$WEBSITE_PRIVACY_URL$", s3_website_privacy_url);
                        s2_email_body = s2_email_body.replaceAll("$WEBSITE_CONTACT_EMAIL$", s3_website_contact_email);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_INITIAL_CLOSE_DATE$", s3_survey_initial_close_date);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_DESCRIPTION$", s3_survey_description);

                        s2_email_body = s2_email_body.replaceAll("$SUBORG_NAME$", s3_suborg_name);

                        s2_email_body = s2_email_body.replaceAll("$DAYS_UNTIL_SURVEY_CLOSE_DATE$", s3_days_until_survey_close_date);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_SUBJECT_FULL_NAME$", s3_survey_subject_full_name);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_SUBJECT_FIRST_NAME$", s3_survey_subject_first_name);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_ITERATION_NAME$", s3_iteration_name);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_ACTIVE_REMINDERS$", s3_survey_active_reminders);
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);
                        s2_email_body = s2_email_body.replaceAll("$PARTICIPANT_REPORT_RELEASE_DATE$", s3_participant_report_release_date);
                        s2_email_body = s2_email_body.replaceAll("$PDF_DATE_CREATED$", s3_pdf_date_created);
                        s2_email_body = s2_email_body.replaceAll("$PDF_TIME_CREATED$", s3_pdf_time_created);
                        s2_email_body = s2_email_body.replaceAll("$REPORT_TITLE$", s3_report_title);

                        s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                        if (s3_logged_in == 1) {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                        }

                        // use this incase subject needed to show in the pdf
                        // mergedSubjectAndBody = "<div><p>" + s2_subject + "</p>" +s2_email_body + "</div>";
                        // mergedSubjectAndBody = s2_email_body

                        mergedSubjectAndBody.push(s2_email_body)
                        // mergedSubjectAndBody.push(resp.data)
                        // mergedSubjectAndBody.push(s3_report_title)
                        // mergedSubjectAndBody.push(s3_participant_report_release_date)
                    })
                    .catch(function (error) {
                        if (error.response) {
                            // Request made and server responded
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else if (error.request) {
                            // The request was made but no response was received
                            console.log(error.request);
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }

                    });
                //res.json(resp.data);
            })
            .catch(function (error) {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });

    }

    return mergedSubjectAndBody
}

// generate pdf by iteration
export const generateS3PDFIterationM = async (iteration_id, result) => {
    db.query(`
        SELECT
        org.org_name,
        sub.suborg_name,
        p.program_name,
        it.iteration_name,
        s.org_id,
        s.suborg_id,
        s.program_id,
        s.iteration_id,
        s.stream_id,
        s.group_id,
        s.coach_id,
        s.survey_assignment_id,
        s.ind_id,
        CONCAT(i.first_name, ' ', i.last_name) AS full_name,
        i.first_name,
        i.last_name,
        rt.report_template_id,
        rt.report_template_name,
        rt.report_file,
        s.is_nomination,
        s.recipient_email,
        s.survey_template_id,
        st.survey_template_name,
        st.survey_type,
        rt.is_coach_report,
        rt.is_faculty_report,
        rt.is_group_report,
        srQ121.answer AS country,
        srQ122.answer AS gender,
        q.qsort_type
        FROM
            survey_assignment s
        JOIN
            individual i ON s.ind_id = i.ind_id
        JOIN
            survey_template st ON s.survey_template_id = st.survey_template_id
        JOIN
            report_template rt ON rt.survey_template_id = st.survey_template_id
        JOIN
            org ON org.org_id = s.org_id
        JOIN 
            suborg sub ON sub.suborg_id = s.suborg_id
        JOIN 
            program p ON p.program_id = s.program_id
        JOIN
            iteration it ON it.iteration_id = ${iteration_id}
        LEFT JOIN
            survey_result srQ121 ON srQ121.survey_assignment_id = s.survey_assignment_id AND srQ121.statement_num = 'Q121'
        LEFT JOIN
            survey_result srQ122 ON srQ122.survey_assignment_id = s.survey_assignment_id AND srQ122.statement_num = 'Q122'
        LEFT JOIN 
            qsort_raw q ON q.iteration_id = ${iteration_id}
        WHERE
            s.iteration_id = ${iteration_id}
            AND s.is_nomination = 0
            AND rt.is_coach_report = 0
            AND rt.is_group_report = 0
            AND rt.is_faculty_report = 0
            AND s.is_participant_report_processed = 1
        `, // remove the limit and offset soon
        (err, surveyAssignmentOutput) => {
            if (err) {
                console.log(err)
                result(err, null)
            }
            else {

                if (surveyAssignmentOutput.length == 0) {
                    return result(null, {
                        status: "failed",
                        message: "No records found from database to create pdf",
                    })
                }

                const orgId = surveyAssignmentOutput[0].org_id
                const suborgId = surveyAssignmentOutput[0].suborg_id
                const programId = surveyAssignmentOutput[0].program_id
                const iterationId = surveyAssignmentOutput[0].iteration_id
                const orgName = surveyAssignmentOutput[0].org_name
                const suborgName = surveyAssignmentOutput[0].suborg_name
                const programName = surveyAssignmentOutput[0].program_name
                const iterationName = surveyAssignmentOutput[0].iteration_name
                const reportTemplateNames = surveyAssignmentOutput.map(row => row.report_template_name);
                const firstNames = surveyAssignmentOutput.map(row => row.first_name);
                const lastNames = surveyAssignmentOutput.map(row => row.last_name);
                const fullNames = surveyAssignmentOutput.map(row => row.full_name);
                const indIds = surveyAssignmentOutput.map(row => row.ind_id);
                const surveyAssignmentIds = surveyAssignmentOutput.map(row => row.survey_assignment_id);
                const streamIds = surveyAssignmentOutput.map(row => row.stream_id);
                const groupIds = surveyAssignmentOutput.map(row => row.group_id);
                const coachIds = surveyAssignmentOutput.map(row => row.coach_id);
                const reportTemplateIds = surveyAssignmentOutput.map(row => row.report_template_id);
                const qsortTypes = surveyAssignmentOutput.map(row => row.qsort_type || '');

                // get data from brand
                db.query(`
                    SELECT *
                    FROM brand b
                    JOIN (
                        SELECT COALESCE(
                            (
                                SELECT brand_id FROM brand
                                WHERE org_id = ${orgId}
                                AND suborg_id = ${suborgId}
                                LIMIT 1
                            ),
                            (
                                SELECT brand_id FROM brand
                                WHERE org_id = ${orgId}
                                AND suborg_id = 0
                                LIMIT 1
                            )
                        ) AS brand_id
                    ) AS bid ON bid.brand_id = b.brand_id
                `,
                    async (err, brandOutput) => {
                        if (err) {
                            console.log(err)
                            result(err, null)
                        }
                        else {

                            const urlReports = surveyAssignmentOutput.flatMap(cr => {
                                return `${brandOutput[0].website_url}${cr.report_file}?survey_assignment_id=${cr.survey_assignment_id}&viewer_fullname=${cr.full_name}&report_for_fullname=${cr.full_name}&org_id=${orgId}&subOrg_id=${suborgId}&program_id=${programId}&iteration_id=${iterationId}&country=${cr.country}&sex=${cr.gender}&qsort_type=${cr.qsort_type}&org_name=${orgName}&expand_all=true`;
                            }).map(str => str.trim());

                            // return result(null, urlReports)

                            const paramsFrontPage = {
                                "org_id": orgId,
                                "suborg_id": suborgId,
                                "program_id": programId,
                                "surveyAssignmentIDs": surveyAssignmentIds,
                                "reportTemplateNames": reportTemplateNames,
                                "templateType": "Front Page"
                            }
                            const frontPageHtmlData = await convertTokenData(paramsFrontPage)

                            // return result(null, frontPageHtmlData)

                            const paramsBackPage = {
                                "org_id": orgId,
                                "suborg_id": suborgId,
                                "program_id": programId,
                                "surveyAssignmentIDs": surveyAssignmentIds,
                                "reportTemplateNames": reportTemplateNames,
                                "templateType": "Back Page"
                            }
                            const backPageHtmlData = await convertTokenData(paramsBackPage)

                            let pdfBuffers = []

                            for (let i = 0; i < urlReports.length; i++) {
                                pdfBuffers.push(await combineHTMLandURL(urlReports[i], frontPageHtmlData[i], backPageHtmlData[i]))
                            }

                            // return  result(null, pdfBuffers[0])

                            return result(null, {
                                status: "success",
                                message: "PDFs have been created",
                                results: {
                                    "pdfBuffers": pdfBuffers,
                                    "indIds": indIds,
                                    "reportTemplateNames": reportTemplateNames,
                                    "reportTemplateIds": reportTemplateIds,
                                    "firstNames": firstNames,
                                    "lastNames": lastNames,
                                    "fullNames": fullNames,
                                    "streamIds": streamIds,
                                    "groupIds": groupIds,
                                    "coachIds": coachIds,
                                    "qsortTypes": qsortTypes,
                                    "orgName": orgName,
                                    "suborgName": suborgName,
                                    "programName": programName,
                                    "iterationName": iterationName,
                                    "s3_bucket": process.env.S3_BUCKET_NAME
                                }
                            })

                            // result(null, pdfBuffers)
                            // result(null, backPageHtmlData)
                            // result(null, frontPageHtmlData)
                            // result(null, surveyAssignmentIds)
                            // result(null, brandOutput);
                        }
                    })
                // result(null, surveyAssignmentOutput);
            }
        })

}

// generate pdf by survey assignment
export const generateS3PDFSurveyAssignmentM = async (survey_assignment_id, result) => {
    db.query(`
        SELECT
        org.org_name,
        sub.suborg_name,
        p.program_name,
        it.iteration_name,
        s.org_id,
        s.suborg_id,
        s.program_id,
        s.iteration_id,
        s.stream_id,
        s.group_id,
        s.coach_id,
        s.survey_assignment_id,
        s.ind_id,
        CONCAT(i.first_name, ' ', i.last_name) AS full_name,
        i.first_name,
        i.last_name,
        rt.report_template_id,
        rt.report_template_name,
        rt.report_file,
        s.is_nomination,
        s.recipient_email,
        s.survey_template_id,
        st.survey_template_name,
        st.survey_type,
        rt.is_coach_report,
        rt.is_faculty_report,
        rt.is_group_report,
        srQ121.answer AS country,
        srQ122.answer AS gender,
        q.qsort_type
        FROM
            survey_assignment s
        JOIN
            individual i ON s.ind_id = i.ind_id
        JOIN
            survey_template st ON s.survey_template_id = st.survey_template_id
        JOIN
            report_template rt ON rt.survey_template_id = st.survey_template_id
        JOIN
            org ON org.org_id = s.org_id
        JOIN 
            suborg sub ON sub.suborg_id = s.suborg_id
        JOIN 
            program p ON p.program_id = s.program_id
        JOIN
            iteration it ON it.iteration_id = s.iteration_id
        LEFT JOIN
            survey_result srQ121 ON srQ121.survey_assignment_id = s.survey_assignment_id AND srQ121.statement_num = 'Q121'
        LEFT JOIN
            survey_result srQ122 ON srQ122.survey_assignment_id = s.survey_assignment_id AND srQ122.statement_num = 'Q122'
        LEFT JOIN 
            qsort_raw q ON q.survey_assignment_id = ${survey_assignment_id}
        WHERE
            s.survey_assignment_id = ${survey_assignment_id}
            AND s.is_nomination = 0
            AND rt.is_coach_report = 0
            AND rt.is_group_report = 0
            AND rt.is_faculty_report = 0
            AND s.is_participant_report_processed = 1
        `, // remove the limit soon
        (err, surveyAssignmentOutput) => {
            if (err) {
                console.log(err)
                result(err, null)
            }
            else {

                if (surveyAssignmentOutput.length == 0) {
                    return result(null, {
                        status: "failed",
                        message: "No records found from database to create pdf",
                    })
                }

                const orgId = surveyAssignmentOutput[0].org_id
                const suborgId = surveyAssignmentOutput[0].suborg_id
                const programId = surveyAssignmentOutput[0].program_id
                const iterationId = surveyAssignmentOutput[0].iteration_id
                const orgName = surveyAssignmentOutput[0].org_name
                const suborgName = surveyAssignmentOutput[0].suborg_name
                const programName = surveyAssignmentOutput[0].program_name
                const iterationName = surveyAssignmentOutput[0].iteration_name
                const reportTemplateNames = surveyAssignmentOutput.map(row => row.report_template_name);
                const firstNames = surveyAssignmentOutput.map(row => row.first_name);
                const lastNames = surveyAssignmentOutput.map(row => row.last_name);
                const fullNames = surveyAssignmentOutput.map(row => row.full_name);
                const indIds = surveyAssignmentOutput.map(row => row.ind_id);
                const surveyAssignmentIds = surveyAssignmentOutput.map(row => row.survey_assignment_id);
                const streamIds = surveyAssignmentOutput.map(row => row.stream_id);
                const groupIds = surveyAssignmentOutput.map(row => row.group_id);
                const coachIds = surveyAssignmentOutput.map(row => row.coach_id);
                const reportTemplateIds = surveyAssignmentOutput.map(row => row.report_template_id);
                const qsortTypes = surveyAssignmentOutput.map(row => row.qsort_type || '');

                // get data from brand
                db.query(`
                    SELECT *
                    FROM brand b
                    JOIN (
                        SELECT COALESCE(
                            (
                                SELECT brand_id FROM brand
                                WHERE org_id = ${orgId}
                                AND suborg_id = ${suborgId}
                                LIMIT 1
                            ),
                            (
                                SELECT brand_id FROM brand
                                WHERE org_id = ${orgId}
                                AND suborg_id = 0
                                LIMIT 1
                            )
                        ) AS brand_id
                    ) AS bid ON bid.brand_id = b.brand_id
                `,
                    async (err, brandOutput) => {
                        if (err) {
                            console.log(err)
                            result(err, null)
                        }
                        else {
                            const urlReports = surveyAssignmentOutput.flatMap(cr => {
                                return `${brandOutput[0].website_url}${cr.report_file}?survey_assignment_id=${cr.survey_assignment_id}&viewer_fullname=${cr.full_name}&report_for_fullname=${cr.full_name}&org_id=${orgId}&subOrg_id=${suborgId}&program_id=${programId}&iteration_id=${iterationId}&country=${cr.country}&sex=${cr.gender}&qsort_type=${cr.qsort_type}&org_name=${orgName}&expand_all=true`;
                            }).map(str => str.trim());

                            // return result(null, urlReports)

                            const paramsFrontPage = {
                                "org_id": orgId,
                                "suborg_id": suborgId,
                                "program_id": programId,
                                "surveyAssignmentIDs": surveyAssignmentIds,
                                "reportTemplateNames": reportTemplateNames,
                                "templateType": "Front Page"
                            }
                            const frontPageHtmlData = await convertTokenData(paramsFrontPage)

                            // return result(null, frontPageHtmlData)

                            const paramsBackPage = {
                                "org_id": orgId,
                                "suborg_id": suborgId,
                                "program_id": programId,
                                "surveyAssignmentIDs": surveyAssignmentIds,
                                "reportTemplateNames": reportTemplateNames,
                                "templateType": "Back Page"
                            }
                            const backPageHtmlData = await convertTokenData(paramsBackPage)

                            let pdfBuffers = []

                            for (let i = 0; i < urlReports.length; i++) {
                                pdfBuffers.push(await combineHTMLandURL(urlReports[i], frontPageHtmlData[i], backPageHtmlData[i]))
                            }

                            // return  result(null, pdfBuffers[0])

                            return result(null, {
                                status: "success",
                                message: "PDFs have been created",
                                results: {
                                    "pdfBuffers": pdfBuffers,
                                    "indIds": indIds,
                                    "reportTemplateNames": reportTemplateNames,
                                    "reportTemplateIds": reportTemplateIds,
                                    "firstNames": firstNames,
                                    "lastNames": lastNames,
                                    "fullNames": fullNames,
                                    "orgId": orgId,
                                    "suborgId": suborgId,
                                    "programId": programId,
                                    "iterationId": iterationId,
                                    "streamIds": streamIds,
                                    "groupIds": groupIds,
                                    "coachIds": coachIds,
                                    "qsortTypes": qsortTypes,
                                    "orgName": orgName,
                                    "suborgName": suborgName,
                                    "programName": programName,
                                    "iterationName": iterationName,
                                    "surveyAssignmentIds": surveyAssignmentIds,
                                    "s3_bucket": process.env.S3_BUCKET_NAME
                                }
                            })

                            // result(null, pdfBuffers)
                            // result(null, backPageHtmlData)
                            // result(null, frontPageHtmlData)
                            // result(null, surveyAssignmentIds)
                            // result(null, brandOutput);
                        }
                    })
                // result(null, surveyAssignmentOutput);
            }
        })

}

// read pdf content 
export const getPdfContentM = async (data, result) => {
    db.query(`
        SELECT * FROM pdf_generated
        WHERE report_template_id = ?
        AND survey_assignment_id = ?
        LIMIT 1
    `,
        [data.report_template_id, data.survey_assignment_id],
        (err, results) => {
            if (err) {
                console.log(err)
                result(err, null)
            }
            else {
                if (results.length == 0) {
                    return result(null, "No records found!");
                }

                return result(null, {
                    "pdfPath": results[0].pdf_path
                });
            }
        })

}


export const getPdfGeneratedForCoachScreen = (data, result) => {
    db.query(
      `SELECT report_template_id FROM pdf_generated WHERE survey_assignment_id = ${data.survey_assignment_id} 
            AND pdf_file_name LIKE '%${data.pdf_file_name}%'`,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }