import db from "../config/database.js";

import axios, * as others from 'axios';
import { response } from "express";
import { getBrandMaxLimitByOrgId } from "../controllers/brands.js";
import { getAllSurveyTemplateAssociation } from "./SurveyTemplateAssociation.js";
import moment from "moment";
import clickSendAPI from 'clicksend'
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const SES_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_SES_REGION,
};

const sesClient = new SESClient(SES_CONFIG);

const testSendEmail = async (name) => {
  let params = {
    Source: process.env.AWS_SES_SENDER,
    Destination: {
      ToAddresses: [
        'jhunrheycbohol@gmail.com', // Update the recipient email address
      ],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: '<h1> TESTING </h1>',
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'This is the sample body of email',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Hello, ${name}`,
      },
    },
  };
  try {
    const sendEmailCommand = new SendEmailCommand(params);
    const res = await sesClient.send(sendEmailCommand);
    console.log('Email has been sent!', res);
  } catch (error) {
    console.log('Error:', error);
  }
};


// Get All Organization
export const getAllSendEmail = (result) => {
  db.query("SELECT * FROM send_email", (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

export const getSendEmailbyIndId = (ind_id, result) => {
  db.query(`SELECT DATE_FORMAT(se.created_at, '%Y-%m-%d %H:%i')  AS datetime_sent_utc, et.template_type, se.subject, se.body, se.send_from, se.send_to, se.email_sent_status 
  FROM send_email se
  LEFT JOIN individual i ON se.ind_id = i.ind_id
  LEFT JOIN email_template et ON et.email_template_id = se.email_template_id
  WHERE se.ind_id = ?
  AND se.type = 'email'
  ORDER BY send_email_id DESC`, 
  [ind_id],
  (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};

export const getSendEmailbySendTo = (email, result) => {
  db.query(`SELECT DATE_FORMAT(se.created_at, '%Y-%m-%d %H:%i')  AS datetime_sent_utc, et.template_type, se.subject, se.body, se.send_from, se.send_to, se.email_sent_status 
  FROM send_email se
  LEFT JOIN individual i ON se.ind_id = i.ind_id
  LEFT JOIN email_template et ON et.email_template_id = se.email_template_id
  WHERE se.send_to LIKE '%${email}%'
  AND se.type = 'email'
  ORDER BY send_email_id DESC`, 
  [],
  (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results);
    }
  });
};


// AWS SES send email from jomel
export const insertSendEmail_jomel = async (data, result) => {
  db.query(
    "INSERT INTO send_email (ind_id, survey_assignment_id, send_from, send_to, send_cc, send_bcc, subject, body, org_id, suborg_id, email_template_id, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
    [data.ind_id, data.survey_assignment_id, data.send_from, data.send_to, data.send_cc, data.send_bcc, data.subject, data.body, data.org_id, data.suborg_id, data.email_template_id],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('data inserted successfully');
      }
    }
  );

  try {
    const params = {
      Destination: {
        ToAddresses: [data.send_to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: data.body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: data.subject,
        },
      },
      Source: data.send_from,
    };

    // Use the SendEmailCommand and capture the response
    const response = await sesClient.send(new SendEmailCommand(params));

    // Log the SES response
    console.log("SES Email Sent Successfully. Response:", response);

    updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, { email_valid_status: 1, email_check: 'Valid' });
    result(null, { success: true, type: 'success', message: 'This email was queued for delivery.', sesResponse: response });
  } catch (error) {
    console.error("Error sending email:", error);

    updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, { email_valid_status: -2, email_check: 'Invalid' });
    result(null, { success: false, type: 'error', message: 'Something went wrong sending this email. Please try again or contact help@talentsage.com if the error persists.', sesResponse: null });
  }
};



// amazon ses
export const insertSendEmail = async (data, result) => {
  if (!data.survey_assignment_id) {
    data.survey_assignment_id = 0;
  }

  try {
    // Use the sesClient declared at the top of the file
    const params = {
      Destination: {
        ToAddresses: [data.send_to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: data.body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: data.subject,
        },
      },
      Source: data.send_from,
    };

    // Use the SendEmailCommand
    await sesClient.send(new SendEmailCommand(params));

    // Use db.query to insert into the database
    db.query(
      "INSERT INTO send_email (ind_id, survey_assignment_id, send_from, send_to, send_cc, send_bcc, subject, body, org_id, suborg_id, email_template_id, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [data.ind_id, data.survey_assignment_id, data.send_from, data.send_to, data.send_cc, data.send_bcc, data.subject, data.body, data.org_id, data.suborg_id, data.email_template_id],
      (err) => {
        if (err) {
          updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, { email_valid_status: -2, email_check: 'Invalid' });
          result(null, { success: false, type: 'error', message: 'Failed to insert into the send_email table.' });
        } else {
          updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, { email_valid_status: 1, email_check: 'Valid' });
          result(null, { success: true, type: 'success', message: 'This email was queued for delivery.' });
        }
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, { email_valid_status: -3, email_check: 'Invalid' });
    result(null, {success: false, type: 'error', message: 'Something went wrong sending this email. Please try again or contact help@talentsage.com if the error persists.'});
  }
};
// clicksend
// export const insertSendEmail = (data, result) => {  
//   /*
//   emailMarketingApi.allowedEmailAddressGet(page, limit).then(function(response) {
//     console.log(response.body);
//   }).catch(function(err){
//     console.error(err.body);
//   });
//   var contactListApi = new clickSendAPI.ContactListApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);

//   contactListApi.listsGet().then(function(response) {
//     let contactLists = response.body.data.data;
//     for (var i = 0; i < contactLists.length; i++) {
//       const contactList = contactLists[i];
//       if (data.send_to + '-' + data.email_template_id == contactList.list_name) {
//         return contactList.list_id;
//       }
//     }
//     var contactList = new clickSendAPI.ContactList();

//     contactList.listName = data.send_to + '-' + data.email_template_id;
    
//     contactListApi.listsPost(contactList).then(function(response) {
//       return response.body.data.list_id;
//     }).then(function(listID) {

//       var contactApi = new api.ContactApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);
//       contactApi.listsContactsByListIdGet(listID).then(function(response) {
//         const contactList = response.body.data.data;
//         let contactFound = false;
//         for (var i = 0; i < contactList.length; i++) {
//           const contact = contactList[i];
//           if (contact.email == data.send_to && contact.list_id == listID) {
//             //proceed to email
//             contactFound = true;
//           }
//         }
//         if (!contactFound) {
//           var contactApi = new clickSendAPI.ContactApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);
//           var contact = new clickSendAPI.Contact();
//           contact.email = data.send_to;
          
//           contactApi.listsContactsByListIdPost(contact, listID).then(function(response) {
//             console.log(response.body.data.contact_id, response.body.data.list_id);
            
//           }).catch(function(err){
//             console.error(err.body);
//           });          
//         }

//       }).catch(function(err){
//         console.error(err.body);
//       });
//       console.log("Creating list\n", listID);




//     }).catch(function(err){
//       console.error(1,err.body);
//     });
//   }).then(function(listID) {
    

//     console.log("List found\n", listID)




//   }).catch(function(err){
//     console.error(2,err);
//   });
//   */
//   if (!data.survey_assignment_id) {
//     data.survey_assignment_id = 0;
//   }

//   // if (!validateEmail(data.send_to)) {
//   //   db.query(
//   //     "INSERT INTO send_email (ind_id, survey_assignment_id, send_from, send_to, send_cc, send_bcc, subject, body, org_id, suborg_id, email_template_id, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
//   //     [data.ind_id, data.survey_assignment_id, data.send_from, data.send_to, data.send_cc, data.send_bcc, data.subject, data.body, data.org_id, data.suborg_id, data.email_template_id],
//   //     (err, res) => {
//   //       if (err) {
//   //         console.log(err);
//   //       }
//   //     }
//   //   );    
//   //   updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, {email_valid_status: 0, email_check: 'Invalid'});
//   //   result(null, {success: false, type: 'error', message: data.send_to + ' is an invalid email.'});
//   //   return null;
//   // }



//   var emailTransaction = new clickSendAPI.EmailMarketingApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);
//   emailTransaction.allowedEmailAddressGet().then(function(response) {
//     const emailsToCheck = response.body.data.data;
//     var found = false;
//     for (var i = 0; i < emailsToCheck.length; i++) {
//       const email = emailsToCheck[i];
//       if(data.send_from === email.email_address) {
//         found = true;
//         if (email.verified === 0) {
//           updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, {email_valid_status: -1, email_check: 'Invalid'});
//           result(null, {success: false, type: 'error', message: data.send_from + ' needs to be verified before it can send emails.'});
//           return null;
//         }
//         else {
//           var emailRecipient = new clickSendAPI.EmailRecipient();

//           emailRecipient.email = data.send_to;
//           emailRecipient.name = data.send_to;

//           var emailFrom = new clickSendAPI.EmailFrom();

//           emailFrom.emailAddressId = email.email_address_id;
//           emailFrom.name = data.send_from;

//           var mailer = new clickSendAPI.Email();

//           mailer.to = [emailRecipient];
//           if (data.send_cc) {
//             var ccs = data.send_cc.split(",");
//             var ccRecipients = [];
//             for (var j = 0; j < ccs.length; j++) {
//               var ccRecipient = new clickSendAPI.EmailRecipient();
//               ccRecipient.email = ccs[j];
//               ccRecipient.name = ccs[j];
//               ccRecipients.push(ccRecipient);
//             }
//             mailer.cc = ccRecipients;
//           }
//           if (data.send_bcc) {
//             var bccs = data.send_bcc.split(",");
//             var bccRecipients = [];
//             for (var k = 0; k < bccs.length; k++) {
//               var bccRecipient = new clickSendAPI.EmailRecipient();
//               bccRecipient.email = bccs[k];
//               bccRecipient.name = bccs[k];
//               bccRecipients.push(bccRecipient);
//             }
//             mailer.bcc = bccRecipients;
//           }
//           mailer.from = emailFrom;
//           mailer.subject = data.subject;
//           mailer.body = data.body;
//           if(data.schedule != null || data.schedule != ""){
//             mailer.schedule = data.schedule;
//           }
//           const MailerAPI = new clickSendAPI.TransactionalEmailApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);
//           MailerAPI.emailSendPost(mailer).then(function(response) {
//             console.log(response);
//             db.query(
//               "INSERT INTO send_email (ind_id, survey_assignment_id, send_from, send_to, send_cc, send_bcc, subject, body, org_id, suborg_id, email_template_id, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
//               [data.ind_id, data.survey_assignment_id, data.send_from, data.send_to, data.send_cc, data.send_bcc, data.subject, data.body, data.org_id, data.suborg_id, data.email_template_id],
//               (err, res) => {
//                 if (err) {
//                   res(err, null);
//                 }
//               }
//             );
//             updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, {email_valid_status: 1, email_check: 'Valid'});
//             result(null, {success: true, type: 'success', message: 'This email was queued for delivery.'});
//           }).catch(function(err){
//             updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, {email_valid_status: -2, email_check: 'Invalid'});
//             result(null, {success: false, type: 'error', message: 'Something went wrong sending this email. Please try again or contact help@talentsage.com if the error persists.'});
//           });
//         }
//       }
//     }
//     if (!found) {
//       var emailAddress = new clickSendAPI.EmailAddress();
//       emailAddress.emailAddress = data.send_from;

//       emailTransaction.allowedEmailAddressPost(emailAddress).then(function(response) {
//         emailTransaction.sendVerificationTokenGet(response.body.data.email_address_id).then(function(response) {
//           updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, {email_valid_status: -3, email_check: 'Invalid'});
//           result(null, {success: false, type: 'error', message: 'A verification email was sent to ' + data.send_from + '. Please check your mails for a verification email and verify!'});
//         }).catch(function(err){
//           updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, {email_valid_status: -4, email_check: 'Invalid'});
//           result(null, {success: false, type: 'error', message: 'Something went wrong sending your verification email. Please try again or contact customer support if the error persists.'});
//         });
//       }).catch(function(err){
//         updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, {email_valid_status: -5, email_check: 'Invalid'});
//         result(null, {success: false, type: 'error', message: 'Something went wrong creating your sender-email. Please try again or contact customer support if the error persists.'});
//       });
//     }
//   }).catch(function(err){
//     console.log(1, err);
//     updatesSendEmailBySurveyAssignmentId(data.survey_assignment_id, {email_valid_status: -6, email_check: 'Invalid'});
//     result(null, {success: false, type: 'error', message: 'Backup email service failed. please contact help@talentsage.com'});
//   });
// };

// update the status of email of send_email and survey_assignment 
export const updatesSendEmailBySurveyAssignmentId = (survey_assignment_id, data) => {
  // update send email
  db.query(
    "UPDATE send_email SET email_valid_status = ? WHERE survey_assignment_id = ?",
    [ data.email_valid_status, survey_assignment_id ],
    (err) => {
      if (err) return console.log(1, err)
      // update survey assignment
      db.query(
        "UPDATE survey_assignment SET email_check = ? WHERE survey_assignment_id = ?",
        [ data.email_check, survey_assignment_id ],
        (err) => {
          if (err) return console.log(2, err)
        }
      );
    }
  );
  
};

const validateEmail = function(mail) 
{
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

/*
const sendEmail = function(templateName, contactID, listID, data, emailFrom) {
  var masterEmailTemplateApi = new clickSendAPI.MasterEmailTemplatesApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);

  masterEmailTemplateApi.masterEmailTemplatesGet().then(function(response) {
    const masterTemplateID = response.body.data[0].template_id_master
    var userEmailTemplateApi = new clickSendAPI.UserEmailTemplatesApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);

    var emailTemplate = new clickSendAPI.EmailTemplateNew();
    
    emailTemplate.templateName = templateName;
    emailTemplate.templateIdMaster = masterTemplateID;

    userEmailTemplateApi.emailTemplatePost(emailTemplate).then(function(response) {

      var userEmailTemplateApi = new clickSendAPI.UserEmailTemplatesApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);

      var templateID = response.body.data.template_id;
      
      var emailTemplate = new clickSendAPI.EmailTemplateUpdate();
      
      emailTemplate.templateName = templateName;
      emailTemplate.body = data.body;
      
      userEmailTemplateApi.emailTemplatePut(templateID, emailTemplate).then(function(response) {
        var emailMarketingApi = new clickSendAPI.EmailMarketingApi(process.env.CLICKSEND_USERNAME, process.env.CLICKSEND_API_KEY);

        var emailCampaign = new clickSendAPI.EmailCampaign();
        
        emailCampaign.name = templateName
        emailCampaign.subject = data.subject;
        emailCampaign.body = data.body;
        emailCampaign.fromEmailAddressId = 4197;
        emailCampaign.fromName = "help@talentsage.com";
        emailCampaign.templateId = templateID;
        emailCampaign.listId = listID;
        
        emailMarketingApi.emailCampaignPost(emailCampaign).then(function(response) {
          console.log(response.body);
        }).catch(function(err){
          console.error(err.body);
        });      }).catch(function(err){
        console.error(err.body);
      });      
    }).catch(function(err){
      console.error(err.body);
    });    
  }).catch(function(err){
    console.error(err.body);
  });
};
*/

export const handleEvent = (result) => {
  console.log(result);
};