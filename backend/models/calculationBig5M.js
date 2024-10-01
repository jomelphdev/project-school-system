import db from "../config/database.js"

export const GetBig5SurveyResultM = (survey_assignment_id, result) => {
  db.query('SELECT * FROM survey_result WHERE survey_assignment_id = ?',
    [survey_assignment_id],
    (err, results) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, results)
    }
  })
}

export const big5InsertSurveyResultTraitsM = (data, result) => {
  let s1_survey_assignment_id = data[0]['survey_assignment_id'];
  let s1_org_id = data[0]['org_id'];
  let s1_suborg_id = data[0]['suborg_id'];

  //let pos = data.map(function(e) { return e.statement_num; }).indexOf('Q7');
  //console.log ("pos value: " + pos );
  //console.log ("Q1_pos : "+ Q1_pos);
  ////ER1//////
  let Q1_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q1');
  let Q31_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q31');
  let Q61_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q61');
  let Q91_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q91');
  
  console.log ( "data q1 pos score: " + data[Q1_pos]['score']);
  console.log ( "data q31 pos score: " + data[Q31_pos]['score']);
  console.log ( "data q61 pos score: " + data[Q61_pos]['score']);
  console.log ( "data q91 pos score: " + data[Q91_pos]['score']);

  let Q1_score = data[Q1_pos]['score'];
  let Q31_score = data[Q31_pos]['score'];
  let Q61_score = data[Q61_pos]['score'];
  let Q91_score = data[Q91_pos]['score'];

  let ER1 = ( Q1_score + Q31_score + Q61_score + Q91_score);
  console.log ("ER1 Total:" +ER1);
  ER1 = ER1 / 4;
  console.log ("ER1 AVG:" +ER1);

////ER2//////sr.statement_num IN ('Q6', 'Q36', 'Q66', 'Q96') AND sr.record_type = 'Statement') AS ER2,
let Q6_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q6');
let Q36_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q36');
let Q66_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q66');
let Q96_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q96');

console.log ( "data q6 pos score: " + data[Q6_pos]['score']);
console.log ( "data q36 pos score: " + data[Q36_pos]['score']);
console.log ( "data q66 pos score: " + data[Q66_pos]['score']);
console.log ( "data q96 pos score: " + data[Q96_pos]['score']);

let Q6_score = data[Q6_pos]['score'];
let Q36_score = data[Q36_pos]['score'];
let Q66_score = data[Q66_pos]['score'];
let Q96_score = data[Q96_pos]['score'];

let ER2 = ( Q6_score + Q36_score + Q66_score + Q96_score);
console.log ("ER2 Total:" +ER2);
ER2 = ER2 / 4;
console.log ("ER2 AVG:" +ER2);


////ER3////// ('Q11', 'Q41', 'Q71', 'Q101') AND sr.record_type = 'Statement') AS ER3,
let Q11_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q11');
let Q41_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q41');
let Q71_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q71');
let Q101_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q101');

let Q11_score = data[Q11_pos]['score'];
let Q41_score = data[Q41_pos]['score'];
let Q71_score = data[Q71_pos]['score'];
let Q101_score = data[Q101_pos]['score'];

let ER3 = ( Q11_score + Q41_score + Q71_score + Q101_score);
console.log ("ER3 Total:" +ER3);
ER3 = ER3 / 4;
console.log ("ER3 AVG:" +ER3);

////ER4////// ('Q16', 'Q46', 'Q76', 'Q106') AND sr.record_type = 'Statement') AS ER4,
let Q16_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q16');
let Q46_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q46');
let Q76_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q76');
let Q106_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q106');

let Q16_score = data[Q16_pos]['score'];
let Q46_score = data[Q46_pos]['score'];
let Q76_score = data[Q76_pos]['score'];
let Q106_score = data[Q106_pos]['score'];

let ER4 = ( Q16_score + Q46_score + Q76_score + Q106_score);
console.log ("ER4 Total:" +ER4);
ER4 = ER4 / 4;
console.log ("ER4 AVG:" +ER4);

////ER5////// sr.statement_num IN ('Q21', 'Q51', 'Q81', 'Q111') AND sr.record_type = 'Statement') AS ER5,
let Q21_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q21');
let Q51_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q51');
let Q81_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q81');
let Q111_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q111');

let Q21_score = data[Q21_pos]['score'];
let Q51_score = data[Q51_pos]['score'];
let Q81_score = data[Q81_pos]['score'];
let Q111_score = data[Q111_pos]['score'];

let ER5 = ( Q21_score + Q51_score + Q81_score + Q111_score);
console.log ("ER5 Total:" +ER5);
ER5 = ER5 / 4;
console.log ("ER5 AVG:" +ER5);


////ER6//////sr.statement_num IN ('Q26', 'Q56', 'Q86', 'Q116') AND sr.record_type = 'Statement') AS ER6,
let Q26_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q26');
let Q56_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q56');
let Q86_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q86');
let Q116_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q116');

let Q26_score = data[Q26_pos]['score'];
let Q56_score = data[Q56_pos]['score'];
let Q86_score = data[Q86_pos]['score'];
let Q116_score = data[Q116_pos]['score'];

let ER6 = ( Q26_score + Q56_score + Q86_score + Q116_score);
console.log ("ER6 Total:" +ER6);
ER6 = ER6 / 4;
console.log ("ER6 AVG:" +ER6);

////E1////// sr.statement_num IN ('Q2', 'Q32', 'Q62', 'Q92') AND sr.record_type = 'Statement') AS E1,
let Q2_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q2');
let Q32_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q32');
let Q62_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q62');
let Q92_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q92');

let Q2_score = data[Q2_pos]['score'];
let Q32_score = data[Q32_pos]['score'];
let Q62_score = data[Q62_pos]['score'];
let Q92_score = data[Q92_pos]['score'];

let E1 = ( Q2_score + Q32_score + Q62_score + Q92_score);
console.log ("E1 Total:" +E1);
E1= E1 / 4;
console.log ("E1 AVG:" +ER1);


////E2//////sr.statement_num IN ('Q7', 'Q37', 'Q67', 'Q97') AND sr.record_type = 'Statement') AS E2,
let Q7_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q7');
let Q37_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q37');
let Q67_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q67');
let Q97_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q97');

let Q7_score = data[Q7_pos]['score'];
let Q37_score = data[Q37_pos]['score'];
let Q67_score = data[Q67_pos]['score'];
let Q97_score = data[Q97_pos]['score'];

let E2 = ( Q7_score + Q37_score + Q67_score + Q97_score);
console.log ("E2 Total:" +E2);
E2= E2 / 4;
console.log ("E2 AVG:" +ER2);


////E3//////('Q12', 'Q42', 'Q72', 'Q102') AND sr.record_type = 'Statement') AS E3,
let Q12_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q12');
let Q42_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q42');
let Q72_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q72');
let Q102_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q102');

let Q12_score = data[Q12_pos]['score'];
let Q42_score = data[Q42_pos]['score'];
let Q72_score = data[Q72_pos]['score'];
let Q102_score = data[Q102_pos]['score'];

let E3 = ( Q12_score + Q42_score + Q72_score + Q102_score);
console.log ("E3 Total:" +E3);
E3= E3 / 4;
console.log ("E3 AVG:" +ER3);


////E4//////  ('Q17', 'Q47', 'Q77', 'Q107') AND sr.record_type = 'Statement') AS E4,
let Q17_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q17');
let Q47_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q47');
let Q77_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q77');
let Q107_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q107');

let Q17_score = data[Q17_pos]['score'];
let Q47_score = data[Q47_pos]['score'];
let Q77_score = data[Q77_pos]['score'];
let Q107_score = data[Q107_pos]['score'];

let E4 = ( Q17_score + Q47_score + Q77_score + Q107_score);
console.log ("E4 Total:" +E4);
E4= E4 / 4;
console.log ("E4 AVG:" +ER4);

////E5//////sr.statement_num IN ('Q22', 'Q52', 'Q82', 'Q112') AND sr.record_type = 'Statement') AS E5,
let Q22_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q22');
let Q52_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q52');
let Q82_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q82');
let Q112_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q112');

let Q22_score = data[Q22_pos]['score'];
let Q52_score = data[Q52_pos]['score'];
let Q82_score = data[Q82_pos]['score'];
let Q112_score = data[Q112_pos]['score'];

let E5 = ( Q22_score + Q52_score + Q82_score + Q112_score);
console.log ("E5 Total:" +E5);
E5= E5 / 4;
console.log ("E5 AVG:" +ER5);

////E6/////sr.statement_num IN ('Q27', 'Q57', 'Q87', 'Q117') AND sr.record_type = 'Statement') AS E6,
let Q27_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q27');
let Q57_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q57');
let Q87_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q87');
let Q117_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q117');

let Q27_score = data[Q27_pos]['score'];
let Q57_score = data[Q57_pos]['score'];
let Q87_score = data[Q87_pos]['score'];
let Q117_score = data[Q117_pos]['score'];

let E6 = ( Q27_score + Q57_score + Q87_score + Q117_score);
console.log ("E6 Total:" +E6);
E6= E6 / 4;
console.log ("E6 AVG:" +ER6);


/////O1//// sr.statement_num IN ('Q3', 'Q33', 'Q63', 'Q93') AND sr.record_type = 'Statement') AS O1,
let Q3_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q3');
let Q33_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q33');
let Q63_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q63');
let Q93_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q93');

let Q3_score = data[Q3_pos]['score'];
let Q33_score = data[Q33_pos]['score'];
let Q63_score = data[Q63_pos]['score'];
let Q93_score = data[Q93_pos]['score'];

let O1 = ( Q3_score + Q33_score + Q63_score + Q93_score);
console.log ("O1 Total:" +O1);
O1= O1 / 4;
console.log ("O1 AVG:" +O1);

/////O2////  sr.statement_num IN ('Q8', 'Q38', 'Q68', 'Q98') AND sr.record_type = 'Statement') AS O2,
let Q8_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q8');
let Q38_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q38');
let Q68_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q68');
let Q98_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q98');

let Q8_score = data[Q8_pos]['score'];
let Q38_score = data[Q38_pos]['score'];
let Q68_score = data[Q68_pos]['score'];
let Q98_score = data[Q98_pos]['score'];

let O2 = ( Q8_score + Q38_score + Q68_score + Q98_score);
console.log ("O1 Total:" +O2);
O2= O2 / 4;
console.log ("O2 AVG:" +O2);

/////O3////  AND sr.statement_num IN ('Q13', 'Q43', 'Q73', 'Q103') AND sr.record_type = 'Statement') AS O3,
let Q13_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q13');
let Q43_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q43');
let Q73_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q73');
let Q103_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q103');

let Q13_score = data[Q13_pos]['score'];
let Q43_score = data[Q43_pos]['score'];
let Q73_score = data[Q73_pos]['score'];
let Q103_score = data[Q103_pos]['score'];

let O3 = ( Q13_score + Q43_score + Q73_score + Q103_score);
console.log ("O3 Total:" +O3);
O3= O3 / 4;
console.log ("O3 AVG:" +O3);


/////O4////    AND sr.statement_num IN ('Q18', 'Q48', 'Q78', 'Q108') AND sr.record_type = 'Statement') AS O4,
let Q18_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q18');
let Q48_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q48');
let Q78_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q78');
let Q108_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q108');

let Q18_score = data[Q18_pos]['score'];
let Q48_score = data[Q48_pos]['score'];
let Q78_score = data[Q78_pos]['score'];
let Q108_score = data[Q108_pos]['score'];

let O4 = ( Q18_score + Q48_score + Q78_score + Q108_score);
console.log ("O4 Total:" +O4);
O4= O4 / 4;
console.log ("O4 AVG:" +O4);



/////O5////  AND sr.statement_num IN ('Q23', 'Q53', 'Q83', 'Q113') AND sr.record_type = 'Statement') AS O5,
let Q23_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q23');
let Q53_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q53');
let Q83_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q83');
let Q113_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q113');

let Q23_score = data[Q23_pos]['score'];
let Q53_score = data[Q53_pos]['score'];
let Q83_score = data[Q83_pos]['score'];
let Q113_score = data[Q113_pos]['score'];

let O5 = ( Q23_score + Q53_score + Q83_score + Q113_score);
console.log ("O5 Total:" +O5);
O5= O5 / 4;
console.log ("O5 AVG:" +O5);


/////O6////  AND sr.statement_num IN ('Q28', 'Q58', 'Q88', 'Q118') AND sr.record_type = 'Statement') AS O6,
let Q28_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q28');
let Q58_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q58');
let Q88_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q88');
let Q118_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q118');

let Q28_score = data[Q28_pos]['score'];
let Q58_score = data[Q58_pos]['score'];
let Q88_score = data[Q88_pos]['score'];
let Q118_score = data[Q118_pos]['score'];

let O6 = ( Q28_score + Q58_score + Q88_score + Q118_score);
console.log ("O6 Total:" +O6);
O6= O6 / 4;
console.log ("O6 AVG:" +O6);


/////A1////  AND sr.statement_num IN ('Q4', 'Q34', 'Q64', 'Q94') AND sr.record_type = 'Statement') AS A1,
let Q4_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q4');
let Q34_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q34');
let Q64_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q64');
let Q94_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q94');

let Q4_score = data[Q4_pos]['score'];
let Q34_score = data[Q34_pos]['score'];
let Q64_score = data[Q64_pos]['score'];
let Q94_score = data[Q94_pos]['score'];

let A1 = ( Q4_score + Q34_score + Q64_score + Q94_score);
console.log ("A1 Total:" +A1);
A1= A1 / 4;
console.log ("A1 AVG:" +A1);


/////A2////  AND sr.statement_num IN ('Q9', 'Q39', 'Q69', 'Q99') AND sr.record_type = 'Statement') AS A2,
let Q9_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q9');
let Q39_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q39');
let Q69_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q69');
let Q99_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q99');

let Q9_score = data[Q9_pos]['score'];
let Q39_score = data[Q39_pos]['score'];
let Q69_score = data[Q69_pos]['score'];
let Q99_score = data[Q99_pos]['score'];

let A2 = ( Q9_score + Q39_score + Q69_score + Q99_score);
console.log ("A2 Total:" +A2);
A2= A2 / 4;
console.log ("A2 AVG:" +A2);


/////A3////  AND sr.statement_num IN ('Q14', 'Q44', 'Q74', 'Q104') AND sr.record_type = 'Statement') AS A3,
let Q14_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q14');
let Q44_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q44');
let Q74_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q74');
let Q104_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q104');

let Q14_score = data[Q14_pos]['score'];
let Q44_score = data[Q44_pos]['score'];
let Q74_score = data[Q74_pos]['score'];
let Q104_score = data[Q104_pos]['score'];

let A3 = ( Q14_score + Q44_score + Q74_score + Q104_score);
console.log ("A3 Total:" +A3);
A3= A3 / 4;
console.log ("A3 AVG:" +A3);


/////A4////   AND sr.statement_num IN ('Q19', 'Q49', 'Q79', 'Q109') AND sr.record_type = 'Statement') AS A4,
let Q19_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q19');
let Q49_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q49');
let Q79_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q79');
let Q109_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q109');

let Q19_score = data[Q19_pos]['score'];
let Q49_score = data[Q49_pos]['score'];
let Q79_score = data[Q79_pos]['score'];
let Q109_score = data[Q109_pos]['score'];

let A4 = ( Q19_score + Q49_score + Q79_score + Q109_score);
console.log ("A4 Total:" +A4);
A4= A4 / 4;
console.log ("A4 AVG:" +A4);



/////A5////AND sr.statement_num IN ('Q24', 'Q54', 'Q84', 'Q114') AND sr.record_type = 'Statement') AS A5,
let Q24_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q24');
let Q54_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q54');
let Q84_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q84');
let Q114_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q114');

let Q24_score = data[Q24_pos]['score'];
let Q54_score = data[Q54_pos]['score'];
let Q84_score = data[Q84_pos]['score'];
let Q114_score = data[Q114_pos]['score'];

let A5 = ( Q24_score + Q54_score + Q84_score + Q114_score);
console.log ("A5 Total:" +A5);
A5= A5 / 4;
console.log ("A5 AVG:" +A5);



/////A6////  AND sr.statement_num IN ('Q29', 'Q59', 'Q89', 'Q119') AND sr.record_type = 'Statement') AS A6,
let Q29_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q29');
let Q59_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q59');
let Q89_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q89');
let Q119_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q119');

let Q29_score = data[Q29_pos]['score'];
let Q59_score = data[Q59_pos]['score'];
let Q89_score = data[Q89_pos]['score'];
let Q119_score = data[Q119_pos]['score'];

let A6 = ( Q29_score + Q59_score + Q89_score + Q119_score);
console.log ("A6 Total:" +A6);
A6= A6 / 4;
console.log ("A6 AVG:" +A6);


/////C1////  AND sr.statement_num IN ('Q5', 'Q35', 'Q65', 'Q95') AND sr.record_type = 'Statement') AS C1,
let Q5_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q5');
let Q35_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q35');
let Q65_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q65');
let Q95_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q95');

let Q5_score = data[Q5_pos]['score'];
let Q35_score = data[Q35_pos]['score'];
let Q65_score = data[Q65_pos]['score'];
let Q95_score = data[Q95_pos]['score'];

let C1 = ( Q5_score + Q35_score + Q65_score + Q95_score);
console.log ("C1 Total:" +C1);
C1= C1 / 4;
console.log ("C1 AVG:" +C1);



/////C2////  AND sr.statement_num IN ('Q10', 'Q40', 'Q70', 'Q100') AND sr.record_type = 'Statement') AS C2,
let Q10_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q10');
let Q40_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q40');
let Q70_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q70');
let Q100_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q100');

let Q10_score = data[Q10_pos]['score'];
let Q40_score = data[Q40_pos]['score'];
let Q70_score = data[Q70_pos]['score'];
let Q100_score = data[Q100_pos]['score'];

let C2 = ( Q10_score + Q40_score + Q70_score + Q100_score);
console.log ("C2 Total:" +C2);
C2= C2 / 4;
console.log ("C2 AVG:" +C2);



/////C3////   AND sr.statement_num IN ('Q15', 'Q45', 'Q75', 'Q105') AND sr.record_type = 'Statement') AS C3,
let Q15_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q15');
let Q45_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q45');
let Q75_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q75');
let Q105_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q105');

let Q15_score = data[Q15_pos]['score'];
let Q45_score = data[Q45_pos]['score'];
let Q75_score = data[Q75_pos]['score'];
let Q105_score = data[Q105_pos]['score'];

let C3 = ( Q15_score + Q45_score + Q75_score + Q105_score);
console.log ("C3 Total:" +C3);
C3= C3 / 4;
console.log ("C3 AVG:" +C3);



/////C4////   AND sr.statement_num IN ('Q20', 'Q50', 'Q80', 'Q110') AND sr.record_type = 'Statement') AS C4,
let Q20_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q20');
let Q50_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q50');
let Q80_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q80');
let Q110_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q110');

let Q20_score = data[Q20_pos]['score'];
let Q50_score = data[Q50_pos]['score'];
let Q80_score = data[Q80_pos]['score'];
let Q110_score = data[Q110_pos]['score'];

let C4 = ( Q20_score + Q50_score + Q80_score + Q110_score);
console.log ("C4 Total:" +C4);
C4= C4 / 4;
console.log ("C4 AVG:" +C4);




/////C5////  AND sr.statement_num IN ('Q25', 'Q55', 'Q85', 'Q115') AND sr.record_type = 'Statement') AS C5,
let Q25_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q25');
let Q55_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q55');
let Q85_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q85');
let Q115_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q115');

let Q25_score = data[Q25_pos]['score'];
let Q55_score = data[Q55_pos]['score'];
let Q85_score = data[Q85_pos]['score'];
let Q115_score = data[Q115_pos]['score'];

let C5 = ( Q25_score + Q55_score + Q85_score + Q115_score);
console.log ("C5 Total:" +C5);
C5= C5 / 4;
console.log ("C5 AVG:" +C5);

/////C6////AND sr.statement_num IN ('Q30', 'Q60', 'Q90', 'Q120') AND sr.record_type = 'Statement') AS C6
let Q30_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q30');
let Q60_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q60');
let Q90_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q90');
let Q120_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q120');

let Q30_score = data[Q30_pos]['score'];
let Q60_score = data[Q60_pos]['score'];
let Q90_score = data[Q90_pos]['score'];
let Q120_score = data[Q120_pos]['score'];

let C6 = ( Q30_score + Q60_score + Q90_score + Q120_score);
console.log ("C6 Total:" +C6);
C6= C6 / 4;
console.log ("C6 AVG:" +C6);

let ER = (ER1 + ER2 + ER3 + ER4 + ER5 + ER6) / 6;
let E = (E1 + E2 + E3 + E4 + E5 + E6) / 6;
let O = (O1 + O2 + O3 + O4 + O5 + O6) / 6;
let A = (A1 + A2 + A3 + A4 + A5 + A6) / 6;
let C = (C1 + C2 + C3 + C4 + C5 + C6) / 6;

  let query1 = `INSERT INTO survey_result 
  (survey_assignment_id, org_id, suborg_id, record_type, record_type_id, statement_num, answer, score) 
  VALUES 
   (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER1",
      "Anxiety",
      ${ER1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER2",
      "Anger",
      ${ER2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER3",
      "Depression",
      ${ER3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER4",
      "Self-Consciousness",
      ${ER4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER5",
      "Immoderation",
      ${ER5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "ER6",
      "Vulnerability",
      ${ER6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E1",
      "Friendliness",
      ${E1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E2",
      "Gregariousness",
      ${E2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E3",
      "Assertiveness",
      ${E3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E4",
      "Activity level",
      ${E4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E5",
      "Excitement Seeking",
      ${E5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "E6",
      "Cheerfulness",
      ${E6}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O1",
      "Imagination",
      ${O1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O2",
      "Artistic interests",
      ${O2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O3",
      "Emotionality",
      ${O3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O4",
      "Adventurousness",
      ${O4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O5",
      "Intellect",
      ${O5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "O6",
      "Liberalism",
      ${O6}
    ),
   
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A1",
      "Trust",
      ${A1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A2",
      "Morality",
      ${A2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A3",
      "Altruism",
      ${A3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A4",
      "Cooperation",
      ${A4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A5",
      "Modesty",
      ${A5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "A6",
      "Sympathy",
      ${A6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C1",
      "Self-efficacy",
      ${C1}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C2",
      "Orderliness",
      ${C2}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C3",
      "Dutifulness",
      ${C3}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C4",
      "Achievement-striving",
      ${C4}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C5",
      "Self-discipline",
      ${C5}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Subtrait",
      2,
      "C6",
      "Cautiousness",
      ${C6}
    ),

    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "ER",
      "Emotional Reactiveness",
      ${ER}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "E",
      "Extraversion",
      ${E}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "O",
      "Openness to Experience",
      ${O}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "A",
      "Agreeableness",
      ${A}
    ),
    (
      ${s1_survey_assignment_id},
      ${s1_org_id},
      ${s1_suborg_id},
      "Supertrait",
      3,
      "C",
      "Conscientiousness",
      ${C}
    )

  `
  console.log(query1)



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

export const big5InsertRawCalcM = (data, result) => {
  let s1_survey_assignment_id = data[0]['survey_assignment_id'];

  //? ER1
  let Q1_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q1');
  let Q31_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q31');
  let Q61_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q61');
  let Q91_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q91');

  let Q1_score = data[Q1_pos]['score'];
  let Q31_score = data[Q31_pos]['score'];
  let Q61_score = data[Q61_pos]['score'];
  let Q91_score = data[Q91_pos]['score'];

  let ER1 = ( Q1_score + Q31_score + Q61_score + Q91_score);
  ER1 = ER1 / 4;

  //? ER2
  let Q6_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q6');
  let Q36_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q36');
  let Q66_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q66');
  let Q96_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q96');

  let Q6_score = data[Q6_pos]['score'];
  let Q36_score = data[Q36_pos]['score'];
  let Q66_score = data[Q66_pos]['score'];
  let Q96_score = data[Q96_pos]['score'];

  let ER2 = ( Q6_score + Q36_score + Q66_score + Q96_score);
  ER2 = ER2 / 4;

  //? ER3
  let Q11_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q11');
  let Q41_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q41');
  let Q71_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q71');
  let Q101_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q101');

  let Q11_score = data[Q11_pos]['score'];
  let Q41_score = data[Q41_pos]['score'];
  let Q71_score = data[Q71_pos]['score'];
  let Q101_score = data[Q101_pos]['score'];

  let ER3 = ( Q11_score + Q41_score + Q71_score + Q101_score);
  ER3 = ER3 / 4;

  //? ER4
  let Q16_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q16');
  let Q46_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q46');
  let Q76_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q76');
  let Q106_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q106');

  let Q16_score = data[Q16_pos]['score'];
  let Q46_score = data[Q46_pos]['score'];
  let Q76_score = data[Q76_pos]['score'];
  let Q106_score = data[Q106_pos]['score'];

  let ER4 = ( Q16_score + Q46_score + Q76_score + Q106_score);
  ER4 = ER4 / 4;

  //? ER5
  let Q21_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q21');
  let Q51_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q51');
  let Q81_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q81');
  let Q111_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q111');

  let Q21_score = data[Q21_pos]['score'];
  let Q51_score = data[Q51_pos]['score'];
  let Q81_score = data[Q81_pos]['score'];
  let Q111_score = data[Q111_pos]['score'];

  let ER5 = ( Q21_score + Q51_score + Q81_score + Q111_score);
  ER5 = ER5 / 4;

  //? ER6
  let Q26_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q26');
  let Q56_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q56');
  let Q86_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q86');
  let Q116_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q116');

  let Q26_score = data[Q26_pos]['score'];
  let Q56_score = data[Q56_pos]['score'];
  let Q86_score = data[Q86_pos]['score'];
  let Q116_score = data[Q116_pos]['score'];

  let ER6 = ( Q26_score + Q56_score + Q86_score + Q116_score);
  ER6 = ER6 / 4;

  //? E1
  let Q2_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q2');
  let Q32_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q32');
  let Q62_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q62');
  let Q92_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q92');

  let Q2_score = data[Q2_pos]['score'];
  let Q32_score = data[Q32_pos]['score'];
  let Q62_score = data[Q62_pos]['score'];
  let Q92_score = data[Q92_pos]['score'];

  let E1 = ( Q2_score + Q32_score + Q62_score + Q92_score);
  E1= E1 / 4;

  //? E2
  let Q7_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q7');
  let Q37_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q37');
  let Q67_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q67');
  let Q97_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q97');

  let Q7_score = data[Q7_pos]['score'];
  let Q37_score = data[Q37_pos]['score'];
  let Q67_score = data[Q67_pos]['score'];
  let Q97_score = data[Q97_pos]['score'];

  let E2 = ( Q7_score + Q37_score + Q67_score + Q97_score);
  E2 = E2 / 4;

  //? E3
  let Q12_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q12');
  let Q42_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q42');
  let Q72_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q72');
  let Q102_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q102');

  let Q12_score = data[Q12_pos]['score'];
  let Q42_score = data[Q42_pos]['score'];
  let Q72_score = data[Q72_pos]['score'];
  let Q102_score = data[Q102_pos]['score'];

  let E3 = ( Q12_score + Q42_score + Q72_score + Q102_score);
  E3 = E3 / 4;

  //? E4
  let Q17_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q17');
  let Q47_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q47');
  let Q77_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q77');
  let Q107_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q107');

  let Q17_score = data[Q17_pos]['score'];
  let Q47_score = data[Q47_pos]['score'];
  let Q77_score = data[Q77_pos]['score'];
  let Q107_score = data[Q107_pos]['score'];

  let E4 = ( Q17_score + Q47_score + Q77_score + Q107_score);
  E4 = E4 / 4;

  //? E5
  let Q22_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q22');
  let Q52_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q52');
  let Q82_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q82');
  let Q112_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q112');

  let Q22_score = data[Q22_pos]['score'];
  let Q52_score = data[Q52_pos]['score'];
  let Q82_score = data[Q82_pos]['score'];
  let Q112_score = data[Q112_pos]['score'];

  let E5 = ( Q22_score + Q52_score + Q82_score + Q112_score);
  E5 = E5 / 4;

  //? E6
  let Q27_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q27');
  let Q57_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q57');
  let Q87_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q87');
  let Q117_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q117');

  let Q27_score = data[Q27_pos]['score'];
  let Q57_score = data[Q57_pos]['score'];
  let Q87_score = data[Q87_pos]['score'];
  let Q117_score = data[Q117_pos]['score'];

  let E6 = ( Q27_score + Q57_score + Q87_score + Q117_score);
  E6 = E6 / 4;

  //? O1
  let Q3_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q3');
  let Q33_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q33');
  let Q63_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q63');
  let Q93_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q93');

  let Q3_score = data[Q3_pos]['score'];
  let Q33_score = data[Q33_pos]['score'];
  let Q63_score = data[Q63_pos]['score'];
  let Q93_score = data[Q93_pos]['score'];

  let O1 = ( Q3_score + Q33_score + Q63_score + Q93_score);
  O1 = O1 / 4;

  //? O2
  let Q8_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q8');
  let Q38_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q38');
  let Q68_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q68');
  let Q98_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q98');

  let Q8_score = data[Q8_pos]['score'];
  let Q38_score = data[Q38_pos]['score'];
  let Q68_score = data[Q68_pos]['score'];
  let Q98_score = data[Q98_pos]['score'];

  let O2 = ( Q8_score + Q38_score + Q68_score + Q98_score);
  O2 = O2 / 4;

  //? O3
  let Q13_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q13');
  let Q43_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q43');
  let Q73_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q73');
  let Q103_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q103');

  let Q13_score = data[Q13_pos]['score'];
  let Q43_score = data[Q43_pos]['score'];
  let Q73_score = data[Q73_pos]['score'];
  let Q103_score = data[Q103_pos]['score'];

  let O3 = ( Q13_score + Q43_score + Q73_score + Q103_score);
  O3 = O3 / 4;

  //? O4
  let Q18_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q18');
  let Q48_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q48');
  let Q78_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q78');
  let Q108_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q108');

  let Q18_score = data[Q18_pos]['score'];
  let Q48_score = data[Q48_pos]['score'];
  let Q78_score = data[Q78_pos]['score'];
  let Q108_score = data[Q108_pos]['score'];

  let O4 = ( Q18_score + Q48_score + Q78_score + Q108_score);
  O4 = O4 / 4;

  //? O5
  let Q23_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q23');
  let Q53_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q53');
  let Q83_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q83');
  let Q113_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q113');

  let Q23_score = data[Q23_pos]['score'];
  let Q53_score = data[Q53_pos]['score'];
  let Q83_score = data[Q83_pos]['score'];
  let Q113_score = data[Q113_pos]['score'];

  let O5 = ( Q23_score + Q53_score + Q83_score + Q113_score);
  O5 = O5 / 4;

  //? O6
  let Q28_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q28');
  let Q58_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q58');
  let Q88_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q88');
  let Q118_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q118');

  let Q28_score = data[Q28_pos]['score'];
  let Q58_score = data[Q58_pos]['score'];
  let Q88_score = data[Q88_pos]['score'];
  let Q118_score = data[Q118_pos]['score'];

  let O6 = ( Q28_score + Q58_score + Q88_score + Q118_score);
  O6 = O6 / 4;

  //? A1
  let Q4_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q4');
  let Q34_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q34');
  let Q64_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q64');
  let Q94_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q94');

  let Q4_score = data[Q4_pos]['score'];
  let Q34_score = data[Q34_pos]['score'];
  let Q64_score = data[Q64_pos]['score'];
  let Q94_score = data[Q94_pos]['score'];

  let A1 = ( Q4_score + Q34_score + Q64_score + Q94_score);
  A1 = A1 / 4;

  //? A2
  let Q9_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q9');
  let Q39_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q39');
  let Q69_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q69');
  let Q99_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q99');

  let Q9_score = data[Q9_pos]['score'];
  let Q39_score = data[Q39_pos]['score'];
  let Q69_score = data[Q69_pos]['score'];
  let Q99_score = data[Q99_pos]['score'];

  let A2 = ( Q9_score + Q39_score + Q69_score + Q99_score);
  A2 = A2 / 4;

  //? A3
  let Q14_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q14');
  let Q44_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q44');
  let Q74_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q74');
  let Q104_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q104');

  let Q14_score = data[Q14_pos]['score'];
  let Q44_score = data[Q44_pos]['score'];
  let Q74_score = data[Q74_pos]['score'];
  let Q104_score = data[Q104_pos]['score'];

  let A3 = ( Q14_score + Q44_score + Q74_score + Q104_score);
  A3 = A3 / 4;

  //? A4
  let Q19_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q19');
  let Q49_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q49');
  let Q79_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q79');
  let Q109_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q109');

  let Q19_score = data[Q19_pos]['score'];
  let Q49_score = data[Q49_pos]['score'];
  let Q79_score = data[Q79_pos]['score'];
  let Q109_score = data[Q109_pos]['score'];

  let A4 = ( Q19_score + Q49_score + Q79_score + Q109_score);
  A4 = A4 / 4;

  //? A5
  let Q24_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q24');
  let Q54_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q54');
  let Q84_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q84');
  let Q114_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q114');

  let Q24_score = data[Q24_pos]['score'];
  let Q54_score = data[Q54_pos]['score'];
  let Q84_score = data[Q84_pos]['score'];
  let Q114_score = data[Q114_pos]['score'];

  let A5 = ( Q24_score + Q54_score + Q84_score + Q114_score);
  A5 = A5 / 4;

  //? A6
  let Q29_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q29');
  let Q59_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q59');
  let Q89_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q89');
  let Q119_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q119');

  let Q29_score = data[Q29_pos]['score'];
  let Q59_score = data[Q59_pos]['score'];
  let Q89_score = data[Q89_pos]['score'];
  let Q119_score = data[Q119_pos]['score'];

  let A6 = ( Q29_score + Q59_score + Q89_score + Q119_score);
  A6 = A6 / 4;

  //? C1
  let Q5_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q5');
  let Q35_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q35');
  let Q65_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q65');
  let Q95_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q95');

  let Q5_score = data[Q5_pos]['score'];
  let Q35_score = data[Q35_pos]['score'];
  let Q65_score = data[Q65_pos]['score'];
  let Q95_score = data[Q95_pos]['score'];

  let C1 = ( Q5_score + Q35_score + Q65_score + Q95_score);
  C1 = C1 / 4;

  //? C2
  let Q10_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q10');
  let Q40_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q40');
  let Q70_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q70');
  let Q100_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q100');

  let Q10_score = data[Q10_pos]['score'];
  let Q40_score = data[Q40_pos]['score'];
  let Q70_score = data[Q70_pos]['score'];
  let Q100_score = data[Q100_pos]['score'];

  let C2 = ( Q10_score + Q40_score + Q70_score + Q100_score);
  C2 = C2 / 4;

  //? C3
  let Q15_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q15');
  let Q45_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q45');
  let Q75_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q75');
  let Q105_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q105');

  let Q15_score = data[Q15_pos]['score'];
  let Q45_score = data[Q45_pos]['score'];
  let Q75_score = data[Q75_pos]['score'];
  let Q105_score = data[Q105_pos]['score'];

  let C3 = ( Q15_score + Q45_score + Q75_score + Q105_score);
  C3 = C3 / 4;

  //? C4
  let Q20_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q20');
  let Q50_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q50');
  let Q80_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q80');
  let Q110_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q110');

  let Q20_score = data[Q20_pos]['score'];
  let Q50_score = data[Q50_pos]['score'];
  let Q80_score = data[Q80_pos]['score'];
  let Q110_score = data[Q110_pos]['score'];

  let C4 = ( Q20_score + Q50_score + Q80_score + Q110_score);
  C4 = C4 / 4;

  //? C5
  let Q25_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q25');
  let Q55_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q55');
  let Q85_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q85');
  let Q115_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q115');

  let Q25_score = data[Q25_pos]['score'];
  let Q55_score = data[Q55_pos]['score'];
  let Q85_score = data[Q85_pos]['score'];
  let Q115_score = data[Q115_pos]['score'];

  let C5 = ( Q25_score + Q55_score + Q85_score + Q115_score);
  C5 = C5 / 4;

  //? C6
  let Q30_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q30');
  let Q60_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q60');
  let Q90_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q90');
  let Q120_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q120');

  let Q30_score = data[Q30_pos]['score'];
  let Q60_score = data[Q60_pos]['score'];
  let Q90_score = data[Q90_pos]['score'];
  let Q120_score = data[Q120_pos]['score'];

  let C6 = ( Q30_score + Q60_score + Q90_score + Q120_score);
  C6= C6 / 4;
  
  //! SUPERTRAITS 
  let ER = (ER1 + ER2 + ER3 + ER4 + ER5 + ER6) / 6;
  let E = (E1 + E2 + E3 + E4 + E5 + E6) / 6;
  let O = (O1 + O2 + O3 + O4 + O5 + O6) / 6;
  let A = (A1 + A2 + A3 + A4 + A5 + A6) / 6;
  let C = (C1 + C2 + C3 + C4 + C5 + C6) / 6;

  let query1 = `
    INSERT INTO b5_norm_raw 
      (
      source,
      country, sex, age, 
      er1, er2, er3, er4, er5, er6, 
      e1, e2, e3, e4, e5, e6, 
      o1, o2, o3, o4, o5, o6, 
      a1, a2, a3, a4, a5, a6, 
      c1, c2, c3, c4, c5, c6, 
      er, e, o, a, c, 
      survey_assignment_id, ind_id, 
      org_id, suborg_id, program_id, iteration_id,
      created_by, modified_by
      ) 
      VALUES
      (
        'sa',
        (select answer as country from survey_result where survey_assignment_id = ${s1_survey_assignment_id} and statement_num = 'Q121'),
        (select answer as sex from survey_result where survey_assignment_id = ${s1_survey_assignment_id} and statement_num = 'Q122'),
        (select answer as age from survey_result where survey_assignment_id = ${s1_survey_assignment_id} and statement_num = 'Q123'),
        '${ER1}',
        '${ER2}',
        '${ER3}',
        '${ER4}',
        '${ER5}',
        '${ER6}',
        '${E1}',
        '${E2}',
        '${E3}',
        '${E4}',
        '${E5}',
        '${E6}',
        '${O1}',
        '${O2}',
        '${O3}',
        '${O4}',
        '${O5}',
        '${O6}',
        '${A1}',
        '${A2}',
        '${A3}',
        '${A4}',
        '${A5}',
        '${A6}',
        '${C1}',
        '${C2}',
        '${C3}',
        '${C4}',
        '${C5}',
        '${C6}',
        '${ER}',
        '${E}',
        '${O}',
        '${A}',
        '${C}',
        ${s1_survey_assignment_id},
        (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
        (SELECT org_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
        (SELECT suborg_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
        (SELECT program_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
        (SELECT iteration_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
        (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
        (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id})
      ) 
  `
  db.query(query1,
    [],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${s1_survey_assignment_id}`

        db.query(
          query2,
          [],
          (err, results) => {
            if (err) {
              console.log(err)
              //result(err, null)
            } else {
              console.log(query2)
              //result(null, results)

              let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${s1_survey_assignment_id}`

              db.query
                (
                  query3,
                  [],
                  (err, results) => 
                    {
                      if (err) {
                        console.log(err)
                        //result(err, null)
                      } else {
                        console.log(query3)
                        //result(null, results)
                      }
                    }
                )
            }
          }
        )
        result(null, results)
      }
    }
  )
}

