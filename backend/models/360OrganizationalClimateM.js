import db from "../config/database.js"

export const get360OrgClimateM = (data, result) => {
  db.query(`SELECT * FROM 360_org_climate WHERE org_id = ? AND suborg_id = ? AND program_id = ? AND iteration_id = ? AND for_participant = ?`,
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

export const insert360OrgClimateM = (data, result) => {
  db.query(
    'INSERT INTO 360_org_climate (question, org_climate_code, status, source, language, participant_level, added_by, for_participant, global, org_id, suborg_id, program_id, iteration_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      data.question,
      data.org_climate_code,
      'Original', // Set the status to "Original"
      data.source,
      data.language,
      data.participant_level,
      data.added_by,
      data.for_participant,
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
        result(null, results);
      }
    }
  );
};

export const update360OrgClimateM = (id, data, result) => {
  db.query(
    'UPDATE 360_org_climate SET question = ?, org_climate_code = ?, source = ?, language = ?, participant_level = ?, added_by = ?, for_participant = ?, global = ?, org_id = ?, suborg_id = ?, program_id = ?, iteration_id = ? WHERE org_climate_id = ?',
    [
      data.question,
      data.org_climate_code,
      data.source,
      data.language,
      data.participant_level,
      data.added_by,
      data.for_participant,
      data.global,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
      id
    ],
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
export const borrowOrgClimateM = (data, result) => {
  db.query(
    `SELECT * FROM 360_org_climate WHERE org_climate_id = ?`,
    [data.org_climate_id],
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
          ...insertData
        } = selectedRow;
        
        db.query(
          `INSERT INTO 360_org_climate (org_climate_code, question, source, language, participant_level, added_by, status, for_participant, global, org_id, suborg_id, program_id, iteration_id)
          VALUES (?, ?, ?, ?, ?, ?, 'Borrowed', ?, ?, ?, ?, ?, ?)`,
          [
            insertData.org_climate_code,
            insertData.question,
            insertData.source,
            insertData.language,
            insertData.participant_level,
            insertData.added_by,
            insertData.for_participant, // Place the value of for_participant here
            data.global, // Place the value of global here
            data.org_id,
            data.suborg_id,
            data.program_id,
            data.iteration_id,
          ],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.log(insertErr);
              result(insertErr, null);
            } else {
              const insertedOrgClimateId = insertResults.insertId;
              console.log("Inserted Open-Ended ID:", insertedOrgClimateId);
              result(null, { insertedOrgClimateId }); // Pass insertedOrgClimateId in the result callback
            }
          }
        );
      }
    }
  );
};