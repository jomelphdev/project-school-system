import db from "../config/database.js";

//todo Delete 360 Cohort by final_deadline_date
export const delete360CohortM = (id, result) => {
  let query1 = `
    DELETE rc
    FROM r360_cohort rc
      JOIN iteration i 
      ON i.iteration_id = rc.iteration_id
      AND i.suborg_id = rc.suborg_id
      AND i.program_id = rc.program_id
      AND i.iteration_id = rc.iteration_id
    WHERE 
      DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
      AND i.never_run_iteration = 0
  `
  // console.log(query1)
  db.query(
    query1,
    [],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo Set is_processed to 0 by final_deadline_date
export const updateIsProcessedM = (id, result) => {
  let query1 = `
    UPDATE r360_raw r
    LEFT JOIN iteration i
      ON i.suborg_id = r.suborg_id
      AND i.program_id = r.program_id
      AND i.iteration_id = r.iteration_id
    SET is_processed = 0
    WHERE 
      DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i') 
      AND i.never_run_iteration = 0
  `
  // console.log(query1)
  db.query(
    query1,
    [id],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo Get 350 final_deadline_date
export const get360FinalDeadlineDateM = (id, result) => {
  let query1 = `
    SELECT 
      sa.survey_assignment_id, 
      sa.ind_id, 
      sa.org_id, 
      sa.suborg_id, 
      sa.program_id, 
      sa.iteration_id, 
      sa.is_nomination, 
      i.iteration_name, 
      i.time_zone
    FROM survey_assignment sa 
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN survey_template st on st.survey_template_id = sa.survey_template_id
    WHERE 
      sa.dropped_status = 0 AND
      sa.submitted_status = 1 AND
      st.survey_type = 2 AND
      DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')  
      AND i.never_run_iteration = 0
  `
  // console.log(query1)
  db.query(
    query1, 
    [],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo Generate data for 360 cohort
export const generate360DataM = (id, result) => { 
  let query1 = `
    SELECT
    r1.survey_assignment_id, 
    r1.relationship_id, 
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,  

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  


    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,
    
    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.survey_assignment_id, r1.relationship_id, r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION

  SELECT 
    r1.survey_assignment_id, 
    996,
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    
    
    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  


    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.relationship_id IN (2,3) AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION


  SELECT
    r1.survey_assignment_id,
    997,
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  
    
    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.relationship_id IN (4,5) AND
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION


  SELECT
    r1.survey_assignment_id, 
    998,
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.relationship_id IN (2,3,4,5) AND
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION

  SELECT
    r1.survey_assignment_id, 
    999, 
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.is_nomination = 1 AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION

  SELECT 
    r1.survey_assignment_id, 
    1000, 
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6, 
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,   

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION

  SELECT
    0, 
    r1.relationship_id, 
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id,  r1.relationship_id

  UNION

  SELECT
    0, 
    996, 
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.relationship_id IN (2, 3) AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION

  SELECT
    0, 
    997, 
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

  r1.org_id,
  r1.suborg_id,
  r1.program_id,
  r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.relationship_id IN (4, 5) AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION

  SELECT
    0, 
    998, 
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    

    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.relationship_id IN (2, 3, 4, 5) AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION 

  SELECT
    0,
    999,
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    
    
    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.is_nomination = 1 AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

  UNION

  SELECT
    0,
    1000, 
    COUNT(*) AS N,

    AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
    AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
    AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
    AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
    AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
    AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
    AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

    AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
    AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
    AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
    AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
    AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
    AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
    AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

    AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
    AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
    AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
    AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
    AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
    AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
    AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

    AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
    AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
    AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
    AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
    AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
    AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
    AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

    AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
    AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
    AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
    AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
    AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
    AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
    AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

    AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
    AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
    AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
    AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
    AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
    AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
    AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

    AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
    AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
    AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
    AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
    AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
    AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII10, 0)) AS avg_CII0,
    AVG(NULLIF(r1.CII11, 0)) AS avg_CII1,
    AVG(NULLIF(r1.CII12, 0)) AS avg_CII2,
    AVG(NULLIF(r1.CII13, 0)) AS avg_CII3,
    AVG(NULLIF(r1.CII14, 0)) AS avg_CII4,
    AVG(NULLIF(r1.CII15, 0)) AS avg_CII5,
    AVG(NULLIF(r1.CII16, 0)) AS avg_CII6,
    AVG(NULLIF(r1.CII17, 0)) AS avg_CII7,
    AVG(NULLIF(r1.CII18, 0)) AS avg_CII8,
    AVG(NULLIF(r1.CII19, 0)) AS avg_CII9,
    AVG(NULLIF(r1.CII20, 0)) AS avg_CI20,    
    
    AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
    AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
    AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
    AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
    AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
    AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
    AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

    AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
    AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
    AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
    AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
    AVG(NULLIF(r1.CX, 0)) AS avg_CX,

    AVG(NULLIF(r1.SA, 0)) AS avg_SA,
    AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
    AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
    AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
    AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
    AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
    AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
    AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

    AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
    AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
    AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
    AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
    AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
    AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

    AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
    AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
    AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
    AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
    AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
    AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
    AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

    AVG(NULLIF(r1.EI, 0)) AS avg_EI,
    AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
    AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
    AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
    AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
    AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
    AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

    AVG(NULLIF(r1.GP, 0)) AS avg_GP,
    AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
    AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
    AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
    AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
    AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

    AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
    AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
    AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
    AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
    AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

    AVG(NULLIF(r1.LA, 0)) AS avg_LA,
    AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
    AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
    AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
    AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
    AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

    AVG(NULLIF(r1.CE, 0)) AS avg_CE,
    AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
    AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
    AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
    AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
    AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

    AVG(NULLIF(r1.LC, 0)) AS avg_LC,
    AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
    AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
    AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
    AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
    AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
    AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

    AVG(NULLIF(r1.LS, 0)) AS avg_LS,
    AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
    AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
    AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
    AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
    AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

    AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
    AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
    AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
    AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
    AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

    AVG(NULLIF(r1.LO, 0)) AS avg_LO,
    AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
    AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
    AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
    AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
    AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
    AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

    AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
    AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
    AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
    AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
    AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
    AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
    AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

    AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
    AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
    AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
    AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
    AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
    AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
    AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

    AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
    AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
    AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
    AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
    AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
    AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
    AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
    AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
    AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
    AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
    AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

    AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
    AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
    AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
    AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
    AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
    AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
    AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
    AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
    AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
    AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

    AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
    AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
    AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
    AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
    AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
    AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
    AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
    AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
    AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

    AVG(NULLIF(r1.HH, 0)) AS avg_HH,
    AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
    AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
    AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
    AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
    AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

    AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
    AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
    AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
    AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
    AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
    AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
    AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

    AVG(NULLIF(r1.RI, 0)) AS avg_RI,
    AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
    AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
    AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
    AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

    AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
    AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
    AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
    AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
    AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
    AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

    AVG(NULLIF(r1.TW, 0)) AS avg_TW,
    AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
    AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
    AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
    AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
    AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
    AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

    AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
    AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
    AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
    AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
    AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

    AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
    AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
    AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
    AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
    AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
    AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
    AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

    AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
    AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
    AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
    AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
    AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
    AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
    AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

  FROM r360_raw r1
  LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
  LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
  WHERE 
    r1.is_processed = 0 AND 
    r1.relationship_id IN (0, 1, 2, 3, 4, 5) AND 
    DATE_FORMAT(i.${id}, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
  GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id
  `;
  // console.log(query1);
  db.query(query1, 
  [], (err, results) => {
    if (err) {
      // console.log(err);
      result(err, null);
    } else {
      // console.log(results);
      result(null, results);
    }
  });
}
//todo Insert 360 Cohort Data
export const insert360CohortM = (data, result) => {
  let query1 = `
    INSERT INTO r360_cohort 
      (
        survey_assignment_id, relationship_id, relationship_name, n, 
        KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6, 
        DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6, 
        CP, CP1, CP2, CP3, CP4, CP5, CP6, 
        SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6, 
        LIC, LIC1, LIC2, LIC3, LIC4, LIC5, LIC6, 
        LDF, LDF1, LDF2, LDF3, LDF4, LDF5, LDF6, 
        CII1, CII2, CII3, CII4, CII5, CII6, CII7, CII8, CII8, CII10, CII11, CII12, CII13, CII14, CII15, CII16, CII17, CII18, CII19, CII20,  
        EUSO, EUSO1, EUSO2, EUSO3, EUSO4, EUSO5, EUSO6, 
        ERX, EX, OX, AX, CX, 
        SA, SA1, SA2, SA3, SA4, SA5, SA6, SA7,
        ISR, ISR1, ISR2, ISR3, ISR4, ISR5,
        OAW, OAW1, OAW2, OAW3, OAW4, OAW5, OAW6,
        EI, EI1, EI2, EI3, EI4, EI5, EI6,
        GP, GP1, GP2, GP3, GP4, GP5,
        CLD, CLD1, CLD2, CLD3, CLD4,
        LA, LA1, LA2, LA3, LA4, LA5,
        CE, CE1, CE2, CE3, CE4, CE5,
        LC, LC1, LC2, LC3, LC4, LC5, LC6,
        LS, LS1, LS2, LS3, LS4, LS5,
        LTO, LTO1, LTO2, LTO3, LTO4,
        LO, LO1, LO2, LO3, LO4, LO5, LO6,
        AEI, AEI1, AEI2, AEI3, AEI4, AEI5, AEI6,
        LOC, LOC1, LOC2, LOC3, LOC4, LOC5, LOC6,
        NPS, NPS1, NPS2, NPS3, NPS4, NPS5, NPS6, NPS7, NPS8, NPS9, NPS10,
        BTC, BTC1, BTC2, BTC3, BTC4, BTC5, BTC6, BTC7, BTC8, BTC9,
        CPT, CPT1, CPT2, CPT3, CPT4, CPT5, CPT6, CPT7, CPT8,
        HH, HH1, HH2, HH3, HH4, HH5,
        BGIW, BGIW1, BGIW2, BGIW3, BGIW4, BGIW5, BGIW6,
        RI, RI1, RI2, RI3, RI4,
        ATR, ATR1, ATR2, ATR3, ATR4, ATR5,
        TW, TW1, TW2, TW3, TW4, TW5, TW6,
        TIO, TIO1, TIO2, TIO3, TIO4,
        RSH, RSH1, RSH2, RSH3, RSH4, RSH5, RSH6,
        WEI, WEI1, WEI2, WEI3, WEI4, WEI5, WEI6,
        org_id, suborg_id, program_id, iteration_id
      )
    VALUES
  `
  let ctr = data.length
  // console.log('R360 Cohort InsertM ctr length: '+ ctr )
  // console.log(data[0]['survey_assignment_id'])

  for(let i = 0; i < ctr; i++) {
    let rel_name
    switch (data[i]['relationship_id']) {
      case 0:
        rel_name = "Self"
        break;
      case 1:
        rel_name = "My primary supervisor"
        break;
      case 2:
        rel_name = "A peer"
        break;
      case 3:
        rel_name = "My direct report"
        break;
      case 4:
        rel_name = "An other internal stakeholder"
        break;
      case 5:
        rel_name = "An external stakeholder"
        break;
      case 996:
        rel_name = "PD"
        break;      
      case 997:
        rel_name = "IE"
      break;      
      case 998:
        rel_name = "PDIE"
        break;      
      case 999:
        rel_name = "All Nominees"
        break;      
      case 1000:
        rel_name = "All"
    }

    query1 += `
      (
        ( ${data[i]['survey_assignment_id']} ),
        ( ${data[i]['relationship_id']} ),
        ('${rel_name}' ),
        ( ${data[i]['N']} ),

        ( ${data[i]['avg_KDY']} ),
        ( ${data[i]['avg_KDY1']} ),
        ( ${data[i]['avg_KDY2']} ),
        ( ${data[i]['avg_KDY3']} ),
        ( ${data[i]['avg_KDY4']} ),
        ( ${data[i]['avg_KDY5']} ),
        ( ${data[i]['avg_KDY6']} ),

        ( ${data[i]['avg_DTO']} ),
        ( ${data[i]['avg_DTO1']} ),
        ( ${data[i]['avg_DTO2']} ),
        ( ${data[i]['avg_DTO3']} ),
        ( ${data[i]['avg_DTO4']} ),
        ( ${data[i]['avg_DTO5']} ),
        ( ${data[i]['avg_DTO6']} ),

        ( ${data[i]['avg_CP']} ),
        ( ${data[i]['avg_CP1']} ),
        ( ${data[i]['avg_CP2']} ),
        ( ${data[i]['avg_CP3']} ),
        ( ${data[i]['avg_CP4']} ),
        ( ${data[i]['avg_CP5']} ),
        ( ${data[i]['avg_CP6']} ),
        
        ( ${data[i]['avg_SCP']} ),
        ( ${data[i]['avg_SCP1']} ),
        ( ${data[i]['avg_SCP2']} ),
        ( ${data[i]['avg_SCP3']} ),
        ( ${data[i]['avg_SCP4']} ),
        ( ${data[i]['avg_SCP5']} ),
        ( ${data[i]['avg_SCP6']} ),

        ( ${data[i]['avg_LIC']} ),
        ( ${data[i]['avg_LIC1']} ),
        ( ${data[i]['avg_LIC2']} ),
        ( ${data[i]['avg_LIC3']} ),
        ( ${data[i]['avg_LIC4']} ),
        ( ${data[i]['avg_LIC5']} ),
        ( ${data[i]['avg_LIC6']} ),

        ( ${data[i]['avg_LDF']} ),
        ( ${data[i]['avg_LDF1']} ),
        ( ${data[i]['avg_LDF2']} ),
        ( ${data[i]['avg_LDF3']} ),
        ( ${data[i]['avg_LDF4']} ),
        ( ${data[i]['avg_LDF5']} ),
        ( ${data[i]['avg_LDF6']} ),

        ( ${data[i]['avg_CII1']} ),
        ( ${data[i]['avg_CII2']} ),
        ( ${data[i]['avg_CII3']} ),
        ( ${data[i]['avg_CII4']} ),
        ( ${data[i]['avg_CII5']} ),
        ( ${data[i]['avg_CII6']} ),
        ( ${data[i]['avg_CII7']} ),
        ( ${data[i]['avg_CII8']} ),
        ( ${data[i]['avg_CII9']} ),
        ( ${data[i]['avg_CII10']} ),
        ( ${data[i]['avg_CII11']} ),
        ( ${data[i]['avg_CII12']} ),
        ( ${data[i]['avg_CII13']} ),
        ( ${data[i]['avg_CII14']} ),
        ( ${data[i]['avg_CII15']} ),
        ( ${data[i]['avg_CII16']} ),
        ( ${data[i]['avg_CII17']} ),
        ( ${data[i]['avg_CII18']} ),
        ( ${data[i]['avg_CII19']} ),
        ( ${data[i]['avg_CII20']} ),

        ( ${data[i]['avg_EUSO']} ),
        ( ${data[i]['avg_EUSO1']} ),
        ( ${data[i]['avg_EUSO2']} ),
        ( ${data[i]['avg_EUSO3']} ),
        ( ${data[i]['avg_EUSO4']} ),
        ( ${data[i]['avg_EUSO5']} ),
        ( ${data[i]['avg_EUSO6']} ),
        
        ( ${data[i]['avg_ERX']} ),
        ( ${data[i]['avg_EX']} ),
        ( ${data[i]['avg_OX']} ),
        ( ${data[i]['avg_AX']} ),
        ( ${data[i]['avg_CX']} ),

        ( ${data[i]['avg_SA']} ),
        ( ${data[i]['avg_SA1']} ),
        ( ${data[i]['avg_SA2']} ),
        ( ${data[i]['avg_SA3']} ),
        ( ${data[i]['avg_SA4']} ),
        ( ${data[i]['avg_SA5']} ),
        ( ${data[i]['avg_SA6']} ),
        ( ${data[i]['avg_SA7']} ),
  
        ( ${data[i]['avg_ISR']} ),
        ( ${data[i]['avg_ISR1']} ),
        ( ${data[i]['avg_ISR2']} ),
        ( ${data[i]['avg_ISR3']} ),
        ( ${data[i]['avg_ISR4']} ),
        ( ${data[i]['avg_ISR5']} ),
  
        ( ${data[i]['avg_OAW']} ),
        ( ${data[i]['avg_OAW1']} ),
        ( ${data[i]['avg_OAW2']} ),
        ( ${data[i]['avg_OAW3']} ),
        ( ${data[i]['avg_OAW4']} ),
        ( ${data[i]['avg_OAW5']} ),
        ( ${data[i]['avg_OAW6']} ),
  
        ( ${data[i]['avg_EI']} ),
        ( ${data[i]['avg_EI1']} ),
        ( ${data[i]['avg_EI2']} ),
        ( ${data[i]['avg_EI3']} ),
        ( ${data[i]['avg_EI4']} ),
        ( ${data[i]['avg_EI5']} ),
        ( ${data[i]['avg_EI6']} ),
  
        ( ${data[i]['avg_GP']} ),
        ( ${data[i]['avg_GP1']} ),
        ( ${data[i]['avg_GP2']} ),
        ( ${data[i]['avg_GP3']} ),
        ( ${data[i]['avg_GP4']} ),
        ( ${data[i]['avg_GP5']} ),
  
        ( ${data[i]['avg_CLD']} ),
        ( ${data[i]['avg_CLD1']} ),
        ( ${data[i]['avg_CLD2']} ),
        ( ${data[i]['avg_CLD3']} ),
        ( ${data[i]['avg_CLD4']} ),
  
        ( ${data[i]['avg_LA']} ),
        ( ${data[i]['avg_LA1']} ),
        ( ${data[i]['avg_LA2']} ),
        ( ${data[i]['avg_LA3']} ),
        ( ${data[i]['avg_LA4']} ),
        ( ${data[i]['avg_LA5']} ),
  
        ( ${data[i]['avg_CE']} ),
        ( ${data[i]['avg_CE1']} ),
        ( ${data[i]['avg_CE2']} ),
        ( ${data[i]['avg_CE3']} ),
        ( ${data[i]['avg_CE4']} ),
        ( ${data[i]['avg_CE5']} ),
  
        ( ${data[i]['avg_LC']} ),
        ( ${data[i]['avg_LC1']} ),
        ( ${data[i]['avg_LC2']} ),
        ( ${data[i]['avg_LC3']} ),
        ( ${data[i]['avg_LC4']} ),
        ( ${data[i]['avg_LC5']} ),
        ( ${data[i]['avg_LC6']} ),
  
        ( ${data[i]['avg_LS']} ),
        ( ${data[i]['avg_LS1']} ),
        ( ${data[i]['avg_LS2']} ),
        ( ${data[i]['avg_LS3']} ),
        ( ${data[i]['avg_LS4']} ),
        ( ${data[i]['avg_LS5']} ),
  
        ( ${data[i]['avg_LTO']} ),
        ( ${data[i]['avg_LTO1']} ),
        ( ${data[i]['avg_LTO2']} ),
        ( ${data[i]['avg_LTO3']} ),
        ( ${data[i]['avg_LTO4']} ),
  
        ( ${data[i]['avg_LO']} ),
        ( ${data[i]['avg_LO1']} ),
        ( ${data[i]['avg_LO2']} ),
        ( ${data[i]['avg_LO3']} ),
        ( ${data[i]['avg_LO4']} ),
        ( ${data[i]['avg_LO5']} ),
        ( ${data[i]['avg_LO6']} ),

        ( ${data[i]['avg_AEI']} ),
        ( ${data[i]['avg_AEI1']} ),
        ( ${data[i]['avg_AEI2']} ),
        ( ${data[i]['avg_AEI3']} ),
        ( ${data[i]['avg_AEI4']} ),
        ( ${data[i]['avg_AEI5']} ),
        ( ${data[i]['avg_AEI6']} ),

        ( ${data[i]['avg_LOC']} ),
        ( ${data[i]['avg_LOC1']} ),
        ( ${data[i]['avg_LOC2']} ),
        ( ${data[i]['avg_LOC3']} ),
        ( ${data[i]['avg_LOC4']} ),
        ( ${data[i]['avg_LOC5']} ),
        ( ${data[i]['avg_LOC6']} ),

        ( ${data[i]['avg_NPS']} ),
        ( ${data[i]['avg_NPS1']} ),
        ( ${data[i]['avg_NPS2']} ),
        ( ${data[i]['avg_NPS3']} ),
        ( ${data[i]['avg_NPS4']} ),
        ( ${data[i]['avg_NPS5']} ),
        ( ${data[i]['avg_NPS6']} ),
        ( ${data[i]['avg_NPS7']} ),
        ( ${data[i]['avg_NPS8']} ),
        ( ${data[i]['avg_NPS9']} ),
        ( ${data[i]['avg_NPS10']} ),

        ( ${data[i]['avg_BTC']} ),
        ( ${data[i]['avg_BTC1']} ),
        ( ${data[i]['avg_BTC2']} ),
        ( ${data[i]['avg_BTC3']} ),
        ( ${data[i]['avg_BTC4']} ),
        ( ${data[i]['avg_BTC5']} ),
        ( ${data[i]['avg_BTC6']} ),
        ( ${data[i]['avg_BTC7']} ),
        ( ${data[i]['avg_BTC8']} ),
        ( ${data[i]['avg_BTC9']} ),

        ( ${data[i]['avg_CPT']} ),
        ( ${data[i]['avg_CPT1']} ),
        ( ${data[i]['avg_CPT2']} ),
        ( ${data[i]['avg_CPT3']} ),
        ( ${data[i]['avg_CPT4']} ),
        ( ${data[i]['avg_CPT5']} ),
        ( ${data[i]['avg_CPT6']} ),
        ( ${data[i]['avg_CPT7']} ),
        ( ${data[i]['avg_CPT8']} ),

        ( ${data[i]['avg_HH']} ),
        ( ${data[i]['avg_HH1']} ),
        ( ${data[i]['avg_HH2']} ),
        ( ${data[i]['avg_HH3']} ),
        ( ${data[i]['avg_HH4']} ),
        ( ${data[i]['avg_HH5']} ),

        ( ${data[i]['avg_BGIW']} ),
        ( ${data[i]['avg_BGIW1']} ),
        ( ${data[i]['avg_BGIW2']} ),
        ( ${data[i]['avg_BGIW3']} ),
        ( ${data[i]['avg_BGIW4']} ),
        ( ${data[i]['avg_BGIW5']} ),
        ( ${data[i]['avg_BGIW6']} ),

        ( ${data[i]['avg_RI']} ),
        ( ${data[i]['avg_RI1']} ),
        ( ${data[i]['avg_RI2']} ),
        ( ${data[i]['avg_RI3']} ),
        ( ${data[i]['avg_RI4']} ),

        ( ${data[i]['avg_ATR']} ),
        ( ${data[i]['avg_ATR1']} ),
        ( ${data[i]['avg_ATR2']} ),
        ( ${data[i]['avg_ATR3']} ),
        ( ${data[i]['avg_ATR4']} ),
        ( ${data[i]['avg_ATR5']} ),

        ( ${data[i]['avg_TW']} ),
        ( ${data[i]['avg_TW1']} ),
        ( ${data[i]['avg_TW2']} ),
        ( ${data[i]['avg_TW3']} ),
        ( ${data[i]['avg_TW4']} ),
        ( ${data[i]['avg_TW5']} ),
        ( ${data[i]['avg_TW6']} ),

        ( ${data[i]['avg_TIO']} ),
        ( ${data[i]['avg_TIO1']} ),
        ( ${data[i]['avg_TIO2']} ),
        ( ${data[i]['avg_TIO3']} ),
        ( ${data[i]['avg_TIO4']} ),

        ( ${data[i]['avg_RSH']} ),
        ( ${data[i]['avg_RSH1']} ),
        ( ${data[i]['avg_RSH2']} ),
        ( ${data[i]['avg_RSH3']} ),
        ( ${data[i]['avg_RSH4']} ),
        ( ${data[i]['avg_RSH5']} ),
        ( ${data[i]['avg_RSH6']} ),

        ( ${data[i]['avg_WEI']} ),
        ( ${data[i]['avg_WEI1']} ),
        ( ${data[i]['avg_WEI2']} ),
        ( ${data[i]['avg_WEI3']} ),
        ( ${data[i]['avg_WEI4']} ),
        ( ${data[i]['avg_WEI5']} ),
        ( ${data[i]['avg_WEI6']} ),

        ( ${data[i]['org_id']} ),
        ( ${data[i]['suborg_id']} ),
        ( ${data[i]['program_id']} ),
        ( ${data[i]['iteration_id']} )
      )
    `

    if ( (i + 1) == ctr ){
      query1 += `;`
      // console.log(query1)
      db.query(
        query1,
        [],
        (err, results) => {
          if (err) {
            console.log(err)
            result(err, null)
          } else {
            let query2 = `UPDATE 
                            r360_raw r1
                          LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
                          LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
                          SET is_processed = 1  
                          WHERE 
                            is_processed = 0 AND
                            DATE_FORMAT(i.final_deadline_date, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
                        `
            db.query(
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  // result(err, null)
                } else {
                  console.log(results)
                  // result(null, results)
                }
              }
            )
            result(null, results)
          }
        }
      )
    }
    else{
      query1 += `,`
    }
  }
}


//todo FORCE Delete 350 Cohort by iteration_id
export const forceDelete360CohortM = (id, result) => {
  let query1 = `
    DELETE rc
    FROM r360_cohort rc
      JOIN iteration i 
      ON i.iteration_id = rc.iteration_id
      AND i.suborg_id = rc.suborg_id
      AND i.program_id = rc.program_id
      AND i.iteration_id = rc.iteration_id
    WHERE
      i.iteration_id = ?
      AND i.never_run_iteration = 0
  `
  // console.log(query1)
  db.query(
    query1,
    [id],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo FORCE Set is_processed to 0 by iteration_id
export const forceUpdateIsProcessedM = (id, result) => {
  let query1 = `
    UPDATE r360_raw r
    LEFT JOIN iteration i
      ON i.suborg_id = r.suborg_id
      AND i.program_id = r.program_id
      AND i.iteration_id = r.iteration_id
    SET is_processed = 0
    WHERE r.iteration_id = ?
    AND i.never_run_iteration = 0
  `
  // console.log(query1)
  db.query(
    query1,
    [id],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}
//todo FORCE Get 350 list by iteration by iteration_id
export const forceGet360IterationListM = (id, result) => {
  let query1 = `
    SELECT 
      sa.survey_assignment_id,
      sa.org_id, 
      sa.suborg_id, 
      sa.program_id, 
      sa.iteration_id,
      i.iteration_name
    FROM survey_assignment sa 
    LEFT JOIN iteration i ON i.iteration_id = sa.iteration_id
    LEFT JOIN survey_template st ON st.survey_template_id = sa.survey_template_id
    WHERE 
      sa.dropped_status = 0 AND 
      sa.submitted_status = 1 AND 
      st.survey_type = 2 AND
      sa.iteration_id = ?
      AND i.never_run_iteration = 0
  `
  // console.log(query1)
  db.query(
    query1, 
    [id],
    (err, results) => {
      if (err) {
        result(err, null)
        // console.log(err)
      } else {
        result(null, results)
        // console.log(results)
      }
    }
  )
}
//todo FORCE Generate data for 360 cohort by iteration_id
export const forceGenerate360DataM = (id, result) => {
  let query1 = `
    SELECT
      r1.survey_assignment_id, 
      r1.relationship_id, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  


      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id, r1.relationship_id, r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT 
      r1.survey_assignment_id, 
      996,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  


      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (2,3) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id,
      997,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  
      
      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (4,5) AND
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id, 
      998,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (2,3,4,5) AND
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id, 
      999, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.is_nomination = 1 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT 
      r1.survey_assignment_id, 
      1000, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      0, 
      r1.relationship_id, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id,  r1.relationship_id

    UNION

    SELECT
      0, 
      996, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (2, 3) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      0, 
      997, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (4, 5) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      0, 
      998, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (2, 3, 4, 5) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION 

    SELECT
      0,
      999,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.is_nomination = 1 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      0,
      1000, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (0, 1, 2, 3, 4, 5) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id
  `;
  // console.log(query1);
  db.query(
    query1, 
    [id],
    (err, results) => {
      if (err) {
        // console.log(err);
        result(err, null);
      } else {
        // console.log(results);
        result(null, results);
      }
    }
  );
};
//todo FORCE Insert 360 Cohort Data
export const forceInsert360CohortM = (data, result) => {
  let query1 = `
    INSERT INTO r360_cohort 
      (
        survey_assignment_id, relationship_id, relationship_name, n, 
        KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6, 
        DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6, 
        CP, CP1, CP2, CP3, CP4, CP5, CP6, 
        SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6, 
        LIC, LIC1, LIC2, LIC3, LIC4, LIC5, LIC6, 
        LDF, LDF1, LDF2, LDF3, LDF4, LDF5, LDF6, 
        CII1, CII2, CII3, CII4, CII5, CII6, CII7, CII8, CII9, CII10, CII11, CII12, CII13, CII14, CII15, CII16, CII17, CII18, CII19, CII20, 
        EUSO, EUSO1, EUSO2, EUSO3, EUSO4, EUSO5, EUSO6, 
        ERX, EX, OX, AX, CX, 
        SA, SA1, SA2, SA3, SA4, SA5, SA6, SA7,
        ISR, ISR1, ISR2, ISR3, ISR4, ISR5,
        OAW, OAW1, OAW2, OAW3, OAW4, OAW5, OAW6,
        EI, EI1, EI2, EI3, EI4, EI5, EI6,
        GP, GP1, GP2, GP3, GP4, GP5,
        CLD, CLD1, CLD2, CLD3, CLD4,
        LA, LA1, LA2, LA3, LA4, LA5,
        CE, CE1, CE2, CE3, CE4, CE5,
        LC, LC1, LC2, LC3, LC4, LC5, LC6,
        LS, LS1, LS2, LS3, LS4, LS5,
        LTO, LTO1, LTO2, LTO3, LTO4,
        LO, LO1, LO2, LO3, LO4, LO5, LO6,
        AEI, AEI1, AEI2, AEI3, AEI4, AEI5, AEI6,
        LOC, LOC1, LOC2, LOC3, LOC4, LOC5, LOC6,
        NPS, NPS1, NPS2, NPS3, NPS4, NPS5, NPS6, NPS7, NPS8, NPS9, NPS10,
        BTC, BTC1, BTC2, BTC3, BTC4, BTC5, BTC6, BTC7, BTC8, BTC9,
        CPT, CPT1, CPT2, CPT3, CPT4, CPT5, CPT6, CPT7, CPT8,
        HH, HH1, HH2, HH3, HH4, HH5,
        BGIW, BGIW1, BGIW2, BGIW3, BGIW4, BGIW5, BGIW6,
        RI, RI1, RI2, RI3, RI4,
        ATR, ATR1, ATR2, ATR3, ATR4, ATR5,
        TW, TW1, TW2, TW3, TW4, TW5, TW6,
        TIO, TIO1, TIO2, TIO3, TIO4,
        RSH, RSH1, RSH2, RSH3, RSH4, RSH5, RSH6,
        WEI, WEI1, WEI2, WEI3, WEI4, WEI5, WEI6,
        org_id, suborg_id, program_id, iteration_id
      )
    VALUES
  `
  let ctr = data.length
  // console.log('R360 Cohort InsertM ctr length: '+ ctr )
  // console.log(data[0]['survey_assignment_id'])

  for(let i = 0; i < ctr; i++) {
    let rel_name
    switch (data[i]['relationship_id']) {
      case 0:
        rel_name = "Self"
        break;
      case 1:
        rel_name = "My primary supervisor"
        break;
      case 2:
        rel_name = "A peer"
        break;
      case 3:
        rel_name = "My direct report"
        break;
      case 4:
        rel_name = "An other internal stakeholder"
        break;
      case 5:
        rel_name = "An external stakeholder"
        break;
      case 996:
        rel_name = "PD"
        break;      
      case 997:
        rel_name = "IE"
      break;      
      case 998:
        rel_name = "PDIE"
        break;      
      case 999:
        rel_name = "All Nominees"
        break;      
      case 1000:
        rel_name = "All"
    }

    query1 += `
      (
        ( ${data[i]['survey_assignment_id']} ),
        ( ${data[i]['relationship_id']} ),
        ('${rel_name}' ),
        ( ${data[i]['N']} ),

        ( ${data[i]['avg_KDY']} ),
        ( ${data[i]['avg_KDY1']} ),
        ( ${data[i]['avg_KDY2']} ),
        ( ${data[i]['avg_KDY3']} ),
        ( ${data[i]['avg_KDY4']} ),
        ( ${data[i]['avg_KDY5']} ),
        ( ${data[i]['avg_KDY6']} ),

        ( ${data[i]['avg_DTO']} ),
        ( ${data[i]['avg_DTO1']} ),
        ( ${data[i]['avg_DTO2']} ),
        ( ${data[i]['avg_DTO3']} ),
        ( ${data[i]['avg_DTO4']} ),
        ( ${data[i]['avg_DTO5']} ),
        ( ${data[i]['avg_DTO6']} ),

        ( ${data[i]['avg_CP']} ),
        ( ${data[i]['avg_CP1']} ),
        ( ${data[i]['avg_CP2']} ),
        ( ${data[i]['avg_CP3']} ),
        ( ${data[i]['avg_CP4']} ),
        ( ${data[i]['avg_CP5']} ),
        ( ${data[i]['avg_CP6']} ),
        
        ( ${data[i]['avg_SCP']} ),
        ( ${data[i]['avg_SCP1']} ),
        ( ${data[i]['avg_SCP2']} ),
        ( ${data[i]['avg_SCP3']} ),
        ( ${data[i]['avg_SCP4']} ),
        ( ${data[i]['avg_SCP5']} ),
        ( ${data[i]['avg_SCP6']} ),

        ( ${data[i]['avg_LIC']} ),
        ( ${data[i]['avg_LIC1']} ),
        ( ${data[i]['avg_LIC2']} ),
        ( ${data[i]['avg_LIC3']} ),
        ( ${data[i]['avg_LIC4']} ),
        ( ${data[i]['avg_LIC5']} ),
        ( ${data[i]['avg_LIC6']} ),

        ( ${data[i]['avg_LDF']} ),
        ( ${data[i]['avg_LDF1']} ),
        ( ${data[i]['avg_LDF2']} ),
        ( ${data[i]['avg_LDF3']} ),
        ( ${data[i]['avg_LDF4']} ),
        ( ${data[i]['avg_LDF5']} ),
        ( ${data[i]['avg_LDF6']} ),

        ( ${data[i]['avg_CII1']} ),
        ( ${data[i]['avg_CII2']} ),
        ( ${data[i]['avg_CII3']} ),
        ( ${data[i]['avg_CII4']} ),
        ( ${data[i]['avg_CII5']} ),
        ( ${data[i]['avg_CII6']} ),
        ( ${data[i]['avg_CII7']} ),
        ( ${data[i]['avg_CII8']} ),
        ( ${data[i]['avg_CII9']} ),
        ( ${data[i]['avg_CII10']} ),
        ( ${data[i]['avg_CII11']} ),
        ( ${data[i]['avg_CII12']} ),
        ( ${data[i]['avg_CII13']} ),
        ( ${data[i]['avg_CII14']} ),
        ( ${data[i]['avg_CII15']} ),
        ( ${data[i]['avg_CII16']} ),
        ( ${data[i]['avg_CII17']} ),
        ( ${data[i]['avg_CII18']} ),
        ( ${data[i]['avg_CII19']} ),
        ( ${data[i]['avg_CII20']} ),

        ( ${data[i]['avg_EUSO']} ),
        ( ${data[i]['avg_EUSO1']} ),
        ( ${data[i]['avg_EUSO2']} ),
        ( ${data[i]['avg_EUSO3']} ),
        ( ${data[i]['avg_EUSO4']} ),
        ( ${data[i]['avg_EUSO5']} ),
        ( ${data[i]['avg_EUSO6']} ),
        
        ( ${data[i]['avg_ERX']} ),
        ( ${data[i]['avg_EX']} ),
        ( ${data[i]['avg_OX']} ),
        ( ${data[i]['avg_AX']} ),
        ( ${data[i]['avg_CX']} ),

        ( ${data[i]['avg_SA']} ),
        ( ${data[i]['avg_SA1']} ),
        ( ${data[i]['avg_SA2']} ),
        ( ${data[i]['avg_SA3']} ),
        ( ${data[i]['avg_SA4']} ),
        ( ${data[i]['avg_SA5']} ),
        ( ${data[i]['avg_SA6']} ),
        ( ${data[i]['avg_SA7']} ),
  
        ( ${data[i]['avg_ISR']} ),
        ( ${data[i]['avg_ISR1']} ),
        ( ${data[i]['avg_ISR2']} ),
        ( ${data[i]['avg_ISR3']} ),
        ( ${data[i]['avg_ISR4']} ),
        ( ${data[i]['avg_ISR5']} ),
  
        ( ${data[i]['avg_OAW']} ),
        ( ${data[i]['avg_OAW1']} ),
        ( ${data[i]['avg_OAW2']} ),
        ( ${data[i]['avg_OAW3']} ),
        ( ${data[i]['avg_OAW4']} ),
        ( ${data[i]['avg_OAW5']} ),
        ( ${data[i]['avg_OAW6']} ),
  
        ( ${data[i]['avg_EI']} ),
        ( ${data[i]['avg_EI1']} ),
        ( ${data[i]['avg_EI2']} ),
        ( ${data[i]['avg_EI3']} ),
        ( ${data[i]['avg_EI4']} ),
        ( ${data[i]['avg_EI5']} ),
        ( ${data[i]['avg_EI6']} ),
  
        ( ${data[i]['avg_GP']} ),
        ( ${data[i]['avg_GP1']} ),
        ( ${data[i]['avg_GP2']} ),
        ( ${data[i]['avg_GP3']} ),
        ( ${data[i]['avg_GP4']} ),
        ( ${data[i]['avg_GP5']} ),
  
        ( ${data[i]['avg_CLD']} ),
        ( ${data[i]['avg_CLD1']} ),
        ( ${data[i]['avg_CLD2']} ),
        ( ${data[i]['avg_CLD3']} ),
        ( ${data[i]['avg_CLD4']} ),
  
        ( ${data[i]['avg_LA']} ),
        ( ${data[i]['avg_LA1']} ),
        ( ${data[i]['avg_LA2']} ),
        ( ${data[i]['avg_LA3']} ),
        ( ${data[i]['avg_LA4']} ),
        ( ${data[i]['avg_LA5']} ),
  
        ( ${data[i]['avg_CE']} ),
        ( ${data[i]['avg_CE1']} ),
        ( ${data[i]['avg_CE2']} ),
        ( ${data[i]['avg_CE3']} ),
        ( ${data[i]['avg_CE4']} ),
        ( ${data[i]['avg_CE5']} ),
  
        ( ${data[i]['avg_LC']} ),
        ( ${data[i]['avg_LC1']} ),
        ( ${data[i]['avg_LC2']} ),
        ( ${data[i]['avg_LC3']} ),
        ( ${data[i]['avg_LC4']} ),
        ( ${data[i]['avg_LC5']} ),
        ( ${data[i]['avg_LC6']} ),
  
        ( ${data[i]['avg_LS']} ),
        ( ${data[i]['avg_LS1']} ),
        ( ${data[i]['avg_LS2']} ),
        ( ${data[i]['avg_LS3']} ),
        ( ${data[i]['avg_LS4']} ),
        ( ${data[i]['avg_LS5']} ),
  
        ( ${data[i]['avg_LTO']} ),
        ( ${data[i]['avg_LTO1']} ),
        ( ${data[i]['avg_LTO2']} ),
        ( ${data[i]['avg_LTO3']} ),
        ( ${data[i]['avg_LTO4']} ),
  
        ( ${data[i]['avg_LO']} ),
        ( ${data[i]['avg_LO1']} ),
        ( ${data[i]['avg_LO2']} ),
        ( ${data[i]['avg_LO3']} ),
        ( ${data[i]['avg_LO4']} ),
        ( ${data[i]['avg_LO5']} ),
        ( ${data[i]['avg_LO6']} ),

        ( ${data[i]['avg_AEI']} ),
        ( ${data[i]['avg_AEI1']} ),
        ( ${data[i]['avg_AEI2']} ),
        ( ${data[i]['avg_AEI3']} ),
        ( ${data[i]['avg_AEI4']} ),
        ( ${data[i]['avg_AEI5']} ),
        ( ${data[i]['avg_AEI6']} ),

        ( ${data[i]['avg_LOC']} ),
        ( ${data[i]['avg_LOC1']} ),
        ( ${data[i]['avg_LOC2']} ),
        ( ${data[i]['avg_LOC3']} ),
        ( ${data[i]['avg_LOC4']} ),
        ( ${data[i]['avg_LOC5']} ),
        ( ${data[i]['avg_LOC6']} ),

        ( ${data[i]['avg_NPS']} ),
        ( ${data[i]['avg_NPS1']} ),
        ( ${data[i]['avg_NPS2']} ),
        ( ${data[i]['avg_NPS3']} ),
        ( ${data[i]['avg_NPS4']} ),
        ( ${data[i]['avg_NPS5']} ),
        ( ${data[i]['avg_NPS6']} ),
        ( ${data[i]['avg_NPS7']} ),
        ( ${data[i]['avg_NPS8']} ),
        ( ${data[i]['avg_NPS9']} ),
        ( ${data[i]['avg_NPS10']} ),

        ( ${data[i]['avg_BTC']} ),
        ( ${data[i]['avg_BTC1']} ),
        ( ${data[i]['avg_BTC2']} ),
        ( ${data[i]['avg_BTC3']} ),
        ( ${data[i]['avg_BTC4']} ),
        ( ${data[i]['avg_BTC5']} ),
        ( ${data[i]['avg_BTC6']} ),
        ( ${data[i]['avg_BTC7']} ),
        ( ${data[i]['avg_BTC8']} ),
        ( ${data[i]['avg_BTC9']} ),

        ( ${data[i]['avg_CPT']} ),
        ( ${data[i]['avg_CPT1']} ),
        ( ${data[i]['avg_CPT2']} ),
        ( ${data[i]['avg_CPT3']} ),
        ( ${data[i]['avg_CPT4']} ),
        ( ${data[i]['avg_CPT5']} ),
        ( ${data[i]['avg_CPT6']} ),
        ( ${data[i]['avg_CPT7']} ),
        ( ${data[i]['avg_CPT8']} ),

        ( ${data[i]['avg_HH']} ),
        ( ${data[i]['avg_HH1']} ),
        ( ${data[i]['avg_HH2']} ),
        ( ${data[i]['avg_HH3']} ),
        ( ${data[i]['avg_HH4']} ),
        ( ${data[i]['avg_HH5']} ),

        ( ${data[i]['avg_BGIW']} ),
        ( ${data[i]['avg_BGIW1']} ),
        ( ${data[i]['avg_BGIW2']} ),
        ( ${data[i]['avg_BGIW3']} ),
        ( ${data[i]['avg_BGIW4']} ),
        ( ${data[i]['avg_BGIW5']} ),
        ( ${data[i]['avg_BGIW6']} ),

        ( ${data[i]['avg_RI']} ),
        ( ${data[i]['avg_RI1']} ),
        ( ${data[i]['avg_RI2']} ),
        ( ${data[i]['avg_RI3']} ),
        ( ${data[i]['avg_RI4']} ),

        ( ${data[i]['avg_ATR']} ),
        ( ${data[i]['avg_ATR1']} ),
        ( ${data[i]['avg_ATR2']} ),
        ( ${data[i]['avg_ATR3']} ),
        ( ${data[i]['avg_ATR4']} ),
        ( ${data[i]['avg_ATR5']} ),

        ( ${data[i]['avg_TW']} ),
        ( ${data[i]['avg_TW1']} ),
        ( ${data[i]['avg_TW2']} ),
        ( ${data[i]['avg_TW3']} ),
        ( ${data[i]['avg_TW4']} ),
        ( ${data[i]['avg_TW5']} ),
        ( ${data[i]['avg_TW6']} ),

        ( ${data[i]['avg_TIO']} ),
        ( ${data[i]['avg_TIO1']} ),
        ( ${data[i]['avg_TIO2']} ),
        ( ${data[i]['avg_TIO3']} ),
        ( ${data[i]['avg_TIO4']} ),

        ( ${data[i]['avg_RSH']} ),
        ( ${data[i]['avg_RSH1']} ),
        ( ${data[i]['avg_RSH2']} ),
        ( ${data[i]['avg_RSH3']} ),
        ( ${data[i]['avg_RSH4']} ),
        ( ${data[i]['avg_RSH5']} ),
        ( ${data[i]['avg_RSH6']} ),

        ( ${data[i]['avg_WEI']} ),
        ( ${data[i]['avg_WEI1']} ),
        ( ${data[i]['avg_WEI2']} ),
        ( ${data[i]['avg_WEI3']} ),
        ( ${data[i]['avg_WEI4']} ),
        ( ${data[i]['avg_WEI5']} ),
        ( ${data[i]['avg_WEI6']} ),

        ( ${data[i]['org_id']} ),
        ( ${data[i]['suborg_id']} ),
        ( ${data[i]['program_id']} ),
        ( ${data[i]['iteration_id']} )
      )
    `
    if ( (i + 1) == ctr ){
      query1 += `;`
      // console.log(query1)
      db.query(
        query1,
        [],
        (err, results) => {
          if (err) {
            console.log(err)
            result(err, null)
          } else {
            let query2 = `UPDATE 
                            r360_raw r1
                          LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
                          LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
                          SET is_processed = 1  
                          WHERE 
                            r1.is_processed = 0 AND
                            r1.iteration_id = ${data[i]['iteration_id']}
                        `
            db.query(
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  // result(err, null)
                } else {
                  console.log(results)
                  // result(null, results)
                }
              }
            )
            result(null, results)
          }
        }
      )
    }
    else{
      query1 += `,`
    }
  }
}



////2024-01-02 Calculate participant scores - generate participant data for cohort
export const CalculateParticipantSelectScoresM = (id, result) => {
    let query1 = `
            SELECT
      r1.survey_assignment_id,
      r1.relationship_id,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY,
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1,
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2,
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3,
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4,
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5,
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6,

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO,
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1,
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,


      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE
      r1.survey_assignment_id = ${id}

    GROUP BY r1.survey_assignment_id, r1.relationship_id, r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id,
      996,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY,
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1,
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2,
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3,
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4,
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5,
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6,

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO,
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1,
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,


      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE
      r1.survey_assignment_id = ${id} AND
      r1.relationship_id IN (2,3) 

    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id,
      997,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY,
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1,
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2,
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3,
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4,
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5,
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6,

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO,
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1,
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE
      r1.survey_assignment_id = ${id} AND
      r1.relationship_id IN (4,5)

    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id,
      998,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY,
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1,
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2,
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3,
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4,
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5,
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6,

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO,
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1,
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE
      r1.survey_assignment_id = ${id} AND
      r1.relationship_id IN (2,3,4,5)

    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id,
      999,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY,
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1,
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2,
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3,
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4,
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5,
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6,

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO,
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1,
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE
      r1.survey_assignment_id = ${id} AND
      r1.is_nomination = 1 

    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id,
      1000,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY,
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1,
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2,
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3,
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4,
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5,
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6,

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO,
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1,
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE
      r1.survey_assignment_id = ${id}

    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id
    ORDER BY relationship_id
  `;

  let query2 = `
  DELETE FROM r360_cohort rc
  WHERE
  survey_assignment_id = ${id}
`;

console.log("query1: "+query1);
console.log("query2: "+query2);
  // Execute the DELETE query first
  db.query(query2, [id], (err2, results2) => {
    if (err2) {
      console.error("Error executing DELETE query:", err2);
      result(err2, null);
    } else {
      console.log("DELETE Query results:", results2);

      // Now, execute the SELECT query
      db.query(query1, [id], (err1, results1) => {
        if (err1) {
          console.error("Error executing SELECT query:", err1);
          result(err1, null);
        } else {
          console.log("SELECT Query results:", results1);

          // Pass the results of the SELECT query to the callback
          result(null, results1);
        }
      });
    }
  });
};
/*
   console.log(query1);
   console.log(query2);
  db.query(query1, [id], (err, results) => {
    if (err) {
      // console.log(err);
      result(err, null);
    } else {
      // console.log(results);
      result(null, results);
    }
  });
};
*/



/////2024-01-05///

export const CalculateParticipantInsertM = (data, result) => {
  let query1 = `
    INSERT INTO r360_cohort 
      (
        survey_assignment_id, relationship_id, relationship_name, n, 
        KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6, 
        DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6, 
        CP, CP1, CP2, CP3, CP4, CP5, CP6, 
        SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6, 
        LIC, LIC1, LIC2, LIC3, LIC4, LIC5, LIC6, 
        LDF, LDF1, LDF2, LDF3, LDF4, LDF5, LDF6, 
        CII1, CII2, CII3, CII4, CII5, CII6, CII7, CII8, CII9, CII10, CII11, CII12, CII13, CII14, CII15, CII16, CII17, CII18, CII19, CII20, 
        EUSO, EUSO1, EUSO2, EUSO3, EUSO4, EUSO5, EUSO6, 
        ERX, EX, OX, AX, CX, 
        SA, SA1, SA2, SA3, SA4, SA5, SA6, SA7,
        ISR, ISR1, ISR2, ISR3, ISR4, ISR5,
        OAW, OAW1, OAW2, OAW3, OAW4, OAW5, OAW6,
        EI, EI1, EI2, EI3, EI4, EI5, EI6,
        GP, GP1, GP2, GP3, GP4, GP5,
        CLD, CLD1, CLD2, CLD3, CLD4,
        LA, LA1, LA2, LA3, LA4, LA5,
        CE, CE1, CE2, CE3, CE4, CE5,
        LC, LC1, LC2, LC3, LC4, LC5, LC6,
        LS, LS1, LS2, LS3, LS4, LS5,
        LTO, LTO1, LTO2, LTO3, LTO4,
        LO, LO1, LO2, LO3, LO4, LO5, LO6,
        AEI, AEI1, AEI2, AEI3, AEI4, AEI5, AEI6,
        LOC, LOC1, LOC2, LOC3, LOC4, LOC5, LOC6,
        NPS, NPS1, NPS2, NPS3, NPS4, NPS5, NPS6, NPS7, NPS8, NPS9, NPS10,
        BTC, BTC1, BTC2, BTC3, BTC4, BTC5, BTC6, BTC7, BTC8, BTC9,
        CPT, CPT1, CPT2, CPT3, CPT4, CPT5, CPT6, CPT7, CPT8,
        HH, HH1, HH2, HH3, HH4, HH5,
        BGIW, BGIW1, BGIW2, BGIW3, BGIW4, BGIW5, BGIW6,
        RI, RI1, RI2, RI3, RI4,
        ATR, ATR1, ATR2, ATR3, ATR4, ATR5,
        TW, TW1, TW2, TW3, TW4, TW5, TW6,
        TIO, TIO1, TIO2, TIO3, TIO4,
        RSH, RSH1, RSH2, RSH3, RSH4, RSH5, RSH6,
        WEI, WEI1, WEI2, WEI3, WEI4, WEI5, WEI6,
        org_id, suborg_id, program_id, iteration_id
      )
    VALUES
  `
  let ctr = data.length
  // console.log('R360 Cohort InsertM ctr length: '+ ctr )
  console.log('CalculateThisParticipantScoresInsertM ctr length: '+ ctr )
  // console.log(data[0]['survey_assignment_id'])

  for(let i = 0; i < ctr; i++) {
    let rel_name
    switch (data[i]['relationship_id']) {
      case 0:
        rel_name = "Self"
        break;
      case 1:
        rel_name = "My primary supervisor"
        break;
      case 2:
        rel_name = "A peer"
        break;
      case 3:
        rel_name = "My direct report"
        break;
      case 4:
        rel_name = "An other internal stakeholder"
        break;
      case 5:
        rel_name = "An external stakeholder"
        break;
      case 996:
        rel_name = "PD"
        break;      
      case 997:
        rel_name = "IE"
      break;      
      case 998:
        rel_name = "PDIE"
        break;      
      case 999:
        rel_name = "All Nominees"
        break;      
      case 1000:
        rel_name = "All"
    }

    query1 += `
      (
        ( ${data[i]['survey_assignment_id']} ),
        ( ${data[i]['relationship_id']} ),
        ('${rel_name}' ),
        ( ${data[i]['N']} ),

        ( ${data[i]['avg_KDY']} ),
        ( ${data[i]['avg_KDY1']} ),
        ( ${data[i]['avg_KDY2']} ),
        ( ${data[i]['avg_KDY3']} ),
        ( ${data[i]['avg_KDY4']} ),
        ( ${data[i]['avg_KDY5']} ),
        ( ${data[i]['avg_KDY6']} ),

        ( ${data[i]['avg_DTO']} ),
        ( ${data[i]['avg_DTO1']} ),
        ( ${data[i]['avg_DTO2']} ),
        ( ${data[i]['avg_DTO3']} ),
        ( ${data[i]['avg_DTO4']} ),
        ( ${data[i]['avg_DTO5']} ),
        ( ${data[i]['avg_DTO6']} ),

        ( ${data[i]['avg_CP']} ),
        ( ${data[i]['avg_CP1']} ),
        ( ${data[i]['avg_CP2']} ),
        ( ${data[i]['avg_CP3']} ),
        ( ${data[i]['avg_CP4']} ),
        ( ${data[i]['avg_CP5']} ),
        ( ${data[i]['avg_CP6']} ),
        
        ( ${data[i]['avg_SCP']} ),
        ( ${data[i]['avg_SCP1']} ),
        ( ${data[i]['avg_SCP2']} ),
        ( ${data[i]['avg_SCP3']} ),
        ( ${data[i]['avg_SCP4']} ),
        ( ${data[i]['avg_SCP5']} ),
        ( ${data[i]['avg_SCP6']} ),

        ( ${data[i]['avg_LIC']} ),
        ( ${data[i]['avg_LIC1']} ),
        ( ${data[i]['avg_LIC2']} ),
        ( ${data[i]['avg_LIC3']} ),
        ( ${data[i]['avg_LIC4']} ),
        ( ${data[i]['avg_LIC5']} ),
        ( ${data[i]['avg_LIC6']} ),

        ( ${data[i]['avg_LDF']} ),
        ( ${data[i]['avg_LDF1']} ),
        ( ${data[i]['avg_LDF2']} ),
        ( ${data[i]['avg_LDF3']} ),
        ( ${data[i]['avg_LDF4']} ),
        ( ${data[i]['avg_LDF5']} ),
        ( ${data[i]['avg_LDF6']} ),

        ( ${data[i]['avg_CII1']} ),
        ( ${data[i]['avg_CII2']} ),
        ( ${data[i]['avg_CII3']} ),
        ( ${data[i]['avg_CII4']} ),
        ( ${data[i]['avg_CII5']} ),
        ( ${data[i]['avg_CII6']} ),
        ( ${data[i]['avg_CII7']} ),
        ( ${data[i]['avg_CII8']} ),
        ( ${data[i]['avg_CII9']} ),
        ( ${data[i]['avg_CII10']} ),
        ( ${data[i]['avg_CII11']} ),
        ( ${data[i]['avg_CII12']} ),
        ( ${data[i]['avg_CII13']} ),
        ( ${data[i]['avg_CII14']} ),
        ( ${data[i]['avg_CII15']} ),
        ( ${data[i]['avg_CII16']} ),
        ( ${data[i]['avg_CII17']} ),
        ( ${data[i]['avg_CII18']} ),
        ( ${data[i]['avg_CII19']} ),
        ( ${data[i]['avg_CII20']} ),

        ( ${data[i]['avg_EUSO']} ),
        ( ${data[i]['avg_EUSO1']} ),
        ( ${data[i]['avg_EUSO2']} ),
        ( ${data[i]['avg_EUSO3']} ),
        ( ${data[i]['avg_EUSO4']} ),
        ( ${data[i]['avg_EUSO5']} ),
        ( ${data[i]['avg_EUSO6']} ),
        
        ( ${data[i]['avg_ERX']} ),
        ( ${data[i]['avg_EX']} ),
        ( ${data[i]['avg_OX']} ),
        ( ${data[i]['avg_AX']} ),
        ( ${data[i]['avg_CX']} ),

        ( ${data[i]['avg_SA']} ),
        ( ${data[i]['avg_SA1']} ),
        ( ${data[i]['avg_SA2']} ),
        ( ${data[i]['avg_SA3']} ),
        ( ${data[i]['avg_SA4']} ),
        ( ${data[i]['avg_SA5']} ),
        ( ${data[i]['avg_SA6']} ),
        ( ${data[i]['avg_SA7']} ),
  
        ( ${data[i]['avg_ISR']} ),
        ( ${data[i]['avg_ISR1']} ),
        ( ${data[i]['avg_ISR2']} ),
        ( ${data[i]['avg_ISR3']} ),
        ( ${data[i]['avg_ISR4']} ),
        ( ${data[i]['avg_ISR5']} ),
  
        ( ${data[i]['avg_OAW']} ),
        ( ${data[i]['avg_OAW1']} ),
        ( ${data[i]['avg_OAW2']} ),
        ( ${data[i]['avg_OAW3']} ),
        ( ${data[i]['avg_OAW4']} ),
        ( ${data[i]['avg_OAW5']} ),
        ( ${data[i]['avg_OAW6']} ),
  
        ( ${data[i]['avg_EI']} ),
        ( ${data[i]['avg_EI1']} ),
        ( ${data[i]['avg_EI2']} ),
        ( ${data[i]['avg_EI3']} ),
        ( ${data[i]['avg_EI4']} ),
        ( ${data[i]['avg_EI5']} ),
        ( ${data[i]['avg_EI6']} ),
  
        ( ${data[i]['avg_GP']} ),
        ( ${data[i]['avg_GP1']} ),
        ( ${data[i]['avg_GP2']} ),
        ( ${data[i]['avg_GP3']} ),
        ( ${data[i]['avg_GP4']} ),
        ( ${data[i]['avg_GP5']} ),
  
        ( ${data[i]['avg_CLD']} ),
        ( ${data[i]['avg_CLD1']} ),
        ( ${data[i]['avg_CLD2']} ),
        ( ${data[i]['avg_CLD3']} ),
        ( ${data[i]['avg_CLD4']} ),
  
        ( ${data[i]['avg_LA']} ),
        ( ${data[i]['avg_LA1']} ),
        ( ${data[i]['avg_LA2']} ),
        ( ${data[i]['avg_LA3']} ),
        ( ${data[i]['avg_LA4']} ),
        ( ${data[i]['avg_LA5']} ),
  
        ( ${data[i]['avg_CE']} ),
        ( ${data[i]['avg_CE1']} ),
        ( ${data[i]['avg_CE2']} ),
        ( ${data[i]['avg_CE3']} ),
        ( ${data[i]['avg_CE4']} ),
        ( ${data[i]['avg_CE5']} ),
  
        ( ${data[i]['avg_LC']} ),
        ( ${data[i]['avg_LC1']} ),
        ( ${data[i]['avg_LC2']} ),
        ( ${data[i]['avg_LC3']} ),
        ( ${data[i]['avg_LC4']} ),
        ( ${data[i]['avg_LC5']} ),
        ( ${data[i]['avg_LC6']} ),
  
        ( ${data[i]['avg_LS']} ),
        ( ${data[i]['avg_LS1']} ),
        ( ${data[i]['avg_LS2']} ),
        ( ${data[i]['avg_LS3']} ),
        ( ${data[i]['avg_LS4']} ),
        ( ${data[i]['avg_LS5']} ),
  
        ( ${data[i]['avg_LTO']} ),
        ( ${data[i]['avg_LTO1']} ),
        ( ${data[i]['avg_LTO2']} ),
        ( ${data[i]['avg_LTO3']} ),
        ( ${data[i]['avg_LTO4']} ),
  
        ( ${data[i]['avg_LO']} ),
        ( ${data[i]['avg_LO1']} ),
        ( ${data[i]['avg_LO2']} ),
        ( ${data[i]['avg_LO3']} ),
        ( ${data[i]['avg_LO4']} ),
        ( ${data[i]['avg_LO5']} ),
        ( ${data[i]['avg_LO6']} ),

        ( ${data[i]['avg_AEI']} ),
        ( ${data[i]['avg_AEI1']} ),
        ( ${data[i]['avg_AEI2']} ),
        ( ${data[i]['avg_AEI3']} ),
        ( ${data[i]['avg_AEI4']} ),
        ( ${data[i]['avg_AEI5']} ),
        ( ${data[i]['avg_AEI6']} ),

        ( ${data[i]['avg_LOC']} ),
        ( ${data[i]['avg_LOC1']} ),
        ( ${data[i]['avg_LOC2']} ),
        ( ${data[i]['avg_LOC3']} ),
        ( ${data[i]['avg_LOC4']} ),
        ( ${data[i]['avg_LOC5']} ),
        ( ${data[i]['avg_LOC6']} ),

        ( ${data[i]['avg_NPS']} ),
        ( ${data[i]['avg_NPS1']} ),
        ( ${data[i]['avg_NPS2']} ),
        ( ${data[i]['avg_NPS3']} ),
        ( ${data[i]['avg_NPS4']} ),
        ( ${data[i]['avg_NPS5']} ),
        ( ${data[i]['avg_NPS6']} ),
        ( ${data[i]['avg_NPS7']} ),
        ( ${data[i]['avg_NPS8']} ),
        ( ${data[i]['avg_NPS9']} ),
        ( ${data[i]['avg_NPS10']} ),

        ( ${data[i]['avg_BTC']} ),
        ( ${data[i]['avg_BTC1']} ),
        ( ${data[i]['avg_BTC2']} ),
        ( ${data[i]['avg_BTC3']} ),
        ( ${data[i]['avg_BTC4']} ),
        ( ${data[i]['avg_BTC5']} ),
        ( ${data[i]['avg_BTC6']} ),
        ( ${data[i]['avg_BTC7']} ),
        ( ${data[i]['avg_BTC8']} ),
        ( ${data[i]['avg_BTC9']} ),

        ( ${data[i]['avg_CPT']} ),
        ( ${data[i]['avg_CPT1']} ),
        ( ${data[i]['avg_CPT2']} ),
        ( ${data[i]['avg_CPT3']} ),
        ( ${data[i]['avg_CPT4']} ),
        ( ${data[i]['avg_CPT5']} ),
        ( ${data[i]['avg_CPT6']} ),
        ( ${data[i]['avg_CPT7']} ),
        ( ${data[i]['avg_CPT8']} ),

        ( ${data[i]['avg_HH']} ),
        ( ${data[i]['avg_HH1']} ),
        ( ${data[i]['avg_HH2']} ),
        ( ${data[i]['avg_HH3']} ),
        ( ${data[i]['avg_HH4']} ),
        ( ${data[i]['avg_HH5']} ),

        ( ${data[i]['avg_BGIW']} ),
        ( ${data[i]['avg_BGIW1']} ),
        ( ${data[i]['avg_BGIW2']} ),
        ( ${data[i]['avg_BGIW3']} ),
        ( ${data[i]['avg_BGIW4']} ),
        ( ${data[i]['avg_BGIW5']} ),
        ( ${data[i]['avg_BGIW6']} ),

        ( ${data[i]['avg_RI']} ),
        ( ${data[i]['avg_RI1']} ),
        ( ${data[i]['avg_RI2']} ),
        ( ${data[i]['avg_RI3']} ),
        ( ${data[i]['avg_RI4']} ),

        ( ${data[i]['avg_ATR']} ),
        ( ${data[i]['avg_ATR1']} ),
        ( ${data[i]['avg_ATR2']} ),
        ( ${data[i]['avg_ATR3']} ),
        ( ${data[i]['avg_ATR4']} ),
        ( ${data[i]['avg_ATR5']} ),

        ( ${data[i]['avg_TW']} ),
        ( ${data[i]['avg_TW1']} ),
        ( ${data[i]['avg_TW2']} ),
        ( ${data[i]['avg_TW3']} ),
        ( ${data[i]['avg_TW4']} ),
        ( ${data[i]['avg_TW5']} ),
        ( ${data[i]['avg_TW6']} ),

        ( ${data[i]['avg_TIO']} ),
        ( ${data[i]['avg_TIO1']} ),
        ( ${data[i]['avg_TIO2']} ),
        ( ${data[i]['avg_TIO3']} ),
        ( ${data[i]['avg_TIO4']} ),

        ( ${data[i]['avg_RSH']} ),
        ( ${data[i]['avg_RSH1']} ),
        ( ${data[i]['avg_RSH2']} ),
        ( ${data[i]['avg_RSH3']} ),
        ( ${data[i]['avg_RSH4']} ),
        ( ${data[i]['avg_RSH5']} ),
        ( ${data[i]['avg_RSH6']} ),

        ( ${data[i]['avg_WEI']} ),
        ( ${data[i]['avg_WEI1']} ),
        ( ${data[i]['avg_WEI2']} ),
        ( ${data[i]['avg_WEI3']} ),
        ( ${data[i]['avg_WEI4']} ),
        ( ${data[i]['avg_WEI5']} ),
        ( ${data[i]['avg_WEI6']} ),

        ( ${data[i]['org_id']} ),
        ( ${data[i]['suborg_id']} ),
        ( ${data[i]['program_id']} ),
        ( ${data[i]['iteration_id']} )
      )
    `
    if ( (i + 1) == ctr ){
      query1 += `;`
      
      console.log("query1 final: "+query1);
      db.query(
        query1,
        [],
        (err, results) => {
          if (err) {
            console.log(err)
            result(err, null)
          } else {
            let query2 = `UPDATE 
                            r360_raw r1
                          LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
                          LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
                          SET is_processed = 1  
                          WHERE 
                            r1.is_processed = 0 AND
                            r1.survey_assignment_id = ${data[i]['survey_assignment_id']}
                        `
            db.query(
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  // result(err, null)
                } else {
                  console.log(results)
                  // result(null, results)
                }
              }
            )
            result(null, results)
          }
        }
      )
    }
    else{
      query1 += `,`
    }
  }
}


//2024-01-09delete cohort by days passed i id
//returns list of iterations to be processed
// DATE_SUB ( DATE(i.final_deadline_date), INTERVAL 7 DAY) = DATE(CONVERT_TZ(NOW(), 'GMT', i.time_zone)) 
//  DATE_SUB ( DATE(i.final_deadline_date), INTERVAL ${id} DAY) = DATE(CONVERT_TZ(NOW(), 'GMT', i.time_zone))    
//change time of server timezone
export const delete360CohortPriorDaysM = (id, result) => {
  if (id == "final_deadline_date")
  {
      let query1 = `
      SELECT iteration_id 
      FROM iteration i 
      WHERE 
        DATE_FORMAT(i.final_deadline_date, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(NOW(), 'GMT', i.time_zone), '%Y-%m-%d %H:%i')
        AND i.never_run_iteration = 0
      `
      console.log(query1)
      db.query(
        query1,
        [],
        (err, results) => {
          if (err) {
            result(err, null)
            console.log(err)
          } else 
          {
              console.log("select iteration results: "+ JSON.stringify(results));
              //ctr vty
              let ctr = results.length;
              console.log("iteration results ctr: "+ctr);
              
              //let query2 = '';

              for(let i = 0; i < ctr; i++) 
              {
                let query2 = `
                DELETE 
                FROM r360_cohort
                WHERE iteration_id = ${results[i]['iteration_id']}
                `
                db.query(
                  query2,
                  [],
                  (err, results) => {
                    if (err) {
                      console.log(err)
                      // result(err, null)
                    } else {
                      console.log(results)
                      //output query2
                      
                    }
                  }
                )
              }
              result(null, results)
          }
        }
      )

  } //end if
  else
  {


      let query1 = `
      DELETE rc
      FROM r360_cohort rc
        JOIN iteration i 
        ON i.iteration_id = rc.iteration_id
        AND i.suborg_id = rc.suborg_id
        AND i.program_id = rc.program_id
        AND i.iteration_id = rc.iteration_id
      WHERE 
        DATE_SUB ( DATE(i.final_deadline_date), INTERVAL ${id} DAY) = DATE(NOW())      
        AND i.never_run_iteration = 0
      `
      console.log(query1)
      db.query(
        query1,
        [],
        (err, results) => {
          if (err) {
            result(err, null)
            console.log(err)
          } else 
          {

              let query2 = `SELECT iteration_id 
                FROM iteration i                    
                WHERE 
                  DATE_SUB ( DATE(i.final_deadline_date), INTERVAL ${id} DAY) = DATE(NOW())     
                  AND i.never_run_iteration = 0
              `

              db.query(
                query2,
                [],
                (err, results) => {
                  if (err) {
                    console.log(err)
                    // result(err, null)
                  } else {
                    console.log(results)
                    //output query2
                    result(null, results)
                  }
                }
              )
              //result(null, results)
          }
        }
      )




    
  }

}




//2024-01-09 update is process column by iteration_id
export const updateIsProcessedByIterationM = (id, result) => {
  let query1 = `
    UPDATE r360_raw r
    LEFT JOIN iteration i
      ON i.suborg_id = r.suborg_id
      AND i.program_id = r.program_id
      AND i.iteration_id = r.iteration_id
    SET is_processed = 0
    WHERE 
      i.iteration_id = ${id} 
      AND i.never_run_iteration = 0
  `
  // console.log(query1)
  db.query(
    query1,
    [id],
    (err, results) => {
      if (err) {
        result(err, null)
        console.log(err)
      } else {
        result(null, results)
        console.log(results)
      }
    }
  )
}



//2024-01-12 vty generate insert 360 cohort data
export const forceGenerateInsert360DataM = (id, result) => 
{
  let query1 = `
    SELECT
      r1.survey_assignment_id, 
      r1.relationship_id, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  


      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id, r1.relationship_id, r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT 
      r1.survey_assignment_id, 
      996,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  


      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (2,3) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id,
      997,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  
      
      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (4,5) AND
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id, 
      998,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (2,3,4,5) AND
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      r1.survey_assignment_id, 
      999, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.is_nomination = 1 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT 
      r1.survey_assignment_id, 
      1000, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.survey_assignment_id,  r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      0, 
      r1.relationship_id, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id,  r1.relationship_id

    UNION

    SELECT
      0, 
      996, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (2, 3) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      0, 
      997, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

    r1.org_id,
    r1.suborg_id,
    r1.program_id,
    r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (4, 5) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      0, 
      998, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (2, 3, 4, 5) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION 

    SELECT
      0,
      999,
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.is_nomination = 1 AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id

    UNION

    SELECT
      0,
      1000, 
      COUNT(*) AS N,

      AVG(NULLIF(r1.KDY, 0)) AS avg_KDY, 
      AVG(NULLIF(r1.KDY1, 0)) AS avg_KDY1, 
      AVG(NULLIF(r1.KDY2, 0)) AS avg_KDY2, 
      AVG(NULLIF(r1.KDY3, 0)) AS avg_KDY3, 
      AVG(NULLIF(r1.KDY4, 0)) AS avg_KDY4, 
      AVG(NULLIF(r1.KDY5, 0)) AS avg_KDY5, 
      AVG(NULLIF(r1.KDY6, 0)) AS avg_KDY6, 

      AVG(NULLIF(r1.DTO, 0)) AS avg_DTO, 
      AVG(NULLIF(r1.DTO1, 0)) AS avg_DTO1,  
      AVG(NULLIF(r1.DTO2, 0)) AS avg_DTO2,  
      AVG(NULLIF(r1.DTO3, 0)) AS avg_DTO3,  
      AVG(NULLIF(r1.DTO4, 0)) AS avg_DTO4,  
      AVG(NULLIF(r1.DTO5, 0)) AS avg_DTO5,  
      AVG(NULLIF(r1.DTO6, 0)) AS avg_DTO6,  

      AVG(NULLIF(r1.CP, 0)) AS avg_CP,  
      AVG(NULLIF(r1.CP1, 0)) AS avg_CP1,  
      AVG(NULLIF(r1.CP2, 0)) AS avg_CP2,  
      AVG(NULLIF(r1.CP3, 0)) AS avg_CP3,  
      AVG(NULLIF(r1.CP4, 0)) AS avg_CP4,  
      AVG(NULLIF(r1.CP5, 0)) AS avg_CP5,  
      AVG(NULLIF(r1.CP6, 0)) AS avg_CP6,  

      AVG(NULLIF(r1.SCP, 0)) AS avg_SCP,  
      AVG(NULLIF(r1.SCP1, 0)) AS avg_SCP1,  
      AVG(NULLIF(r1.SCP2, 0)) AS avg_SCP2,  
      AVG(NULLIF(r1.SCP3, 0)) AS avg_SCP3,  
      AVG(NULLIF(r1.SCP4, 0)) AS avg_SCP4,  
      AVG(NULLIF(r1.SCP5, 0)) AS avg_SCP5,  
      AVG(NULLIF(r1.SCP6, 0)) AS avg_SCP6,  

      AVG(NULLIF(r1.LIC, 0)) AS avg_LIC,  
      AVG(NULLIF(r1.LIC1, 0)) AS avg_LIC1, 
      AVG(NULLIF(r1.LIC2, 0)) AS avg_LIC2,  
      AVG(NULLIF(r1.LIC3, 0)) AS avg_LIC3,  
      AVG(NULLIF(r1.LIC4, 0)) AS avg_LIC4,  
      AVG(NULLIF(r1.LIC5, 0)) AS avg_LIC5,  
      AVG(NULLIF(r1.LIC6, 0)) AS avg_LIC6,   

      AVG(NULLIF(r1.LDF, 0)) AS avg_LDF,  
      AVG(NULLIF(r1.LDF1, 0)) AS avg_LDF1,  
      AVG(NULLIF(r1.LDF2, 0)) AS avg_LDF2,  
      AVG(NULLIF(r1.LDF3, 0)) AS avg_LDF3,  
      AVG(NULLIF(r1.LDF4, 0)) AS avg_LDF4,  
      AVG(NULLIF(r1.LDF5, 0)) AS avg_LDF5,  
      AVG(NULLIF(r1.LDF6, 0)) AS avg_LDF6,  

      AVG(NULLIF(r1.CII1, 0)) AS avg_CII1,  
      AVG(NULLIF(r1.CII2, 0)) AS avg_CII2,  
      AVG(NULLIF(r1.CII3, 0)) AS avg_CII3,  
      AVG(NULLIF(r1.CII4, 0)) AS avg_CII4,  
      AVG(NULLIF(r1.CII5, 0)) AS avg_CII5,  
      AVG(NULLIF(r1.CII6, 0)) AS avg_CII6,  
      AVG(NULLIF(r1.CII7, 0)) AS avg_CII7,  
      AVG(NULLIF(r1.CII8, 0)) AS avg_CII8,  
      AVG(NULLIF(r1.CII9, 0)) AS avg_CII9,  
      AVG(NULLIF(r1.CII10, 0)) AS avg_CII10,  
      AVG(NULLIF(r1.CII11, 0)) AS avg_CII11,  
      AVG(NULLIF(r1.CII12, 0)) AS avg_CII12,  
      AVG(NULLIF(r1.CII13, 0)) AS avg_CII13,  
      AVG(NULLIF(r1.CII14, 0)) AS avg_CII14,  
      AVG(NULLIF(r1.CII15, 0)) AS avg_CII15,  
      AVG(NULLIF(r1.CII16, 0)) AS avg_CII16,  
      AVG(NULLIF(r1.CII17, 0)) AS avg_CII17,  
      AVG(NULLIF(r1.CII18, 0)) AS avg_CII18,  
      AVG(NULLIF(r1.CII19, 0)) AS avg_CII19,  
      AVG(NULLIF(r1.CII20, 0)) AS avg_CII20,  

      AVG(NULLIF(r1.EUSO, 0)) AS avg_EUSO,  
      AVG(NULLIF(r1.EUSO1, 0)) AS avg_EUSO1,  
      AVG(NULLIF(r1.EUSO2, 0)) AS avg_EUSO2,  
      AVG(NULLIF(r1.EUSO3, 0)) AS avg_EUSO3,  
      AVG(NULLIF(r1.EUSO4, 0)) AS avg_EUSO4,  
      AVG(NULLIF(r1.EUSO5, 0)) AS avg_EUSO5,  
      AVG(NULLIF(r1.EUSO6, 0)) AS avg_EUSO6,  

      AVG(NULLIF(r1.ERX, 0)) AS avg_ERX,  
      AVG(NULLIF(r1.EX, 0)) AS avg_EX,  
      AVG(NULLIF(r1.OX, 0)) AS avg_OX,  
      AVG(NULLIF(r1.AX, 0)) AS avg_AX,  
      AVG(NULLIF(r1.CX, 0)) AS avg_CX,

      AVG(NULLIF(r1.SA, 0)) AS avg_SA,
      AVG(NULLIF(r1.SA1, 0)) AS avg_SA1,
      AVG(NULLIF(r1.SA2, 0)) AS avg_SA2,
      AVG(NULLIF(r1.SA3, 0)) AS avg_SA3,
      AVG(NULLIF(r1.SA4, 0)) AS avg_SA4,
      AVG(NULLIF(r1.SA5, 0)) AS avg_SA5,
      AVG(NULLIF(r1.SA6, 0)) AS avg_SA6,
      AVG(NULLIF(r1.SA7, 0)) AS avg_SA7,

      AVG(NULLIF(r1.ISR, 0)) AS avg_ISR,
      AVG(NULLIF(r1.ISR1, 0)) AS avg_ISR1,
      AVG(NULLIF(r1.ISR2, 0)) AS avg_ISR2,
      AVG(NULLIF(r1.ISR3, 0)) AS avg_ISR3,
      AVG(NULLIF(r1.ISR4, 0)) AS avg_ISR4,
      AVG(NULLIF(r1.ISR5, 0)) AS avg_ISR5,

      AVG(NULLIF(r1.OAW, 0)) AS avg_OAW,
      AVG(NULLIF(r1.OAW1, 0)) AS avg_OAW1,
      AVG(NULLIF(r1.OAW2, 0)) AS avg_OAW2,
      AVG(NULLIF(r1.OAW3, 0)) AS avg_OAW3,
      AVG(NULLIF(r1.OAW4, 0)) AS avg_OAW4,
      AVG(NULLIF(r1.OAW5, 0)) AS avg_OAW5,
      AVG(NULLIF(r1.OAW6, 0)) AS avg_OAW6,

      AVG(NULLIF(r1.EI, 0)) AS avg_EI,
      AVG(NULLIF(r1.EI1, 0)) AS avg_EI1,
      AVG(NULLIF(r1.EI2, 0)) AS avg_EI2,
      AVG(NULLIF(r1.EI3, 0)) AS avg_EI3,
      AVG(NULLIF(r1.EI4, 0)) AS avg_EI4,
      AVG(NULLIF(r1.EI5, 0)) AS avg_EI5,
      AVG(NULLIF(r1.EI6, 0)) AS avg_EI6,

      AVG(NULLIF(r1.GP, 0)) AS avg_GP,
      AVG(NULLIF(r1.GP1, 0)) AS avg_GP1,
      AVG(NULLIF(r1.GP2, 0)) AS avg_GP2,
      AVG(NULLIF(r1.GP3, 0)) AS avg_GP3,
      AVG(NULLIF(r1.GP4, 0)) AS avg_GP4,
      AVG(NULLIF(r1.GP5, 0)) AS avg_GP5,

      AVG(NULLIF(r1.CLD, 0)) AS avg_CLD,
      AVG(NULLIF(r1.CLD1, 0)) AS avg_CLD1,
      AVG(NULLIF(r1.CLD2, 0)) AS avg_CLD2,
      AVG(NULLIF(r1.CLD3, 0)) AS avg_CLD3,
      AVG(NULLIF(r1.CLD4, 0)) AS avg_CLD4,

      AVG(NULLIF(r1.LA, 0)) AS avg_LA,
      AVG(NULLIF(r1.LA1, 0)) AS avg_LA1,
      AVG(NULLIF(r1.LA2, 0)) AS avg_LA2,
      AVG(NULLIF(r1.LA3, 0)) AS avg_LA3,
      AVG(NULLIF(r1.LA4, 0)) AS avg_LA4,
      AVG(NULLIF(r1.LA5, 0)) AS avg_LA5,

      AVG(NULLIF(r1.CE, 0)) AS avg_CE,
      AVG(NULLIF(r1.CE1, 0)) AS avg_CE1,
      AVG(NULLIF(r1.CE2, 0)) AS avg_CE2,
      AVG(NULLIF(r1.CE3, 0)) AS avg_CE3,
      AVG(NULLIF(r1.CE4, 0)) AS avg_CE4,
      AVG(NULLIF(r1.CE5, 0)) AS avg_CE5,

      AVG(NULLIF(r1.LC, 0)) AS avg_LC,
      AVG(NULLIF(r1.LC1, 0)) AS avg_LC1,
      AVG(NULLIF(r1.LC2, 0)) AS avg_LC2,
      AVG(NULLIF(r1.LC3, 0)) AS avg_LC3,
      AVG(NULLIF(r1.LC4, 0)) AS avg_LC4,
      AVG(NULLIF(r1.LC5, 0)) AS avg_LC5,
      AVG(NULLIF(r1.LC6, 0)) AS avg_LC6,

      AVG(NULLIF(r1.LS, 0)) AS avg_LS,
      AVG(NULLIF(r1.LS1, 0)) AS avg_LS1,
      AVG(NULLIF(r1.LS2, 0)) AS avg_LS2,
      AVG(NULLIF(r1.LS3, 0)) AS avg_LS3,
      AVG(NULLIF(r1.LS4, 0)) AS avg_LS4,
      AVG(NULLIF(r1.LS5, 0)) AS avg_LS5,

      AVG(NULLIF(r1.LTO, 0)) AS avg_LTO,
      AVG(NULLIF(r1.LTO1, 0)) AS avg_LTO1,
      AVG(NULLIF(r1.LTO2, 0)) AS avg_LTO2,
      AVG(NULLIF(r1.LTO3, 0)) AS avg_LTO3,
      AVG(NULLIF(r1.LTO4, 0)) AS avg_LTO4,

      AVG(NULLIF(r1.LO, 0)) AS avg_LO,
      AVG(NULLIF(r1.LO1, 0)) AS avg_LO1,
      AVG(NULLIF(r1.LO2, 0)) AS avg_LO2,
      AVG(NULLIF(r1.LO3, 0)) AS avg_LO3,
      AVG(NULLIF(r1.LO4, 0)) AS avg_LO4,
      AVG(NULLIF(r1.LO5, 0)) AS avg_LO5,
      AVG(NULLIF(r1.LO6, 0)) AS avg_LO6,

      AVG(NULLIF(r1.AEI, 0)) AS avg_AEI,
      AVG(NULLIF(r1.AEI1, 0)) AS avg_AEI1,
      AVG(NULLIF(r1.AEI2, 0)) AS avg_AEI2,
      AVG(NULLIF(r1.AEI3, 0)) AS avg_AEI3,
      AVG(NULLIF(r1.AEI4, 0)) AS avg_AEI4,
      AVG(NULLIF(r1.AEI5, 0)) AS avg_AEI5,
      AVG(NULLIF(r1.AEI6, 0)) AS avg_AEI6,

      AVG(NULLIF(r1.LOC, 0)) AS avg_LOC,
      AVG(NULLIF(r1.LOC1, 0)) AS avg_LOC1,
      AVG(NULLIF(r1.LOC2, 0)) AS avg_LOC2,
      AVG(NULLIF(r1.LOC3, 0)) AS avg_LOC3,
      AVG(NULLIF(r1.LOC4, 0)) AS avg_LOC4,
      AVG(NULLIF(r1.LOC5, 0)) AS avg_LOC5,
      AVG(NULLIF(r1.LOC6, 0)) AS avg_LOC6,

      AVG(NULLIF(r1.NPS, 0)) AS avg_NPS,
      AVG(NULLIF(r1.NPS1, 0)) AS avg_NPS1,
      AVG(NULLIF(r1.NPS2, 0)) AS avg_NPS2,
      AVG(NULLIF(r1.NPS3, 0)) AS avg_NPS3,
      AVG(NULLIF(r1.NPS4, 0)) AS avg_NPS4,
      AVG(NULLIF(r1.NPS5, 0)) AS avg_NPS5,
      AVG(NULLIF(r1.NPS6, 0)) AS avg_NPS6,
      AVG(NULLIF(r1.NPS7, 0)) AS avg_NPS7,
      AVG(NULLIF(r1.NPS8, 0)) AS avg_NPS8,
      AVG(NULLIF(r1.NPS9, 0)) AS avg_NPS9,
      AVG(NULLIF(r1.NPS10, 0)) AS avg_NPS10,

      AVG(NULLIF(r1.BTC, 0)) AS avg_BTC,
      AVG(NULLIF(r1.BTC1, 0)) AS avg_BTC1,
      AVG(NULLIF(r1.BTC2, 0)) AS avg_BTC2,
      AVG(NULLIF(r1.BTC3, 0)) AS avg_BTC3,
      AVG(NULLIF(r1.BTC4, 0)) AS avg_BTC4,
      AVG(NULLIF(r1.BTC5, 0)) AS avg_BTC5,
      AVG(NULLIF(r1.BTC6, 0)) AS avg_BTC6,
      AVG(NULLIF(r1.BTC7, 0)) AS avg_BTC7,
      AVG(NULLIF(r1.BTC8, 0)) AS avg_BTC8,
      AVG(NULLIF(r1.BTC9, 0)) AS avg_BTC9,

      AVG(NULLIF(r1.CPT, 0)) AS avg_CPT,
      AVG(NULLIF(r1.CPT1, 0)) AS avg_CPT1,
      AVG(NULLIF(r1.CPT2, 0)) AS avg_CPT2,
      AVG(NULLIF(r1.CPT3, 0)) AS avg_CPT3,
      AVG(NULLIF(r1.CPT4, 0)) AS avg_CPT4,
      AVG(NULLIF(r1.CPT5, 0)) AS avg_CPT5,
      AVG(NULLIF(r1.CPT6, 0)) AS avg_CPT6,
      AVG(NULLIF(r1.CPT7, 0)) AS avg_CPT7,
      AVG(NULLIF(r1.CPT8, 0)) AS avg_CPT8,

      AVG(NULLIF(r1.HH, 0)) AS avg_HH,
      AVG(NULLIF(r1.HH1, 0)) AS avg_HH1,
      AVG(NULLIF(r1.HH2, 0)) AS avg_HH2,
      AVG(NULLIF(r1.HH3, 0)) AS avg_HH3,
      AVG(NULLIF(r1.HH4, 0)) AS avg_HH4,
      AVG(NULLIF(r1.HH5, 0)) AS avg_HH5,

      AVG(NULLIF(r1.BGIW, 0)) AS avg_BGIW,
      AVG(NULLIF(r1.BGIW1, 0)) AS avg_BGIW1,
      AVG(NULLIF(r1.BGIW2, 0)) AS avg_BGIW2,
      AVG(NULLIF(r1.BGIW3, 0)) AS avg_BGIW3,
      AVG(NULLIF(r1.BGIW4, 0)) AS avg_BGIW4,
      AVG(NULLIF(r1.BGIW5, 0)) AS avg_BGIW5,
      AVG(NULLIF(r1.BGIW6, 0)) AS avg_BGIW6,

      AVG(NULLIF(r1.RI, 0)) AS avg_RI,
      AVG(NULLIF(r1.RI1, 0)) AS avg_RI1,
      AVG(NULLIF(r1.RI2, 0)) AS avg_RI2,
      AVG(NULLIF(r1.RI3, 0)) AS avg_RI3,
      AVG(NULLIF(r1.RI4, 0)) AS avg_RI4,

      AVG(NULLIF(r1.ATR, 0)) AS avg_ATR,
      AVG(NULLIF(r1.ATR1, 0)) AS avg_ATR1,
      AVG(NULLIF(r1.ATR2, 0)) AS avg_ATR2,
      AVG(NULLIF(r1.ATR3, 0)) AS avg_ATR3,
      AVG(NULLIF(r1.ATR4, 0)) AS avg_ATR4,
      AVG(NULLIF(r1.ATR5, 0)) AS avg_ATR5,

      AVG(NULLIF(r1.TW, 0)) AS avg_TW,
      AVG(NULLIF(r1.TW1, 0)) AS avg_TW1,
      AVG(NULLIF(r1.TW2, 0)) AS avg_TW2,
      AVG(NULLIF(r1.TW3, 0)) AS avg_TW3,
      AVG(NULLIF(r1.TW4, 0)) AS avg_TW4,
      AVG(NULLIF(r1.TW5, 0)) AS avg_TW5,
      AVG(NULLIF(r1.TW6, 0)) AS avg_TW6,

      AVG(NULLIF(r1.TIO, 0)) AS avg_TIO,
      AVG(NULLIF(r1.TIO1, 0)) AS avg_TIO1,
      AVG(NULLIF(r1.TIO2, 0)) AS avg_TIO2,
      AVG(NULLIF(r1.TIO3, 0)) AS avg_TIO3,
      AVG(NULLIF(r1.TIO4, 0)) AS avg_TIO4,

      AVG(NULLIF(r1.RSH, 0)) AS avg_RSH,
      AVG(NULLIF(r1.RSH1, 0)) AS avg_RSH1,
      AVG(NULLIF(r1.RSH2, 0)) AS avg_RSH2,
      AVG(NULLIF(r1.RSH3, 0)) AS avg_RSH3,
      AVG(NULLIF(r1.RSH4, 0)) AS avg_RSH4,
      AVG(NULLIF(r1.RSH5, 0)) AS avg_RSH5,
      AVG(NULLIF(r1.RSH6, 0)) AS avg_RSH6,

      AVG(NULLIF(r1.WEI, 0)) AS avg_WEI,
      AVG(NULLIF(r1.WEI1, 0)) AS avg_WEI1,
      AVG(NULLIF(r1.WEI2, 0)) AS avg_WEI2,
      AVG(NULLIF(r1.WEI3, 0)) AS avg_WEI3,
      AVG(NULLIF(r1.WEI4, 0)) AS avg_WEI4,
      AVG(NULLIF(r1.WEI5, 0)) AS avg_WEI5,
      AVG(NULLIF(r1.WEI6, 0)) AS avg_WEI6,

      r1.org_id,
      r1.suborg_id,
      r1.program_id,
      r1.iteration_id

    FROM r360_raw r1
    LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
    WHERE 
      r1.is_processed = 0 AND 
      r1.relationship_id IN (0, 1, 2, 3, 4, 5) AND 
      r1.iteration_id = ${id}
    GROUP BY r1.org_id, r1.suborg_id, r1.program_id, r1.iteration_id
  `;
  // console.log(query1);
  db.query(
    query1, 
    [id],
    (err, results) => 
    {
      if (err) {
        // console.log(err);
        result(err, null);
      } 
      else 
      {
        ////insert data from generate
        let ctr = results.length;
        console.log("ctr: "+ctr);
        //console.log("results: "+JSON.stringify(results));
        //console.log("results 0: "+ JSON.stringify(results[0])); //first record
        let query2 = `
        INSERT INTO r360_cohort 
          (
            survey_assignment_id, relationship_id, relationship_name, n, 
            KDY, KDY1, KDY2, KDY3, KDY4, KDY5, KDY6, 
            DTO, DTO1, DTO2, DTO3, DTO4, DTO5, DTO6, 
            CP, CP1, CP2, CP3, CP4, CP5, CP6, 
            SCP, SCP1, SCP2, SCP3, SCP4, SCP5, SCP6, 
            LIC, LIC1, LIC2, LIC3, LIC4, LIC5, LIC6, 
            LDF, LDF1, LDF2, LDF3, LDF4, LDF5, LDF6, 
            CII1, CII2, CII3, CII4, CII5, CII6, CII7, CII8, CII9, CII10, CII11, CII12, CII13, CII14, CII15, CII16, CII17, CII18, CII19, CII20, 
            EUSO, EUSO1, EUSO2, EUSO3, EUSO4, EUSO5, EUSO6, 
            ERX, EX, OX, AX, CX, 
            SA, SA1, SA2, SA3, SA4, SA5, SA6, SA7,
            ISR, ISR1, ISR2, ISR3, ISR4, ISR5,
            OAW, OAW1, OAW2, OAW3, OAW4, OAW5, OAW6,
            EI, EI1, EI2, EI3, EI4, EI5, EI6,
            GP, GP1, GP2, GP3, GP4, GP5,
            CLD, CLD1, CLD2, CLD3, CLD4,
            LA, LA1, LA2, LA3, LA4, LA5,
            CE, CE1, CE2, CE3, CE4, CE5,
            LC, LC1, LC2, LC3, LC4, LC5, LC6,
            LS, LS1, LS2, LS3, LS4, LS5,
            LTO, LTO1, LTO2, LTO3, LTO4,
            LO, LO1, LO2, LO3, LO4, LO5, LO6,
            AEI, AEI1, AEI2, AEI3, AEI4, AEI5, AEI6,
            LOC, LOC1, LOC2, LOC3, LOC4, LOC5, LOC6,
            NPS, NPS1, NPS2, NPS3, NPS4, NPS5, NPS6, NPS7, NPS8, NPS9, NPS10,
            BTC, BTC1, BTC2, BTC3, BTC4, BTC5, BTC6, BTC7, BTC8, BTC9,
            CPT, CPT1, CPT2, CPT3, CPT4, CPT5, CPT6, CPT7, CPT8,
            HH, HH1, HH2, HH3, HH4, HH5,
            BGIW, BGIW1, BGIW2, BGIW3, BGIW4, BGIW5, BGIW6,
            RI, RI1, RI2, RI3, RI4,
            ATR, ATR1, ATR2, ATR3, ATR4, ATR5,
            TW, TW1, TW2, TW3, TW4, TW5, TW6,
            TIO, TIO1, TIO2, TIO3, TIO4,
            RSH, RSH1, RSH2, RSH3, RSH4, RSH5, RSH6,
            WEI, WEI1, WEI2, WEI3, WEI4, WEI5, WEI6,
            org_id, suborg_id, program_id, iteration_id
          )
        VALUES
      `
      for(let i = 0; i < ctr; i++) 
        { //start for loop
          let rel_name
          switch (results[i]['relationship_id']) {
            case 0:
              rel_name = "Self"
              break;
            case 1:
              rel_name = "My primary supervisor"
              break;
            case 2:
              rel_name = "A peer"
              break;
            case 3:
              rel_name = "My direct report"
              break;
            case 4:
              rel_name = "An other internal stakeholder"
              break;
            case 5:
              rel_name = "An external stakeholder"
              break;
            case 996:
              rel_name = "PD"
              break;      
            case 997:
              rel_name = "IE"
            break;      
            case 998:
              rel_name = "PDIE"
              break;      
            case 999:
              rel_name = "All Nominees"
              break;      
            case 1000:
              rel_name = "All"
          }
      
          query2 += `    (
              ( ${results[i]['survey_assignment_id']} ),
              ( ${results[i]['relationship_id']} ),
              ('${rel_name}' ),
              ( ${results[i]['N']} ),
      
              ( ${results[i]['avg_KDY']} ),
              ( ${results[i]['avg_KDY1']} ),
              ( ${results[i]['avg_KDY2']} ),
              ( ${results[i]['avg_KDY3']} ),
              ( ${results[i]['avg_KDY4']} ),
              ( ${results[i]['avg_KDY5']} ),
              ( ${results[i]['avg_KDY6']} ),
      
              ( ${results[i]['avg_DTO']} ),
              ( ${results[i]['avg_DTO1']} ),
              ( ${results[i]['avg_DTO2']} ),
              ( ${results[i]['avg_DTO3']} ),
              ( ${results[i]['avg_DTO4']} ),
              ( ${results[i]['avg_DTO5']} ),
              ( ${results[i]['avg_DTO6']} ),
      
              ( ${results[i]['avg_CP']} ),
              ( ${results[i]['avg_CP1']} ),
              ( ${results[i]['avg_CP2']} ),
              ( ${results[i]['avg_CP3']} ),
              ( ${results[i]['avg_CP4']} ),
              ( ${results[i]['avg_CP5']} ),
              ( ${results[i]['avg_CP6']} ),
              
              ( ${results[i]['avg_SCP']} ),
              ( ${results[i]['avg_SCP1']} ),
              ( ${results[i]['avg_SCP2']} ),
              ( ${results[i]['avg_SCP3']} ),
              ( ${results[i]['avg_SCP4']} ),
              ( ${results[i]['avg_SCP5']} ),
              ( ${results[i]['avg_SCP6']} ),
      
              ( ${results[i]['avg_LIC']} ),
              ( ${results[i]['avg_LIC1']} ),
              ( ${results[i]['avg_LIC2']} ),
              ( ${results[i]['avg_LIC3']} ),
              ( ${results[i]['avg_LIC4']} ),
              ( ${results[i]['avg_LIC5']} ),
              ( ${results[i]['avg_LIC6']} ),
      
              ( ${results[i]['avg_LDF']} ),
              ( ${results[i]['avg_LDF1']} ),
              ( ${results[i]['avg_LDF2']} ),
              ( ${results[i]['avg_LDF3']} ),
              ( ${results[i]['avg_LDF4']} ),
              ( ${results[i]['avg_LDF5']} ),
              ( ${results[i]['avg_LDF6']} ),
      
              ( ${results[i]['avg_CII1']} ),
              ( ${results[i]['avg_CII2']} ),
              ( ${results[i]['avg_CII3']} ),
              ( ${results[i]['avg_CII4']} ),
              ( ${results[i]['avg_CII5']} ),
              ( ${results[i]['avg_CII6']} ),
              ( ${results[i]['avg_CII7']} ),
              ( ${results[i]['avg_CII8']} ),
              ( ${results[i]['avg_CII9']} ),
              ( ${results[i]['avg_CII10']} ),
              ( ${results[i]['avg_CII11']} ),
              ( ${results[i]['avg_CII12']} ),
              ( ${results[i]['avg_CII13']} ),
              ( ${results[i]['avg_CII14']} ),
              ( ${results[i]['avg_CII15']} ),
              ( ${results[i]['avg_CII16']} ),
              ( ${results[i]['avg_CII17']} ),
              ( ${results[i]['avg_CII18']} ),
              ( ${results[i]['avg_CII19']} ),
              ( ${results[i]['avg_CII20']} ),
      
              ( ${results[i]['avg_EUSO']} ),
              ( ${results[i]['avg_EUSO1']} ),
              ( ${results[i]['avg_EUSO2']} ),
              ( ${results[i]['avg_EUSO3']} ),
              ( ${results[i]['avg_EUSO4']} ),
              ( ${results[i]['avg_EUSO5']} ),
              ( ${results[i]['avg_EUSO6']} ),
              
              ( ${results[i]['avg_ERX']} ),
              ( ${results[i]['avg_EX']} ),
              ( ${results[i]['avg_OX']} ),
              ( ${results[i]['avg_AX']} ),
              ( ${results[i]['avg_CX']} ),
      
              ( ${results[i]['avg_SA']} ),
              ( ${results[i]['avg_SA1']} ),
              ( ${results[i]['avg_SA2']} ),
              ( ${results[i]['avg_SA3']} ),
              ( ${results[i]['avg_SA4']} ),
              ( ${results[i]['avg_SA5']} ),
              ( ${results[i]['avg_SA6']} ),
              ( ${results[i]['avg_SA7']} ),
        
              ( ${results[i]['avg_ISR']} ),
              ( ${results[i]['avg_ISR1']} ),
              ( ${results[i]['avg_ISR2']} ),
              ( ${results[i]['avg_ISR3']} ),
              ( ${results[i]['avg_ISR4']} ),
              ( ${results[i]['avg_ISR5']} ),
        
              ( ${results[i]['avg_OAW']} ),
              ( ${results[i]['avg_OAW1']} ),
              ( ${results[i]['avg_OAW2']} ),
              ( ${results[i]['avg_OAW3']} ),
              ( ${results[i]['avg_OAW4']} ),
              ( ${results[i]['avg_OAW5']} ),
              ( ${results[i]['avg_OAW6']} ),
        
              ( ${results[i]['avg_EI']} ),
              ( ${results[i]['avg_EI1']} ),
              ( ${results[i]['avg_EI2']} ),
              ( ${results[i]['avg_EI3']} ),
              ( ${results[i]['avg_EI4']} ),
              ( ${results[i]['avg_EI5']} ),
              ( ${results[i]['avg_EI6']} ),
        
              ( ${results[i]['avg_GP']} ),
              ( ${results[i]['avg_GP1']} ),
              ( ${results[i]['avg_GP2']} ),
              ( ${results[i]['avg_GP3']} ),
              ( ${results[i]['avg_GP4']} ),
              ( ${results[i]['avg_GP5']} ),
        
              ( ${results[i]['avg_CLD']} ),
              ( ${results[i]['avg_CLD1']} ),
              ( ${results[i]['avg_CLD2']} ),
              ( ${results[i]['avg_CLD3']} ),
              ( ${results[i]['avg_CLD4']} ),
        
              ( ${results[i]['avg_LA']} ),
              ( ${results[i]['avg_LA1']} ),
              ( ${results[i]['avg_LA2']} ),
              ( ${results[i]['avg_LA3']} ),
              ( ${results[i]['avg_LA4']} ),
              ( ${results[i]['avg_LA5']} ),
        
              ( ${results[i]['avg_CE']} ),
              ( ${results[i]['avg_CE1']} ),
              ( ${results[i]['avg_CE2']} ),
              ( ${results[i]['avg_CE3']} ),
              ( ${results[i]['avg_CE4']} ),
              ( ${results[i]['avg_CE5']} ),
        
              ( ${results[i]['avg_LC']} ),
              ( ${results[i]['avg_LC1']} ),
              ( ${results[i]['avg_LC2']} ),
              ( ${results[i]['avg_LC3']} ),
              ( ${results[i]['avg_LC4']} ),
              ( ${results[i]['avg_LC5']} ),
              ( ${results[i]['avg_LC6']} ),
        
              ( ${results[i]['avg_LS']} ),
              ( ${results[i]['avg_LS1']} ),
              ( ${results[i]['avg_LS2']} ),
              ( ${results[i]['avg_LS3']} ),
              ( ${results[i]['avg_LS4']} ),
              ( ${results[i]['avg_LS5']} ),
        
              ( ${results[i]['avg_LTO']} ),
              ( ${results[i]['avg_LTO1']} ),
              ( ${results[i]['avg_LTO2']} ),
              ( ${results[i]['avg_LTO3']} ),
              ( ${results[i]['avg_LTO4']} ),
        
              ( ${results[i]['avg_LO']} ),
              ( ${results[i]['avg_LO1']} ),
              ( ${results[i]['avg_LO2']} ),
              ( ${results[i]['avg_LO3']} ),
              ( ${results[i]['avg_LO4']} ),
              ( ${results[i]['avg_LO5']} ),
              ( ${results[i]['avg_LO6']} ),
      
              ( ${results[i]['avg_AEI']} ),
              ( ${results[i]['avg_AEI1']} ),
              ( ${results[i]['avg_AEI2']} ),
              ( ${results[i]['avg_AEI3']} ),
              ( ${results[i]['avg_AEI4']} ),
              ( ${results[i]['avg_AEI5']} ),
              ( ${results[i]['avg_AEI6']} ),
      
              ( ${results[i]['avg_LOC']} ),
              ( ${results[i]['avg_LOC1']} ),
              ( ${results[i]['avg_LOC2']} ),
              ( ${results[i]['avg_LOC3']} ),
              ( ${results[i]['avg_LOC4']} ),
              ( ${results[i]['avg_LOC5']} ),
              ( ${results[i]['avg_LOC6']} ),
      
              ( ${results[i]['avg_NPS']} ),
              ( ${results[i]['avg_NPS1']} ),
              ( ${results[i]['avg_NPS2']} ),
              ( ${results[i]['avg_NPS3']} ),
              ( ${results[i]['avg_NPS4']} ),
              ( ${results[i]['avg_NPS5']} ),
              ( ${results[i]['avg_NPS6']} ),
              ( ${results[i]['avg_NPS7']} ),
              ( ${results[i]['avg_NPS8']} ),
              ( ${results[i]['avg_NPS9']} ),
              ( ${results[i]['avg_NPS10']} ),
      
              ( ${results[i]['avg_BTC']} ),
              ( ${results[i]['avg_BTC1']} ),
              ( ${results[i]['avg_BTC2']} ),
              ( ${results[i]['avg_BTC3']} ),
              ( ${results[i]['avg_BTC4']} ),
              ( ${results[i]['avg_BTC5']} ),
              ( ${results[i]['avg_BTC6']} ),
              ( ${results[i]['avg_BTC7']} ),
              ( ${results[i]['avg_BTC8']} ),
              ( ${results[i]['avg_BTC9']} ),
      
              ( ${results[i]['avg_CPT']} ),
              ( ${results[i]['avg_CPT1']} ),
              ( ${results[i]['avg_CPT2']} ),
              ( ${results[i]['avg_CPT3']} ),
              ( ${results[i]['avg_CPT4']} ),
              ( ${results[i]['avg_CPT5']} ),
              ( ${results[i]['avg_CPT6']} ),
              ( ${results[i]['avg_CPT7']} ),
              ( ${results[i]['avg_CPT8']} ),
      
              ( ${results[i]['avg_HH']} ),
              ( ${results[i]['avg_HH1']} ),
              ( ${results[i]['avg_HH2']} ),
              ( ${results[i]['avg_HH3']} ),
              ( ${results[i]['avg_HH4']} ),
              ( ${results[i]['avg_HH5']} ),
      
              ( ${results[i]['avg_BGIW']} ),
              ( ${results[i]['avg_BGIW1']} ),
              ( ${results[i]['avg_BGIW2']} ),
              ( ${results[i]['avg_BGIW3']} ),
              ( ${results[i]['avg_BGIW4']} ),
              ( ${results[i]['avg_BGIW5']} ),
              ( ${results[i]['avg_BGIW6']} ),
      
              ( ${results[i]['avg_RI']} ),
              ( ${results[i]['avg_RI1']} ),
              ( ${results[i]['avg_RI2']} ),
              ( ${results[i]['avg_RI3']} ),
              ( ${results[i]['avg_RI4']} ),
      
              ( ${results[i]['avg_ATR']} ),
              ( ${results[i]['avg_ATR1']} ),
              ( ${results[i]['avg_ATR2']} ),
              ( ${results[i]['avg_ATR3']} ),
              ( ${results[i]['avg_ATR4']} ),
              ( ${results[i]['avg_ATR5']} ),
      
              ( ${results[i]['avg_TW']} ),
              ( ${results[i]['avg_TW1']} ),
              ( ${results[i]['avg_TW2']} ),
              ( ${results[i]['avg_TW3']} ),
              ( ${results[i]['avg_TW4']} ),
              ( ${results[i]['avg_TW5']} ),
              ( ${results[i]['avg_TW6']} ),
      
              ( ${results[i]['avg_TIO']} ),
              ( ${results[i]['avg_TIO1']} ),
              ( ${results[i]['avg_TIO2']} ),
              ( ${results[i]['avg_TIO3']} ),
              ( ${results[i]['avg_TIO4']} ),
      
              ( ${results[i]['avg_RSH']} ),
              ( ${results[i]['avg_RSH1']} ),
              ( ${results[i]['avg_RSH2']} ),
              ( ${results[i]['avg_RSH3']} ),
              ( ${results[i]['avg_RSH4']} ),
              ( ${results[i]['avg_RSH5']} ),
              ( ${results[i]['avg_RSH6']} ),
      
              ( ${results[i]['avg_WEI']} ),
              ( ${results[i]['avg_WEI1']} ),
              ( ${results[i]['avg_WEI2']} ),
              ( ${results[i]['avg_WEI3']} ),
              ( ${results[i]['avg_WEI4']} ),
              ( ${results[i]['avg_WEI5']} ),
              ( ${results[i]['avg_WEI6']} ),
      
              ( ${results[i]['org_id']} ),
              ( ${results[i]['suborg_id']} ),
              ( ${results[i]['program_id']} ),
              ( ${results[i]['iteration_id']} )
            )
          `
          if ( (i + 1) == ctr ){
            query2 += `;`
             //console.log(query2) //very big
            db.query(
              query2,
              [],
              (err, results) => {
                if (err) {
                  console.log(err)
                  result(err, null)
                } else {
                  console.log("insert results: "+ JSON.stringify(results));
                  //console.log(results)
                  let query3 = `UPDATE 
                                  r360_raw r1
                                LEFT JOIN iteration i ON i.iteration_id = r1.iteration_id
                                LEFT JOIN survey_template st ON st.survey_template_id = r1.survey_template_id
                                SET is_processed = 1  
                                WHERE 
                                  r1.is_processed = 0 AND
                                  r1.iteration_id = ${id}
                              `
                  db.query(
                    query3,
                    [],
                    (err, results) => {
                      if (err) {
                        console.log(err)
                        // result(err, null)
                      } else {
                        console.log("updating is processed to 1.")
                        console.log(results)
                        result(null, results)
                      }
                    }
                  )
                  //result(null, results)
                }
              }
            )
          }
          else
          {
            query2 += `,`
          }
        } //end for loop
      } //end if  
    
       /////////////output of function
        //result(null, results);
      
      
    }
  );
};