// get all survey_assingment with big5 survey
export const getAllSurveyAssignmentBig5M = (result) => {
    const query = `
        SELECT sa.survey_assignment_id, st.survey_type, st.survey_template_name, sa.created_at
        FROM survey_assignment sa 
        LEFT JOIN survey_template st 
        ON sa.survey_template_id = st.survey_template_id 
        WHERE st.survey_type = 1
        AND sa.complete_survey = 1
        AND no_duplicates = 1
        AND complete_calculations = 1
        AND sa.submitted_status = 1
        AND st.survey_template_name LIKE "big 5 Survey"`
    db.query(query, [], (err, results) => {
        if (err) {
            console.log(err)
            result(err, null)
        } else {
            result(null, results)
        }
    })
}
// Delete big5 raw data
export const deleteBig5RawM = (survey_assignment_id, result) => {
    db.query('DELETE FROM b5_norm_raw WHERE survey_assignment_id = ?',
    [survey_assignment_id],
    (err, results) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, results)
      }
    })
}
// insert into big5 raw table with reversed 53, 98 and 113
export const big5InsertRawCalcModifiedM = (data, result) => {
    let s1_survey_assignment_id = data[0]['survey_assignment_id'];
  
    //? ER1
    let Q1_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q1');
    let Q31_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q31');
    let Q61_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q61');
    let Q91_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q91');
  
    let Q1_score = data[Q1_pos]['score'];
    let Q31_score = data[Q31_pos]['score'];
    let Q61_score = data[Q61_pos]['score'];
    let Q91_score = data[Q91_pos]['score'];
  
    let ER1 = ( Q1_score + Q31_score + Q61_score + Q91_score);
    ER1 = ER1 / 4;
  
    //? ER2
    let Q6_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q6');
    let Q36_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q36');
    let Q66_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q66');
    let Q96_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q96');
  
    let Q6_score = data[Q6_pos]['score'];
    let Q36_score = data[Q36_pos]['score'];
    let Q66_score = data[Q66_pos]['score'];
    let Q96_score = data[Q96_pos]['score'];
  
    let ER2 = ( Q6_score + Q36_score + Q66_score + Q96_score);
    ER2 = ER2 / 4;
  
    //? ER3
    let Q11_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q11');
    let Q41_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q41');
    let Q71_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q71');
    let Q101_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q101');
  
    let Q11_score = data[Q11_pos]['score'];
    let Q41_score = data[Q41_pos]['score'];
    let Q71_score = data[Q71_pos]['score'];
    let Q101_score = data[Q101_pos]['score'];
  
    let ER3 = ( Q11_score + Q41_score + Q71_score + Q101_score);
    ER3 = ER3 / 4;
  
    //? ER4
    let Q16_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q16');
    let Q46_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q46');
    let Q76_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q76');
    let Q106_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q106');
  
    let Q16_score = data[Q16_pos]['score'];
    let Q46_score = data[Q46_pos]['score'];
    let Q76_score = data[Q76_pos]['score'];
    let Q106_score = data[Q106_pos]['score'];
  
    let ER4 = ( Q16_score + Q46_score + Q76_score + Q106_score);
    ER4 = ER4 / 4;
  
    //? ER5
    let Q21_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q21');
    let Q51_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q51');
    let Q81_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q81');
    let Q111_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q111');
  
    let Q21_score = data[Q21_pos]['score'];
    let Q51_score = data[Q51_pos]['score'];
    let Q81_score = data[Q81_pos]['score'];
    let Q111_score = data[Q111_pos]['score'];
  
    let ER5 = ( Q21_score + Q51_score + Q81_score + Q111_score);
    ER5 = ER5 / 4;
  
    //? ER6
    let Q26_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q26');
    let Q56_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q56');
    let Q86_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q86');
    let Q116_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q116');
  
    let Q26_score = data[Q26_pos]['score'];
    let Q56_score = data[Q56_pos]['score'];
    let Q86_score = data[Q86_pos]['score'];
    let Q116_score = data[Q116_pos]['score'];
  
    let ER6 = ( Q26_score + Q56_score + Q86_score + Q116_score);
    ER6 = ER6 / 4;
  
    //? E1
    let Q2_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q2');
    let Q32_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q32');
    let Q62_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q62');
    let Q92_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q92');
  
    let Q2_score = data[Q2_pos]['score'];
    let Q32_score = data[Q32_pos]['score'];
    let Q62_score = data[Q62_pos]['score'];
    let Q92_score = data[Q92_pos]['score'];
  
    let E1 = ( Q2_score + Q32_score + Q62_score + Q92_score);
    E1= E1 / 4;
  
    //? E2
    let Q7_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q7');
    let Q37_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q37');
    let Q67_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q67');
    let Q97_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q97');
  
    let Q7_score = data[Q7_pos]['score'];
    let Q37_score = data[Q37_pos]['score'];
    let Q67_score = data[Q67_pos]['score'];
    let Q97_score = data[Q97_pos]['score'];
  
    let E2 = ( Q7_score + Q37_score + Q67_score + Q97_score);
    E2 = E2 / 4;
  
    //? E3
    let Q12_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q12');
    let Q42_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q42');
    let Q72_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q72');
    let Q102_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q102');
  
    let Q12_score = data[Q12_pos]['score'];
    let Q42_score = data[Q42_pos]['score'];
    let Q72_score = data[Q72_pos]['score'];
    let Q102_score = data[Q102_pos]['score'];
  
    let E3 = ( Q12_score + Q42_score + Q72_score + Q102_score);
    E3 = E3 / 4;
  
    //? E4
    let Q17_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q17');
    let Q47_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q47');
    let Q77_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q77');
    let Q107_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q107');
  
    let Q17_score = data[Q17_pos]['score'];
    let Q47_score = data[Q47_pos]['score'];
    let Q77_score = data[Q77_pos]['score'];
    let Q107_score = data[Q107_pos]['score'];
  
    let E4 = ( Q17_score + Q47_score + Q77_score + Q107_score);
    E4 = E4 / 4;
  
    //? E5
    let Q22_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q22');
    let Q52_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q52');
    let Q82_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q82');
    let Q112_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q112');
  
    let Q22_score = data[Q22_pos]['score'];
    let Q52_score = data[Q52_pos]['score'];
    let Q82_score = data[Q82_pos]['score'];
    let Q112_score = data[Q112_pos]['score'];
  
    let E5 = ( Q22_score + Q52_score + Q82_score + Q112_score);
    E5 = E5 / 4;
  
    //? E6
    let Q27_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q27');
    let Q57_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q57');
    let Q87_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q87');
    let Q117_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q117');
  
    let Q27_score = data[Q27_pos]['score'];
    let Q57_score = data[Q57_pos]['score'];
    let Q87_score = data[Q87_pos]['score'];
    let Q117_score = data[Q117_pos]['score'];
  
    let E6 = ( Q27_score + Q57_score + Q87_score + Q117_score);
    E6 = E6 / 4;
  
    //? O1
    let Q3_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q3');
    let Q33_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q33');
    let Q63_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q63');
    let Q93_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q93');
  
    let Q3_score = data[Q3_pos]['score'];
    let Q33_score = data[Q33_pos]['score'];
    let Q63_score = data[Q63_pos]['score'];
    let Q93_score = data[Q93_pos]['score'];
  
    let O1 = ( Q3_score + Q33_score + Q63_score + Q93_score);
    O1 = O1 / 4;
  
    //? O2
    let Q8_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q8');
    let Q38_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q38');
    let Q68_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q68');
    let Q98_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q98');
  
    let Q8_score = data[Q8_pos]['score'];
    let Q38_score = data[Q38_pos]['score'];
    let Q68_score = data[Q68_pos]['score'];
    let Q98_score = data[Q98_pos]['score'];

    let O2 = ( Q8_score + Q38_score + Q68_score + Q98_score);
    O2 = O2 / 4;
  
    //? O3
    let Q13_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q13');
    let Q43_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q43');
    let Q73_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q73');
    let Q103_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q103');
  
    let Q13_score = data[Q13_pos]['score'];
    let Q43_score = data[Q43_pos]['score'];
    let Q73_score = data[Q73_pos]['score'];
    let Q103_score = data[Q103_pos]['score'];
  
    let O3 = ( Q13_score + Q43_score + Q73_score + Q103_score);
    O3 = O3 / 4;
  
    //? O4
    let Q18_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q18');
    let Q48_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q48');
    let Q78_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q78');
    let Q108_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q108');
  
    let Q18_score = data[Q18_pos]['score'];
    let Q48_score = data[Q48_pos]['score'];
    let Q78_score = data[Q78_pos]['score'];
    let Q108_score = data[Q108_pos]['score'];
  
    let O4 = ( Q18_score + Q48_score + Q78_score + Q108_score);
    O4 = O4 / 4;
  
    //? O5
    let Q23_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q23');
    let Q53_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q53');
    let Q83_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q83');
    let Q113_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q113');
  
    let Q23_score = data[Q23_pos]['score'];
    let Q53_score = data[Q53_pos]['score'];
    let Q83_score = data[Q83_pos]['score'];
    let Q113_score = data[Q113_pos]['score'];

    let O5 = ( Q23_score + Q53_score + Q83_score + Q113_score);
    O5 = O5 / 4;
  
    //? O6
    let Q28_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q28');
    let Q58_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q58');
    let Q88_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q88');
    let Q118_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q118');
  
    let Q28_score = data[Q28_pos]['score'];
    let Q58_score = data[Q58_pos]['score'];
    let Q88_score = data[Q88_pos]['score'];
    let Q118_score = data[Q118_pos]['score'];
  
    let O6 = ( Q28_score + Q58_score + Q88_score + Q118_score);
    O6 = O6 / 4;
  
    //? A1
    let Q4_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q4');
    let Q34_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q34');
    let Q64_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q64');
    let Q94_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q94');
  
    let Q4_score = data[Q4_pos]['score'];
    let Q34_score = data[Q34_pos]['score'];
    let Q64_score = data[Q64_pos]['score'];
    let Q94_score = data[Q94_pos]['score'];
  
    let A1 = ( Q4_score + Q34_score + Q64_score + Q94_score);
    A1 = A1 / 4;
  
    //? A2
    let Q9_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q9');
    let Q39_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q39');
    let Q69_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q69');
    let Q99_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q99');
  
    let Q9_score = data[Q9_pos]['score'];
    let Q39_score = data[Q39_pos]['score'];
    let Q69_score = data[Q69_pos]['score'];
    let Q99_score = data[Q99_pos]['score'];
  
    let A2 = ( Q9_score + Q39_score + Q69_score + Q99_score);
    A2 = A2 / 4;
  
    //? A3
    let Q14_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q14');
    let Q44_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q44');
    let Q74_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q74');
    let Q104_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q104');
  
    let Q14_score = data[Q14_pos]['score'];
    let Q44_score = data[Q44_pos]['score'];
    let Q74_score = data[Q74_pos]['score'];
    let Q104_score = data[Q104_pos]['score'];
  
    let A3 = ( Q14_score + Q44_score + Q74_score + Q104_score);
    A3 = A3 / 4;
  
    //? A4
    let Q19_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q19');
    let Q49_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q49');
    let Q79_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q79');
    let Q109_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q109');
  
    let Q19_score = data[Q19_pos]['score'];
    let Q49_score = data[Q49_pos]['score'];
    let Q79_score = data[Q79_pos]['score'];
    let Q109_score = data[Q109_pos]['score'];
  
    let A4 = ( Q19_score + Q49_score + Q79_score + Q109_score);
    A4 = A4 / 4;
  
    //? A5
    let Q24_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q24');
    let Q54_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q54');
    let Q84_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q84');
    let Q114_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q114');
  
    let Q24_score = data[Q24_pos]['score'];
    let Q54_score = data[Q54_pos]['score'];
    let Q84_score = data[Q84_pos]['score'];
    let Q114_score = data[Q114_pos]['score'];
  
    let A5 = ( Q24_score + Q54_score + Q84_score + Q114_score);
    A5 = A5 / 4;
  
    //? A6
    let Q29_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q29');
    let Q59_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q59');
    let Q89_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q89');
    let Q119_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q119');
  
    let Q29_score = data[Q29_pos]['score'];
    let Q59_score = data[Q59_pos]['score'];
    let Q89_score = data[Q89_pos]['score'];
    let Q119_score = data[Q119_pos]['score'];
  
    let A6 = ( Q29_score + Q59_score + Q89_score + Q119_score);
    A6 = A6 / 4;
  
    //? C1
    let Q5_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q5');
    let Q35_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q35');
    let Q65_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q65');
    let Q95_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q95');
  
    let Q5_score = data[Q5_pos]['score'];
    let Q35_score = data[Q35_pos]['score'];
    let Q65_score = data[Q65_pos]['score'];
    let Q95_score = data[Q95_pos]['score'];
  
    let C1 = ( Q5_score + Q35_score + Q65_score + Q95_score);
    C1 = C1 / 4;
  
    //? C2
    let Q10_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q10');
    let Q40_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q40');
    let Q70_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q70');
    let Q100_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q100');
  
    let Q10_score = data[Q10_pos]['score'];
    let Q40_score = data[Q40_pos]['score'];
    let Q70_score = data[Q70_pos]['score'];
    let Q100_score = data[Q100_pos]['score'];
  
    let C2 = ( Q10_score + Q40_score + Q70_score + Q100_score);
    C2 = C2 / 4;
  
    //? C3
    let Q15_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q15');
    let Q45_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q45');
    let Q75_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q75');
    let Q105_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q105');
  
    let Q15_score = data[Q15_pos]['score'];
    let Q45_score = data[Q45_pos]['score'];
    let Q75_score = data[Q75_pos]['score'];
    let Q105_score = data[Q105_pos]['score'];
  
    let C3 = ( Q15_score + Q45_score + Q75_score + Q105_score);
    C3 = C3 / 4;
  
    //? C4
    let Q20_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q20');
    let Q50_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q50');
    let Q80_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q80');
    let Q110_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q110');
  
    let Q20_score = data[Q20_pos]['score'];
    let Q50_score = data[Q50_pos]['score'];
    let Q80_score = data[Q80_pos]['score'];
    let Q110_score = data[Q110_pos]['score'];
  
    let C4 = ( Q20_score + Q50_score + Q80_score + Q110_score);
    C4 = C4 / 4;
  
    //? C5
    let Q25_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q25');
    let Q55_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q55');
    let Q85_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q85');
    let Q115_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q115');
  
    let Q25_score = data[Q25_pos]['score'];
    let Q55_score = data[Q55_pos]['score'];
    let Q85_score = data[Q85_pos]['score'];
    let Q115_score = data[Q115_pos]['score'];
  
    let C5 = ( Q25_score + Q55_score + Q85_score + Q115_score);
    C5 = C5 / 4;
  
    //? C6
    let Q30_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q30');
    let Q60_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q60');
    let Q90_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q90');
    let Q120_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q120');
  
    let Q30_score = data[Q30_pos]['score'];
    let Q60_score = data[Q60_pos]['score'];
    let Q90_score = data[Q90_pos]['score'];
    let Q120_score = data[Q120_pos]['score'];
  
    let C6 = ( Q30_score + Q60_score + Q90_score + Q120_score);
    C6= C6 / 4;
    
    //! SUPERTRAITS 
    let ER = (ER1 + ER2 + ER3 + ER4 + ER5 + ER6) / 6;
    let E = (E1 + E2 + E3 + E4 + E5 + E6) / 6;
    let O = (O1 + O2 + O3 + O4 + O5 + O6) / 6;
    let A = (A1 + A2 + A3 + A4 + A5 + A6) / 6;
    let C = (C1 + C2 + C3 + C4 + C5 + C6) / 6;
  
    let query1 = `
      INSERT INTO b5_norm_raw 
        (
        source,
        country, sex, age, 
        er1, er2, er3, er4, er5, er6, 
        e1, e2, e3, e4, e5, e6, 
        o1, o2, o3, o4, o5, o6, 
        a1, a2, a3, a4, a5, a6, 
        c1, c2, c3, c4, c5, c6, 
        er, e, o, a, c, 
        survey_assignment_id, ind_id, 
        org_id, suborg_id, program_id, iteration_id,
        created_by, modified_by
        ) 
        VALUES
        (
          'sa',
          (select answer as country from survey_result where survey_assignment_id = ${s1_survey_assignment_id} and statement_num = 'Q121'),
          (select answer as sex from survey_result where survey_assignment_id = ${s1_survey_assignment_id} and statement_num = 'Q122'),
          (select answer as age from survey_result where survey_assignment_id = ${s1_survey_assignment_id} and statement_num = 'Q123'),
          '${ER1}',
          '${ER2}',
          '${ER3}',
          '${ER4}',
          '${ER5}',
          '${ER6}',
          '${E1}',
          '${E2}',
          '${E3}',
          '${E4}',
          '${E5}',
          '${E6}',
          '${O1}',
          '${O2}',
          '${O3}',
          '${O4}',
          '${O5}',
          '${O6}',
          '${A1}',
          '${A2}',
          '${A3}',
          '${A4}',
          '${A5}',
          '${A6}',
          '${C1}',
          '${C2}',
          '${C3}',
          '${C4}',
          '${C5}',
          '${C6}',
          '${ER}',
          '${E}',
          '${O}',
          '${A}',
          '${C}',
          ${s1_survey_assignment_id},
          (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
          (SELECT org_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
          (SELECT suborg_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
          (SELECT program_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
          (SELECT iteration_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
          (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id}),
          (SELECT ind_id FROM survey_assignment WHERE survey_assignment_id = ${s1_survey_assignment_id})
        ) 
    `
    db.query(query1,
      [],
      (err, results) => {
        if (err) {
          console.log(err)
          result(err, null)
        } else {
          let query2 = `UPDATE survey_assignment SET complete_calculations = 1 WHERE survey_assignment_id = ${s1_survey_assignment_id}`
  
          db.query(
            query2,
            [],
            (err, results) => {
              if (err) {
                console.log(err)
                //result(err, null)
              } else {
                console.log(query2)
                //result(null, results)
  
                let query3 = `UPDATE survey_assignment SET is_participant_report_processed = 1 WHERE survey_assignment_id = ${s1_survey_assignment_id}`
  
                db.query
                  (
                    query3,
                    [],
                    (err, results) => 
                      {
                        if (err) {
                          console.log(err)
                          //result(err, null)
                        } else {
                          console.log(query3)
                          //result(null, results)
                        }
                      }
                  )
              }
            }
          )
          result(null, results)
        }
      }
    )
}

