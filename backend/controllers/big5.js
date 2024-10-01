import {
    b5DeleteM,
    b5Delete2M,
    b5GetFinalDeadlineM,
    b5NormRawInsertM,
    b5CohortInsertM,
    b5ReportDataM,
    b5ReportData2M,
    //big5 survey result data fix:
    b5GetDuplicateStatement1M,
    b5DeleteDuplicateStatement2M,
    b5DeleteSubtraitSupertrait3M,
    b5DeleteSubtraitSupertrait3aM,
    b5GetSubmittedSurvey4M,
    b5InsertSubtrait6M,
    b5GetSurveyResultM,
    b5InsertSurveyResultTraitsM,
    b5GetSurveyAssignmentForSRReprocessingM,
    b5CoachReportDataM,
    b5FacultyReportDataM,
    b5GetCountriesM,
  } from '../models/Big5M.js'
  
  // import function to check token
  import check_token from "./functions.js";
  

  //import axios to call endpoints in sequence for scheduled email sending
  import axios, * as others from 'axios';

  import CryptoJS from 'crypto-js';

   //encryption function
   function encrypt(src, passphrase){
    return CryptoJS.AES.encrypt(src, passphrase).toString()
  }


  // step1 fix survey result data
  export const  b5GetDuplicateStatement1 = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  b5GetDuplicateStatement1M(data, (err, results) => {
    if (err) 
      {
        res.send(err)
      } else 
      {
          res.json(results)
      }
    })
  }

  
  // step2 delete duplicate statement
  export const  b5DeleteDuplicateStatement2 = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    b5DeleteDuplicateStatement2M(data, (err, results) => {
      if (err) 
        {
          res.send(err)
        } else 
        {
            res.json(results)
        }
      })
    }

  // step3 delete subtrait supertrait
  export const  b5DeleteSubtraitSupertrait3 = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    b5DeleteSubtraitSupertrait3M(data, (err, results) => {
      if (err) 
        {
          res.send(err)
        } else 
        {
            res.json(results)
        }
      })
    }

    // step3a delete subtrait supertrait by sa_id
  export const  b5DeleteSubtraitSupertrait3a = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    b5DeleteSubtraitSupertrait3aM(data, (err, results) => {
      if (err) 
        {
          res.send(err)
        } else 
        {
            res.json(results)
        }
      })
    }

  // step4 GET LIST OF SURVEY ASSIGNMENTS FOR BIG5 TYPE SURVEY THAT ARE SUBMITTED (TO BE UPDATED WITH SUBTRAIT SUPERTRAIT)
  export const b5GetSubmittedSurvey4 = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    b5GetSubmittedSurvey4M(data, (err, results) => {
      if (err) 
        {
          res.send(err)
        } else 
        {
          res.json(results)
        }
      })
    }

  

  // step 6 big 5 survey result data fix insert subtrait (pass suvey_assignment_id org id suborgid)
  export const  b5InsertSubtrait6 = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    b5InsertSubtrait6M(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }


  export const b5Delete = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    b5DeleteM(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

  export const b5Delete2 = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    //const data = req.body
    //b5Delete2M(data, (err, results) => {
    b5Delete2M(req.params.id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }


   // Get final deadline surveys with org suborg program iteration  group
   export const  b5GetFinalDeadline = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    b5GetFinalDeadlineM(req.params.id, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

   // insert b5_norm_raw endpoint
   export const  b5NormRawInsert = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    b5NormRawInsertM(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }


     // insert cohort insert m
     export const  b5CohortInsert = (req, res) => {
      if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
      const data = req.body
      b5CohortInsertM(data, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.json(results)
        }
      })
    }



  // process in sequence the endpoints for b5 report processing based on iteration final deadline date
