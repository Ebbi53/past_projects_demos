const ResumeParser = require('resume-parser');
const fs = require('fs');
// const fileDir = process.cwd() + '/files/';

function extractData (path) {
    return ResumeParser
    .parseResume(path, './files/compiled') //First parse and convert the uploaded
    //file to the JSON format
    .then(JSONfile => {
        // console.log(JSONfile);
        return new Promise((resolve,reject) => {
            fs.open('./files/compiled/' + JSONfile + '.json', 'r', (err, fd) => {
            if (err) {
                // console.log(err);
                return reject(err);
            } else {

                fs.readFile('./files/compiled/' + JSONfile + '.json', 'utf8', function(err, JSONdata) {
                if (err) {
                    console.log(err);
                } else {
                  //Extracting data from the JSON file
                    JSONdata = JSON.parse(JSONdata);
            
                    var uniData = JSONdata["education"].split('\n').join(',').split(',').join(' – ').split(' – ').join('"').split('"').join("'").split("'");
                    cvData = uniData;
                    
                    var workData = JSONdata["experience"].split('\n').join(',').split(',').join('.').split('.').join('"').split('"').join("'").split("'");
                    cvData = cvData.concat(workData);
                    
                    var skillsData = JSONdata["skills"];
                    var intData = JSONdata["interests"];
                    
                    if (skillsData) {
                    skillsData = skillsData.split('\n').join(',').split(',').join('.').split('.').join('"').split('"').join("'").split("'");
                    cvData = cvData.concat(skillsData);
                    }
                
                    if (intData) {
                    intData = intData.split('\n').join(',').split(',').join('.').split('.').join('"').split('"').join("'").split("'");
                    cvData = cvData.concat(intData);
                    }

                    // console.log(cvData.length)
                    cvData = new Set(cvData);
                    cvData = Array.from(cvData);

                    // console.log(cvData.length)
                    resolve(cvData);
                    }
                });
                
                fs.close(fd, err => {
                    if (err) {
                    console.log(err);
                    }
                })
                }
            })
        })
    }).catch(error => {
    console.log('parseResume failed');
    console.error(error);
    })

    /*
    ResumeParser.parseResumeUrl('http://www.mysite.com/resume.txt') // url
    .then(data => {
      console.log('Yay! ', data);
    })
    .catch(error => {
      console.log('parseResume failed');
      console.error(error);
    });
    */
}

module.exports = extractData;