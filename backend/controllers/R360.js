import {
  R360DeleteM,
  R360Delete2M,
  R360GetFinalDeadlineM,
  R360RawInsertM,
  R360CohortInsertM,
  R360ReportData2M,
  R360GenerateDataM,
  R360ReportData2aM,
  R360ReportData2bM,
  R360ReportData2cM,
  R360RawInsert3M,
  R360CoachReportDataM,
  R360CoachReportData2cM,
  R360FacultyReportDataM,
  updateR360RawRelationshipM,
} from '../models/R360M.js'

// import function to check token
import check_token from "./functions.js";

import db from "../config/database.js";

//import axios to call endpoints in sequence for scheduled email sending
import axios, * as others from 'axios';

import CryptoJS from 'crypto-js';

 //encryption function
 function encrypt(src, passphrase){
  return CryptoJS.AES.encrypt(src, passphrase).toString()
}

export const R360Delete = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  R360DeleteM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

export const R360Delete2 = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  //const data = req.body
  //R360Delete2M(data, (err, results) => {
  R360Delete2M(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


 // Get final deadline surveys with org suborg program iteration stream group
 export const  R360GetFinalDeadline = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  R360GetFinalDeadlineM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


 // insert R360_norm_raw endpoint
 export const  R360RawInsert = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  R360RawInsertM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


   // insert cohort insert m
   export const  R360CohortInsert = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    R360CohortInsertM(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
  }

 // Generate r360 cohort data
 export const  R360GenerateData = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  R360GenerateDataM(req.params.id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// process in sequence the endpoints for R360 report processing based on iteration final deadline date
export const R360Processing2 = (req, res) => {
var check_date_field = 'final_deadline_date';

if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")


/////////step 0 delete existing////////////
let step0_url = node_baseurl + 'r360-delete2/'+check_date_field;
axios.delete(step0_url, { headers: {"token" : valid_token} })      
.then
(resp => 
  {
    console.log("step0 delete: " + JSON.stringify(resp.data));


    /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
    axios.get(node_baseurl +'r360-get-final-deadline/'+check_date_field,{ headers: {"token" : valid_token} })
    .then
    (resp => 
      {
        //console.log(resp.data);
        console.log("step1");
        let sa360_data = resp.data;
        let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
        
        console.log("step 1 - r360 list of surveys count ctr: " + ctr);
    
        //console log if no final_deadline_date found
        if (ctr == 0){
          //res.json({processed: true});
          let myResp = {};
          myResp = {'360 surveys processed' : ctr};
          res.json(myResp);
          //res.json({processed: `$(ctr)`});
          //to add later minimum # of surveys to be eligible for big5 report processing
          console.log("no valid submitted surveys found for 360 report processing");
        }
        else
        {
          //console.log("R360 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
          //define variable values from step1///////
          //let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
          //let s1_ind_id = resp.data[i].ind_id;
          //let s1_org_id = resp.data[i].org_id;
          //let s1_suborg_id = resp.data[i].suborg_id;
          //let s1_program_id = resp.data[i].program_id;
          //let s1_iteration_id = resp.data[i].iteration_id;
          //let s1_stream_id = resp.data[i].stream_id;
          //let s1_group_id = resp.data[i].group_id;
          //let s1_is_nomination = resp.data[i].is_nomination;

          //console.log("big5 array values checking i: ["+ i +"] " + s1_survey_assignment_id);

              ////////////step 2 - insert R360  raw///////////////////
              let step2_url = node_baseurl + 'r360-raw-insert';
              //axios.post(step2_url, {survey_assignment_id: s1_survey_assignment_id}, { headers: {"token" : valid_token} })
              //axios.post(step2_url, sa360_data, { headers: {"token" : valid_token} })
              //axios.post(step2_url, sa360_data, { headers: {"token" : valid_token} })
              axios({
                method: 'post',
                url: step2_url,
                data: sa360_data,
                headers: { 
                  'token': valid_token, 
                  'Content-Type': 'application/json'
                },

              })
              .then(resp => {
                console.log("step 2 r360 raw insert complete, console log resp.data on following line");
                  console.log(resp.data);

                  ///////////step 3 - after R360-raw-insert , generate R360 cohort data////////////////////////                    
                    let step3_url = node_baseurl + 'r360-generate-data/1';
                    console.log("step3 url: "+step3_url);
                    //axios.post(step3_url, { headers: {"token" : valid_token} })
                    axios({
                      method: 'post',
                      url: step3_url,
                      headers: { 
                        'token': valid_token 
                      },
                    })
                    .then(resp => {
                          let r360_cohort_data = resp.data;
                          console.log("step3 generate cohort data resp.data: " + JSON.stringify(resp.data));
                          
                          // ///////////step4 insert r360 cohort data//////////
                          let step4_url = node_baseurl + 'r360-cohort-insert';
                          console.log ("step 4 url : " + step4_url);
                          //axios.post(step4_url, { headers: {"token" : valid_token} } )
                          axios({
                            method: 'post',
                            url: step4_url,
                            data: r360_cohort_data,
                            headers: { 
                              'token': valid_token, 
                              'Content-Type': 'application/json'
                            },
            
                          })
                            .then(resp => {                                  
                                //console.log(i);
                                console.log("step 4 finished, resp.data in following line:");
                                console.log(resp.data);
                                res.json(resp.data);
                                // let myResp = {};
                                // myResp = {'r360 cohort surveys processed' : ctr};
                                // res.json(myResp)

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
                          // let myResp = {};
                          // myResp = {'Big5 cohort surveys processed' : ctr};
                          // res.json(myResp)
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




export const R360ReportData2 = (req, res) => {
if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
const data = req.body
R360ReportData2M(data, (err, results) => {
  if (err) {
    res.send(err)
  } else {
    res.json(results)
  }
})
}



export const   R360ReportData2a = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  R360ReportData2aM(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
  }


  export const   R360ReportData2b = (req, res) => {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    const data = req.body
    R360ReportData2bM(data, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.json(results)
      }
    })
    }
  

    export const   R360ReportData2c = (req, res) => {
      if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
      const data = req.body
      R360ReportData2cM(data, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.json(results)
        }
      })
      }
    





///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// process in sequence the endpoints for R360 report processing based on iteration final deadline date
////////2022-08-19 one at a time instead of by bulk
export const R360Processing3 = (req, res) => {
  var check_date_field = 'final_deadline_date';
  
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  
  
  /////////step 0 delete existing////////////
  let step0_url = node_baseurl + 'r360-delete2/'+check_date_field;
  axios.delete(step0_url, { headers: {"token" : valid_token} })      
  .then
  (resp => 
    {
      console.log("step0 delete: " + JSON.stringify(resp.data));
  
  
      /////////////step 1 select list of surveys to be processed based on iteration where final_deadline_date = now////////////
      axios.get(node_baseurl +'r360-get-final-deadline/'+check_date_field,{ headers: {"token" : valid_token} })
      .then
      (resp => 
        {
          //console.log(resp.data);
          console.log("step1");
          let sa360_data = resp.data;
          let ctr = resp.data.length; //use this to trigger execution of insert cohort endpoint if i == (ctr - 1)
          
          console.log("step 1 - r360 list of surveys count ctr: " + ctr);
      
          //console log if no final_deadline_date found
          if (ctr == 0){
            //res.json({processed: true});
            let myResp = {};
            myResp = {'360 surveys processed' : ctr};
            res.json(myResp);
            //res.json({processed: `$(ctr)`});
            //to add later minimum # of surveys to be eligible for big5 report processing
            console.log("no valid submitted surveys found for 360 report processing");
          }
          else
          {
            for(let i = 0; i < ctr; i++) 
            {
                console.log("R360 ctr i:" + i, "survey_assignment_id" + resp.data[i].survey_assignment_id);
                //define variable values from step1///////
                let s1_survey_assignment_id = resp.data[i].survey_assignment_id;
                let s1_ind_id = resp.data[i].ind_id;
                let s1_org_id = resp.data[i].org_id;
                let s1_suborg_id = resp.data[i].suborg_id;
                let s1_program_id = resp.data[i].program_id;
                let s1_iteration_id = resp.data[i].iteration_id;
                let s1_stream_id = resp.data[i].stream_id;
                let s1_group_id = resp.data[i].group_id;
                let s1_is_nomination = resp.data[i].is_nomination;
      
                console.log("r360 array values checking i: ["+ i +"] " + s1_survey_assignment_id);

                //get survey_result data for survey_assignment
                db.query('SELECT sa.program_id, sa.iteration_id, sa.is_nomination, sa.parent_survey_assignment_id, sa.relationship_id, sa.survey_template_id, sa.ind_id, sr.* FROM survey_result sr LEFT JOIN survey_assignment sa ON sa.survey_assignment_id = sr.survey_assignment_id WHERE sr.record_type = "Cohort" AND sr.statement_num IS NOT NULL AND sr.survey_assignment_id = ?',
                [s1_survey_assignment_id],
                (err, results) => 
                {
                  if (err) 
                  {
                    console.log(err)
                    //result(err, null)
                  } else 
                  {
                    //result(null, results)
                    console.log("db.query controller survey results for " + i);
                    console.log(results);

                    ////////////step 2 - insert R360  raw///////////////////
                    let step2_url = node_baseurl + 'r360-raw-insert3';
                    //axios.post(step2_url, {survey_assignment_id: s1_survey_assignment_id}, { headers: {"token" : valid_token} })
                    //axios.post(step2_url, sa360_data, { headers: {"token" : valid_token} })
                    //axios.post(step2_url, sa360_data, { headers: {"token" : valid_token} })
                    axios({
                      method: 'post',
                      url: step2_url,
                      data: results,
                      headers: { 
                        'token': valid_token, 
                        'Content-Type': 'application/json'
                      },
      
                    })
                    .then(resp => 
                    {
                        console.log("step 2 r360 raw insert console log resp.data on following line for i: " + i);
                        console.log(resp.data);
      
                        ///////////step 3 - run after all i for R360-raw-insert3 finished , generate R360 cohort data////////////////////////
                        if (ctr == (i+1))
                        {
                          let step3_url = node_baseurl + 'r360-generate-data/1';
                          console.log("step3 url: "+step3_url);
                          //axios.post(step3_url, { headers: {"token" : valid_token} })
                          axios({
                            method: 'post',
                            url: step3_url,
                            headers: { 
                              'token': valid_token 
                            },
                          })
                          .then(resp => 
                            {
                                let r360_cohort_data = resp.data;
                                console.log("step3 generate cohort data resp.data: " + JSON.stringify(resp.data));
                                
                                // ///////////step4 insert r360 cohort data//////////
                                let step4_url = node_baseurl + 'r360-cohort-insert';
                                console.log ("step 4 url : " + step4_url);
                                //axios.post(step4_url, { headers: {"token" : valid_token} } )
                                axios({
                                  method: 'post',
                                  url: step4_url,
                                  data: r360_cohort_data,
                                  headers: { 
                                    'token': valid_token, 
                                    'Content-Type': 'application/json'
                                  },
                                })
                                .then(resp => 
                                  {                                  
                                      //console.log(i);
                                      console.log("step 4 finished, resp.data in following line:");
                                      console.log(resp.data);
                                      res.json(resp.data);
                                      // let myResp = {};
                                      // myResp = {'r360 cohort surveys processed' : ctr};
                                      // res.json(myResp)
      
                                  })
                                .catch(function (error) 
                                  {
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
                          .catch(function (error) 
                            {
                              if (error.response) 
                              {
                                // Request made and server responded
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                              } 
                              else if (error.request) 
                              {
                                // The request was made but no response was received
                                console.log(error.request);
                              } 
                              else 
                              {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                              }
                            });
                        }//end if
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
                  }  //end db.query else valid result execution  
                }) //end db.query get survey_result data
            }   //end for loop  //step 2 ?///////////////////////////////////
          }  //end else 
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
  
  

  // insert R360_norm_raw endpoint
 export const  R360RawInsert3 = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  R360RawInsert3M(data, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

//get all individual that shared with coach
export const  R360CoachReportData = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  R360CoachReportDataM(data, (err, results) => {
    if (err) res.send(err)
    res.json(results)
  })
}

//get all individual that shared with coach and with count
export const  R360CoachReportData2c = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  R360CoachReportData2cM(data, (err, results) => {
    if (err) res.send(err)
    res.json(results)
  })
}

// query 360 faculty report data based on the iteration
export const  R360FacultyReportData = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body
  R360FacultyReportDataM(data, (err, results) => {
    if (err) res.send(err)
    res.json(results)
  })
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////2023-01-03 TO 01-05 copy data from survey_result to r360_survey_result and update iteration_id
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const R360Histogram1 = (req, res) => {

  
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const s1_iteration_id = req.params.id;
  console.log(s1_iteration_id);
  /////STEP 1 - DELETE R360_SURVEY_RESULT DATA//////
  let query1 = `
    DELETE 
    FROM r360_survey_result
    WHERE 
    iteration_id = ${s1_iteration_id}
  `;
//   console.log(query1);
  db.query(query1, [], (err, results) => 
  {
    if (err) 
    {
        console.log(err)
        //result(err, null)
    } else 
    {
      //result(null, results)
      
      ///STEP A1 GENERATE QUERY - SELECT LIST OF TRAITS
      let query1a = `
      SELECT trait_code from r360_trait
      `;
    //   console.log(query1a);
      db.query(query1a, [], (err, results) => 
      {
        if (err) 
        {
            console.log(err)
            //result(err, null)
        } else 
        {
          //res.json(results);
        //   console.log(results);
          let ctr = results.length;
        //   console.log("ctr: " + ctr);
        //   console.log("RECORD 0 trait_code: " + results[0].trait_code);
          let query2 = ``;
          for(let i = 0; i < ctr; i++) 
          {
            // console.log("trait code :" + i, " : " + results[i].trait_code);
            let s2_trait_code = results[i].trait_code;
            // console.log("s2_trait_code :" + i, " : " + s2_trait_code);
            query2 = query2 + 
              `(SELECT rr.survey_assignment_id,
              'Cohort' AS record_type,
              '${s2_trait_code}' as statement_num,
              rr.${s2_trait_code} AS score,
              rr.org_id,
              rr.suborg_id,
              rr.iteration_id
              FROM r360_raw rr
              WHERE rr.is_nomination = 0 
              AND rr.iteration_id = ${s1_iteration_id}) 
              UNION ALL #THE FF IS FOR NOMINEEES
              (SELECT rr.nomination_survey_assignment_id,
                'Cohort' AS record_type,
                '${s2_trait_code}' as statement_num,
                rr.${s2_trait_code} AS score,
                rr.org_id,
                rr.suborg_id,
                rr.iteration_id
                FROM r360_raw rr
                WHERE rr.is_nomination = 1 
                AND rr.iteration_id = ${s1_iteration_id}) 
              `;
            
          
            if (i == (ctr - 1) )
            {
            //   console.log("last trait record");
            //   console.log(query2);
              //res.json(results);

              ///////////////////////////INSERT ORIGINAL CODE HERE


              /////STEP 2 - INSERT R360_SURVEY_RESULT DATA//////
              let query1 = `
              INSERT INTO r360_survey_result (survey_assignment_id, record_type, statement_num, score, org_id, suborg_id, iteration_id)

              ` + query2;
            // console.log(query1);

            db.query(query1, [], (err, results) => 
            {
              if (err) 
              {
                console.log(err)
                //result(err, null)
              } else 
              {
                //result(null, results)
                console.log("insert r360_survey_results:");
                console.log(results);
                ////step3 cohort table for iteration//////////
                let query1 = `
                  DELETE 
                  FROM r360_survey_result_cohort
                  WHERE 
                  iteration_id = ${s1_iteration_id}
                `;
                // console.log(query1);
                db.query(query1, [], (err, results) => 
                {
                  if (err) 
                  {
                      console.log(err)
                      //result(err, null)
                  } else 
                  {
                    /////STEP 3a - INSERT R360_SURVEY_RESULT_COHORT SELF SUBTRAIT DATA//////
                    let query1 = `
                      INSERT INTO r360_survey_result_cohort (survey_assignment_id, relationship_id, relationship_name, element, score, qty, org_id, suborg_id, iteration_id)
                      (SELECT rsr.survey_assignment_id, 0 AS relationship_id, 'Self' AS relationship_name, rsr.statement_num AS element, rsr.score, COUNT(*) AS qty, 
                      rsr.org_id, rsr.suborg_id, rsr.iteration_id 
                      FROM r360_survey_result rsr 
                      WHERE survey_assignment_id IN (
                          SELECT r1.survey_assignment_id FROM r360_raw r1 WHERE r1.iteration_id = ${s1_iteration_id}
                          AND r1.is_nomination = 0)
                        AND score > 0
                        AND statement_num IN (SELECT trait_code FROM r360_trait WHERE trait_type = 'subtrait')
                      GROUP BY rsr.survey_assignment_id, rsr.statement_num, rsr.score)  
                      UNION ALL
                      (SELECT rraw.survey_assignment_id, rraw.relationship_id, rrel.relationship_name, rsr.statement_num AS element, rsr.score, COUNT(*) AS qty, 
                      rsr.org_id, rsr.suborg_id, rsr.iteration_id 
                      FROM r360_survey_result rsr 
                      LEFT JOIN r360_raw rraw ON rraw.nomination_survey_assignment_id = rsr.survey_assignment_id
                      LEFT JOIN r360_relationship rrel ON rrel.r360_relationship_id = rraw.relationship_id
                      WHERE rsr.survey_assignment_id IN (
                          SELECT r1.nomination_survey_assignment_id 
                          FROM r360_raw r1 WHERE r1.iteration_id = ${s1_iteration_id}
                          AND r1.is_nomination = 1
                        )
                        AND score > 0
                        AND statement_num IN (SELECT trait_code FROM r360_trait WHERE trait_type = 'subtrait')
                      GROUP BY rraw.survey_assignment_id, rraw.relationship_id, rsr.statement_num, rsr.score
                      ORDER BY rraw.survey_assignment_id, rraw.relationship_id, rsr.statement_num, rsr.score
                      )  

                    `;
                    // console.log(query1);

                    db.query(query1, [], (err, results) => 
                    {
                      if (err) 
                      {
                        console.log(err)
                        //result(err, null)
                      } else 
                      {
                        //result(null, results)
                        console.log("STEP3a insert r360_survey_result_COHORT:");
                        console.log(results);
                        /////STEP 3b - INSERT R360_SURVEY_RESULT_COHORT COHORT (SURVEY_ASSIGNMENT=0) DATA//////
                        let query1 = `
                        INSERT INTO r360_survey_result_cohort (survey_assignment_id, relationship_id, relationship_name, element, score, qty, org_id, suborg_id, iteration_id)
                        (SELECT 
                          rsrc.survey_assignment_id, rrg.r360_relationship_id, rrg.rel_group_name, rsrc.element, rsrc.score, sum(rsrc.qty) AS qty, rsrc.org_id, rsrc.suborg_id, rsrc.iteration_id 
                        FROM r360_survey_result_cohort rsrc
                        LEFT JOIN r360_rel_group rrg ON rrg.relationship_id = rsrc.relationship_id
                        WHERE rsrc.iteration_id = ${s1_iteration_id}
                        GROUP BY rsrc.survey_assignment_id, rrg.r360_relationship_id, rsrc.element, rsrc.score
                        ORDER BY rsrc.survey_assignment_id, rrg.r360_relationship_id, rsrc.element, rsrc.score)
                        `;
                        // console.log(query1);

                        db.query(query1, [], (err, results) => 
                        {
                          if (err) 
                          {
                            console.log(err)
                            //result(err, null)
                          } else 
                          {
                            //result(null, results)
                            console.log("STEP3B insert r360_survey_result_COHORT:");
                            console.log(results);

                            /////STEP 4 - INSERT R360_SURVEY_RESULT_COHORT SUPERTRAIT DATA//////
                            let query1 = `
                            INSERT INTO r360_survey_result_cohort (survey_assignment_id, relationship_id, relationship_name, element, score, qty, org_id, suborg_id, iteration_id)
                            (SELECT 
                              rsrc.survey_assignment_id, rsrc.relationship_id, rsrc.relationship_name, a.supertrait AS element, rsrc.score, 
                              SUM(rsrc.qty) AS qty, 
                              rsrc.org_id, rsrc.suborg_id, rsrc.iteration_id 
                            FROM r360_survey_result_cohort rsrc
                            LEFT JOIN (SELECT rt.trait_code AS supertrait, rt2.trait_code AS subtrait 
                                  FROM r360_trait rt 
                                  LEFT JOIN r360_trait rt2 ON rt2.supertrait_trait_code = rt.trait_code
                                  WHERE rt.trait_type = 'supertrait') AS a ON a.subtrait = rsrc.element
                            WHERE rsrc.iteration_id = ${s1_iteration_id}
                            GROUP BY rsrc.survey_assignment_id, rsrc.relationship_id, a.supertrait, rsrc.score 
                            ORDER BY rsrc.survey_assignment_id, rsrc.relationship_id, a.supertrait, rsrc.score)
                            `;
                            // console.log(query1);

                            db.query(query1, [], (err, results) => 
                            {
                              if (err) 
                              {
                                console.log(err)
                                //result(err, null)
                              } else 
                              {
                                //result(null, results)
                                console.log("STEP4 insert r360_survey_result_COHORT:");
                                console.log(results);
                                /////STEP 5 - INSERT R360_SURVEY_RESULT_COHORT COHORT (SURVEY_ASSIGNMENT=0) DATA//////
                                let query1 = `
                                INSERT INTO r360_survey_result_cohort (survey_assignment_id, relationship_id, relationship_name, element, score, qty, org_id, suborg_id, iteration_id)
                                (
                                SELECT 0 AS survey_assignment_id, rsrc.relationship_id, rsrc.relationship_name, rsrc.element, rsrc.score, 
                                    SUM(rsrc.qty) AS qty, 
                                    rsrc.org_id, rsrc.suborg_id, rsrc.iteration_id 
                                FROM r360_survey_result_cohort rsrc
                                WHERE rsrc.iteration_id = ${s1_iteration_id}
                                  GROUP BY rsrc.relationship_id, rsrc.element, rsrc.score 
                                  ORDER BY rsrc.relationship_id, rsrc.element, rsrc.score
                                )
                                `;
                                // console.log(query1);

                                db.query(query1, [], (err, results) => 
                                {
                                  if (err) 
                                  {
                                    console.log(err)
                                    //result(err, null)
                                  } else 
                                  {
                                    //result(null, results)
                                    console.log("STEP5 insert r360_survey_result_COHORT:");
                                    console.log(results);
                                    res.json(results);
                                    //////STEP 
                                  } //end STEP5 db.query insert 
                                })//end STEP5 db.query insert 

                              } //end STEP4 db.query insert SUPERTRAIT
                            })//end STEP4 db.query insert supertrait

                          }  //end STEP3B db.query else valid result execution  
                        }) //end STEP3B db.query get survey_result data

                      }  //end STEP3A db.query else valid result execution  
                    }) //end STEP3A db.query get survey_result data

                  }//end STEP3a db.query else delete survey_result_cohort
                }) //end STEP3a db.query delete survey_result_cohort

              }  //end db.query else valid result execution  
            }) //end db.query get survey_result data









              ///////////////////////////ABOVE END INSERT ORIGINAL CODE
            }
            else
            {
              query2 = query2 + 
              ` 
                UNION ALL 
              `;
            }
            
          }
          

        } //end 
      }
      ) //end 2023-01-18 db.query trait code



   
          //res.json(resp.data);
    } //end delete r360_survey_result table
  } //end delete r360_survey_result table
  ) //end delete r360_survey_result table
   
   
      

}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////2023-01-03 copy data from survey_result to r360_survey_result and update iteration_id
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const R360HistogramReportEndpoint = (req, res) => {

  
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const s1_survey_assignment_id = req.params.id;
  console.log(s1_survey_assignment_id);
  
  let query1 = `
  SELECT survey_assignment_id, relationship_id, relationship_name, element, score, qty 
  FROM r360_survey_result_cohort 
  WHERE survey_assignment_id IN (${s1_survey_assignment_id}, 0) 
  AND r360_survey_result_cohort.iteration_id = (SELECT DISTINCT iteration_id FROM r360_survey_result_cohort where survey_assignment_id = ${s1_survey_assignment_id})
    ORDER BY survey_assignment_id DESC, relationship_id, element, score
  `;
  console.log(query1);
  db.query(query1, [], (err, results) => 
  {
    if (err) 
    {
        console.log(err)
        //result(err, null)
    } else 
    {
      console.log(results);
      res.json(results);
    }

  } //end 
  ) //end 
     
    
}


// for faculty 
export const R360HistogramReportEndpointFaculty = (req, res) => {

  
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const s1_iteration_id = req.params.iteration_id;
  // console.log(s1_iteration_id);
  
  let query1 = `
  SELECT iteration_id, survey_assignment_id, relationship_id, relationship_name, element, score, qty 
  FROM r360_survey_result_cohort 
  WHERE iteration_id = ${s1_iteration_id} AND survey_assignment_id = 0
    ORDER BY relationship_id, element, score
  `;
  console.log(query1);
  db.query(query1, [], (err, results) => 
  {
    if (err) 
    {
        console.log(err)
        //result(err, null)
    } else 
    {
      console.log(results);
      res.json(results);
    }

  } //end 
  ) //end 
     
    
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////2023-01-18 r360 histogram query to normalize r360_raw data to r360_survey_result table
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//2023-01-19 incorporated in controller also no need to run this separately///

/*export const R360HistogramQuery = (req, res) => {

  
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const s1_iteration_id = req.params.id;
  console.log(s1_iteration_id);
  
  let query1a = `
  SELECT trait_code from r360_trait
  `;
  console.log(query1a);
  db.query(query1a, [], (err, results) => 
  {
    if (err) 
    {
        console.log(err)
        //result(err, null)
    } else 
    {
      //res.json(results);
      console.log(results);
      let ctr = results.length;
      console.log("ctr: " + ctr);
      console.log("RECORD 0 trait_code: " + results[0].trait_code);
      let query2 = ``;
      for(let i = 0; i < ctr; i++) 
      {
        console.log("trait code :" + i, " : " + results[i].trait_code);
        let s2_trait_code = results[i].trait_code;
        console.log("s2_trait_code :" + i, " : " + s2_trait_code);
        query2 = query2 + 
          `(SELECT rr.survey_assignment_id,
          'Cohort' AS record_type,
          '${s2_trait_code}' as statement_num,
          rr.${s2_trait_code} AS score,
          rr.org_id,
          rr.suborg_id,
          rr.iteration_id
          FROM r360_raw rr
          WHERE rr.is_nomination = 0 
          AND rr.iteration_id = ${s1_iteration_id})`;
        
       
        if (i == (ctr - 1) )
        {
          console.log("last trait record");
          console.log(query2);
          res.json(results);
        }
        else
        {
          query2 = query2 + 
          ` 
            UNION ALL 
          `;
        }
        
      }
      

    } //end 
  }
  ) //end 2023-01-18 db.query trait code
     
    
}*/

export const updateR360RawRelationship = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const nominationId = req.params.nominationId;
  const parentId = req.params.parentId;
  const data = req.body;
  updateR360RawRelationshipM(nominationId, parentId, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};



/////////////2024-01-08 histogram per survey_assignment////////////////
export const R360HistogramPerSA = (req, res) => {

  
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const s1_survey_assignment_id = req.params.id;
  console.log(s1_survey_assignment_id);
  /////STEP 1 - DELETE R360_SURVEY_RESULT DATA//////
  let query1 = `
    DELETE 
    FROM r360_survey_result
    WHERE 
    survey_assignment_id in
              (SELECT rr.nomination_survey_assignment_id
                FROM r360_raw rr
                WHERE rr.is_nomination = 1 
                AND rr.survey_assignment_id = ${s1_survey_assignment_id})
    OR
    survey_assignment_id = ${s1_survey_assignment_id}
  `;
//   console.log(query1);
  db.query(query1, [], (err, results) => 
  {
    if (err) 
    {
        console.log(err)
        //result(err, null)
    } else 
    {
      //result(null, results)
      
      ///STEP A1 GENERATE QUERY - SELECT LIST OF TRAITS
      let query1a = `
      SELECT trait_code from r360_trait
      `;
    //   console.log(query1a);
      db.query(query1a, [], (err, results) => 
      {
        if (err) 
        {
            console.log(err)
            //result(err, null)
        } else 
        {
          //res.json(results);
        //   console.log(results);
          let ctr = results.length;
        //   console.log("ctr: " + ctr);
        //   console.log("RECORD 0 trait_code: " + results[0].trait_code);
          let query2 = ``;
          for(let i = 0; i < ctr; i++) 
          {
            // console.log("trait code :" + i, " : " + results[i].trait_code);
            let s2_trait_code = results[i].trait_code;
            // console.log("s2_trait_code :" + i, " : " + s2_trait_code);
            query2 = query2 + 
              `(SELECT rr.survey_assignment_id,
              'Cohort' AS record_type,
              '${s2_trait_code}' as statement_num,
              rr.${s2_trait_code} AS score,
              rr.org_id,
              rr.suborg_id,
              rr.iteration_id
              FROM r360_raw rr
              WHERE rr.is_nomination = 0 
              AND rr.survey_assignment_id = ${s1_survey_assignment_id}) 
              UNION ALL #THE FF IS FOR NOMINEEES
              (SELECT rr.nomination_survey_assignment_id,
                'Cohort' AS record_type,
                '${s2_trait_code}' as statement_num,
                rr.${s2_trait_code} AS score,
                rr.org_id,
                rr.suborg_id,
                rr.iteration_id
                FROM r360_raw rr
                WHERE rr.is_nomination = 1 
                AND rr.survey_assignment_id = ${s1_survey_assignment_id}) 
              `;
            
          
            if (i == (ctr - 1) )
            {
               console.log("last trait record");
               console.log(query2);
              //res.json(results);

              ///////////////////////////INSERT ORIGINAL CODE HERE


              /////STEP 2 - INSERT R360_SURVEY_RESULT DATA//////
              let query1 = `
              INSERT INTO r360_survey_result (survey_assignment_id, record_type, statement_num, score, org_id, suborg_id, iteration_id)

              ` + query2;
            // console.log(query1);

            db.query(query1, [], (err, results) => 
            {
              if (err) 
              {
                console.log(err)
                //result(err, null)
              } else 
              {
                //result(null, results)
                console.log("insert r360_survey_results:");
                console.log(results);
                ////step3 cohort table for survey_assignment//////////
                let query1 = `
                  DELETE 
                  FROM r360_survey_result_cohort
                  WHERE 
                  survey_assignment_id = ${s1_survey_assignment_id}
                `;
                // console.log(query1);
                db.query(query1, [], (err, results) => 
                {
                  if (err) 
                  {
                      console.log(err)
                      //result(err, null)
                  } else 
                  {
                    /////STEP 3a - INSERT R360_SURVEY_RESULT_COHORT1 (SELF SUBTRAIT DATA) 2024-01-08 without supertrait//////
                    let query1 = `
                      INSERT INTO r360_survey_result_cohort (survey_assignment_id, relationship_id, relationship_name, element, score, qty, org_id, suborg_id, iteration_id)
                      (SELECT rsr.survey_assignment_id, 0 AS relationship_id, 'Self' AS relationship_name, rsr.statement_num AS element, rsr.score, COUNT(*) AS qty, 
                      rsr.org_id, rsr.suborg_id, rsr.iteration_id 
                      FROM r360_survey_result rsr 
                      WHERE survey_assignment_id = ${s1_survey_assignment_id}
                        AND score > 0
                        AND statement_num IN (SELECT trait_code FROM r360_trait WHERE trait_type = 'subtrait')
                      GROUP BY rsr.survey_assignment_id, rsr.statement_num, rsr.score)  
                      UNION ALL
                      (SELECT rraw.survey_assignment_id, rraw.relationship_id, rrel.relationship_name, rsr.statement_num AS element, rsr.score, COUNT(*) AS qty, 
                      rsr.org_id, rsr.suborg_id, rsr.iteration_id 
                      FROM r360_survey_result rsr 
                      LEFT JOIN r360_raw rraw ON rraw.nomination_survey_assignment_id = rsr.survey_assignment_id
                      LEFT JOIN r360_relationship rrel ON rrel.r360_relationship_id = rraw.relationship_id
                      WHERE rsr.survey_assignment_id IN (
                          SELECT r1.nomination_survey_assignment_id 
                          FROM r360_raw r1 WHERE r1.survey_assignment_id = ${s1_survey_assignment_id}
                          AND r1.is_nomination = 1
                        )
                        AND score > 0
                        AND statement_num IN (SELECT trait_code FROM r360_trait WHERE trait_type = 'subtrait')
                      GROUP BY rraw.survey_assignment_id, rraw.relationship_id, rsr.statement_num, rsr.score
                      ORDER BY rraw.survey_assignment_id, rraw.relationship_id, rsr.statement_num, rsr.score
                      )  

                    `;
                    // console.log(query1);

                    db.query(query1, [], (err, results) => 
                    {
                      if (err) 
                      {
                        console.log(err)
                        //result(err, null)
                      } else 
                      {
                        //result(null, results)
                        console.log("STEP3a insert r360_survey_result_COHORT:");
                        console.log(results);
                        /////STEP 3b - INSERT R360_SURVEY_RESULT_COHORT2 (groupings pd id pdie) DATA//////
                        let query1 = `
                        INSERT INTO r360_survey_result_cohort (survey_assignment_id, relationship_id, relationship_name, element, score, qty, org_id, suborg_id, iteration_id)
                        (SELECT 
                          rsrc.survey_assignment_id, rrg.r360_relationship_id, rrg.rel_group_name, rsrc.element, rsrc.score, sum(rsrc.qty) AS qty, rsrc.org_id, rsrc.suborg_id, rsrc.iteration_id 
                        FROM r360_survey_result_cohort rsrc
                        LEFT JOIN r360_rel_group rrg ON rrg.relationship_id = rsrc.relationship_id
                        WHERE rsrc.survey_assignment_id = ${s1_survey_assignment_id}
                        GROUP BY rsrc.survey_assignment_id, rrg.r360_relationship_id, rsrc.element, rsrc.score
                        ORDER BY rsrc.survey_assignment_id, rrg.r360_relationship_id, rsrc.element, rsrc.score)
                        `;
                        // console.log(query1);

                        db.query(query1, [], (err, results) => 
                        {
                          if (err) 
                          {
                            console.log(err)
                            //result(err, null)
                          } else 
                          {
                            //result(null, results)
                            console.log("STEP3B insert r360_survey_result_COHORT:");
                            console.log(results);

                            /////STEP 4 - INSERT R360_SURVEY_RESULT_COHORT3 SUPERTRAIT DATA//////
                            let query1 = `
                            INSERT INTO r360_survey_result_cohort (survey_assignment_id, relationship_id, relationship_name, element, score, qty, org_id, suborg_id, iteration_id)
                            (SELECT 
                              rsrc.survey_assignment_id, rsrc.relationship_id, rsrc.relationship_name, a.supertrait AS element, rsrc.score, 
                              SUM(rsrc.qty) AS qty, 
                              rsrc.org_id, rsrc.suborg_id, rsrc.iteration_id 
                            FROM r360_survey_result_cohort rsrc
                            LEFT JOIN (SELECT rt.trait_code AS supertrait, rt2.trait_code AS subtrait 
                                  FROM r360_trait rt 
                                  LEFT JOIN r360_trait rt2 ON rt2.supertrait_trait_code = rt.trait_code
                                  WHERE rt.trait_type = 'supertrait') AS a ON a.subtrait = rsrc.element
                            WHERE rsrc.survey_assignment_id = ${s1_survey_assignment_id}
                            GROUP BY rsrc.survey_assignment_id, rsrc.relationship_id, a.supertrait, rsrc.score 
                            ORDER BY rsrc.survey_assignment_id, rsrc.relationship_id, a.supertrait, rsrc.score)
                            `;
                            // console.log(query1);

                            db.query(query1, [], (err, results) => 
                            {
                              if (err) 
                              {
                                console.log(err)
                                //result(err, null)
                              } else 
                              {
                                //result(null, results)
                                console.log("STEP4 insert r360_survey_result_COHORT:");
                                console.log(results);
                                res.json(results);
                                /////VTY TO REMOVE!!!!!  2024-01-08STEP 5 - INSERT R360_SURVEY_RESULT_COHORT4 COHORT (SURVEY_ASSIGNMENT=0) DATA - donotrun//////
                                

                                

                              } //end STEP4 db.query insert SUPERTRAIT
                            })//end STEP4 db.query insert supertrait

                          }  //end STEP3B db.query else valid result execution  
                        }) //end STEP3B db.query get survey_result data

                      }  //end STEP3A db.query else valid result execution  
                    }) //end STEP3A db.query get survey_result data

                  }//end STEP3a db.query else delete survey_result_cohort
                }) //end STEP3a db.query delete survey_result_cohort

              }  //end db.query else valid result execution  
            }) //end db.query get survey_result data









              ///////////////////////////ABOVE END INSERT ORIGINAL CODE
            }
            else
            {
              query2 = query2 + 
              ` 
                UNION ALL 
              `;
            }
            
          }
          

        } //end 
      }
      ) //end 2023-01-18 db.query trait code



   
          //res.json(resp.data);
    } //end delete r360_survey_result table
  } //end delete r360_survey_result table
  ) //end delete r360_survey_result table
   
   
      

}