export const big5UpdateSurveyResultM = (data, result) => {
    let s1_survey_assignment_id = data[0]['survey_assignment_id'];

    //? O2

    let Q98_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q98');
  
    let Q98_score = data[Q98_pos]['score'];

    let modifiedQ98 = null
    if (Q98_score === 1) {
        modifiedQ98 = 5
    } else if (Q98_score === 2) {
        modifiedQ98 = 4
    } else if (Q98_score === 4) {
        modifiedQ98 = 2
    } else if (Q98_score === 5) {
        modifiedQ98 = 1
    } else { 
        modifiedQ98 = 3
    }

    //? O5
    let Q53_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q53');
    let Q113_pos = data.map(function(e) { return e.statement_num; }).indexOf('Q113');
  
    let Q53_score = data[Q53_pos]['score'];
    let Q113_score = data[Q113_pos]['score'];

    let modifiedQ53 = null
    let modifiedQ113 = null

    if (Q53_score === 1) {
        modifiedQ53 = 5
    } else if (Q53_score === 2) { 
        modifiedQ53 = 4
    } else if (Q53_score === 4) { 
        modifiedQ53 = 2
    } else if (Q53_score === 5) { 
        modifiedQ53 = 1
    } else { 
        modifiedQ53 = 3
    }

    if (Q113_score === 1) {
        modifiedQ113 = 5
    } else if (Q113_score === 2) { 
        modifiedQ113 = 4
    } else if (Q113_score === 4) { 
        modifiedQ113 = 2
    } else if (Q113_score === 5) { 
        modifiedQ113 = 1
    } else { 
        modifiedQ113 = 3
    }

    const updateQ98 = 'UPDATE survey_result SET score = ?, modified_at = NOW() WHERE statement_num = "Q98" AND survey_assignment_id = ?'
    const updateQ53 = 'UPDATE survey_result SET score = ?, modified_at = NOW() WHERE statement_num = "Q53" AND survey_assignment_id = ?'
    const updateQ113 = 'UPDATE survey_result SET score = ?, modified_at = NOW() WHERE statement_num = "Q113" AND survey_assignment_id = ?'

    db.query(updateQ98,
        [modifiedQ98, s1_survey_assignment_id],
        (err, results) => {
          if (err) {
            console.log(err)
            result(err, null)
          } else {
            db.query(updateQ53,
                [modifiedQ53, s1_survey_assignment_id],
                (err, results) => {
                  if (err) {
                    console.log(err)
                    result(err, null)
                  } else {
                    db.query(updateQ113,
                        [modifiedQ113, s1_survey_assignment_id],
                        (err, results) => {
                          if (err) {
                            console.log(err)
                            result(err, null)
                          } else {
                              console.log(updateQ113)
                            // result(null, results)
                          }
                        }
                      )
                      console.log(updateQ53)
                    // result(null, results)
                  }
                }
              )
              console.log(updateQ98)
            result(null, results)
          }
        }
    )
}