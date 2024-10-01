import db from '../config/database.js'
import CryptoJS from 'crypto-js'

function decrypt(src, passphrase){
  const bytes = CryptoJS.AES.decrypt(src, passphrase)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const authIndividual = (email, password, result) => {
    db.query("SELECT org_id, ind_id, first_name, last_name, email, password, auth_string, seed, suborgs, is_participant, is_nominee, roles, last_login_date FROM individual WHERE LOWER(email) = ?",
      [email],
      (err, results) => {
      if (err) 
      {
        result(err, null)
      } 
      else 
      {
        if(results[0] === null || results[0] === undefined || results[0].password === null || results[0].password === ""){
          result(null)
          return null
        }
        let decryptedPW = decrypt(results[0].password, results[0].seed)
        if(password == decryptedPW)
        {
          if(results[0].suborgs === null){
              db.query("SELECT * FROM brand WHERE org_id = ? LIMIT 1", [results[0].org_id, 0], (err, brandData) => {
                if (err) {
                  result(err, null);
                } else {
                  results[0].brandData = brandData[0] ? brandData[0] : {};
                  result(null, [...results])
                }
              });
              // result(null, results[0].suborgs.split(', '))
            }
          else{
            console.log(results[0].suborgs.split(', ') ? results[0].suborgs.split(', ') : 0)
            db.query("SELECT * FROM brand WHERE org_id = ? LIMIT 1", [results[0].org_id, results[0].suborgs.split(', ') ? results[0].suborgs.split(', ') : 0], (err, brandData) => {
              if (err) {
                result(err, null);
              } else {
                results[0].brandData = brandData[0] ? brandData[0] : {};
                result(null, [...results])
              }
            });
          }
        }
        else
        {
          result(null)
        }
      }
    })
  }

  export const authLastLogin = (email, result) => {
    db.query(
      "UPDATE individual SET last_login_date = NOW(), logged_in = 1 WHERE LOWER(email) = ?",
      [email],
      (err, results) => {
        if (err) {
          result(err, null);
        } else {
          result(null, results);
        }
      }
    );
  };

  export const resetPasswordLog = (data, result) => {
    db.query(
      "INSERT INTO password_reset_log (ind_id, email, location, catch_1, catch_2, catch_3, catch_4, catch_5, catch_6, catch_7, catch_8, datetime, org_id, suborg_id, created_at, created_by, modified_at, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, NOW(), ?, NOW(), ?)",
      [
        data.ind_id,
        data.email,
        data.location,
        data.catch_1,
        data.catch_2,
        data.catch_3,
        data.catch_4,
        data.catch_5,
        data.catch_6,
        data.catch_7,
        data.catch_8,
        data.org_id,
        data.suborg_id,
        data.created_by,
        data.modified_by,
      ],
      (err, results) => {
        if (err) {
          result(err, null);
        } else {
          result(null, results);
        }
      }
    );
  };
  // generate a 2FA 6-digit number
  export const generate2FACode = (id, result) => {
    const twoFACode = Math.floor(Math.random() * 900000) + 100000;
    db.query(
      `UPDATE individual SET two_factor_auth_code = ${twoFACode} WHERE ind_id = ${id}`,
      [],
      (err, results) => {
        if (err) {
          result(err, null);
        } else {
          result(null, results);
          // Set the two_factor_auth_code to '000000' after 1 minute
          setTimeout(() => {
            db.query(
              `UPDATE individual SET two_factor_auth_code = '0' WHERE ind_id = ${id}`,
              [],
              (err, results) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`two_factor_auth_code has been set to '0' for user with id ${id}`);
                }
              }
            );
          }, 10 * 60 * 1000); // 10 minutes in milliseconds
        }
      }
    );
  };
  // get the 2FA code via ind_id
  export const get2FAcode = (id, result) => {
    db.query(
      `SELECT two_factor_auth_code FROM individual WHERE ind_id = ${id}`,
      [],
      (err, results) => {
        if (err) {
          result(err, null);
        } else {
          result(null, results);
        }
      }
    );
  };