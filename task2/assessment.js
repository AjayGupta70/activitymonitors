//const mongoose = require('mongoose');
const mongoose = require('mongoose');
let assessmentResp = require('./../dev.assessmentresponses.json');
let assessment = require('./../dev.assessments.json');
//const { v4: uuidv4 } = require("uuid"); // for  uuid
// let data = require('./../dev.enrollments.json');
const uri = "mongodb://localhost:27017";

let assessmentIds = {};
for(let _assessment of assessment) assessmentIds[_assessment.assessmentId] = _assessment.name;
let finalResp = [];
for(let _assessmentResp of assessmentResp){
  if(_assessmentResp.type != "assessment") continue;
  let _resp = {
    "userId": _assessmentResp.userId,
    "type": _assessmentResp.status == 'Finished' ? "assessment-completed" : "assessment-InProgress",
    "createdAt": _assessmentResp.createdAt["$date"],
    "details": {
       "assessmentId": _assessmentResp.assessmentId,
       "AssessmentVersion": "",
       "assessmentName": (!!assessmentIds[_assessmentResp.assessmentId]) ? assessmentIds[_assessmentResp.assessmentId] : "",
       "assessmentStartedAt": _assessmentResp.createdAt["$date"],
       "assessmentCompletedAt": _assessmentResp.updatedAt["$date"],
       "status": "",
       "score": _assessmentResp.userScore
    }
  }
  finalResp.push(_resp);
}

//let x = JSON.stringify(finalResp);

console.log(finalResp);