/*
import {
  R360DeleteM,
} from '../models/R360M.js'
*/

//const { exec } = require('child_process');
import { exec } from 'child_process';
//const mysql = require('mysql');

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





////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////2023-04-04 teest
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const UpdateUAT = (req, res) => {
 

  
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
    
    
  // Define an array of bash scripts and MySQL queries to execute
  const commands = [
    
      {
        type: 'bash',
        command: '/home/admin/prod_copy_db.sh',
      },
      {
        type: 'mysql',
        command: "UPDATE brand SET website_url = 'https://uatapp.gcm3.com/', website_sender_email = 'donotsend@test.com'",
      },
      {
        type: 'mysql',
        command: "CREATE TABLE `individual2` (PRIMARY KEY(`ind_id`),UNIQUE `email_unique`( `email` ), KEY `org`( `org_id` ), KEY `others`( `ind_id` , `email` , `last_name` , `first_name` , `org_id` ))ENGINE=INNODB COLLATE = utf8mb4_0900_ai_ci COMMENT = '' SELECT `ind_id`, `email`, `original_email`, `is_email_valid`, `last_name`, `first_name`, `phone_number`, `password`, `auth_string`, `seed`, `suppress_email_sending`, `is_participant`, `is_nominee`, `time_zone`, `initiation_date`, `roles`, `org_id`, `suborgs`, `self-initiated_date`, `logged_in`, `last_login_date`, `created_at`, `created_by`, `modified_at`, `modified_by` FROM `individual` ",
      },
      {
        type: 'mysql',
        command: `UPDATE 
        individual
        SET 
        email = CONCAT('preprod', IF(first_name IS NULL, '', RIGHT(first_name,3)), IF(last_name IS NULL, '', RIGHT(last_name,3)), ind_id, '@talentsage.com'),
        first_name = RIGHT(first_name,3),
        last_name = RIGHT(last_name,3)
        WHERE 
        ind_id IN
        (
        select ind_id
        from individual2
        WHERE 
        (FIND_IN_SET('1', REPLACE(roles, ' ', '')) > 0 #participant
        OR FIND_IN_SET('2', REPLACE(roles, ' ', '')) > 0 #respondent/nominee
        OR FIND_IN_SET('4', REPLACE(roles, ' ', '')) > 0 ) #coach
        AND not (FIND_IN_SET('11', REPLACE(roles, ' ', '')) > 0 ) #not a Master Administrator
        AND not (FIND_IN_SET('3', REPLACE(roles, ' ', '')) > 0 ) #not a survey previewer
        AND not (FIND_IN_SET('5', REPLACE(roles, ' ', '')) > 0 ) #not a faculty viewer
        AND not (FIND_IN_SET('6', REPLACE(roles, ' ', '')) > 0 ) #not a HR Professional viewer
        AND not (FIND_IN_SET('7', REPLACE(roles, ' ', '')) > 0 ) #not a Client Administrator Viewer
        AND not (FIND_IN_SET('8', REPLACE(roles, ' ', '')) > 0 ) #not a Client Administrator Editor
        AND not (FIND_IN_SET('9', REPLACE(roles, ' ', '')) > 0 ) #not a Client Email Template Editor
        AND not (FIND_IN_SET('10', REPLACE(roles, ' ', '')) > 0 ) #not a CXM
        AND not (FIND_IN_SET('11', REPLACE(roles, ' ', '')) > 0 ) #not a Master Administrator
        AND not (FIND_IN_SET('12', REPLACE(roles, ' ', '')) > 0 ) #not a Master Administrator - Emails
        AND not (FIND_IN_SET('13', REPLACE(roles, ' ', '')) > 0 ) #not a Sub Org Manager
        AND not (FIND_IN_SET('14', REPLACE(roles, ' ', '')) > 0 ) #not a Announcement Manager
        AND not (FIND_IN_SET('16', REPLACE(roles, ' ', '')) > 0 ) #not a Site Manager
        AND not (FIND_IN_SET('17', REPLACE(roles, ' ', '')) > 0 ) #not aSurvey Creator
        AND not (FIND_IN_SET('18', REPLACE(roles, ' ', '')) > 0 ) #not a survey manager
        )`,
      },
      {
        type: 'mysql',
        command: 'DROP TABLE individual2',
      },
      {
        type: 'bash',
        command: '/home/admin/prod_copy_and_update_html.sh',
      },
    ];
    

    // Define a function to execute each command 
const executeCommand = (command, callback) => {
    if (command.type === 'bash') 
      {
        exec(command.command, (error, stdout, stderr) => {
          if (error) {
            callback(error);
          } else {
            callback(null, stdout);
          }
        }
        );
      } 
      else if (command.type === 'mysql') 
      {
        db.query(command.command, (err, results) => {
          if (err) {
            callback(err);
          } else {
            console.log(results);
            callback(null, results);
          }
        });
      }
    
};
    // Define a function to execute each command in sequence
  const executeCommands = (commands, index, callback) => {
      if (index >= commands.length) {
        res.json("UAT Regression Copy and Anonymize Complete!");
        callback(null);
      } else {
        executeCommand(commands[index], (error, result) => {
          if (error) {
            callback(error);
          } else {
            executeCommands(commands, index + 1, callback);
          }
        });
      }
    };
  
    // Call the executeCommands function to run all the commands sequentially
  executeCommands(commands, 0, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('All commands executed successfully!');
      }
    });
  }
  
  