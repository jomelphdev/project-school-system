import db from "../config/database.js";


// Create New Organization
export const seedDataTag = (data, result) => {
  db.query(
    `
    INSERT INTO tag (tag_name, tag_type, org_id, created_by, modified_by) 
    VALUES 
    ('auto_self_report', 'auto_self_report', ?, '0', '0'),
    ('auto_coach_report', 'auto_coach_report', ?, '0', '0'),
    ('coach_group_report', 'coach_group_report', ?, '0', '0'),
    ('disable_nominations', 'disable_nominations', ?, '0', '0'),
    ('disable_reminders', 'disable_reminders', ?, '0', '0'),
    ('editable', 'editable', ?, '0', '0'),
    ('has_5_step', 'has_5_step', ?, '0', '0'),
    ('has_coach_5_step', 'has_coach_5_step', ?, '0', '0'),
    ('has_tipping_point', 'has_tipping_point', ?, '0', '0'),
    ('has_coach_tipping_point', 'has_coach_tipping_point', ?, '0', '0'),
    ('has_pressure_point', 'has_pressure_point', ?, '0', '0'),
    ('has_coach_pressure_point', 'has_coach_pressure_point', ?, '0', '0'),
    ('impact_report', 'impact_report', ?, '0', '0'),('invoiced', 'invoiced', ?, '0', '0'),
    ('quantitative_360_report', 'quantitative_360_report', ?, '0', '0'),
    ('retake', 'retake', ?, '0', '0'),('self_report_preview', 'self_report_preview', ?, '0', '0'),
    ('hr_report', 'hr_report', ?, '0', '0'),('disable_coach_sharing', 'disable_coach_sharing', ?, '0', '0')
   `
   ,
    [data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id,data.org_id],
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