export const b5Processing = (req, res) => {
  var check_date_field = 'final_deadline_date';
  //var cc_list = "mnetdev2@mnetteam.com,greg.martin@mnetteam.com,j.proutymclaren@gmail.com,d.c.hallett@icloud.com";
  var cc_list = "mnetdev2@mnetteam.com";
  var bcc_list = "mnetdev2@mnetteam.com";
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")



  //step 1 select iteration where final_deadline_date = now
  axios.get(node_baseurl +'b5-get-final-deadline/'+check_date_field,{ headers: {"token" : valid_token} })
  .then(resp => {
      console.log(resp.data);
      let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
      
      console.log(ctr);
  
      //console log if no final_deadline_date found
      if (ctr == 0){
        //res.json({processed: true});
        let myResp = {};
        myResp = {'big5 surveys processed' : ctr};
        res.json(myResp);
        //res.json({processed: `$(ctr)`});
        //to add later minimum # of surveys to be eligible for big5 report processing
        console.log("no valid submitted surveys found for big5 report processing");
      }

      for(let i = 0; i < ctr; i++) 
      {
        console.log("big5 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
        //define variable values from step1///////
        let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
        let s1_ind_id = resp.data[i].ind_id;
        let s1_org_id = resp.data[i].org_id;
        let s1_suborg_id = resp.data[i].suborg_id;
        let s1_program_id = resp.data[i].program_id;
        let s1_iteration_id = resp.data[i].iteration_id;
        
        //let s1_is_nomination = resp.data[i].is_nomination;

        console.log("big5 array values checking i: ["+ i +"] " + s1_survey_assignment_id);
        //console.log("s1_survey_assignment_id");

        /////step 2 - delete b5 norm raw , b5 cohort for same cohort group for re-run scenario
        //step 2 ///////////////////////////////////

        //let found_existing_big5 = false;
        
        let email_template_type;
        switch (check_date_field) {
          case 'final_deadline_date':
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

            // let step2_url = node_baseurl + 'b5-delete';
            // axios.delete(step2_url, {org_id: s1_org_id, suborg_id: s1_suborg_id, program_id: s1_program_id, iteration_id: s1_iteration_id,
            // _id: s1__id, group_id: s1_group_id}, { headers: {"token" : valid_token} } )        
            
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// process in sequence the endpoints for b5 report processing based on iteration final deadline date
export const b5Processing2 = (req, res) => {
  var check_date_field = 'final_deadline_date';
  //var cc_list = "mnetdev2@mnetteam.com,greg.martin@mnetteam.com,j.proutymclaren@gmail.com,d.c.hallett@icloud.com";
  var cc_list = "mnetdev2@mnetteam.com";
  var bcc_list = "mnetdev2@mnetteam.com";
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")


  /////////step 0 delete existing////////////
  let step0_url = node_baseurl + 'b5-delete2/'+check_date_field;
  axios.delete(step0_url, { headers: {"token" : valid_token} })      
  .then
  (resp => 
    {
      console.log("step0 delete: " + JSON.stringify(resp.data));


      /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
      axios.get(node_baseurl +'b5-get-final-deadline/'+check_date_field,{ headers: {"token" : valid_token} })
      .then
      (resp => 
        {
          console.log(resp.data);
          let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
          
          console.log(ctr);
      
          //console log if no final_deadline_date found
          if (ctr == 0){
            //res.json({processed: true});
            let myResp = {};
            myResp = {'big5 surveys processed' : ctr};
            res.json(myResp);
            //res.json({processed: `$(ctr)`});
            //to add later minimum # of surveys to be eligible for big5 report processing
            console.log("no valid submitted surveys found for big5 report processing");
          }

          for(let i = 0; i < ctr; i++) 
          {
            console.log("big5 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
            //define variable values from step1///////
            let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
            let s1_ind_id = resp.data[i].ind_id;
            let s1_org_id = resp.data[i].org_id;
            let s1_suborg_id = resp.data[i].suborg_id;
            let s1_program_id = resp.data[i].program_id;
            let s1_iteration_id = resp.data[i].iteration_id;
            
            //let s1_is_nomination = resp.data[i].is_nomination;

            console.log("big5 array values checking i: ["+ i +"] " + s1_survey_assignment_id);

                ////////////step 2 - insert b5 norm raw///////////////////
                let step2_url = node_baseurl + 'b5-norm-raw-insert';
                axios.post(step2_url, {survey_assignment_id: s1_survey_assignment_id}, { headers: {"token" : valid_token} })
                .then(resp => {
                    console.log(resp.data);

                    ///////////step 3 - if all b5-norm-raw-insert complete, insert b5 cohort table////////////////////////
                    if ( i == (ctr - 1) )
                    {
                      let step3_url = node_baseurl + 'b5-cohort-insert';
                      console.log("step3 url: "+step3_url);
                      axios.post(step3_url, {org_id: s1_org_id, suborg_id: s1_suborg_id, program_id: s1_program_id, iteration_id: s1_iteration_id }, { headers: {"token" : valid_token} })
                      .then(resp => {
                            console.log("step3 insert cohort: " + JSON.stringify(resp.data));
                            
                            // ///////////step4 send email//////////
                            // let step4_url = node_baseurl + 'sendemail';
                            // axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
                            // send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
                            // org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
                            //   .then(resp => {                                  
                            //       //console.log(i);
                            //       console.log("ctr i: "+i, "survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
                            //       //res.json(resp.data);
                            //   })
                            //   .catch(function (error) {
                            //     if (error.response) {
                            //       // Request made and server responded
                            //       console.log(error.response.data);
                            //       console.log(error.response.status);
                            //       console.log(error.response.headers);
                            //     } else if (error.request) {
                            //       // The request was made but no response was received
                            //       console.log(error.request);
                            //     } else {
                            //       // Something happened in setting up the request that triggered an Error
                            //       console.log('Error', error.message);
                            //     }
                            //   });
                            let myResp = {};
                            myResp = {'Big5 cohort surveys processed' : ctr};
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
            //step 2 ///////////////////////////////////
            } 
          //res.json(resp.data);
      
        }
      )
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
  )    
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


export const b5ReportData = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  b5ReportDataM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


export const b5ReportData2 = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  b5ReportData2M(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


export const b5CoachReportData = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  b5CoachReportDataM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const b5FacultyReportData = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  b5FacultyReportDataM(data, (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}





// based on charles reprocess big5 survey result computation of subtrait supertrait
export const b5SurveyResultReprocessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let s1_survey_assignment_id = req.body['survey_assignment_id']
  // const data = req.body
  console.log(req.body)
  let step1_url = node_baseurl + 'b5-get-survey-result/' + s1_survey_assignment_id;
  console.log(step1_url)
  //axios.get(step1_url, { headers: {"token" : valid_token} })      

  axios({
    method: 'get',
    url: step1_url,
    headers: { 
      'token': valid_token, 
      'Content-Type': 'application/json'
    },
  })


  .then
  (resp => 
  {
    console.log("step1 get: " + JSON.stringify(resp.data));
    let s2_data = resp.data

    /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
    let step2_url = node_baseurl + 'b5-insert-survey-result-traits'
    // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
    console.log(step2_url)
    axios({
      method: 'post',
      url: step2_url,
      data: s2_data,
      headers: { 
        'token': valid_token, 
        'Content-Type': 'application/json'
      },
    })
      .then
      (resp => 
        {
          console.log("step2", resp.data);
          res.json(resp.data);
          // let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
          
          // console.log(ctr);
      
          // //console log if no final_deadline_date found
          // if (ctr == 0){
          //   //res.json({processed: true});
          //   let myResp = {};
          //   myResp = {'big5 surveys processed' : ctr};
          //   res.json(myResp);
          //   //res.json({processed: `$(ctr)`});
          //   //to add later minimum # of surveys to be eligible for big5 report processing
          //   console.log("no valid submitted surveys found for big5 report processing");
          // }

          // for(let i = 0; i < ctr; i++) 
          // {
          //   console.log("big5 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
          //   //define variable values from step1///////
          //   let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
          //   let s1_ind_id = resp.data[i].ind_id;
          //   let s1_org_id = resp.data[i].org_id;
          //   let s1_suborg_id = resp.data[i].suborg_id;
          //   let s1_program_id = resp.data[i].program_id;
          //   let s1_iteration_id = resp.data[i].iteration_id;
            
          //   //let s1_is_nomination = resp.data[i].is_nomination;

          //   console.log("big5 array values checking i: ["+ i +"] " + s1_survey_assignment_id);

          //       ////////////step 2 - insert b5 norm raw///////////////////
          //       let step2_url = node_baseurl + 'b5-norm-raw-insert';
          //       axios.post(step2_url, {survey_assignment_id: s1_survey_assignment_id}, { headers: {"token" : valid_token} })
          //       .then(resp => {
          //           console.log(resp.data);

          //           ///////////step 3 - if all b5-norm-raw-insert complete, insert b5 cohort table////////////////////////
          //           if ( i == (ctr - 1) )
          //           {
          //             let step3_url = node_baseurl + 'b5-cohort-insert';
          //             console.log("step3 url: "+step3_url);
          //             axios.post(step3_url, {org_id: s1_org_id, suborg_id: s1_suborg_id, program_id: s1_program_id, iteration_id: s1_iteration_id }, { headers: {"token" : valid_token} })
          //             .then(resp => {
          //                   console.log("step3 insert cohort: " + JSON.stringify(resp.data));
                            
          //                   // ///////////step4 send email//////////
          //                   // let step4_url = node_baseurl + 'sendemail';
          //                   // axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
          //                   // send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
          //                   // org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
          //                   //   .then(resp => {                                  
          //                   //       //console.log(i);
          //                   //       console.log("ctr i: "+i, "survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
          //                   //       //res.json(resp.data);
          //                   //   })
          //                   //   .catch(function (error) {
          //                   //     if (error.response) {
          //                   //       // Request made and server responded
          //                   //       console.log(error.response.data);
          //                   //       console.log(error.response.status);
          //                   //       console.log(error.response.headers);
          //                   //     } else if (error.request) {
          //                   //       // The request was made but no response was received
          //                   //       console.log(error.request);
          //                   //     } else {
          //                   //       // Something happened in setting up the request that triggered an Error
          //                   //       console.log('Error', error.message);
          //                   //     }
          //                   //   });
          //                   let myResp = {};
          //                   myResp = {'Big5 cohort surveys processed' : ctr};
          //                   res.json(myResp)
          //                 //res.json(resp.data);
          //                 //res.json(s2_subject);
          //             })
          //             .catch(function (error) {
          //               if (error.response) {
          //                 // Request made and server responded
          //                 console.log(error.response.data);
          //                 console.log(error.response.status);
          //                 console.log(error.response.headers);
          //               } else if (error.request) {
          //                 // The request was made but no response was received
          //                 console.log(error.request);
          //               } else {
          //                 // Something happened in setting up the request that triggered an Error
          //                 console.log('Error', error.message);
          //               }
                    
          //             });






          //           }
 
          //           //res.json(resp.data);
          //       })
          //       .catch(function (error) {
          //         if (error.response) {
          //           // Request made and server responded
          //           console.log(error.response.data);
          //           console.log(error.response.status);
          //           console.log(error.response.headers);
          //         } else if (error.request) {
          //           // The request was made but no response was received
          //           console.log(error.request);
          //         } else {
          //           // Something happened in setting up the request that triggered an Error
          //           console.log('Error', error.message);
          //         }
          //       });
          //   //step 2 ///////////////////////////////////
          //   } 
          // //res.json(resp.data);
      
        }
      )
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
  )    
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


//data fix survey result
export const b5GetSurveyResult = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const surveyAssignmentId = req.params.survey_assignment_id 
  b5GetSurveyResultM(surveyAssignmentId, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const b5InsertSurveyResultTraits = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  b5InsertSurveyResultTraitsM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const b5GetSurveyAssignmentForSRReprocessing = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const s1a_iteration_id = req.params.iteration_id 
  b5GetSurveyAssignmentForSRReprocessingM(s1a_iteration_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}



// based on charles reprocess big5 survey result computation of subtrait supertrait
export const b5SurveyResultReprocessing2 = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  let s1_iteration_id = req.body['iteration_id']
  // const data = req.body
  console.log(req.body)
  
  let step0_url = node_baseurl + 'b5-get-survey_assignment_for_sr_reprocessing/' + s1_iteration_id;
  console.log("step 0 url:" + step0_url);
  axios({
    method: 'get',
    url: step0_url,
    headers: { 
      'token': valid_token, 
      'Content-Type': 'application/json'
    },
  })  
  .then
  (resp => 
  {
      console.log("step0 get: " + JSON.stringify(resp.data));
      let s0_data = resp.data;
      console.log("step0 i:0 survey_assignment_id: " + s0_data[0]['survey_assignment_id']);

      let step1_url = node_baseurl + 'b5-get-survey-result/' + s1_survey_assignment_id;
      console.log(step1_url)
      //axios.get(step1_url, { headers: {"token" : valid_token} })      

      axios({
        method: 'get',
        url: step1_url,
        headers: { 
          'token': valid_token, 
          'Content-Type': 'application/json'
        },
      })


      .then
      (resp => 
      {
        console.log("step1 get: " + JSON.stringify(resp.data));
        let s2_data = resp.data

        /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
        let step2_url = node_baseurl + 'b5-insert-survey-result-traits'
        // axios.post(step2_url, s2_data, { headers: { "token": valid_token } })
        console.log(step2_url)
        axios({
          method: 'post',
          url: step2_url,
          data: s2_data,
          headers: { 
            'token': valid_token, 
            'Content-Type': 'application/json'
          },
        })
          .then
          (resp => 
            {
              console.log("step2", resp.data);
              res.json(resp.data);
              // let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
              
              // console.log(ctr);
          
              // //console log if no final_deadline_date found
              // if (ctr == 0){
              //   //res.json({processed: true});
              //   let myResp = {};
              //   myResp = {'big5 surveys processed' : ctr};
              //   res.json(myResp);
              //   //res.json({processed: `$(ctr)`});
              //   //to add later minimum # of surveys to be eligible for big5 report processing
              //   console.log("no valid submitted surveys found for big5 report processing");
              // }

              // for(let i = 0; i < ctr; i++) 
              // {
              //   console.log("big5 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
              //   //define variable values from step1///////
              //   let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
              //   let s1_ind_id = resp.data[i].ind_id;
              //   let s1_org_id = resp.data[i].org_id;
              //   let s1_suborg_id = resp.data[i].suborg_id;
              //   let s1_program_id = resp.data[i].program_id;
              //   let s1_iteration_id = resp.data[i].iteration_id;
                
              //   //let s1_is_nomination = resp.data[i].is_nomination;

              //   console.log("big5 array values checking i: ["+ i +"] " + s1_survey_assignment_id);

              //       ////////////step 2 - insert b5 norm raw///////////////////
              //       let step2_url = node_baseurl + 'b5-norm-raw-insert';
              //       axios.post(step2_url, {survey_assignment_id: s1_survey_assignment_id}, { headers: {"token" : valid_token} })
              //       .then(resp => {
              //           console.log(resp.data);

              //           ///////////step 3 - if all b5-norm-raw-insert complete, insert b5 cohort table////////////////////////
              //           if ( i == (ctr - 1) )
              //           {
              //             let step3_url = node_baseurl + 'b5-cohort-insert';
              //             console.log("step3 url: "+step3_url);
              //             axios.post(step3_url, {org_id: s1_org_id, suborg_id: s1_suborg_id, program_id: s1_program_id, iteration_id: s1_iteration_id }, { headers: {"token" : valid_token} })
              //             .then(resp => {
              //                   console.log("step3 insert cohort: " + JSON.stringify(resp.data));
                                
              //                   // ///////////step4 send email//////////
              //                   // let step4_url = node_baseurl + 'sendemail';
              //                   // axios.post(step4_url, {send_from: s3_website_sender_email, send_to: s3_recipient_email, send_cc: cc_list, 
              //                   // send_bcc: bcc_list, subject: s2_subject, body: s2_email_body, ind_id: s1_ind_id, survey_assignment_id: s1_survey_assignment_id,
              //                   // org_id: s1_org_id, suborg_id: s1_suborg_id, email_template_id: s2_email_template_id}, { headers: {"token" : valid_token} } )
              //                   //   .then(resp => {                                  
              //                   //       //console.log(i);
              //                   //       console.log("ctr i: "+i, "survey_assignment_id: "+s1_survey_assignment_id, "send_email response :",resp.data);
              //                   //       //res.json(resp.data);
              //                   //   })
              //                   //   .catch(function (error) {
              //                   //     if (error.response) {
              //                   //       // Request made and server responded
              //                   //       console.log(error.response.data);
              //                   //       console.log(error.response.status);
              //                   //       console.log(error.response.headers);
              //                   //     } else if (error.request) {
              //                   //       // The request was made but no response was received
              //                   //       console.log(error.request);
              //                   //     } else {
              //                   //       // Something happened in setting up the request that triggered an Error
              //                   //       console.log('Error', error.message);
              //                   //     }
              //                   //   });
              //                   let myResp = {};
              //                   myResp = {'Big5 cohort surveys processed' : ctr};
              //                   res.json(myResp)
              //                 //res.json(resp.data);
              //                 //res.json(s2_subject);
              //             })
              //             .catch(function (error) {
              //               if (error.response) {
              //                 // Request made and server responded
              //                 console.log(error.response.data);
              //                 console.log(error.response.status);
              //                 console.log(error.response.headers);
              //               } else if (error.request) {
              //                 // The request was made but no response was received
              //                 console.log(error.request);
              //               } else {
              //                 // Something happened in setting up the request that triggered an Error
              //                 console.log('Error', error.message);
              //               }
                        
              //             });






              //           }
    
              //           //res.json(resp.data);
              //       })
              //       .catch(function (error) {
              //         if (error.response) {
              //           // Request made and server responded
              //           console.log(error.response.data);
              //           console.log(error.response.status);
              //           console.log(error.response.headers);
              //         } else if (error.request) {
              //           // The request was made but no response was received
              //           console.log(error.request);
              //         } else {
              //           // Something happened in setting up the request that triggered an Error
              //           console.log('Error', error.message);
              //         }
              //       });
              //   //step 2 ///////////////////////////////////
              //   } 
              // //res.json(resp.data);
          
            }
          )
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
      )    
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
  )
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

//get countries
export const b5GetCountries = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  b5GetCountriesM( (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
}