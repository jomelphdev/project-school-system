import db from "../config/database.js"

export const getVFPReportM = (survey_assignment_id, result) => {
  db.query('SELECT * FROM vfp_raw WHERE survey_assignment_id = ?',
    [survey_assignment_id],
    (err, results) => {
      if (err) {
        result(err, null)
      }
      else {
        if(results.length == 0) {
          return result(null, [])
        }
        else {

          const culturalValues = results[0].calcs[0].CulturalValues

          let powerDistanceComparison = culturalValues[0].Value == culturalValues[4].Value ? 'equal' : culturalValues[0].Value < culturalValues[4].Value ? 'less' : 'more'
          let goalOrientationComparison = culturalValues[1].Value == culturalValues[5].Value ? 'equal' : culturalValues[1].Value <= culturalValues[5].Value ? 'less' : 'more'
          let culturalImpositionComparison = culturalValues[2].Value == culturalValues[6].Value ? 'equal' : culturalValues[2].Value <= culturalValues[6].Value ? 'less' : 'more'
          let uncertaintyAvoidanceComparison = culturalValues[3].Value == culturalValues[7].Value ? 'equal' : culturalValues[3].Value <= culturalValues[7].Value ? 'less' : 'more'

          const superScales = results[0].calcs[0].SuperScales
          const personalValues = results[0].calcs[0].PersonalValues

          const powerDistance = superScales[0].Value
          const goalOrientation = superScales[1].Value
          const culturalImposition = superScales[2].Value
          const uncertaintyAvoidance = superScales[3].Value

          const [powerDistanceValue, powerDistanceMessage, powerDistancePosition] = culturalValuesFunc(powerDistance, powerDistanceComparison)
          const [goalOrientationValue, goalOrientationMessage, goalOrientationPosition] = culturalValuesFunc(goalOrientation, goalOrientationComparison)
          const [culturalImpositionValue, culturalImpositionMessage, culturalImpositionPosition] = culturalValuesFunc(culturalImposition, culturalImpositionComparison)
          const [uncertaintyAvoidanceValue, uncertaintyAvoidanceMessage, uncertaintyAvoidancePosition] = culturalValuesFunc(uncertaintyAvoidance, uncertaintyAvoidanceComparison)

          
          result(null, {
            "superScales" : superScales,
            "unsortedPersonalValues" : [...personalValues],
            "sortedPersonalValues" : [...personalValues].sort((a, b) => b.Value - a.Value),
            "powerDistanceValue" : powerDistanceValue,
            "powerDistanceMessage" : superScales[0].CulturalNames[0]+ ' ' +powerDistanceMessage+ ' ' +superScales[0].CulturalNames[1],
            "powerDistancePosition" : powerDistancePosition,
            "goalOrientationValue" : goalOrientationValue,
            "goalOrientationMessage" : superScales[1].CulturalNames[0]+ ' ' +goalOrientationMessage+ ' ' +superScales[1].CulturalNames[1],
            "goalOrientationPosition" : goalOrientationPosition,
            "culturalImpositionValue" : culturalImpositionValue,
            "culturalImpositionMessage" : superScales[2].CulturalNames[0]+ ' ' +culturalImpositionMessage+ ' ' +superScales[2].CulturalNames[1],
            "culturalImpositionPosition" : culturalImpositionPosition,
            "uncertaintyAvoidanceValue" : uncertaintyAvoidanceValue,
            "uncertaintyAvoidanceMessage" : superScales[3].CulturalNames[0]+ ' ' +uncertaintyAvoidanceMessage+ ' ' +superScales[3].CulturalNames[1],
            "uncertaintyAvoidancePosition" : uncertaintyAvoidancePosition,
          })
        }
      }
    })
}

export const culturalValuesFunc = (data, comparison) => {
  /*
    formula from stuart 
    If Left - Right > 1.4, then result is Position 1		
    If 1.4 >= (Left - Right) > 0.2, then result is Position 2		
    If 0.2 >= (Left - Right) >= -0.2, then result is Position 3		
    If -0.2 > (Left - Right) >= -1.4, then result is Position 4		
    If Left - Right < -1.4, then result is Position 5		
  */
  
  let value = ''
  let message = ''
  let position = ''

  if(data > 1.4) {
    value = '0px'
    message = comparison == 'equal' ? 'is the same as' : 'significantly ' +comparison+ ' than'
    position = "position1"
  }
  else if(1.4 >= data && data > 0.2) {
    value = '120px'
    message = comparison == 'equal' ? 'is the same as' : 'slightly ' +comparison+ ' than'
    position = "position2"
  }
  else if(0.2 >= data && data >= -0.2) {
    let comparisonData  = comparison == 'more' ? 'much' : comparison
    
    value = '240px'
    message = comparison == 'equal' ? 'is the same as' : 'as ' +comparisonData+ ' as'
    position = "position3"
  }
  else if(-0.2 > data && data >= -1.4) {
    value = '360px'
    message = comparison == 'equal' ? 'is the same as' : 'slightly ' +comparison+ ' than'
    position = "position4"
  }
  else if(data < -1.4) {
    value = '480px'
    message = comparison == 'equal' ? 'is the same as' : 'significantly ' +comparison+ ' than'
    position = "position5"
  }
  else {
    value = '0px',
    message = "somthing went wrong"
    position = "position1"
  }
  return [value, message, position]
}