import CryptoJS from 'crypto-js'
import {
  processScheduledEmailM,
  getScheduledSurveysM,
  getScheduledSurveysM1,
  getScheduledSurveysM2,
  getScheduledSurveysM3,
  getScheduledParticipantReportM,
  getScheduledParticipantReportByNeverRunIterationM,
  getETSubjectBodyM,
  getTokenValuesM,
  getEmailTemplateByTemplateTypeM,
  getSingleSurveyAssignmentSubmittedM,
  getScheduledCoachReportM,
  getTimeZoneM,
  } from '../models/SendScheduledEmail.js'
  
  // import function to check token
  import check_token from "./functions.js";
  

  //import axios to call endpoints in sequence for scheduled email sending
  import axios, * as others from 'axios';
  //encryption function
  function encrypt(src, passphrase){
    return CryptoJS.AES.encrypt(src, passphrase).toString()
  }
  //import jomel's logo function
  //import {replaceTokens} from "../functions.js";

  
// 2022-10-11 Get timezone list
export const getTimeZone = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getTimeZoneM((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}




// Get Single survey assignment submitted
export const getSingleSurveyAssignmentSubmitted = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getSingleSurveyAssignmentSubmittedM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


// process in sequence the endpoints for scheduled email sending
export const scheduledEmailSending = (req, res) => {
    var check_date_field = 'launch_date';
    //var cc_list = "mnetdev2@mnetteam.com,greg.martin@mnetteam.com,j.proutymclaren@gmail.com,d.c.hallett@icloud.com";
    var cc_list = "";
    var bcc_list = "";
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    //step 1 - get all survey assignments
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let date_time_i = (year + "-" + month + "-" + date + " " + hours + ":" + minutes);

    axios.get(node_baseurl +'get-scheduled-surveys/'+check_date_field,{ headers: {"token" : valid_token} })
    .then(resp => {
        console.log(resp.data);
        let ctr = resp.data.length;
        
        console.log(ctr);
    
        //vty2022-07-06 respond if no launch date found
        if (ctr == 0){
          //res.json({processed: true});
          let myResp = {};
          myResp = {'processed' : ctr};
          res.json(myResp);
          //res.json({processed: `$(ctr)`});
          console.log("no surveys match current minute");
        }

        for(let i = 0; i < ctr; i++) 
        {
          console.log("ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
          //define variable values from step1///////
          let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
          let s1_ind_id = resp.data[i].ind_id;
          let s1_org_id = resp.data[i].org_id;
          let s1_suborg_id = resp.data[i].suborg_id;
          let s1_program_id = resp.data[i].program_id;
          let s1_is_nomination = resp.data[i].is_nomination;
          console.log("array values checking i: ["+ i +"] " + s1_survey_assignment_id);
          //console.log("s1_survey_assignment_id");
          



          //step 2 - for each survey assignment, get the email template, subject, and body
          //step 2 ///////////////////////////////////

          let email_template_type;
        switch (check_date_field) {
          case 'launch_date':
            if (s1_is_nomination == 0 )  
            {
              email_template_type = "Participant survey launch";
            }
            if (s1_is_nomination == 1 )  
            {
              email_template_type = "Nominee survey launch";
            }
            break;
          
        }
              let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
              axios.get(step2_url,{ headers: {"token" : valid_token} })
              .then(resp => {
                  //console.log("step1 org_id:");
                  //console.log(s1_org_id);
                  console.log(resp.data);
                  //let ctr = resp.data.length;
                  //console.log(ctr);
                  //for(let i = 0; i < ctr; i++) {
                  //  console.log(i, resp.data[i]);
                  ////////step 2 define variable values

                  //s2_subject[i] = resp.data.subject;
                  //s2_email_template_id[i] = resp.data.email_template_id;
                  //s2_email_body[i] = resp.data.email_body;
                  let s2_subject = resp.data.subject;
                  let s2_email_body = resp.data.email_body;
                  let s2_email_template_id = resp.data.email_template_id;
                  //console.log (s2_subject);
                  ///////////step 3 - for each survey assignment, and email template, get token values////////////////////////
                      let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                      console.log("step 3 url: "+step3_url);
                      axios.get(step3_url,{ headers: {"token" : valid_token} })
                      .then(resp => {
                          //console.log("step1 org_id:");
                          //console.log(s1_org_id);
                          console.log(resp.data);
                          //let ctr = resp.data.length;
                          //console.log(ctr);
                          //for(let i = 0; i < ctr; i++) {
                          //  console.log(i, resp.data[i]);
                          ////////step 3 define variable values
                          //var s3_survey_close_date = resp.data.survey_close_date;
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


                          //encrypting the email
                          //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                          let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                          //new token $CHOOSE_PASSWORD_LINK$
                          //let s3_choose_password_link = "<a href =" + resp.data.website_url + "#/forgot_password_screen?email=" + encodeURIComponent(encryptedEmail) + "> Click Here </a>"
                          let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"
                          
                          console.log("s3 recipient email: "+s3_recipient_email+" i.logged_in: "+ s3_logged_in);
                          
                          //var s2_subject = resp.data.subject;
                          //var s2_email_template_id = resp.data.email_template_id;
                          //var s2_email_body = resp.data.email_body;
                          if (s2_subject == null) {
                            s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                          //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                          
                          let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                          if (s3_logged_in == 0)
                          {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          }
                          if (s3_logged_in == 1)
                          {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                          }
                          //SURVEY_SUB_ORGANIZATION_NAME
                          //SUBORG_NAME
                          if (s2_email_template_id == null)
                          {
                            s2_email_template_id = 0;
                          }
                          if (s3_website_sender_email == null)
                          {
                            s3_website_sender_email = "help@talentsage.com";
                          }
                          if (s3_recipient_email == null)
                          {
                            s3_recipient_email = "help@talentsage.com";
                          }
                          

                          if (s2_email_body == null)
                          {
                            s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                          }


                          if (s2_subject == null) {
                            s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                          //logo 
                          if (s3_header_bg_color == null) {
                            s3_header_bg_color = "#ffffff";
                          }
                          let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';
                          //let s3_logo = 'test logo.png';

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
                          
                          s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                          //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);

                          //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                          if (s3_logged_in == 0)
                          {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          }
                          if (s3_logged_in == 1)
                          {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                          }


                          //s2_email_body = s2_email_body.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_email_body);

                          //console.log (s3_survey_close_date);
                          //console.log (s3_suborg_name);
                          console.log ("s2 subject : "+s2_subject);
                          //console.log (s2_email_body);
                          ///////////step 4 - send email////////////////////////
                                // var send_email_data = JSON.stringify({
                                //   "send_from": "mnetdev2@mnetteam.com",
                                //   "send_to": "mnetdev2@mnetteam.com",
                                //   "send_cc": "mnetdev2@mnetteam.com",
                                //   "send_bcc": "mnetdev2@mnetteam.com",
                                //   "subject": "vty test from scheduled email",
                                //   "body": "<p>test from scheduled email</p>",
                                //   "org_id": "1",
                                //   "suborg_id": "1",
                                //   "email_template_id": "99"
                                // });

                                //var send_email_data = JSON.stringify({send_from: "mnetdev2@mnetteam.com", send_to: "mnetdev2@mnetteam.com", send_cc: "mnetdev2@mnetteam.com", send_bcc: "mnetdev2@mnetteam.com", subject: "vty test from scheduled email", body: "body2", org_id: "1", suborg_id: "1", email_template_id: "1"});
        
                                
                            console.log("website sender email: "+s3_website_sender_email);
                            console.log("s3 recipient email: "+s3_recipient_email);
                            console.log("s2 email body: "+s2_email_body);
                            let step4_url = node_baseurl + 'sendemail';
                            axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                            send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                            org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                              .then(resp => {                                  
                                  
                                  //console.log(i);

                                  console.log(date_time_i + " ctr i: "+i, "survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
                                  // prints date & time in YYYY-MM-DD HH:MM:SS format
                                  console.log();
                                  
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
                            let myResp = {};
                            myResp = {'processed' : ctr, 'date_time' : date_time_i};
                            res.json(myResp)
                            //res.json({processed: true});



        
        
        
        
        
        
        
                          /////////STEP  4 - SEND EMAIL END/////////////////////////////////////////
                            
                          //} 
                          //res.json(resp.data);
                          //res.json(s2_subject);
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













                  //////////////////////////////////////////////////
                    
                  //} 
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
          //step 2 ///////////////////////////////////

          } 
        //res.json(resp.data);
    })
    // .catch(resp => {
    //     console.log('error: ',);	  
    // });
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
    // res.json(resp.data);
}



// process in sequence the endpoints for scheduled email REMINDER sending
export const scheduledSurveyReminder = (req, res) => {
  var check_date_field = 'survey_reminder_date';
  //var cc_list = "mnetdev2@mnetteam.com,greg.martin@mnetteam.com,j.proutymclaren@gmail.com,d.c.hallett@icloud.com";
  var cc_list = "";
  var bcc_list = "";
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  //step 1 - get all survey assignments
  //2022-09-20 get-scheduled-surveys1
  axios.get(node_baseurl +'get-scheduled-surveys1/'+check_date_field,{ headers: {"token" : valid_token} })
  .then(resp => {
      console.log(resp.data);
      let ctr = resp.data.length;
      
      console.log(ctr);
  
      //vty2022-07-06 respond if no launch date found
      if (ctr == 0){
        //res.json({processed: true});
        let myResp = {};
        myResp = {'processed' : ctr};
        res.json(myResp);
        //res.json({processed: `$(ctr)`});
        console.log("no surveys match current minute");
      }

      for(let i = 0; i < ctr; i++) 
      {
        console.log("ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
        //define variable values from step1///////
        let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
        let s1_ind_id = resp.data[i].ind_id;
        let s1_org_id = resp.data[i].org_id;
        let s1_suborg_id = resp.data[i].suborg_id;
        let s1_program_id = resp.data[i].program_id;
        let s1_is_nomination = resp.data[i].is_nomination;

        console.log("array values checking i: ["+ i +"] " + s1_survey_assignment_id);
        //console.log("s1_survey_assignment_id");

        //step 2 - for each survey assignment, get the email template, subject, and body
        //step 2 ///////////////////////////////////

        let email_template_type;
        switch (check_date_field) {
          case 'launch_date':
            email_template_type = "Participant survey launch";
            break;
          case 'survey_reminder_date':
            if (s1_is_nomination == 0 )  
            {
              email_template_type = "Participant survey deadline reminder";
            }
            if (s1_is_nomination == 1 )  
            {
              email_template_type = "Nominee survey deadline reminder";
            }
            break;
          
        }
            let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
            axios.get(step2_url,{ headers: {"token" : valid_token} })
            .then(resp => {
                //console.log("step1 org_id:");
                //console.log(s1_org_id);
                console.log(resp.data);
                //let ctr = resp.data.length;
                //console.log(ctr);
                //for(let i = 0; i < ctr; i++) {
                //  console.log(i, resp.data[i]);
                ////////step 2 define variable values

                //s2_email_body[i] = resp.data.email_body;
                let s2_subject = resp.data.subject;
                let s2_email_body = resp.data.email_body;
                let s2_email_template_id = resp.data.email_template_id;
                //console.log (s2_subject);
                ///////////step 3 - for each survey assignment, and email template, get token values////////////////////////
                    let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                    console.log("step 3 url: "+step3_url);
                    axios.get(step3_url,{ headers: {"token" : valid_token} })
                    .then(resp => {
                        //console.log("step1 org_id:");
                        //console.log(s1_org_id);
                        console.log(resp.data);
                        //let ctr = resp.data.length;
                        //console.log(ctr);
                        
                        //var s3_survey_close_date = resp.data.survey_close_date;
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

                        //encrypting the email
                        //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                        let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                        //new token $CHOOSE_PASSWORD_LINK$
                        //let s3_choose_password_link = resp.data.website_url + "#/forgot_password_choose?email=" + encodeURIComponent(encryptedEmail)
                        let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"
                        console.log("s3 recipient email: "+s3_recipient_email);

                        if (s2_subject == null) {
                          s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                        //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                        //s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                        if (s3_logged_in == 0)
                        {
                          s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        }
                        if (s3_logged_in == 1)
                        {
                          s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                        }


                        //SURVEY_SUB_ORGANIZATION_NAME
                        //SUBORG_NAME
                        if (s2_email_template_id == null)
                        {
                          s2_email_template_id = 0;
                        }
                        if (s3_website_sender_email == null)
                        {
                          s3_website_sender_email = "help@talentsage.com";
                        }
                        if (s3_recipient_email == null)
                        {
                          s3_recipient_email = "help@talentsage.com";
                        }                        

                        if (s2_email_body == null)
                        {
                          s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                        }
                        //logo 
                        if (s3_header_bg_color == null) {
                          s3_header_bg_color = "#ffffff";
                        }
                        // let s3_logo = `<div style="background: ${s3_header_bg_color}; 
                        // display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                        // <img style="max-width: 100%; height: 60px;" src="${s3_website_url + '' + s3_brand_path}/logo.png" alt="Brand Logo"/>
                        // </div>`,
                        //let s3_logo = 'test logo.png';
                        let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';

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

                        
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                        //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);

                        //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                        if (s3_logged_in == 0)
                        {
                          s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        }
                        if (s3_logged_in == 1)
                        {
                          s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                        }


                        console.log ("s2 subject : "+s2_subject);
                        
                              
                          console.log("website sender email: "+s3_website_sender_email);
                          console.log("s3 recipient email: "+s3_recipient_email);
                          console.log("s2 email body: "+s2_email_body);
                          let step4_url = node_baseurl + 'sendemail';
                          axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                          send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                          org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                            .then(resp => {                                  
                                //console.log(i);
                                console.log("ctr i: "+i, "survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
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
                          let myResp = {};
                          myResp = {'processed' : ctr};
                          res.json(myResp)
                        //res.json(resp.data);
                        //res.json(s2_subject);
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
        //step 2 ///////////////////////////////////
        } 
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


///survey submission nominee and participant//////////////////////////////////////

// process in sequence the endpoints for scheduled email sending

  export const submitSurveyEmail = (req, res) => {
    var sa_id = req.params.id;
    console.log ("sa_id: "+sa_id);
    console.log ("node_baseurl:"+node_baseurl);
    //var cc_list = "mnetdev2@mnetteam.com,greg.martin@mnetteam.com,j.proutymclaren@gmail.com,d.c.hallett@icloud.com";
    var cc_list = "";
    var bcc_list = "";
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    //step 1 - get all survey assignments
    
    axios.get(node_baseurl +'get-single-survey-assignment-submitted/'+sa_id,{ headers: {"token" : valid_token} })
    .then(resp => {
        console.log(resp.data);
        let ctr = resp.data.length;    

        if (ctr == 0){
          //res.json({processed: true});
          let myResp = {};
          myResp = {'processed' : ctr};
          res.json(myResp);
          //res.json({processed: `$(ctr)`});
          console.log("survey_assignment_id not found");
        } 
          
          //define variable values from step1///////
          let s1_survey_assignment_id = resp.data.survey_assignment_id;
          let s1_ind_id = resp.data.ind_id;
          let s1_org_id = resp.data.org_id;
          let s1_suborg_id = resp.data.suborg_id;
          let s1_program_id = resp.data.program_id;
          let s1_is_nomination = resp.data.is_nomination;
          console.log("resp survey_assignment_id: " + resp.data.survey_assignment_id + " s1_is_nomination : " + s1_is_nomination);
          
          //console.log("s1_survey_assignment_id");
  
          //step 2 - get the email template, subject, and body
          //step 2 ///////////////////////////////////
  
          let email_template_type = 'Participant survey submission confirmation';
          switch (s1_is_nomination) {
            case 1:
              email_template_type = "Nominee survey submission confirmation";
              break;
            case 0:
              email_template_type = "Participant survey submission confirmation";
              break;            
          }
              let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
              axios.get(step2_url,{ headers: {"token" : valid_token} })
              .then(resp => {

                  console.log(resp.data);

                  let s2_subject = resp.data.subject;
                  let s2_email_body = resp.data.email_body;
                  let s2_email_template_id = resp.data.email_template_id;

                  ///////////step 3 - for survey assignment, and email template, get token values////////////////////////
                      let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                      console.log("step 3 url: "+step3_url);
                      axios.get(step3_url,{ headers: {"token" : valid_token} })
                      .then(resp => {

                          console.log(resp.data);
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

                          //encrypting the email
                          //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                          let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                          //new token $CHOOSE_PASSWORD_LINK$
                          //let s3_choose_password_link = resp.data.website_url + "#/forgot_password_choose?email=" + encodeURIComponent(encryptedEmail)
                          let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"

                          console.log("s3 recipient email: "+s3_recipient_email);
  
                          if (s2_subject == null) {
                            s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                          //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                          //s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                          if (s3_logged_in == 0)
                          {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          }
                          if (s3_logged_in == 1)
                          {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                          }

                          //SURVEY_SUB_ORGANIZATION_NAME
                          //SUBORG_NAME
                          if (s2_email_template_id == null)
                          {
                            s2_email_template_id = 0;
                          }
                          if (s3_website_sender_email == null)
                          {
                            s3_website_sender_email = "help@talentsage.com";
                          }
                          if (s3_recipient_email == null)
                          {
                            s3_recipient_email = "help@talentsage.com";
                          }                        
  
                          if (s2_email_body == null)
                          {
                            s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                          }

                          //logo 
                          if (s3_header_bg_color == null) {
                            s3_header_bg_color = "#ffffff";
                          }
                          // let s3_logo = `<div style="background: ${s3_header_bg_color}; 
                          // display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                          // <img style="max-width: 100%; height: 60px;" src="${s3_website_url + '' + s3_brand_path}/logo.png" alt="Brand Logo"/>
                          // </div>`,

                          //let s3_logo = 'test logo.png';
                          let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';

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
                          
                          console.log("survey subject first name: "+s3_survey_subject_first_name);

                          s2_email_body = s2_email_body.replaceAll("$SURVEY_SUBJECT_FIRST_NAME$", s3_survey_subject_first_name);
                          s2_email_body = s2_email_body.replaceAll("$SURVEY_ITERATION_NAME$", s3_iteration_name);
                          s2_email_body = s2_email_body.replaceAll("$SURVEY_ACTIVE_REMINDERS$", s3_survey_active_reminders);
                          s2_email_body = s2_email_body.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);

                          s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                          
                          //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                          if (s3_logged_in == 0)
                          {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          }
                          if (s3_logged_in == 1)
                          {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                          }
  
                          console.log ("s2 subject : "+s2_subject);
                          
                                
                            console.log("website sender email: "+s3_website_sender_email);
                            console.log("s3 recipient email: "+s3_recipient_email);
                            console.log("s2 email body: "+s2_email_body);
                            let step4_url = node_baseurl + 'sendemail';
                            axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                            send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                            org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                              .then(resp => {                                  
                                  //console.log(i);
                                  console.log("submit survey confirmation for survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
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
                            let myResp = {};
                            myResp = {'email_sent_for_sid' : s1_survey_assignment_id};
                            res.json(myResp)
                          //res.json(resp.data);
                          //res.json(s2_subject);
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
          //step 2 ///////////////////////////////////
           
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

    axios.get(node_baseurl +'get-participant-report-by-never-run-iteration/'+sa_id,{ headers: {"token" : valid_token} })
    .then(resp => {
        console.log(resp.data);
        let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
        
        console.log(ctr);
    
        //console log if no final_deadline_date found
        if (ctr == 0){
          //res.json({processed: true});
          let myResp = {};
          myResp = {'Number of surveys with participant_report_start_date match current time' : ctr};
          res.json(myResp);
          //res.json({processed: `$(ctr)`});
          //to add later minimum # of surveys to be eligible for big5 report processing
          console.log("currently no surveys found that matches participant_report_start_date ");
        }
  
        for(let i = 0; i < ctr; i++) 
        {
          console.log("participant report start date i:" + i, " survey_assignment_id" + resp.data[i].survey_assignment_id);
          //define variable values from step1///////
          let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
          let s1_ind_id = resp.data[i].ind_id;
          let s1_org_id = resp.data[i].org_id;
          let s1_suborg_id = resp.data[i].suborg_id;
          let s1_program_id = resp.data[i].program_id;
          //let s1_iteration_id = resp.data[i].iteration_id;
          //let s1_stream_id = resp.data[i].stream_id;
          //let s1_group_id = resp.data[i].group_id;
          //let s1_is_nomination = resp.data[i].is_nomination;
  
          console.log("big5 array values checking i: ["+ i +"] " + s1_survey_assignment_id);
          //console.log("s1_survey_assignment_id");
  
          /////step 2 - delete b5 norm raw , b5 cohort for same cohort group for re-run scenario
          //step 2 ///////////////////////////////////
  
          //let found_existing_big5 = false;
          
          let email_template_type;
          
          email_template_type = "Participant survey report available";
              
              let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
              axios.get(step2_url,{ headers: {"token" : valid_token} })
              .then(resp => {
                  //console.log("step1 org_id:");
                  //console.log(s1_org_id);
                  console.log(resp.data);
                  //s2_email_body[i] = resp.data.email_body;
                  let s2_subject = resp.data.subject;
                  let s2_email_body = resp.data.email_body;
                  let s2_email_template_id = resp.data.email_template_id;
                  //console.log (s2_subject);
                  ///////////step 3 - for each survey assignment, and email template, get token values////////////////////////
                      let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                      console.log("step 3 url: "+step3_url);
                      axios.get(step3_url,{ headers: {"token" : valid_token} })
                      .then(resp => {
                          //console.log("step1 org_id:");
                          //console.log(s1_org_id);
                          console.log(resp.data);
                          //let ctr = resp.data.length;
                          //console.log(ctr);
                          
                          //var s3_survey_close_date = resp.data.survey_close_date;
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
  
                          //encrypting the email
                          //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                          let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                          //new token $CHOOSE_PASSWORD_LINK$
                          //let s3_choose_password_link = resp.data.website_url + "#/forgot_password_choose?email=" + encodeURIComponent(encryptedEmail)
                          let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"
                          console.log("s3 recipient email: "+s3_recipient_email);
  
                          if (s2_subject == null) {
                            s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                          //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                          //s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                          if (s3_logged_in == 0)
                          {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          }
                          if (s3_logged_in == 1)
                          {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                          }
  
  
                          //SURVEY_SUB_ORGANIZATION_NAME
                          //SUBORG_NAME
                          if (s2_email_template_id == null)
                          {
                            s2_email_template_id = 0;
                          }
                          if (s3_website_sender_email == null)
                          {
                            s3_website_sender_email = "help@talentsage.com";
                          }
                          if (s3_recipient_email == null)
                          {
                            s3_recipient_email = "help@talentsage.com";
                          }                        
  
                          if (s2_email_body == null)
                          {
                            s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                          }
                          //logo 
                          if (s3_header_bg_color == null) {
                            s3_header_bg_color = "#ffffff";
                          }
                          // let s3_logo = `<div style="background: ${s3_header_bg_color}; 
                          // display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                          // <img style="max-width: 100%; height: 60px;" src="${s3_website_url + '' + s3_brand_path}/logo.png" alt="Brand Logo"/>
                          // </div>`,
                          //let s3_logo = 'test logo.png';
                          let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';
  
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
  
                          
                          s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                          //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
  
                          //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                          if (s3_logged_in == 0)
                          {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          }
                          if (s3_logged_in == 1)
                          {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                          }
  
  
                          console.log ("s2 subject : "+s2_subject);
                          
                                
                            console.log("website sender email: "+s3_website_sender_email);
                            console.log("s3 recipient email: "+s3_recipient_email);
                            console.log("s2 email body: "+s2_email_body);
                            let step4_url = node_baseurl + 'sendemail';
                            axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                            send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                            org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                              .then(resp => {                                  
                                  //console.log(i);
                                  console.log("participant report email ctr i: "+i, " survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
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
                            let myResp = {};
                            myResp = {'processed' : ctr};
                            res.json(myResp)
                          //res.json(resp.data);
                          //res.json(s2_subject);
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
          //step 2 ///////////////////////////////////
          } 
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


//end survey submission//////////////////////////////////////

  
// vty
  export const getEmailTemplateByTemplateType = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.params
    getEmailTemplateByTemplateTypeM(data.template_type, data.org_id, data.suborg_id, data.program_id, (err, results) => {
        if (err) return res.send(err)
        res.json(results)
    })
  }

  // Get token values
  export const getTokenValues = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getTokenValuesM(req.params.id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }


  // Get scheduled surveys with org suborg and program_id
  export const getScheduledSurveys = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getScheduledSurveysM(req.params.id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }


  // Get unsubmitted surveys with initial deadline > now, 5, 3, 2, 1 days
  export const getScheduledSurveys1 = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    getScheduledSurveysM1(req.params.id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

    // Get unsubmitted surveys with initial deadline > now, 5, 3, 2, 1 days
    export const getScheduledSurveys2 = (req, res) => {
      if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
      getScheduledSurveysM2(req.params.id, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.json(results)
        }
      })
    }


    // Get unsubmitted surveys with initial deadline > now, excluding 5, 3, 2, 1 days for saturday run
    export const getScheduledSurveys3 = (req, res) => {
      if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
      getScheduledSurveysM3(req.params.id, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.json(results)
        }
      })
    }


    
    // Get scheduled participant report start date
    export const getScheduledParticipantReport = (req, res) => {
      if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
      getScheduledParticipantReportM(req.params.id, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.json(results)
        }
      })
    }

    export const getScheduledParticipantReportByNeverRunIteration = (req, res) => {
      if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
      getScheduledParticipantReportByNeverRunIterationM(req.params.id,(err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.json(results)
        }
      })
    }


    // Get scheduled coach report start date and coach email
    export const getScheduledCoachReport = (req, res) => {
      if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
      getScheduledCoachReportM(req.params.id, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.json(results)
        }
      })
    }


// get email template subject and body
export const getETSubjectBody = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getETSubjectBodyM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


  // processing the scheduled email steps 1-4 not used to check
  export const processScheduledEmail = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    processScheduledEmailM(req.params.id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }
  


  /////////////////////////
  // process in sequence the endpoints for auto email sending before initial deadline date 5 3 2 1
export const scheduledSurveyReminder2 = (req, res) => {
  var check_date_field = 'initial_deadline_date';
  //var cc_list = "mnetdev2@mnetteam.com,greg.martin@mnetteam.com,j.proutymclaren@gmail.com,d.c.hallett@icloud.com";
  var cc_list = "";
  var bcc_list = "";
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  //step 1 - get all survey assignments
  //console.log(node_baseurl +'get-scheduled-surveys2/'+check_date_field);
  axios.get(node_baseurl +'get-scheduled-surveys2/'+check_date_field,{ headers: {"token" : valid_token} })
  .then(resp => {
      console.log(resp.data);
      let ctr = resp.data.length;
      
      console.log(ctr);
  
      //vty2022-07-06 respond if no launch date found
      if (ctr == 0){
        //res.json({processed: true});
        let myResp = {};
        myResp = {'processed' : ctr};
        res.json(myResp);
        //res.json({processed: `$(ctr)`});
        console.log("no surveys matched for auto-reminder with initial deadline date 5,3,2,1 days before");
      }

      for(let i = 0; i < ctr; i++) 
      {
        console.log("ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
        //define variable values from step1///////
        let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
        let s1_ind_id = resp.data[i].ind_id;
        let s1_org_id = resp.data[i].org_id;
        let s1_suborg_id = resp.data[i].suborg_id;
        let s1_program_id = resp.data[i].program_id;
        let s1_is_nomination = resp.data[i].is_nomination;

        console.log("array values checking i: ["+ i +"] " + s1_survey_assignment_id);
        //console.log("s1_survey_assignment_id");

        //step 2 - for each survey assignment, get the email template, subject, and body
        //step 2 ///////////////////////////////////

        let email_template_type;
        switch (check_date_field) {
          case 'launch_date':
            email_template_type = "Participant survey launch";
            break;
          case 'survey_reminder_date':
            if (s1_is_nomination == 0 )  
            {
              email_template_type = "Participant survey deadline reminder";
            }
            if (s1_is_nomination == 1 )  
            {
              email_template_type = "Nominee survey deadline reminder";
            }
            break;
          case 'initial_deadline_date':
            if (s1_is_nomination == 0 )  
            {
              email_template_type = "Participant survey deadline reminder";
            }
            if (s1_is_nomination == 1 )  
            {
              email_template_type = "Nominee survey deadline reminder";
            }
            break;
          
        }
            let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
            axios.get(step2_url,{ headers: {"token" : valid_token} })
            .then(resp => {
                //console.log("step1 org_id:");
                //console.log(s1_org_id);
                console.log(resp.data);
                //let ctr = resp.data.length;
                //console.log(ctr);
                //for(let i = 0; i < ctr; i++) {
                //  console.log(i, resp.data[i]);
                ////////step 2 define variable values

                //s2_email_body[i] = resp.data.email_body;
                let s2_subject = resp.data.subject;
                let s2_email_body = resp.data.email_body;
                let s2_email_template_id = resp.data.email_template_id;
                //console.log (s2_subject);
                ///////////step 3 - for each survey assignment, and email template, get token values////////////////////////
                    let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                    console.log("step 3 url: "+step3_url);
                    axios.get(step3_url,{ headers: {"token" : valid_token} })
                    .then(resp => {
                        //console.log("step1 org_id:");
                        //console.log(s1_org_id);
                        console.log(resp.data);
                        //let ctr = resp.data.length;
                        //console.log(ctr);
                        
                        //var s3_survey_close_date = resp.data.survey_close_date;
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

                        //encrypting the email
                        //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                        let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                        //new token $CHOOSE_PASSWORD_LINK$
                        //let s3_choose_password_link = resp.data.website_url + "#/forgot_password_choose?email=" + encodeURIComponent(encryptedEmail)
                        let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"
                        console.log("s3 recipient email: "+s3_recipient_email);

                        if (s2_subject == null) {
                          s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                        //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                        //s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                        if (s3_logged_in == 0)
                        {
                          s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        }
                        if (s3_logged_in == 1)
                        {
                          s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                        }


                        //SURVEY_SUB_ORGANIZATION_NAME
                        //SUBORG_NAME
                        if (s2_email_template_id == null)
                        {
                          s2_email_template_id = 0;
                        }
                        if (s3_website_sender_email == null)
                        {
                          s3_website_sender_email = "help@talentsage.com";
                        }
                        if (s3_recipient_email == null)
                        {
                          s3_recipient_email = "help@talentsage.com";
                        }                        

                        if (s2_email_body == null)
                        {
                          s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                        }
                        //logo 
                        if (s3_header_bg_color == null) {
                          s3_header_bg_color = "#ffffff";
                        }
                        // let s3_logo = `<div style="background: ${s3_header_bg_color}; 
                        // display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                        // <img style="max-width: 100%; height: 60px;" src="${s3_website_url + '' + s3_brand_path}/logo.png" alt="Brand Logo"/>
                        // </div>`,
                        //let s3_logo = 'test logo.png';
                        let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';

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

                        
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                        //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);

                        //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                        if (s3_logged_in == 0)
                        {
                          s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        }
                        if (s3_logged_in == 1)
                        {
                          s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                        }


                        console.log ("s2 subject : "+s2_subject);
                        
                              
                          console.log("website sender email: "+s3_website_sender_email);
                          console.log("s3 recipient email: "+s3_recipient_email);
                          console.log("s2 email body: "+s2_email_body);
                          let step4_url = node_baseurl + 'sendemail';
                          axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                          send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                          org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                            .then(resp => {                                  
                                //console.log(i);
                                console.log("ctr i: "+i, "survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
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
                          let myResp = {};
                          myResp = {'processed' : ctr};
                          res.json(myResp)
                        //res.json(resp.data);
                        //res.json(s2_subject);
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
        //step 2 ///////////////////////////////////
        } 
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



/////////////////////////
  // process in sequence the endpoints for auto email sending before initial deadline date excluding 5 3 2 1, for saturady run
  export const scheduledSurveyReminder3 = (req, res) => {
    var check_date_field = 'initial_deadline_date';
    //var cc_list = "mnetdev2@mnetteam.com,greg.martin@mnetteam.com,j.proutymclaren@gmail.com,d.c.hallett@icloud.com";
    var cc_list = "";
    var bcc_list = "";
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    //step 1 - get all survey assignments
    //console.log(node_baseurl +'get-scheduled-surveys3/'+check_date_field);
    axios.get(node_baseurl +'get-scheduled-surveys3/'+check_date_field,{ headers: {"token" : valid_token} })
    .then(resp => {
        console.log(resp.data);
        let ctr = resp.data.length;
        
    
        //vty2022-07-06 respond if no launch date found
        if (ctr == 0){
          //res.json({processed: true});
          let myResp = {};
          myResp = {'processed' : ctr};
          res.json(myResp);
          //res.json({processed: `$(ctr)`});
        }
  
        for(let i = 0; i < ctr; i++) 
        {
          //define variable values from step1///////
          let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
          let s1_ind_id = resp.data[i].ind_id;
          let s1_org_id = resp.data[i].org_id;
          let s1_suborg_id = resp.data[i].suborg_id;
          let s1_program_id = resp.data[i].program_id;
          let s1_is_nomination = resp.data[i].is_nomination;
  
          //console.log("s1_survey_assignment_id");
  
          //step 2 - for each survey assignment, get the email template, subject, and body
          //step 2 ///////////////////////////////////
  
          let email_template_type;
          switch (check_date_field) {
            case 'launch_date':
              email_template_type = "Participant survey launch";
              break;
            case 'survey_reminder_date':
              if (s1_is_nomination == 0 )  
              {
                email_template_type = "Participant survey deadline reminder";
              }
              if (s1_is_nomination == 1 )  
              {
                email_template_type = "Nominee survey deadline reminder";
              }
              break;
            case 'initial_deadline_date':
              if (s1_is_nomination == 0 )  
              {
                email_template_type = "Participant survey deadline reminder";
              }
              if (s1_is_nomination == 1 )  
              {
                email_template_type = "Nominee survey deadline reminder";
              }
              break;
            
          }
              let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
              axios.get(step2_url,{ headers: {"token" : valid_token} })
              .then(resp => {
                  //console.log("step1 org_id:");
                  //console.log(s1_org_id);
                  //let ctr = resp.data.length;
                  //console.log(ctr);
                  //for(let i = 0; i < ctr; i++) {
                  //  console.log(i, resp.data[i]);
                  ////////step 2 define variable values
  
                  //s2_email_body[i] = resp.data.email_body;
                  let s2_subject = resp.data.subject;
                  let s2_email_body = resp.data.email_body;
                  let s2_email_template_id = resp.data.email_template_id;
                  //console.log (s2_subject);
                  ///////////step 3 - for each survey assignment, and email template, get token values////////////////////////
                      let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                      axios.get(step3_url,{ headers: {"token" : valid_token} })
                      .then(resp => {
                          //console.log("step1 org_id:");
                          //console.log(s1_org_id);
                          //let ctr = resp.data.length;
                          //console.log(ctr);
                          
                          //var s3_survey_close_date = resp.data.survey_close_date;
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
  
                          //encrypting the email
                          //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                          let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                          //new token $CHOOSE_PASSWORD_LINK$
                          //let s3_choose_password_link = resp.data.website_url + "#/forgot_password_choose?email=" + encodeURIComponent(encryptedEmail)
                          let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"
  
                          if (s2_subject == null) {
                            s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                          //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                          //s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                          if (s3_logged_in == 0)
                          {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          }
                          if (s3_logged_in == 1)
                          {
                            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                          }
  
  
                          //SURVEY_SUB_ORGANIZATION_NAME
                          //SUBORG_NAME
                          if (s2_email_template_id == null)
                          {
                            s2_email_template_id = 0;
                          }
                          if (s3_website_sender_email == null)
                          {
                            s3_website_sender_email = "help@talentsage.com";
                          }
                          if (s3_recipient_email == null)
                          {
                            s3_recipient_email = "help@talentsage.com";
                          }                        
  
                          if (s2_email_body == null)
                          {
                            s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                          }
                          //logo 
                          if (s3_header_bg_color == null) {
                            s3_header_bg_color = "#ffffff";
                          }
                          // let s3_logo = `<div style="background: ${s3_header_bg_color}; 
                          // display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                          // <img style="max-width: 100%; height: 60px;" src="${s3_website_url + '' + s3_brand_path}/logo.png" alt="Brand Logo"/>
                          // </div>`,
                          //let s3_logo = 'test logo.png';
                          let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';
  
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
  
                          
                          s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                          //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
  
                          //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                          if (s3_logged_in == 0)
                          {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                          }
                          if (s3_logged_in == 1)
                          {
                            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                          }
  
  
                          
                                
                            let step4_url = node_baseurl + 'sendemail';
                            axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                            send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                            org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                              .then(resp => {                                  
                                  //console.log(i);
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
                            let myResp = {};
                            myResp = {'processed' : ctr};
                            res.json(myResp)
                          //res.json(resp.data);
                          //res.json(s2_subject);
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
          //step 2 ///////////////////////////////////
          } 
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





 ////////////////////////////////////////////////////////////////////////////////////////
 //////////////// email based on participant_report_start_date//////////////////////////
 export const scheduledEmailParticipantReport = (req, res) => 
 {
   var check_date_field = 'participant_report_start_date';
   var cc_list = "";
   var bcc_list = "";
   if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
 
 
 
   //step 1 select surveys whose participant_report_start_date = now
   axios.get(node_baseurl +'get-scheduled-participant-report/'+check_date_field,{ headers: {"token" : valid_token} })
   .then(resp => {
       console.log(resp.data);
       let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
       
       console.log(ctr);
   
       //console log if no final_deadline_date found
       if (ctr == 0){
         //res.json({processed: true});
         let myResp = {};
         myResp = {'Number of surveys with participant_report_start_date match current time' : ctr};
         res.json(myResp);
         //res.json({processed: `$(ctr)`});
         //to add later minimum # of surveys to be eligible for big5 report processing
         console.log("currently no surveys found that matches participant_report_start_date ");
       }
 
       for(let i = 0; i < ctr; i++) 
       {
         console.log("participant report start date i:" + i, " survey_assignment_id" + resp.data[i].survey_assignment_id);
         //define variable values from step1///////
         let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
         let s1_ind_id = resp.data[i].ind_id;
         let s1_org_id = resp.data[i].org_id;
         let s1_suborg_id = resp.data[i].suborg_id;
         let s1_program_id = resp.data[i].program_id;
         let s1_survey_type = resp.data[i].survey_type;
         //let s1_iteration_id = resp.data[i].iteration_id;
         //let s1_stream_id = resp.data[i].stream_id;
         //let s1_group_id = resp.data[i].group_id;
         //let s1_is_nomination = resp.data[i].is_nomination;
 
         //console.log("s1_survey_assignment_id");
 
         /////step 2 - delete b5 norm raw , b5 cohort for same cohort group for re-run scenario
         //step 2 ///////////////////////////////////
 
         //let found_existing_big5 = false;
         
         let email_template_type;
         switch (check_date_field) {
           case 'participant_report_start_date':
             email_template_type = "Participant survey report available";
             break;
           case 'launch_date':
             email_template_type = "Participant survey launch";
             break;
           case 'survey_reminder_date':
             if (s1_is_nomination == 0 )  
             {
               email_template_type = "Participant survey deadline reminder";
             }
             if (s1_is_nomination == 1 )  
             {
               email_template_type = "Nominee survey deadline reminder";
             }
             break;
           
         } 

           if (s1_survey_type == 2) {
             console.log("360 REPORT START EMAIL")
          //added another step update for ticket 30006; we don't need to send "Participant survey report available" email template if the participant is not eligible for a report
          let eligible_url = node_baseurl + 'get-not-eligible360/'+ s1_survey_assignment_id
          axios.get(eligible_url,{ headers: {"token" : valid_token} })
              .then(resp => {
                console.log("360 REPORT START EMAIL ELIGIBLE")
                  console.log(resp.data);
                  console.log("ETO YUNG I SA 360: ", i)
            let notReportEligible = resp.data.not_eligible; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
            
        
            //console log if no final_deadline_date found
            if (notReportEligible == 1){
              //res.json({processed: true});
              let myResp = {};
              myResp = {'The participant is not eligible for a report, the participant wont receive a report ready email.' : ctr};
              res.json(myResp);
            }
            
            let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
            axios.get(step2_url,{ headers: {"token" : valid_token} })
                .then(resp => {
                    console.log("360 REPORT START EMAIL TEMPLATE")
                //console.log("step1 org_id:");
                //console.log(s1_org_id);
                //s2_email_body[i] = resp.data.email_body;
                let s2_subject = resp.data.subject;
                let s2_email_body = resp.data.email_body;
                let s2_email_template_id = resp.data.email_template_id;
                //console.log (s2_subject);
                ///////////step 3 - for each survey assignment, and email template, get token values////////////////////////
                    let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                    axios.get(step3_url,{ headers: {"token" : valid_token} })
                        .then(resp => {
                            console.log("360 REPORT START EMAIL TOKEN")
                        //console.log("step1 org_id:");
                        //console.log(s1_org_id);
                        //let ctr = resp.data.length;
                        //console.log(ctr);
                        
                        //var s3_survey_close_date = resp.data.survey_close_date;
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
  
                        //encrypting the email
                        //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                        let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                        //new token $CHOOSE_PASSWORD_LINK$
                        //let s3_choose_password_link = resp.data.website_url + "#/forgot_password_choose?email=" + encodeURIComponent(encryptedEmail)
                        let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"
  
                        if (s2_subject == null) {
                          s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                        //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                        //s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                        if (s3_logged_in == 0)
                        {
                          s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        }
                        if (s3_logged_in == 1)
                        {
                          s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                        }
  
  
                        //SURVEY_SUB_ORGANIZATION_NAME
                        //SUBORG_NAME
                        if (s2_email_template_id == null)
                        {
                          s2_email_template_id = 0;
                        }
                        if (s3_website_sender_email == null)
                        {
                          s3_website_sender_email = "help@talentsage.com";
                        }
                        if (s3_recipient_email == null)
                        {
                          s3_recipient_email = "help@talentsage.com";
                        }                        
  
                        if (s2_email_body == null)
                        {
                          s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                        }
                        //logo 
                        if (s3_header_bg_color == null) {
                          s3_header_bg_color = "#ffffff";
                        }
                        // let s3_logo = `<div style="background: ${s3_header_bg_color}; 
                        // display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                        // <img style="max-width: 100%; height: 60px;" src="${s3_website_url + '' + s3_brand_path}/logo.png" alt="Brand Logo"/>
                        // </div>`,
                        //let s3_logo = 'test logo.png';
                        let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';
  
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
  
                        
                        s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                        //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
  
                        //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                        if (s3_logged_in == 0)
                        {
                          s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                        }
                        if (s3_logged_in == 1)
                        {
                          s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                        }
  
  
                          let step4_url = node_baseurl + 'sendemail';
                          axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                          send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                          org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                            .then(resp => {                                  
                                //console.log(i);
                                console.log("360 REPORT START EMAIL SENT")
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
                          let myResp = {};
                          myResp = {'processed' : ctr};
                          res.json(myResp)
                        //res.json(resp.data);
                        //res.json(s2_subject);
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
           } else {
            console.log("ETO YUNG I SA big5: ", i)
          let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
          axios.get(step2_url,{ headers: {"token" : valid_token} })
          .then(resp => {
              //console.log("step1 org_id:");
              //console.log(s1_org_id);
              //s2_email_body[i] = resp.data.email_body;
              let s2_subject = resp.data.subject;
              let s2_email_body = resp.data.email_body;
              let s2_email_template_id = resp.data.email_template_id;
              //console.log (s2_subject);
              ///////////step 3 - for each survey assignment, and email template, get token values////////////////////////
                  let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                  axios.get(step3_url,{ headers: {"token" : valid_token} })
                  .then(resp => {
                      //console.log("step1 org_id:");
                      //console.log(s1_org_id);
                      //let ctr = resp.data.length;
                      //console.log(ctr);
                      
                      //var s3_survey_close_date = resp.data.survey_close_date;
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

                      //encrypting the email
                      //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                      let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                      //new token $CHOOSE_PASSWORD_LINK$
                      //let s3_choose_password_link = resp.data.website_url + "#/forgot_password_choose?email=" + encodeURIComponent(encryptedEmail)
                      let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"

                      if (s2_subject == null) {
                        s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                      //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                      //s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                      let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                      if (s3_logged_in == 0)
                      {
                        s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                      }
                      if (s3_logged_in == 1)
                      {
                        s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                      }


                      //SURVEY_SUB_ORGANIZATION_NAME
                      //SUBORG_NAME
                      if (s2_email_template_id == null)
                      {
                        s2_email_template_id = 0;
                      }
                      if (s3_website_sender_email == null)
                      {
                        s3_website_sender_email = "help@talentsage.com";
                      }
                      if (s3_recipient_email == null)
                      {
                        s3_recipient_email = "help@talentsage.com";
                      }                        

                      if (s2_email_body == null)
                      {
                        s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                      }
                      //logo 
                      if (s3_header_bg_color == null) {
                        s3_header_bg_color = "#ffffff";
                      }
                      // let s3_logo = `<div style="background: ${s3_header_bg_color}; 
                      // display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                      // <img style="max-width: 100%; height: 60px;" src="${s3_website_url + '' + s3_brand_path}/logo.png" alt="Brand Logo"/>
                      // </div>`,
                      //let s3_logo = 'test logo.png';
                      let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';

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

                      
                      s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                      //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);

                      //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                      if (s3_logged_in == 0)
                      {
                        s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                      }
                      if (s3_logged_in == 1)
                      {
                        s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                      }


           
                        let step4_url = node_baseurl + 'sendemail';
                        axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                        send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                        org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                          .then(resp => {                                  
                              //console.log(i);
                              console.log("participant report email ctr i: "+i, " survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
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
                        let myResp = {};
                        myResp = {'processed' : ctr};
                        res.json(myResp)
                      //res.json(resp.data);
                      //res.json(s2_subject);
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
      //step 2 ///////////////////////////////////
         }
         } 
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

  


  ////////////////////////////////////////////////////////////////////////////////////////
 //////////////// email based on coach_report_start_date//////////////////////////
 export const scheduledEmailCoachReport = (req, res) => 
 {
   var check_date_field = 'coach_report_start_date';
   var cc_list = "";
   var bcc_list = "";
   if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
 
 
 
   //step 1 select surveys whose coach_report_start_date = now
   axios.get(node_baseurl +'get-scheduled-coach-report/'+check_date_field,{ headers: {"token" : valid_token} })
   .then(resp => {
       console.log(resp.data);
       let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
       
       console.log(ctr);
   
       //console log if no final_deadline_date found
       if (ctr == 0){
         //res.json({processed: true});
         let myResp = {};
         myResp = {'Number of surveys with coach_report_start_date match current time' : ctr};
         res.json(myResp);
         //res.json({processed: `$(ctr)`});
         //to add later minimum # of surveys to be eligible for big5 report processing
         console.log("currently no surveys found that matches coach_report_start_date ");
       }
 
       for(let i = 0; i < ctr; i++) 
       {
         console.log("coach report start date i:" + i, " survey_assignment_id" + resp.data[i].survey_assignment_id);
         //define variable values from step1///////
         let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
         let s1_ind_id = resp.data[i].ind_id;
         let s1_org_id = resp.data[i].org_id;
         let s1_suborg_id = resp.data[i].suborg_id;
         let s1_program_id = resp.data[i].program_id;
         let s1_coach_email = resp.data[i].email; //2022-09-20
         let s1_full_name = resp.data[i].full_name;//2022-09-20
         console.log("coach full_name: "+s1_full_name);
         console.log("coach email: "+s1_coach_email);
         //2022-09-20 end
         console.log("coach array values checking i: ["+ i +"] " + s1_survey_assignment_id);
         
         let email_template_type;
         switch (check_date_field) {
           case 'coach_report_start_date':
             email_template_type = "Coach survey report available";
             break;
           case 'participant_report_start_date':
             email_template_type = "Participant survey report available";
             break;
           case 'launch_date':
             email_template_type = "Participant survey launch";
             break;
           case 'survey_reminder_date':
             if (s1_is_nomination == 0 )  
             {
               email_template_type = "Participant survey deadline reminder";
             }
             if (s1_is_nomination == 1 )  
             {
               email_template_type = "Nominee survey deadline reminder";
             }
             break;
           
         } 
             
             let step2_url = node_baseurl + 'get-email-template-by-template-type/'+ email_template_type +'/org/'+ s1_org_id +'/suborg/'+ s1_suborg_id +'/program/'+ s1_program_id;
             axios.get(step2_url,{ headers: {"token" : valid_token} })
             .then(resp => {
                 //console.log("step1 org_id:");
                 //console.log(s1_org_id);
                 //2022-09-20 console.log(resp.data);
                 //s2_email_body[i] = resp.data.email_body;
                 let s2_subject = resp.data.subject;
                 let s2_email_body = resp.data.email_body;
                 let s2_email_template_id = resp.data.email_template_id;
                 //console.log (s2_subject);
                 ///////////step 3 - for each survey assignment, and email template, get token values////////////////////////
                     let step3_url = node_baseurl + 'get-token-values/'+ s1_survey_assignment_id;
                     console.log("step 3 url: "+step3_url);
                     axios.get(step3_url,{ headers: {"token" : valid_token} })
                     .then(resp => {
                         console.log(resp.data);
                        
                         //2022-09-20 let s3_user_full_name = resp.data.user_full_name;
                         let s3_user_full_name = s1_full_name;//2022-09-20

                         let s3_email = resp.data.email;
                         let s3_logged_in = resp.data.logged_in;
                         //2022-09-20 let s3_recipient_email = resp.data.recipient_email;
                         let s3_recipient_email = s1_coach_email; //2022-09-20
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
 
                         //encrypting the email
                         //let encryptedEmail = encrypt(resp.data.recipient_email.toString(),"seed");
                         let encryptedID = encrypt(s1_ind_id.toString(), "seed");
                         //new token $CHOOSE_PASSWORD_LINK$
                         //let s3_choose_password_link = resp.data.website_url + "#/forgot_password_choose?email=" + encodeURIComponent(encryptedEmail)
                         let s3_choose_password_link = "<a href =" + resp.data.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"
                         //console.log("s3 recipient email: "+s3_recipient_email);
 
                         if (s2_subject == null) {
                           s2_subject = "Please inform your email template manager to create an email template for "+email_template_type;
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
                         s2_subject = s2_subject.replaceAll("$RECIPIENT_EMAIL$", s1_coach_email);
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
                         //s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                         //s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                         let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                         if (s3_logged_in == 0)
                         {
                           s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                         }
                         if (s3_logged_in == 1)
                         {
                           s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                         }
 
 
                         //SURVEY_SUB_ORGANIZATION_NAME
                         //SUBORG_NAME
                         if (s2_email_template_id == null)
                         {
                           s2_email_template_id = 0;
                         }
                         if (s3_website_sender_email == null)
                         {
                           s3_website_sender_email = "help@talentsage.com";
                         }
                         if (s3_recipient_email == null)
                         {
                           s3_recipient_email = "help@talentsage.com";
                         }                        
 
                         if (s2_email_body == null)
                         {
                           s2_email_body = "Please inform your email template manager to create an email template for "+email_template_type;
                         }
                         //logo 
                         if (s3_header_bg_color == null) {
                           s3_header_bg_color = "#ffffff";
                         }
                         // let s3_logo = `<div style="background: ${s3_header_bg_color}; 
                         // display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                         // <img style="max-width: 100%; height: 60px;" src="${s3_website_url + '' + s3_brand_path}/logo.png" alt="Brand Logo"/>
                         // </div>`,
                         //let s3_logo = 'test logo.png';
                         let s3_logo = '<div style="background:'+s3_header_bg_color+'; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="'+s3_website_url + s3_brand_path+'/logo.png" alt="Brand Logo"/> </div>';
 
                         s2_email_body = s2_email_body.replaceAll("$LOGO$", s3_logo);
 
                         s2_email_body = s2_email_body.replaceAll("$USER_FULL_NAME$", s3_user_full_name);
                         s2_email_body = s2_email_body.replaceAll("$USER_EMAIL$", s3_email);
                         s2_email_body = s2_email_body.replaceAll("$RECIPIENT_EMAIL$", s1_coach_email);
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
 
                         
                         s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
                         //s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
 
                         //let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";
                         if (s3_logged_in == 0)
                         {
                           s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_choose_password_link);
                         }
                         if (s3_logged_in == 1)
                         {
                           s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
                         }
 
 
                         console.log ("s2 subject : "+s2_subject);
                         
                               
                           console.log("website sender email: "+s3_website_sender_email);
                           console.log("s1 coach email: "+s1_coach_email);
                           console.log("s2 email body: "+s2_email_body);
                           let step4_url = node_baseurl + 'sendemail';
                           axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s1_coach_email, send_cc: cc_list, 
                           send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                           org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                             .then(resp => {                                  
                                 //console.log(i);
                                 console.log("coach report email ctr i: "+i, " survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
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
                           let myResp = {};
                           myResp = {'processed' : ctr};
                           res.json(myResp)
                         //res.json(resp.data);
                         //res.json(s2_subject);
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
         //step 2 ///////////////////////////////////
         } 
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