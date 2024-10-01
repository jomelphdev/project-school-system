import db from '../config/database.js'

import axios, * as others from 'axios'
import moment from 'moment'

//? Get All Individuals
export const getAllIndividuals = (result) => {
  db.query(
    // "SELECT (GROUP_CONCAT(role.role_name SEPARATOR',')) AS _roles_name, individual.* FROM individual LEFT JOIN role ON role.role_id = individual.roles GROUP BY individual.ind_id",
    `SELECT individual.*, IF(CONCAT(individual.first_name, ' ', individual.last_name) IS NULL, sa.nominee_salutation , CONCAT(individual.first_name, ' ', individual.last_name)) AS full_name, 
    (GROUP_CONCAT(DISTINCT ind_group.program_id SEPARATOR', ')) AS _program_id, 
    (GROUP_CONCAT(DISTINCT ind_group.iteration_id SEPARATOR', ')) AS _iteration_id, 
    (GROUP_CONCAT(DISTINCT ind_group.stream_id SEPARATOR', ')) AS _stream_id, 
    (GROUP_CONCAT(DISTINCT ind_group.group_id SEPARATOR', ')) AS _group_id, 
    (GROUP_CONCAT(DISTINCT ind_group.suborg_id SEPARATOR', ')) AS _suborg_id
    FROM individual 
    LEFT JOIN ind_group ON ind_group.ind_id = individual.ind_id
    LEFT JOIN survey_assignment sa ON sa.ind_id = individual.ind_id
    GROUP BY individual.ind_id`,
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

//Get all individual where role is coach
export const getAllCoach = (org_id, result) => {
  db.query(
    "SELECT ind_id, email, first_name, last_name, roles, org_id, suborgs from individual WHERE roles LIKE '%4%' AND org_id = ?",
    [org_id],
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

export const getAllIndividualsByIndGroupOrg = (org_id, result) => {
  db.query(
    "SELECT ind.ind_id, ind.email, CONCAT(ind.first_name, ' ', ind.last_name) AS NAME, p.program_name, it.iteration_name, s.stream_name, g.group_name FROM `individual` ind LEFT JOIN ind_group ig ON ig.ind_id = ind.ind_id LEFT JOIN program p ON p.program_id = ig.program_id LEFT JOIN iteration it ON it.iteration_id = ig.iteration_id LEFT JOIN stream s ON s.stream_id = ig.stream_id LEFT JOIN `group` g ON g.group_id = ig.group_id WHERE ind.org_id = ?",
    [org_id],
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

export const getAllIndividualsByIndGroupOrgSuborg = (
  org_id,
  suborg_id,
  result
) => {
  db.query(
    "SELECT ind.ind_id, ind.email, CONCAT(ind.first_name, ' ', ind.last_name) AS NAME, p.program_name, it.iteration_name, s.stream_name, g.group_name FROM `individual` ind LEFT JOIN ind_group ig ON ig.ind_id = ind.ind_id LEFT JOIN program p ON p.program_id = ig.program_id LEFT JOIN iteration it ON it.iteration_id = ig.iteration_id LEFT JOIN stream s ON s.stream_id = ig.stream_id LEFT JOIN `group` g ON g.group_id = ig.group_id WHERE ind.org_id = ? AND ig.suborg_id = ?",
    [org_id, suborg_id],
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

export const getAllIndividualsByIndGroupOrgSuborgProgram = (
  org_id,
  suborg_id,
  program_id,
  result
) => {
  db.query(
    "SELECT ind.ind_id, ind.email, CONCAT(ind.first_name, ' ', ind.last_name) AS NAME, p.program_name, it.iteration_name, s.stream_name, g.group_name FROM `individual` ind LEFT JOIN ind_group ig ON ig.ind_id = ind.ind_id LEFT JOIN program p ON p.program_id = ig.program_id LEFT JOIN iteration it ON it.iteration_id = ig.iteration_id LEFT JOIN stream s ON s.stream_id = ig.stream_id LEFT JOIN `group` g ON g.group_id = ig.group_id WHERE ind.org_id = ? AND ig.suborg_id = ? AND ig.program_id = ?",
    [org_id, suborg_id, program_id],
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

export const getAllIndividualsByIndGroupOrgSuborgProgramIteration = (
  org_id,
  suborg_id,
  program_id,
  iteration_id,
  result
) => {
  db.query(
    "SELECT ind.ind_id, ind.email, CONCAT(ind.first_name, ' ', ind.last_name) AS NAME, p.program_name, it.iteration_name, s.stream_name, g.group_name FROM `individual` ind LEFT JOIN ind_group ig ON ig.ind_id = ind.ind_id LEFT JOIN program p ON p.program_id = ig.program_id LEFT JOIN iteration it ON it.iteration_id = ig.iteration_id LEFT JOIN stream s ON s.stream_id = ig.stream_id LEFT JOIN `group` g ON g.group_id = ig.group_id WHERE ind.org_id = ? AND ig.suborg_id = ? AND ig.program_id = ? AND ig.iteration_id = ?",
    [org_id, suborg_id, program_id, iteration_id],
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

export const getAllIndividualsByIndGroup = (
  org_id,
  suborg_id,
  program_id,
  iteration_id,
  stream_id,
  result
) => {
  db.query(
    "SELECT ind.ind_id, ind.email, CONCAT(ind.first_name, ' ', ind.last_name) AS NAME, p.program_name, it.iteration_name, s.stream_name, g.group_name FROM `individual` ind LEFT JOIN ind_group ig ON ig.ind_id = ind.ind_id LEFT JOIN program p ON p.program_id = ig.program_id LEFT JOIN iteration it ON it.iteration_id = ig.iteration_id LEFT JOIN stream s ON s.stream_id = ig.stream_id LEFT JOIN `group` g ON g.group_id = ig.group_id WHERE ind.org_id = ? AND ig.suborg_id = ? AND ig.program_id = ? AND ig.iteration_id = ? AND ig.stream_id = ?",
    [org_id, suborg_id, program_id, iteration_id, stream_id],
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

export const getAllIndividualsByOrgId = (org_id, result) => {
  db.query(
    'SELECT * FROM `individual` WHERE org_id = ?',
    [org_id],
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

//? Get Single Individiual Join Org
export const findIndividualById = (id, result) => {
  db.query(
    'SELECT individual.*, org.org_name FROM individual LEFT JOIN org ON org.org_id = individual.org_id WHERE ind_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results[0])
      }
    }
  )
}
//? Get Single Individiual by Email
export const findIndividualByEmail = (email, result) => {
  db.query(
    'SELECT individual.ind_id, individual.email, individual.last_login_date, individual.logged_in, individual.suborgs, org.org_name, org.org_id FROM individual LEFT JOIN org ON org.org_id = individual.org_id WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results[0])
      }
    }
  )
}

//? Create New Individual
export const insertIndividual = (data, result) => {
  console.log(data)
  if (data.indGroup.program_id == null) {
    db.query(
      "INSERT INTO individual (email, last_name, first_name, phone_number, auth_string, password, seed, suppress_email_sending, is_participant, org_id, suborgs, roles, initiation_date, created_at, modified_at, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '?', '?', ?, NOW(), NOW(), ?, ?)",
      [
        data.email,
        data.last_name,
        data.first_name,
        data.phone_number,
        data.auth_string,
        data.password,
        data.seed,
        data.suppress_email_sending,
        data.is_participant,
        data.org_id,
        data.suborgs,
        data.roles == null ||
        data.roles == '' ||
        data.roles == 'undefined' ||
        data.roles == []
          ? 1
          : data.roles,
        data.initiation_date,
        data.created_by,
        data.modified_by,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  } else {
    db.query(
      "INSERT INTO individual (email, last_name, first_name, phone_number, auth_string, seed, suppress_email_sending, is_participant, org_id, suborgs, roles, initiation_date, created_at, modified_at, created_by, modified_by) VALUES (?, ?, ?, ?, ?,  ?, ?, ?, ?, '?', '?', ?, NOW(), NOW(), ?, ?)",
      [
        data.email,
        data.last_name,
        data.first_name,
        data.phone_number,
        data.auth_string,
        data.seed,
        data.suppress_email_sending,
        data.is_participant,
        data.org_id,
        data.suborgs,
        data.roles == null ||
        data.roles == '' ||
        data.roles == 'undefined' ||
        data.roles == []
          ? 1
          : data.roles,
        data.initiation_date,
        data.created_by,
        data.modified_by,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
    db.query('SET @last_ind_id = LAST_INSERT_ID()')
    db.query(
      'INSERT INTO ind_group (ind_id, program_id, iteration_id, org_id, suborg_id, created_at, modified_at, created_by, modified_by) VALUES (@last_ind_id, ?, ?, ?, ?, NOW(), NOW(), ?, ?)',
      [
        data.indGroup.program_id,
        data.indGroup.iteration_id,
        data.org_id,
        data.suborgs,
        data.created_by,
        data.modified_by,
      ]
    )
  }
}

//? Update Individual
export const updateIndividualById = (id, data, result) => {
  db.query(
    "UPDATE individual SET email = ?, last_name = ?, first_name = ?, phone_number = ?, password = ?, auth_string = ?, suppress_email_sending = ?, is_participant = ?, org_id = ?, suborgs = '?', roles = '?', created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?",
    [
      data.email,
      data.last_name,
      data.first_name,
      data.phone_number,
      data.password,
      data.auth_string,
      data.suppress_email_sending,
      data.is_participant,
      data.org_id,
      data.suborgs,
      data.roles,
      data.created_by,
      data.modified_by,
      id,
    ],
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

export const updateIndividualProgramIterationByIndGroupIndId = (id, data, result) => {
  if(isNaN(data.action_program_id) && data.action_iteration_id == null){
    db.query(
      `INSERT INTO program (program_name, org_id, suborg_id, created_at, created_by, modified_at, modified_by) 
      SELECT ?, ?, ?, NOW(), ?, NOW(), ? 
      FROM DUAL WHERE NOT EXISTS (SELECT * FROM program WHERE program_name = ? LIMIT 1); 

      UPDATE ind_group 
      SET program_id = (SELECT MAX(program_id) FROM program), iteration_id = ?, stream_id = ?, group_id = ?, created_at = NOW(), 
      created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?`,
      [
        data.action_program_id,
        data.org_id,
        data.suborg_id,
        data.created_by,
        data.modified_by,
        data.action_program_id,
        data.action_iteration_id == null ? 0 : data.action_iteration_id,
        data.action_stream_id == null ? 0 : data.action_stream_id,
        data.group_id == null ? 0 : data.group_id,
        data.created_by,
        data.modified_by,
        id,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }else if(!isNaN(data.action_program_id) && data.action_iteration_id == null){
    db.query(
      `UPDATE ind_group SET program_id = ?, iteration_id = ?, stream_id = ?, group_id = ?, created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?`,
      [
        data.action_program_id,
        data.action_iteration_id == null ? 0 : data.action_iteration_id,
        data.action_stream_id == null ? 0 : data.action_stream_id,
        data.group_id == null ? 0 : data.group_id,
        data.created_by,
        data.modified_by,
        id,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }else if(!isNaN(data.action_program_id) && !isNaN(data.action_iteration_id)){
    db.query(
      "UPDATE ind_group SET program_id = ?, iteration_id = ?, stream_id = ?, group_id = ?, created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?",
      [
        data.action_program_id,
        data.action_iteration_id,
        data.action_stream_id == null ? 0 : data.action_stream_id,
        data.group_id == null ? 0 : data.group_id,
        data.created_by,
        data.modified_by,
        id,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }else if(!isNaN(data.action_program_id) && isNaN(data.action_iteration_id)){
    db.query(
      `INSERT INTO iteration (iteration_name, org_id, suborg_id, program_id, created_at, created_by, modified_at, modified_by) SELECT ?, ?, ?, ?, NOW(), ?, NOW(), ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM iteration WHERE iteration_name = ? LIMIT 1); 

      UPDATE ind_group SET program_id = ?, iteration_id = (SELECT MAX(iteration_id) FROM iteration),  stream_id = ?, group_id = ?, created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?`,
      [
        data.action_iteration_id,
        data.org_id,
        data.suborg_id,
        data.action_program_id,
        data.created_by,
        data.modified_by,
        data.action_iteration_id,
        data.action_program_id,
        data.action_stream_id == null ? 0 : data.action_stream_id,
        data.group_id == null ? 0 : data.group_id,
        data.created_by,
        data.modified_by,
        id,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }else if(isNaN(data.action_program_id) && isNaN(data.action_iteration_id)){
    db.query(
      `INSERT INTO program (program_name, org_id, suborg_id, created_at, created_by, modified_at, modified_by) 
      SELECT ?, ?, ?, NOW(), ?, NOW(), ? 
      FROM DUAL WHERE NOT EXISTS (SELECT * FROM program WHERE program_name = ? LIMIT 1); 

      INSERT INTO iteration (iteration_name, org_id, suborg_id, program_id, created_at, created_by, modified_at, modified_by) 
      SELECT ?, ?, ?, (SELECT MAX(program_id) FROM program), NOW(), ?, NOW(), ? 
      FROM DUAL WHERE NOT EXISTS (SELECT * FROM iteration WHERE iteration_name = ? LIMIT 1); 

      UPDATE ind_group SET program_id = (SELECT MAX(program_id) FROM program), iteration_id = (SELECT MAX(iteration_id) FROM iteration), stream_id = ?, group_id = ?,
      created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?`,
      [
        data.action_program_id,
        data.org_id,
        data.suborg_id,
        data.created_by,
        data.modified_by,
        data.action_program_id,
        data.action_iteration_id,
        data.org_id,
        data.suborg_id,
        data.created_by,
        data.modified_by,
        data.action_iteration_id,
        data.action_stream_id == null ? 0 : data.action_stream_id,
        data.group_id == null ? 0 : data.group_id,
        data.created_by,
        data.modified_by,
        id,
      ],
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
}

export const updateIndividualStreamGroupByIndGroupIndId = (id, data, result) => {

  if(isNaN(data.action_stream_id) && data.group_id == null){
    db.query(
      `INSERT INTO stream (stream_name, org_id, suborg_id, program_id, iteration_id, created_at, created_by, modified_at, modified_by) 
      SELECT ?, ?, ?, ?, ?, NOW(), ?, NOW(), ? 
      FROM DUAL WHERE NOT EXISTS (SELECT * FROM stream WHERE stream_name = ? LIMIT 1); 

      UPDATE ind_group 
      SET program_id = ?, iteration_id = ?, stream_id = (SELECT MAX(stream_id) FROM stream), group_id = ?, created_at = NOW(), 
      created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?`,
      [
        data.action_stream_id,
        data.org_id,
        data.suborg_id,
        data.program_id,
        data.iteration_id,
        data.created_by,
        data.modified_by,
        data.action_stream_id,
        data.program_id,
        data.iteration_id,
        data.group_id == null ? 0 : data.group_id,
        data.created_by,
        data.modified_by,
        id,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }else if(!isNaN(data.action_stream_id) && data.group_id == null){
    db.query(
      `UPDATE ind_group SET program_id = ?, iteration_id = ?, stream_id = ?, group_id = ?, created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?`,
      [
        data.program_id,
        data.iteration_id,
        data.action_stream_id,
        data.group_id  == null ? 0 : data.group_id,
        data.created_by,
        data.modified_by,
        id,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }else if(!isNaN(data.action_stream_id) && !isNaN(data.group_id)){
    db.query(
      "UPDATE ind_group SET program_id = ?, iteration_id = ?, stream_id = ?, group_id = ?, created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?",
      [
        data.program_id,
        data.iteration_id,
        data.action_stream_id,
        data.group_id,
        data.created_by,
        data.modified_by,
        id,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }else if(!isNaN(data.action_stream_id) && isNaN(data.group_id)){
    db.query(
      `INSERT INTO talentsage.group (group_name, org_id, suborg_id, program_id, iteration_id, stream_id, created_at, created_by, modified_at, modified_by) 
      SELECT ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM talentsage.group WHERE group_name = ? LIMIT 1); 

      UPDATE ind_group 
      SET program_id = ?, iteration_id = ?, stream_id = ?, group_id = (SELECT MAX(group_id) FROM talentsage.group), 
      created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?`,
      [
        data.group_id,
        data.org_id,
        data.suborg_id,
        data.program_id,
        data.iteration_id,
        data.action_stream_id,
        data.created_by,
        data.modified_by,
        data.group_id,
        data.program_id,
        data.iteration_id,
        data.action_stream_id,
        data.created_by,
        data.modified_by,
        id,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, results)
        }
      }
    )
  }else if(isNaN(data.action_stream_id) && isNaN(data.group_id)){
    db.query(
      `INSERT INTO stream (stream_name, org_id, suborg_id, program_id, iteration_id, created_at, created_by, modified_at, modified_by) 
      SELECT ?, ?, ?, ?, ?, NOW(), ?, NOW(), ? 
      FROM DUAL WHERE NOT EXISTS (SELECT * FROM stream WHERE stream_name = ? LIMIT 1); 

      INSERT INTO talentsage.group (group_name, org_id, suborg_id, program_id, iteration_id, stream_id, created_at, created_by, modified_at, modified_by) 
      SELECT ?, ?, ?, ?, ?, (SELECT MAX(stream_id) FROM stream), NOW(), ?, NOW(), ? 
      FROM DUAL WHERE NOT EXISTS (SELECT * FROM talentsage.group WHERE group_name = ? LIMIT 1); 

      UPDATE ind_group SET program_id = ?, iteration_id = ?, stream_id = (SELECT MAX(stream_id) FROM stream), group_id = (SELECT MAX(group_id) FROM talentsage.group), 
      created_at = NOW(), created_by = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?`,
      [
        data.action_stream_id,
        data.org_id,
        data.suborg_id,
        data.program_id,
        data.iteration_id,
        data.created_by,
        data.modified_by,
        data.action_stream_id,
        data.group_id,
        data.org_id,
        data.suborg_id,
        data.program_id,
        data.iteration_id,
        data.created_by,
        data.modified_by,
        data.group_id,
        data.program_id,
        data.iteration_id,
        data.created_by,
        data.modified_by,
        id,
      ],
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
}

export const updateIndividualNameById = (id, data, result) => {
  db.query(
    'UPDATE individual SET last_name = ?, first_name = ? WHERE ind_id = ?',
    [data.last_name, data.first_name, id],
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

export const updateIndividualEmailById = (id, data, result) => {
  db.query(
    'UPDATE individual SET email = ? WHERE ind_id = ?',
    [data.email, id],
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

export const updateIndividualPasswordById = (id, data, result) => {
  db.query(
    'UPDATE individual SET password = ? WHERE ind_id = ?',
    [data.password, id],
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

export const updateIndividualSuppressEmailSendingById = (id, data, result) => {
  db.query(
    'UPDATE individual SET suppress_email_sending = ? WHERE ind_id = ?',
    [data.suppress_email_sending, id],
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

//? Delete Individual
export const deleteIndividualById = (id, result) => {
  db.query('DELETE FROM individual WHERE ind_id = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

// Get Single Email - check email if already exist
export const findIndividualEmailExist = (email, result) => {
  db.query(
    'SELECT * FROM individual where email = ?',
    [email],
    (err, results) => {
      if (err) return result(err, null)

      if (!results[0])
        return result({ message: 'notexist', payload: 'Email not exist' })
      result({
        data: results[0],
        message: 'exist',
        payload: 'Email already exist',
      })
    }
  )
}

// create an individual for making nomination
export const insertIndividualMakeNomination = (data, result) => {
  // insert data only in survey_assigment and send_email if email already exist
  if (data.is_email_exist == 'yes') {
    return db.query(
      'SELECT ind_id FROM `individual` WHERE email = ? LIMIT 1',
      [data.recipient_email],
      (err, results2) => {
        if (err) return result(err, null)

        // get data of survey_template to insert in survey_assignment
        db.query(
          'SELECT nominee_survey_template_id FROM `survey_template` WHERE survey_template_id = ?',
          [data.survey_template_id],
          (err, results7) => {
            if (err) return result(err, null)

            // get data of survey_template_association_id to insert in survey_assignment
            db.query(
              `SELECT survey_template_association_id FROM survey_template_association WHERE survey_template_id = ${results7[0].nominee_survey_template_id} AND org_id = ? AND suborg_id = ?`,
              [data.org_id, data.suborg_id],
              (err, results8) => {
                if (err) return result(err, null)

                if(results8.length == 0) return result({status : 'failed', message: `Something went wrong in survey template ID = ${data.survey_template_id}, ${data.survey_name}, ${data.org_name}. Please contact help@talentsage.com.`})
                
                // get data of parent of survey assignment
                db.query(
                  `SELECT * FROM survey_assignment WHERE survey_assignment_id = ?`,
                  [data.parent_survey_assignment_id],
                  (err, results9) => {
                    if (err) return result(err, null)

                    let launchDate = moment(results9[0].launch_date).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ) //mysql datetime.
                    let surveyReminderDate = moment(
                      results9[0].survey_reminder_date
                    ).format('YYYY-MM-DD HH:mm:ss') //mysql datetime.
                    let initialDeadlineDate = moment(
                      results9[0].initial_deadline_date
                    ).format('YYYY-MM-DD HH:mm:ss') //mysql datetime.
                    let finalDeadlineDate = moment(
                      results9[0].final_deadline_date
                    ).format('YYYY-MM-DD HH:mm:ss') //mysql datetime.

                    // insert data in survey_assignment
                    db.query(
                      `INSERT INTO survey_assignment(is_nomination,ind_id,survey_template_id,survey_template_association_id,launch_date,survey_reminder_date,initial_deadline_date,final_deadline_date,nominee_salutation,nominee_message,recipient_email,relationship_id,parent_survey_assignment_id,org_id,suborg_id,program_id,iteration_id,stream_id,group_id,created_by,modified_by) 
                      VALUES (1, ${results2[0].ind_id},${results7[0].nominee_survey_template_id},${results8[0].survey_template_association_id},'${launchDate}','${surveyReminderDate}','${initialDeadlineDate}','${finalDeadlineDate}',?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                      [
                        data.nominee_salutation,
                        data.nominee_message,
                        data.recipient_email,
                        data.relationship_id,
                        data.parent_survey_assignment_id,
                        data.org_id,
                        data.suborg_id,
                        data.program_id,
                        data.iteration_id,
                        data.stream_id,
                        data.group_id,
                        data.created_by,
                        data.created_by,
                      ],
                      (err, results3) => {
                        if (err) return result(err, null)

                        result(null, {
                          ind_id: results2[0].ind_id,
                          survey_assignment_id: results3.insertId,
                          payload: results3,
                          status : 'success'
                        })

                        //update number_of_nominations plus 1
                        db.query(
                          'UPDATE survey_assignment SET number_of_nominations = (number_of_nominations + 1 ) WHERE survey_assignment_id = ?',
                          [data.parent_survey_assignment_id],
                          (err) => {
                            if (err) return result(err, null)
                          }
                        )

                        if (data.relationship_id == 1) {
                          //update number_of_nominated_primary_supervisor plus 1
                          db.query(
                            'UPDATE survey_assignment SET number_of_nominated_primary_supervisor = (number_of_nominated_primary_supervisor + 1 ) WHERE survey_assignment_id = ?',
                            [data.parent_survey_assignment_id],
                            (err) => {
                              if (err) return result(err, null)
                            }
                          )
                        }

                      }
                    )
                  }
                )
              }
            )
          }
        )
      }
    )
  }

  // if email is not exist - insert data in individual, survey_assigment and send_email
  // get data of survey_template_id to insert in survey_assignment
  db.query(
    'SELECT nominee_survey_template_id FROM `survey_template` WHERE survey_template_id = ?',
    [data.survey_template_id],
    (err, results7) => {
      if (err) return result(err, null)

      // get data of survey_template_association_id to insert in survey_assignment
      db.query(
        `SELECT survey_template_association_id FROM survey_template_association WHERE survey_template_id = ${results7[0].nominee_survey_template_id} AND org_id = ? AND suborg_id = ?`,
        [data.org_id, data.suborg_id],
        (err, results8) => {
          if (err) return result(err, null)

          if(results8.length == 0) return result({status : 'failed', message: `Something went wrong in survey template ID = ${data.survey_template_id}, ${data.survey_name}, ${data.org_name}. Please contact help@talentsage.com.`})

          db.query(
            `INSERT INTO individual (is_nominee, initiation_date, roles, auth_string, seed, email, org_id, suborgs, created_by, modified_by) 
              VALUES (1, CURRENT_TIMESTAMP(), 2, ?, ?, ?, ?, ?, ?, ?)`,
            [
              data.auth_string,
              data.seed,
              data.recipient_email,
              data.org_id,
              data.suborg_id,
              data.created_by,
              data.modified_by,
            ],
            (err) => {
              if (err) return result(err, null)

              db.query(
                'SELECT ind_id FROM `individual` WHERE email = ? LIMIT 1',
                [data.recipient_email],
                (err, results2) => {
                  if (err) return result(err, null)

                  // get data of parent of survey assignment
                  db.query(
                    `SELECT * FROM survey_assignment WHERE survey_assignment_id = ?`,
                    [data.parent_survey_assignment_id],
                    (err, results9) => {
                      if (err) return result(err, null)

                      let launchDate = moment(results9[0].launch_date).format(
                        'YYYY-MM-DD HH:mm:ss'
                      ) //mysql datetime.
                      let surveyReminderDate = moment(
                        results9[0].survey_reminder_date
                      ).format('YYYY-MM-DD HH:mm:ss') //mysql datetime.
                      let initialDeadlineDate = moment(
                        results9[0].initial_deadline_date
                      ).format('YYYY-MM-DD HH:mm:ss') //mysql datetime.
                      let finalDeadlineDate = moment(
                        results9[0].final_deadline_date
                      ).format('YYYY-MM-DD HH:mm:ss') //mysql datetime.

                      // insert data in survey_assignment
                      db.query(
                        `INSERT INTO survey_assignment(is_nomination,ind_id,survey_template_id,survey_template_association_id,launch_date,survey_reminder_date,initial_deadline_date,final_deadline_date,nominee_salutation,nominee_message,recipient_email,relationship_id,parent_survey_assignment_id,org_id,suborg_id,program_id,iteration_id,stream_id,group_id,created_by,modified_by) 
                            VALUES (1, ${results2[0].ind_id},${results7[0].nominee_survey_template_id},${results8[0].survey_template_association_id},'${launchDate}','${surveyReminderDate}','${initialDeadlineDate}','${finalDeadlineDate}',?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [
                          data.nominee_salutation,
                          data.nominee_message,
                          data.recipient_email,
                          data.relationship_id,
                          data.parent_survey_assignment_id,
                          data.org_id,
                          data.suborg_id,
                          data.program_id,
                          data.iteration_id,
                          data.stream_id,
                          data.group_id,
                          data.created_by,
                          data.created_by,
                        ],
                        (err, results3) => {
                          if (err) return result(err, null)

                          result(null, {
                            ind_id: results2[0].ind_id,
                            survey_assignment_id: results3.insertId,
                            payload: results3,
                            status : 'success'
                          })

                          //update number_of_nominations plus 1
                          db.query(
                            'UPDATE survey_assignment SET number_of_nominations = (number_of_nominations + 1 ) WHERE survey_assignment_id = ?',
                            [data.parent_survey_assignment_id],
                            (err) => {
                              if (err) return result(err, null)
                            }
                          )

                          if (data.relationship_id == 1) {
                            //update number_of_nominated_primary_supervisor plus 1
                            db.query(
                              'UPDATE survey_assignment SET number_of_nominated_primary_supervisor = (number_of_nominated_primary_supervisor + 1 ) WHERE survey_assignment_id = ?',
                              [data.parent_survey_assignment_id],
                              (err) => {
                                if (err) return result(err, null)
                              }
                            )
                          }

                        }
                      )
                    }
                  )
                }
              )
            }
          )
        }
      )
    }
  )
}

//? Get Single Individiual
export const findSingleIndividualById = (id, result) => {
  db.query(
    'SELECT * FROM individual WHERE ind_id = ?',
    [id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results[0])
    }
  )
}

//? Get Email Details of Single Individiual
export const findEmailDetailsById = (id, result) => {
  db.query(
    "SELECT individual.email, individual.first_name, individual.last_name, individual.ind_id, individual.org_id, individual.suborgs, brand.header_bg_color, brand.brand_name, brand.website_url, brand.brand_path, brand.website_sender_email, brand.website_contact_email, brand.website_terms_url, brand.website_privacy_url FROM individual LEFT JOIN brand ON brand.org_id = individual.org_id WHERE individual.ind_id = ?",
    [id],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results[0])
    }
  )
}

export const addIndividualAndProgram = (data, result) => {
  if (
    isNaN(data.program.program_name) &&
    data.iteration.iteration_name == null
  ) {
    db.query(
      `INSERT INTO individual (email, last_name, first_name, phone_number, auth_string, seed, suppress_email_sending, is_participant, org_id, suborgs, roles, initiation_date, created_at, modified_at, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '?', '?', ?, NOW(), NOW(), ?, ?); SET @last_ind_id = LAST_INSERT_ID(); 
    
      INSERT INTO program (program_name, org_id, suborg_id, created_at, created_by, modified_at, modified_by) SELECT ?, ?, ?, NOW(), ?, NOW(), ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM program WHERE program_name = ? LIMIT 1); 
      
      INSERT INTO ind_group (ind_id, program_id, iteration_id, org_id, suborg_id, created_at, modified_at, created_by, modified_by) VALUES (@last_ind_id, (SELECT MAX(program_id) FROM program), ?, ?, ?, NOW(), NOW(), ?, ?);`,
      [
        data.email,
        data.last_name,
        data.first_name,
        data.phone_number,
        data.auth_string,
        data.seed,
        data.suppress_email_sending,
        data.is_participant,
        data.org_id,
        data.suborgs,
        data.roles == null ||
        data.roles == '' ||
        data.roles == 'undefined' ||
        data.roles == []
          ? 1
          : data.roles,
        data.initiation_date,
        data.created_by,
        data.modified_by,

        data.program.program_name,
        data.program.org_id,
        data.program.suborg_id,
        data.program.created_by,
        data.program.modified_by,
        data.program.program_name,

        data.iteration.iteration_name == null ||
        data.iteration.iteration_name == 'undefined'
          ? 0
          : data.iteration.iteration_name,
        data.indGroup.org_id,
        data.indGroup.suborg_id,
        data.indGroup.created_by,
        data.indGroup.modified_by,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, {
            success: true,
            type: 'success',
            message: 'The survey was successfully attached to this user',
          })
          console.log(results)
        }
      }
    )
  } else if (
    !isNaN(data.program.program_name) &&
    isNaN(data.iteration.iteration_name)
  ) {
    db.query(
      `INSERT INTO individual (email, last_name, first_name, phone_number, auth_string, seed, suppress_email_sending, is_participant, org_id, suborgs, roles, initiation_date, created_at, modified_at, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '?', '?', ?, NOW(), NOW(), ?, ?); SET @last_ind_id = LAST_INSERT_ID(); 
  
      INSERT INTO iteration (iteration_name, org_id, suborg_id, program_id, created_at, created_by, modified_at, modified_by) SELECT ?, ?, ?, ?, NOW(), ?, NOW(), ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM iteration WHERE iteration_name = ? LIMIT 1); 

      INSERT INTO ind_group (ind_id, program_id, iteration_id, org_id, suborg_id, created_at, modified_at, created_by, modified_by) VALUES (@last_ind_id, ?, (SELECT MAX(iteration_id) FROM iteration), ?, ?, NOW(), NOW(), ?, ?);`,
      [
        data.email,
        data.last_name,
        data.first_name,
        data.phone_number,
        data.auth_string,
        data.seed,
        data.suppress_email_sending,
        data.is_participant,
        data.org_id,
        data.suborgs,
        data.roles == null ||
        data.roles == '' ||
        data.roles == 'undefined' ||
        data.roles == []
          ? 1
          : data.roles,
        data.initiation_date,
        data.created_by,
        data.modified_by,

        data.iteration.iteration_name,
        data.iteration.org_id,
        data.iteration.suborg_id,
        data.program.program_name,
        data.iteration.created_by,
        data.iteration.modified_by,
        data.iteration.iteration_name,

        data.program.program_name,
        data.indGroup.org_id,
        data.indGroup.suborg_id,
        data.indGroup.created_by,
        data.indGroup.modified_by,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, {
            success: true,
            type: 'success',
            message: 'The survey was successfully attached to this user',
          })
          console.log(results)
        }
      }
    )
  } else if (
    isNaN(data.program.program_name) &&
    isNaN(data.iteration.iteration_name)
  ) {
    db.query(
      `INSERT INTO individual (email, last_name, first_name, phone_number, auth_string, seed, suppress_email_sending, is_participant, org_id, suborgs, roles, initiation_date, created_at, modified_at, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '?', '?', ?, NOW(), NOW(), ?, ?); SET @last_ind_id = LAST_INSERT_ID(); 
      
      INSERT INTO program (program_name, org_id, suborg_id, created_at, created_by, modified_at, modified_by) SELECT ?, ?, ?, NOW(), ?, NOW(), ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM program WHERE program_name = ? LIMIT 1); 

      INSERT INTO iteration (iteration_name, org_id, suborg_id, program_id, created_at, created_by, modified_at, modified_by) SELECT ?, ?, ?, (SELECT MAX(program_id) FROM program), NOW(), ?, NOW(), ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM iteration WHERE iteration_name = ? LIMIT 1); 

      INSERT INTO ind_group (ind_id, program_id, iteration_id, org_id, suborg_id, created_at, modified_at, created_by, modified_by) VALUES (@last_ind_id, (SELECT MAX(program_id) FROM program), (SELECT MAX(iteration_id) FROM iteration), ?, ?, NOW(), NOW(), ?, ?);`,
      [
        data.email,
        data.last_name,
        data.first_name,
        data.phone_number,
        data.auth_string,
        data.seed,
        data.suppress_email_sending,
        data.is_participant,
        data.org_id,
        data.suborgs,
        data.roles == null ||
        data.roles == '' ||
        data.roles == 'undefined' ||
        data.roles == []
          ? 1
          : data.roles,
        data.initiation_date,
        data.created_by,
        data.modified_by,

        data.program.program_name,
        data.program.org_id,
        data.program.suborg_id,
        data.program.created_by,
        data.program.modified_by,
        data.program.program_name,

        data.iteration.iteration_name,
        data.iteration.org_id,
        data.iteration.suborg_id,
        data.iteration.created_by,
        data.iteration.modified_by,
        data.iteration.iteration_name,

        data.indGroup.org_id,
        data.indGroup.suborg_id,
        data.indGroup.created_by,
        data.indGroup.modified_by,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, {
            success: true,
            type: 'success',
            message: 'The survey was successfully attached to this user',
          })
          console.log(results)
        }
      }
    )
  } else {
    db.query(
      `INSERT INTO individual (email, last_name, first_name, phone_number, auth_string, seed, suppress_email_sending, is_participant, org_id, suborgs, roles, initiation_date, created_at, modified_at, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '?', '?', ?, NOW(), NOW(), ?, ?); SET @last_ind_id = LAST_INSERT_ID(); 
      
      INSERT INTO ind_group (ind_id, program_id, iteration_id, org_id, suborg_id, created_at, modified_at, created_by, modified_by) VALUES (@last_ind_id, ?, ?, ?, ?, NOW(), NOW(), ?, ?);`,
      [
        data.email,
        data.last_name,
        data.first_name,
        data.phone_number,
        data.auth_string,
        data.seed,
        data.suppress_email_sending,
        data.is_participant,
        data.org_id,
        data.suborgs,
        data.roles == null ||
        data.roles == '' ||
        data.roles == 'undefined' ||
        data.roles == []
          ? 1
          : data.roles,
        data.initiation_date,
        data.created_by,
        data.modified_by,

        data.program.program_name,
        data.iteration.iteration_name,
        data.indGroup.org_id,
        data.indGroup.suborg_id,
        data.indGroup.created_by,
        data.indGroup.modified_by,
      ],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          result(null, {
            success: true,
            type: 'success',
            message: 'The survey was successfully attached to this user',
          })
          console.log(results)
        }
      }
    )
  }
}

// update timezone of the individual
export const updateindividualTimezoneById = (id, data, result) => {
  db.query(
    'UPDATE individual SET time_zone = ?, modified_at = NOW(), modified_by = ? WHERE ind_id = ?',
    [data.time_zone, data.modified_by, id],
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

//get individual details from ind group, using ind_id
export const getIndividualDetailsFromIndGroup = (id, result) => {
  let query1 = `
  SELECT 
      ig.iteration_id,
    CASE WHEN ((sa.survey_template_id IS NULL) OR (sa.survey_template_id <= 0)) THEN 'No survey assigned'
          WHEN sa.survey_template_id > 0 THEN GROUP_CONCAT(st.survey_template_name SEPARATOR', ') END AS survey_name,
      CASE WHEN ((ig.program_id IS NULL) OR (ig.program_id <= 0)) THEN 'No program'
          WHEN ig.program_id > 0 THEN p.program_name END AS user_program,
      CASE WHEN ((ig.iteration_id IS NULL) OR (ig.iteration_id <= 0)) THEN 'No iteration'
          WHEN ((ig.iteration_id > 0) OR (ig.iteration_id IS NOT NULL)) THEN i.iteration_name END AS user_iteration,
      CASE WHEN ((ig.stream_id IS NULL) OR (ig.stream_id <= 0)) THEN 'No stream'
          WHEN ((ig.stream_id > 0) OR (ig.stream_id IS NOT NULL)) THEN s.stream_name END AS user_stream,
      CASE WHEN ((ig.group_id IS NULL) OR (ig.group_id <= 0)) THEN 'No group'
          WHEN ((ig.group_id > 0)OR(ig.group_id IS NOT NULL)) THEN g.group_name END AS user_group,
      CASE WHEN ((sa.iteration_id IS NULL) OR (sa.iteration_id <= 0)) THEN 'No survey iteration'
          WHEN ((sa.iteration_id > 0) OR (sa.iteration_id IS NOT NULL)) THEN GROUP_CONCAT(i.iteration_name SEPARATOR', ') END AS survey_iteration,
      CASE WHEN ((sa.program_id IS NULL) OR (sa.program_id <= 0)) THEN 'No survey program'
          WHEN ((sa.program_id > 0) OR (sa.program_id IS NOT NULL)) THEN GROUP_CONCAT(p.program_name SEPARATOR', ') END AS survey_program,
    CASE WHEN ((sa.stream_id IS NULL) OR (sa.stream_id <= 0)) THEN 'No survey stream'
          WHEN ((sa.stream_id > 0) OR (sa.stream_id IS NOT NULL)) THEN GROUP_CONCAT(s.stream_name SEPARATOR', ') END AS survey_stream,
      CASE WHEN ((sa.group_id IS NULL) OR (sa.group_id <= 0)) THEN 'No survey group'
          WHEN ((sa.group_id > 0) OR (sa.group_id IS NOT NULL)) THEN GROUP_CONCAT(g.group_name SEPARATOR', ') END AS survey_group
    FROM individual ind
      LEFT JOIN ind_group ig ON ig.ind_id = ind.ind_id
      LEFT JOIN program p ON p.program_id =  ig.program_id
      LEFT JOIN iteration i ON i.iteration_id = ig.iteration_id
      LEFT JOIN stream s ON s.stream_id = ig.stream_id
      LEFT JOIN talentsage.group g ON g.group_id = ig.group_id
      LEFT JOIN survey_assignment sa ON sa.ind_id = ind.ind_id
      LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    WHERE ind.ind_id = ${id}
  `
  db.query(query1,
    [],
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

// get sitemanager emails
export const getSitemanagerEmails = (id, result) => {
  let query1 =
  `
  SELECT ind_id, email, roles, org_id FROM individual 
  WHERE roles LIKE "%16%"
  AND org_id LIKE ${id}
  `
  db.query(query1,
    [],
    (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}

// check if user is logged in to access reports and surveys
export const checkUserLoggedInM = (id, result) => {
  let query1 = "SELECT isUserLogged FROM individual WHERE ind_id = ?"
  
  db.query(query1, [id], (err, results) => {
      if (err) return result(err, null)
      result(null, results[0])
    }
  )
}

// update individual status when the user is logged in or logged out
export const updateUserLoggedInM = (id, status, result) => {
  let query1 = "UPDATE individual SET isUserLogged = ? WHERE ind_id = ?"
  
  db.query(query1, [status, id], (err, results) => {
      if (err) return result(err, null)
      result(null, results)
    }
  )
}