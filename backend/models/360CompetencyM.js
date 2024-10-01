import db from "../config/database.js"

export const get360CompetencyM = (data, result) => {
  db.query('SELECT * FROM 360_competency WHERE org_id = ? and suborg_id = ? AND program_id = ? AND iteration_id = ?',
    [data.org_id, data.suborg_id, data.program_id, data.iteration_id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}

export const update360CompetencyM = (id, data, result) => {
  db.query(
    'UPDATE 360_competency SET competency_name = ?, competency_code = ?, competency_desc = ?, cii_desc = ?, source = ?, added_by = ?, date_valid_from = ?, date_valid_to = ?, participant_level = ?, language = ? WHERE competency_id = ?',
    [data.competency_name, data.competency_code, data.competency_desc, data.cii_desc, data.source, data.added_by, data.date_valid_from, data.date_valid_to, data.participant_level, data.language, id],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

export const insert360CompetencyM = (data, result) => {
  db.query(
    `INSERT INTO 360_competency
    (competency_name, competency_code, competency_desc, cii_desc, source,
      added_by, date_valid_from, date_valid_to, participant_level, language, global, org_id, suborg_id, program_id, iteration_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.competency_name,
      data.competency_code,
      data.competency_desc,
      data.cii_desc,
      data.source,
      data.added_by,
      data.date_valid_from,
      data.date_valid_to,
      data.participant_level,
      data.language,
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
        const competencyCode = data.competency_code;

        // Check if column already exists in r360_raw table
        db.query(
          `SELECT COLUMN_NAME
           FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_NAME = 'r360_raw' AND COLUMN_NAME = ?`,
          [competencyCode],
          (rawCheckErr, rawCheckResults) => {
            if (rawCheckErr) {
              console.log(rawCheckErr);
              result(rawCheckErr, null);
            } else if (rawCheckResults.length === 0) {
              // Column doesn't exist in r360_raw table
              // Create a new column named after competency_id and of type DOUBLE
              db.query(
                `ALTER TABLE r360_raw ADD COLUMN \`${competencyCode}\` DOUBLE`,
                (alterRawErr) => {
                  if (alterRawErr) {
                    console.log(alterRawErr);
                    result(alterRawErr, null);
                  } else {
                    console.log(`Column ${competencyCode} created in r360_raw table.`);
                    // Check if column already exists in r360_cohort table
                    db.query(
                      `SELECT COLUMN_NAME
                       FROM INFORMATION_SCHEMA.COLUMNS
                       WHERE TABLE_NAME = 'r360_cohort' AND COLUMN_NAME = ?`,
                      [competencyCode],
                      (cohortCheckErr, cohortCheckResults) => {
                        if (cohortCheckErr) {
                          console.log(cohortCheckErr);
                          result(cohortCheckErr, null);
                        } else if (cohortCheckResults.length === 0) {
                          // Column doesn't exist in r360_cohort table
                          // Create a new column named after competency_id and of type DOUBLE
                          db.query(
                            `ALTER TABLE r360_cohort ADD COLUMN \`${competencyCode}\` DOUBLE`,
                            (alterCohortErr) => {
                              if (alterCohortErr) {
                                console.log(alterCohortErr);
                                result(alterCohortErr, null);
                              } else {
                                console.log(`Column ${competencyCode} created in r360_cohort table.`);
                                result(null, results);
                              }
                            }
                          );
                        } else {
                          // Column already exists in r360_raw table, no need for alteration
                          // Check if column already exists in r360_cohort table
                          db.query(
                            `SELECT COLUMN_NAME
                             FROM INFORMATION_SCHEMA.COLUMNS
                             WHERE TABLE_NAME = 'r360_cohort' AND COLUMN_NAME = ?`,
                            [competencyCode],
                            (cohortCheckErr, cohortCheckResults) => {
                              if (cohortCheckErr) {
                                console.log(cohortCheckErr);
                                result(cohortCheckErr, null);
                              } else if (cohortCheckResults.length === 0) {
                                // Column doesn't exist in r360_cohort table
                                // Create a new column named after competency_id and of type DOUBLE
                                db.query(
                                  `ALTER TABLE r360_cohort ADD COLUMN \`${competencyCode}\` DOUBLE`,
                                  (alterCohortErr) => {
                                    if (alterCohortErr) {
                                      console.log(alterCohortErr);
                                      result(alterCohortErr, null);
                                    } else {
                                      console.log(`Column ${competencyCode} created in r360_cohort table.`);
                                      result(null, results);
                                    }
                                  }
                                );
                              } else {
                                // Column already exists in r360_cohort table, no need for alteration
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
            };
          }
        )
      }
    }
  )
}

export const borrowCompetencyM = (data, result) => {
  db.query(
    `SELECT * FROM 360_competency WHERE competency_id = ?`,
    [data.competency_id],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.log(selectErr);
        result(selectErr, null);
      } else {
        const selectedRow = selectResults[0];

        // Exclude the columns from data and set status to 'Borrowed'
        const {
          global,
          org_id,
          suborg_id,
          program_id,
          iteration_id,
          date_valid_from,
          date_valid_to,
          ...insertData
        } = selectedRow;

        // Insert a new row with the selected values, status set to 'Borrowed', and date_valid_from and date_valid_to from data
        db.query(
          `INSERT INTO 360_competency (competency_name, competency_code, competency_desc, cii_desc, status, source, added_by, participant_level, language, global, org_id, suborg_id, program_id, iteration_id, date_valid_from, date_valid_to)
          VALUES (?, ?, ?, ?, 'Borrowed', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            insertData.competency_name,
            insertData.competency_code,
            insertData.competency_desc,
            insertData.cii_desc,
            insertData.source,
            insertData.added_by,
            insertData.participant_level,
            insertData.language,
            data.global,
            data.org_id,
            data.suborg_id,
            data.program_id,
            data.iteration_id,
            data.date_valid_from,
            data.date_valid_to
          ],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.log(insertErr);
              result(insertErr, null);
            } else {
              const insertedCompetencyId = insertResults.insertId;
              console.log("Inserted Competency ID:", insertedCompetencyId);
              result(null, { insertedCompetencyId }); // Pass insertedCompetencyId in the result callback
            }
          }
        );
      }
    }
  );
};