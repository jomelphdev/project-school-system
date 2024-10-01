import db from "../config/database.js"

export const get360BehaviorM = (data, result) => {
  db.query('SELECT * FROM 360_behavior WHERE org_id = ? and suborg_id = ? AND program_id = ? AND iteration_id = ? AND for_participant = ?',
    [data.org_id, data.suborg_id, data.program_id, data.iteration_id, data.for_participant],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}

export const get360BehaviorByCompetencyIDM = (data, result) => {
  db.query('SELECT * FROM 360_behavior WHERE competency_id = ? and `global` = ? and org_id = ? and suborg_id = ? AND program_id = ? AND iteration_id = ?',
    [data.competency_id, data.global, data.org_id, data.suborg_id, data.program_id, data.iteration_id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}

export const update360BehaviorM = (id, data, result) => {
  db.query(
    'UPDATE 360_behavior SET behavior_code = ?, behavior_desc = ?, is_reversed = ? WHERE behavior_id = ?',
    [data.behavior_code, data.behavior_desc, data.is_reversed, id],
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

export const insert360BehaviorM = (data, result) => {
  db.query(
    `INSERT INTO 360_behavior 
    (behavior_code, competency_id, behavior_desc, for_participant,
    is_reversed, global, org_id, suborg_id, program_id, iteration_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.behavior_code,
      data.competency_id,
      data.behavior_desc,
      data.for_participant,
      data.is_reversed,
      data.global,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        // Check if column already exists in r360_raw table
        db.query(
          `SELECT COLUMN_NAME
           FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_NAME = 'r360_raw' AND COLUMN_NAME = ?`,
          [data.behavior_code],
          (rawCheckErr, rawCheckResults) => {
            if (rawCheckErr) {
              console.log(rawCheckErr);
              result(rawCheckErr, null);
            } else if (rawCheckResults.length > 0) {
              // Column already exists in r360_raw table
              console.log(`Column ${data.behavior_code} already exists in r360_raw table.`);
              // Check if column already exists in r360_cohort table
              db.query(
                `SELECT COLUMN_NAME
                 FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_NAME = 'r360_cohort' AND COLUMN_NAME = ?`,
                [data.behavior_code],
                (cohortCheckErr, cohortCheckResults) => {
                  if (cohortCheckErr) {
                    console.log(cohortCheckErr);
                    result(cohortCheckErr, null);
                  } else if (cohortCheckResults.length > 0) {
                    // Column already exists in r360_cohort table
                    console.log(`Column ${data.behavior_code} already exists in r360_cohort table.`);
                    result(null, results);
                  } else {
                    // Create new column in r360_cohort table
                    db.query(
                      `ALTER TABLE r360_cohort ADD COLUMN ${data.behavior_code} DOUBLE`,
                      (cohortErr) => {
                        if (cohortErr) {
                          console.log(cohortErr);
                          result(cohortErr, null);
                        } else {
                          result(null, results);
                        }
                      }
                    );
                  }
                }
              );
            } else {
              // Column does not exist in r360_raw table
              console.log(`Column ${data.behavior_code} does not exist in r360_raw table.`);
              // Add new column to r360_raw table
              db.query(
                `ALTER TABLE r360_raw ADD COLUMN ${data.behavior_code} DOUBLE`,
                (rawErr) => {
                  if (rawErr) {
                    console.log(rawErr);
                    result(rawErr, null);
                  } else {
                    // Create new column in r360_cohort table
                    db.query(
                      `ALTER TABLE r360_cohort ADD COLUMN ${data.behavior_code} DOUBLE`,
                      (cohortErr) => {
                        if (cohortErr) {
                          console.log(cohortErr);
                          result(cohortErr, null);
                        } else {
                          result(null, results);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

export const delete360_behaviorM = (id, result) => {
  db.query(`DELETE FROM 360_behavior WHERE behavior_id = ?`,
  [id], (err, results) => {
    if(err){
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  }
  )
}

export const borrowBehaviorM = (data, result) => {
  db.query(
    `SELECT * FROM 360_behavior WHERE behavior_id = ?`,
    [data.behavior_id],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.log(selectErr);
        result(selectErr, null);
      } else if (selectResults.length > 0) {
        const selectedRow = selectResults[0];

        // Exclude the columns from data
        const {
          global,
          org_id,
          suborg_id,
          program_id,
          iteration_id,
          ...insertData
        } = selectedRow;

        // Insert a new row with the selected values
        db.query(
          `INSERT INTO 360_behavior (behavior_code, competency_id, behavior_desc, for_participant, is_reversed, global, org_id, suborg_id, program_id, iteration_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            insertData.behavior_code,
            data.competency_id,
            insertData.behavior_desc,
            insertData.for_participant,
            insertData.is_reversed,
            data.global,
            data.org_id,
            data.suborg_id,
            data.program_id,
            data.iteration_id
          ],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.log(insertErr);
              result(insertErr, null);
            } else {
              const insertedBehaviorId = insertResults.insertId;
              console.log("Inserted Behavior ID:", insertedBehaviorId);
              result(null, insertResults);
            }
          }
        );
      } else {
        const errorMessage = "No behavior found with the provided behavior_id.";
        console.log(errorMessage);
        result(new Error(errorMessage), null);
      }
    }
  );
};