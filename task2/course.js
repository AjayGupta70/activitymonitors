const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");
let data = require('./../dev.enrollments.json');

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017";

mongoose.connect(uri, { dbName: "dev", useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to MongoDB');
        const ActivityMonitor = mongoose.model('ModelLess', mongoose.Schema({}), "activitymonitors");
        
        async function ids() {
            let allDoc = await ActivityMonitor.find({}, { _id: 1 });
            for (let doc of allDoc) {
                let Doc = await ActivityMonitor.findById(doc._id);
                Doc = Doc._doc;
                
                let _newDoc = {
                    "_id": doc._id["$oid"],
                    "activityId": uuidv4(),
                    "type": Doc["activityType"],
                    "userId": Doc.userId,
                    "customerId": Doc.customerId,
                    "createdAt": Doc.createdAt,
                    "userResumedCourse": Doc.userResumedCourse,
                    "details": {
                        "courseId": Doc["activityId"],
                        "courseVersion": "",
                        "courseName": "",
                        "courseStartedAt": "",
                        "courseCompletedAt": ""
                    }
                };
                
               
                for (let d of data) {
                    if (d.userId === Doc.userId) {
                        if (!!d.coursesV2 && d.coursesV2.length > 0) {
                            for (let course of d.coursesV2) {
                                if (course.courseId === Doc.activityId) {
                                    _newDoc.details.courseName = course.name;
                                    if (!!course.beginDate)
                                        _newDoc.details.courseStartedAt = course.beginDate["$date"];
                                    if (!!course.completionDate)
                                        _newDoc.details.courseCompletedAt = course.completionDate["$date"];
                                }
                            }
                        }
                    }
                }

                // Log the new document to the console
                console.log(_newDoc);

                // Uncomment the following lines to delete the old doc and create the new one
                // await User.findByIdAndDelete(doc._id);
                // let completeDoc = { ...Doc, ..._newDoc };
                // await User.create(completeDoc);
            }
        }

        ids();
    })
    .catch(err => {
        console.error('Connection error', err);
    });
