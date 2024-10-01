import db from '../config/database.js'

// Get All Announcement
export const getAllAnnouncement = (result) => {
  let sql = `
    SELECT 
    a.*,
    COALESCE(
      CASE 
        WHEN a.global_id = 1 THEN 'Global'
        WHEN a.for_email IS NOT NULL AND TRIM(a.for_email) <> '' THEN a.for_email
        WHEN a.org_id > 0 AND a.suborg_id > 0 AND a.program_id > 0 AND a.iteration_id > 0 THEN 
          CONCAT(o.org_name, '>', s.suborg_name, '>', p.program_name, '>', i.iteration_name)
        WHEN a.org_id > 0 AND a.suborg_id > 0 AND a.program_id > 0 THEN 
          CONCAT(o.org_name, '>', s.suborg_name, '>', p.program_name)
        WHEN a.org_id > 0 AND a.suborg_id > 0 THEN 
          CONCAT(o.org_name, '>', s.suborg_name)
        WHEN a.org_id > 0 THEN o.org_name
        ELSE 'Role / Respondent'
      END,
      'Role / Respondent'
    ) AS GOSPI
  FROM announcements a
  LEFT JOIN org o ON a.org_id = o.org_id
  LEFT JOIN suborg s ON a.suborg_id = s.suborg_id
  LEFT JOIN program p ON a.program_id = p.program_id
  LEFT JOIN iteration i ON a.iteration_id = i.iteration_id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return result(err, null);
    } else {
      return result(null, results);
    }
  });
};
// Get Announcement MAIN
export const showAnnouncementByGOSPIandRoleM = (data, result) => {
  // Fetch iteration_id and program_id based on ind_id
  db.query('SELECT relationship_id, iteration_id, program_id, suborg_id FROM survey_assignment WHERE ind_id = ? AND org_id = ?', [data.ind_id, data.org_id], (err, rows) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }

    // Store the results in arrays
    const arrayIterationID = rows.map(row => row.iteration_id);
    const arrayProgramID = rows.map(row => row.program_id);
    const suborgIDArray = rows.map(row => row.suborg_id);
    const relationshipIDArray = rows
      .filter(row => row.respondents !== null)
      .map(row => row.respondents);

    // Continue with the main query
    const rolesArray = data.roles.split(',').map(role => role.trim());
    // const suborgIDArray = data.suborg_id.split(',').map(suborg_id => suborg_id.trim());

    // Build dynamic SQL queries with OR conditions
    const roleConditions = rolesArray.map(role => 'FIND_IN_SET(?, roles)').join(' OR ');

    const suborg_idConditions = suborgIDArray.map(suborg_id => 'FIND_IN_SET(?, suborg_id)').join(' OR ');
    const iterarionIDConditions = arrayIterationID.map(iteration_id => 'FIND_IN_SET(?, iteration_id)').join(' OR ');
    const programIDConditions = arrayProgramID.map(program_id => 'FIND_IN_SET(?, program_id)').join(' OR ');
    const relationshipIDConditions = relationshipIDArray.map(respondents => 'FIND_IN_SET(?, respondents)').join(' OR ');

    const currentUtcTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');


    // Construct the main query
    const mainQuery = `SELECT * FROM announcements
      WHERE global_id = 0
      AND roles = 0
      AND org_id = ? 
      AND (${suborg_idConditions})
      AND (${programIDConditions})
      AND (${iterarionIDConditions})
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`;

    // Construct global respondents query
    const globalRespondentsQuery = `SELECT * FROM announcements
    WHERE (${relationshipIDConditions})
    AND global_id = 1
    AND org_id = 0
    AND suborg_id = 0
    AND program_id = 0
    AND iteration_id = 0
    AND release_date <= ?
    AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`

  // Construct org respondentss query
  const orgRespondentsQuery = `SELECT * FROM announcements
    WHERE (${relationshipIDConditions})
    AND global_id = 0
    AND org_id = ?
    AND suborg_id = 0
    AND program_id = 0
    AND iteration_id = 0
    AND release_date <= ?
    AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`


  // Construct suborg respondentss query
  const suborgRespondentsQuery = `SELECT * FROM announcements
    WHERE (${relationshipIDConditions})
    AND global_id = 0
    AND org_id = ?
    AND (${suborg_idConditions})
    AND program_id = 0
    AND iteration_id = 0
    AND release_date <= ?
    AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`


  // Construct program respondentss query
  const programRespondentsQuery = `SELECT * FROM announcements
    WHERE (${relationshipIDConditions})
    AND global_id = 0
    AND org_id = ?
    AND (${suborg_idConditions})
    AND (${programIDConditions})
    AND iteration_id = 0
    AND release_date <= ?
    AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`

    // Construct the main respondents query
    const mainRespondentsQuery = `SELECT * FROM announcements
    WHERE (${relationshipIDConditions})
    AND global_id = 0
    AND org_id = ? 
    AND (${suborg_idConditions})
    AND (${programIDConditions})
    AND (${iterarionIDConditions})
    AND release_date <= ?
    AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`;

    // Construct global roles query
    const globalRoleQuery = `SELECT * FROM announcements
      WHERE (${roleConditions})
      AND global_id = 1
      AND org_id = 0
      AND suborg_id = 0
      AND program_id = 0
      AND iteration_id = 0
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`

    // Construct org roles query
    const orgRoleQuery = `SELECT * FROM announcements
      WHERE (${roleConditions})
      AND global_id = 0
      AND org_id = ?
      AND suborg_id = 0
      AND program_id = 0
      AND iteration_id = 0
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`


    // Construct suborg roles query
    const suborgRoleQuery = `SELECT * FROM announcements
      WHERE (${roleConditions})
      AND global_id = 0
      AND org_id = ?
      AND (${suborg_idConditions})
      AND program_id = 0
      AND iteration_id = 0
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`


    // Construct program roles query
    const programRoleQuery = `SELECT * FROM announcements
      WHERE (${roleConditions})
      AND global_id = 0
      AND org_id = ?
      AND (${suborg_idConditions})
      AND (${programIDConditions})
      AND iteration_id = 0
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`

    // Construct the main roles query
    const mainRolesQuery = `SELECT * FROM announcements
    WHERE (${roleConditions})
    AND global_id = 0
    AND org_id = ? 
    AND (${suborg_idConditions})
    AND (${programIDConditions})
    AND (${iterarionIDConditions})
    AND release_date <= ?
    AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`;

    // for User only announcement
    const userQuery = `SELECT * FROM announcements
      WHERE for_email = ?
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`

    // Construct the suborg query with org and suborg ids and program_id only
    const programQuery = `SELECT * FROM announcements
      WHERE global_id = 0
      AND roles = 0
      AND org_id = ?
      AND (${suborg_idConditions})
      AND (${programIDConditions})
      AND iteration_id = 0
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`

    // Construct the suborg query with org and suborg ids only
    const suborgQuery = `SELECT * FROM announcements
      WHERE global_id = 0
      AND roles = 0
      AND org_id = ?
      AND (${suborg_idConditions})
      AND program_id = 0
      AND iteration_id = 0
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`
    
    // Construct the org query with org_id only
    const orgQuery = `SELECT * FROM announcements
      WHERE global_id = 0
      AND roles = 0
      AND org_id = ?
      AND suborg_id = 0
      AND program_id = 0
      AND iteration_id = 0
      AND release_date <= ?
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`;

    // Construct the global query
    const globalQuery = `SELECT * FROM announcements 
      WHERE global_id = 1
      AND roles = 0
      AND org_id = 0
      AND suborg_id = 0
      AND program_id = 0
      AND iteration_id = 0
      AND release_date <= ? 
      AND (expired_at = '0000-00-00 00:00:00' OR expired_at IS NULL OR expired_at > ?)`;

    // Combine the queries using UNION and eliminate duplicates with DISTINCT
    const finalQuery = `(${mainQuery})
      UNION
      (${globalRespondentsQuery})
      UNION
      (${orgRespondentsQuery})
      UNION
      (${suborgRespondentsQuery})
      UNION
      (${programRespondentsQuery})
      UNION
      (${mainRespondentsQuery})
      UNION
      (${globalRoleQuery})
      UNION
      (${orgRoleQuery})
      UNION
      (${suborgRoleQuery})
      UNION
      (${programRoleQuery})
      UNION
      (${mainRolesQuery})
      UNION
      (${userQuery})
      UNION
      (${programQuery})
      UNION
      (${suborgQuery})
      UNION
      (${orgQuery})
      UNION
      (${globalQuery});`

    // testing each query
    // console.log('User belong to suborgs:', suborgIDArray)
    // console.log('User belong to programs:', arrayProgramID)
    // console.log('User belong to iterations:', arrayIterationID)
    // console.log('mainRolesQuery', mainRolesQuery)
    // db.query(mainRolesQuery,
    //   [
    //     // main roles query
    //     ...rolesArray,
    //     data.org_id,  
    //     ...suborgIDArray, 
    //     ...arrayProgramID,
    //     ...arrayIterationID,
    //     currentUtcTimestamp,
    //     currentUtcTimestamp,
    //   ], (err, results) => {
    //     if (err) {
    //       console.log(err);
    //       result(err, null);
    //     } else {
    //       console.log('testing results:', results)
    //       result(results)
    //     }
    //   });
    // Execute the final query
    db.query(finalQuery,
      [
        // main query
        data.org_id,
        ...suborgIDArray,
        ...arrayProgramID,
        ...arrayIterationID,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // global respondents query
        ...relationshipIDArray,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // org respondents query
        ...relationshipIDArray,
        data.org_id,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // suborg respondents query
        ...relationshipIDArray,
        data.org_id,
        ...suborgIDArray, 
        currentUtcTimestamp,
        currentUtcTimestamp,
        // program respondents query
        ...relationshipIDArray,
        data.org_id,
        ...suborgIDArray, 
        ...arrayProgramID,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // main respondents query
        ...relationshipIDArray,
        data.org_id,
        ...suborgIDArray, 
        ...arrayProgramID,
        ...arrayIterationID,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // global roles query
        ...rolesArray,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // org roles query
        ...rolesArray,
        data.org_id,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // suborg roles query
        ...rolesArray,
        data.org_id,
        ...suborgIDArray, 
        currentUtcTimestamp,
        currentUtcTimestamp,
        // program roles query
        ...rolesArray,
        data.org_id,
        ...suborgIDArray, 
        ...arrayProgramID,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // main roles query
        ...rolesArray,
        data.org_id,  
        ...suborgIDArray, 
        ...arrayProgramID,
        ...arrayIterationID,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // user query
        data.for_email,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // program query
        data.org_id,  
        ...suborgIDArray, 
        ...arrayProgramID,
        currentUtcTimestamp,
        currentUtcTimestamp,
        // suborg query
        data.org_id,  
        ...suborgIDArray, 
        currentUtcTimestamp,
        currentUtcTimestamp,
        // org query
        data.org_id, 
        currentUtcTimestamp,
        currentUtcTimestamp,
        // global query
        currentUtcTimestamp, 
        currentUtcTimestamp,
      ], (err, results) => {
        if (err) {
          console.log(err);
          result(err, null);
        } else {
          // Insert data into announcements_for_user table
          // result(results)
          insertAnnouncementsForUsers(results, data, result);
        }
      });
  });
};

// Function to insert data into announcements_for_user table and update is_expired
const insertAnnouncementsForUsers = (announcements, data, result) => {
  // Extract announcement_ids from the announcements array
  const announcementIds = announcements.map(announcement => announcement.announcement_id);
  // Check if there are new announcements to insert
  if (announcementIds.length === 0) {
    result(null, announcements);
    return;
  }

  // Check if the announcement_id already exists in announcements_for_user
  db.query('SELECT announcement_id FROM announcements_for_user WHERE announcement_id IN (?) AND ind_id = ?', [announcementIds, data.ind_id], (err, existingIds) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      // Filter out announcement_ids that already exist in announcements_for_user
      const newAnnouncements = announcements.filter(announcement =>
        !existingIds.some(existingId => existingId.announcement_id === announcement.announcement_id)
      );

      // Check if there are new announcements to insert
      if (newAnnouncements.length === 0) {
        // After insertion, update is_expired based on expired_at in announcements table
        const updateQuery = `UPDATE announcements_for_user afu
          JOIN announcements a ON afu.announcement_id = a.announcement_id
          SET afu.is_expired = CASE WHEN a.expired_at IS NOT NULL AND a.expired_at <= NOW() THEN 1 ELSE 0 END
          WHERE afu.ind_id = ?`;

        db.query(updateQuery, [data.ind_id], (updateErr, updateResults) => {
          if (updateErr) {
            console.log(updateErr);
            result(updateErr, null);
          } else {
            // After the update, select the data based on ind_id
            db.query(
              `SELECT afu.*, a.* FROM announcements_for_user afu
              JOIN announcements a ON afu.announcement_id = a.announcement_id
              WHERE afu.ind_id = ?`,
              [data.ind_id],
              (selectErr, finalResults) => {
                if (selectErr) {
                  console.log(selectErr);
                  result(selectErr, null);
                } else {
                  result(null, finalResults);
                }
              }
            );
          }
        });
        return;
      }

      // Prepare values for the new announcements
      const values = newAnnouncements.map(announcement => [
        announcement.announcement_id,
        data.ind_id,
        1, // unread is always 1
      ]);

      // Insert only the new announcements
      db.query(`INSERT INTO announcements_for_user 
        (announcement_id, ind_id, unread) VALUES ?`, [values], (err, insertResult) => {
        if (err) {
          console.log(err);
          result(err, null);
        } else {
          // After insertion, update is_expired based on expired_at in announcements table
          const updateQuery = `UPDATE announcements_for_user afu
            JOIN announcements a ON afu.announcement_id = a.announcement_id
            SET afu.is_expired = CASE WHEN a.expired_at IS NOT NULL AND a.expired_at <= NOW() THEN 1 ELSE 0 END
            WHERE afu.ind_id = ?`;

          db.query(updateQuery, [data.ind_id], (updateErr, updateResults) => {
            if (updateErr) {
              console.log(updateErr);
              result(updateErr, null);
            } else {
              // After the update, select the data based on ind_id
              db.query(
                `SELECT afu.*, a.* FROM announcements_for_user afu
                JOIN announcements a ON afu.announcement_id = a.announcement_id
                WHERE afu.ind_id = ?`,
                [data.ind_id],
                (selectErr, finalResults) => {
                  if (selectErr) {
                    console.log(selectErr);
                    result(selectErr, null);
                  } else {
                    result(null, finalResults);
                  }
                }
              );
            }
          });
        }
      });
    }
  });
}

// Update read of announcements_for_user
export const updateReadAnnouncementsM = (data, result) => {
  db.query(
    `UPDATE announcements_for_user
    SET unread = 0,
        read_at = CONVERT_TZ(NOW(), '+00:00', 'UTC')
    WHERE ind_id = ?
    AND announcement_id = ?`,
    [data.ind_id, data.announcement_id],
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
// Delete an Announcement
export const deleteAnnouncementsM = (data, result) => {
  db.query(
    `DELETE FROM announcements WHERE announcement_id = ?`,
    [data.announcement_id],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        // After deleting from announcements table, delete from announcements_for_user table
        deleteAnnouncementsForUser(data.announcement_id, result);
      }
    }
  );
};

// Helper function to delete from announcements_for_user table
const deleteAnnouncementsForUser = (announcementId, result) => {
  db.query(
    `DELETE FROM announcements_for_user WHERE announcement_id = ?`,
    [announcementId],
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

// GET GOSPI Names
export const getGOSPInamesM = (data, result) => {
  db.query(
    `DELETE FROM announcements WHERE announcement_id = ?`,
    [data.announcement_id],
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

// Update Unread of announcements_for_user
export const updateUnReadAnnouncementsM = (data, result) => {
  db.query(
    `UPDATE announcements_for_user
    SET unread = 1,
        unread_at = CONVERT_TZ(NOW(), '+00:00', 'UTC')
    WHERE ind_id = ?
    AND announcement_id = ?`,
    [data.ind_id, data.announcement_id],
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

// Create New Announcement
export const insertAnnouncementM = (data, result) => {
  db.query(
    'INSERT INTO announcements (title, description, announcement_from, release_date, roles, respondents, global_id, org_id, suborg_id, program_id, iteration_id, for_email, created_at, expired_at, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), ?, ?, ?)',
    [
      data.title,
      data.description,
      data.announcement_from,
      data.release_date,
      data.roles,
      data.respondents,
      data.global_id,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
      data.for_email,
      data.expired_at,
      data.ind_id, // created_by
      data.ind_id, // modified_by
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
// Update Announcement
export const updateAnnouncementM = (data, result) => {
  db.query(
    'UPDATE announcements SET title=?, description=?, announcement_from=?, release_date=?, roles=?, respondents=?, global_id=?, org_id=?, suborg_id=?, program_id=?, iteration_id=?, for_email=?, expired_at=?, created_by=?, modified_by=? WHERE announcement_id=?',
    [
      data.title,
      data.description,
      data.announcement_from,
      data.release_date,
      data.roles,
      data.respondents,
      data.global_id,
      data.org_id,
      data.suborg_id,
      data.program_id,
      data.iteration_id,
      data.for_email,
      data.expired_at,
      data.ind_id, // created_by
      data.ind_id, // modified_by
      data.announcement_id, // announcement_id for the WHERE clause
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
// Delete Announcement
export const deleteAnnouncementById = (id, result) => {
  db.query('DELETE FROM org WHERE org_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}
// Get last org_id
export const getLastestOrgId = (result) => {
  db.query('SELECT MAX(org_id) AS latest_org_id FROM org', (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}