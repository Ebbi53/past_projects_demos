const fs = require('fs-extra'),
    archiver = require('archiver'), // https://www.archiverjs.com/archiver (for compressing files)
    exec = require('child_process').exec, // https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback (to execute terminal commands)
    fileDir = process.cwd(), //to get current working directory
    toPdf = require("./officeToPDF");

var recordCount = { // to maintain statistics or logs
    PDF: [],
    Word: [],
    Image: [],
    InconsistentCV: [] // to get those records whose Resumes were not successfully submitted and saved to the database
},
    properties = 'version=18.3.0',
    headers = { // to define the headers of output csv in accordance with IBM's schema
        CP: ['personId', 'jobId', 'personType', 'locale', 'dateCreatedOn', 'resumeRefs', 'firstName', 'lastName', 'city', 'state', 'country', 'email', 'displayName', 'candidateStatus', 'candidateType', 'disabilityDegree', 'employeeType', 'hired', 'isRehire', 'middleName', 'resumeText', 'employeeStatus', 'success', 'yearsInIndustry'], // personal details
        ED: ['personId', 'jobId', 'eduSequence', 'schoolName', 'schoolCountry', 'degree', 'major', 'GPAScale', 'educationLevel', 'endDate', 'GPA', 'ongoing', 'schoolLocation', 'startDate'], // education details
        RP: ['jobId', 'locale', 'dateCreated', 'dateOpen', 'role', 'roleId', 'status', 'totalPositions', 'travelRequired', 'passingDate', 'preferredSkills', 'description', 'preferredExperience', 'experienceLevel', 'baseSalary', 'benefits', 'businessGroupName', 'city', 'code', 'commissionable', 'country', 'dateClosed', 'dateUpdated', 'displayId', 'estimatedSalary', 'applyUrl', 'family', 'gatewayId', 'gatewayJobStatus', 'gpa', 'incentiveCompensation', 'industry', 'isEducationMandatory', 'isExperienceMandatory', 'isLocationMandatory', 'isManagementPosition', 'isSkillMandatory', 'locationName', 'major', 'maxSeniorityLevel', 'minSeniorityLevel', 'numberApplied', 'numberHired', 'numberQualified', 'positionType', 'preferredEducation', 'requiredSkills', 'primaryJobCategory', 'primaryJobCategoryCode', 'requiredEducation', 'requiredExperience', 'skillKeywords', 'secondaryJobCategory', 'secondaryJobCategoryCode', 'specialCommitments', 'state', 'targetSLA', 'timeToFill', 'title', 'eligibilityRequirements', 'workHours'] // job requisition details
    },
    // tmpDir = new tmp.Dir(),

    mappings = { // dictionary to map the JSON keys to the CSV headings
        CP: { 
            // 'personId': ['id'],
            'firstName': ['first_name'],
            'lastName': ['family_name'],
            'city': ['current_residential_address_city'],
            'state': ['current_residential_address_state'],
            'country': ['current_residential_address_country'],
            'email': ['email'],
        },
        ED: {
            'schoolName': ['university_of_tertiary_education'],
            'schoolCountry': ['country_of_tertiary_education'],
            'degree': ['qualification_of_tertiary_education'],
            'major': ['major_of_tertiary_education'],
        }
    },
    RP = `${headers.RP.join(',')}\n`; // start preparing the comma-seperated string for RP (job requisition)

// append the RP string with a record (always one record for RP since JETS or JIP always has only one job description)
RP += `jip-1,en,${(new Date()).toISOString()},${(new Date()).toISOString()},management intern,jip-1,open,5,International mobility,2020,"English Language\nDigital Savvy - can see why technology can add value\nImpactful communication, able to inspire others\nMicrosoft Excel\nData analytics and visualization tools (R, Tableau, SAS, SPSS)\nComputer programming and coding languages (Python, Java) \nBusiness acumen, business savvy\nProblem solving. \nConflict Management\nAnalytical Thinking\nConsulting\nDesign thinking\nData analysis\nData mining\nSoutheast Asian languages (Bahasa Indonesian, Malaysian, Tagalog, Vietnamese, Thai)\nChinese (Mandarin, Cantonese)\nStakeholder management\nCritical thinking\nProduct strategy\nSocial Media\nStatistics\nCustomer relationship management","Passion for meeting people and establishing networks.\nLeadership. Able to take decision, lead people and create the right environment for people to excel. Leading in uncertainty.\nCustomer Oriented.  i.e. understanding that there is always internal and external and delivery of high level service\nForward—Thinking. Can think outside the conventional thinking and able to see beyond the present moment.\nRisk Taking. Courage. Able to take risks on activities/decisions that are not completely clear. \nOwnership and accountability\nHumbleness\nDriven, energetic\nLearning Agility. Continuous learning mindset\nResilient. Grit/determination and ability to bounce back and learn after set backs\nDiplomatic and able to deal with multiple different backgrounds easily \nEmbracing diversity\nFlexible. Able to adapt fast to change.\nCuriosity. Inquisitive\nInnovative mindset\nAuthentic. Comfortable with being themselves to have a voice\nChange catalyst\nTeam Player. Collaborative\nComfortable with ambiguity\nOpen-minded\nSelf-Awareness\nStrong values, principle and integrity\nDetermined\nFast learner\nProactive\nPersuasive\nDiligent \nSelf-motivated","Less than 2 years of full time work experiences\nEntrepreneur \nLeadership (school team, clubs, groups, case competition)\nIndustry: Consumer retail, hospitality, operations, restaurant or property\nMarketing\nDigital marketing\nSales\neCommerce\nVolunteer work\nCustomer facing roles\nSocial ventures",Entry,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n`;

module.exports = (JSONdata, SESSION) => {
    return new Promise(async (resolve, reject) => {

        // using SESSION object to determine number of records to parse and number of batches to divide the output into
        var nRecords = SESSION.TOTAL_RECORDS == 'all' ? JSONdata.length : SESSION.TOTAL_RECORDS,
            nBatches = Math.ceil(nRecords / SESSION.RECORDS_IN_EACH_BATCH);
            SESSION['nBatches'] = nBatches;

        await new Promise(async (resolve, reject) => {
            for (let j = 0; j < nBatches; j++) {
                var batchID = `${SESSION.BATCH}_${j == nBatches - 1 ? 'EOB' : j + 1}` // generating batch ID according to IBM schema

                fs.mkdirSync(`${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/datafeeds_ResumeFiles_${batchID}/`, {
                    recursive: true
                }); // making the directories recursively until the dir to store the resumes

                var parsedData = { // start preparing the comma-seperated string for CP (personal details) and ED (education details)
                    CP: `${headers.CP.join(',')}\n`,
                    ED: `${headers.ED.join(',')}\n`,
                };

                // initializing the writing streams for archived (zipped) file 
                // these streams will be appended with files during the parsing process
                var resumeStream = fs.createWriteStream(`${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/datafeeds_ResumeFiles_${batchID}/datafeeds_ResumeFiles_${batchID}.zip`),
                    batchStream = fs.createWriteStream(`${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/jardines_datafeeds_Delta_${batchID}.zip`),
                    resumeArchive = archiver('zip'),
                    batchArchive = archiver('zip');

                resumeArchive.pipe(resumeStream);
                batchArchive.pipe(batchStream);

                // 1. First Step: Wait to completely populate the comma-seperated strings object before writing it to the files
                await new Promise(async (resolve, reject) => {
                    for (let i = 0; i < SESSION.RECORDS_IN_EACH_BATCH && (i + j * SESSION.RECORDS_IN_EACH_BATCH) < nRecords; i++) {
                        var record = JSONdata[i + j * SESSION.RECORDS_IN_EACH_BATCH];
                        console.log(`Record #${record.id} in progress..`)
                        var recordData = JSON.parse(record['json_data']),
                            personalInfo = recordData['personal_info'],
                            educationInfo = recordData['tertiary_education'],
                            inconsistent = false,
                            found = false,
                            fileFormats = ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg']; // resume formats expected

                        await (async function () { // redundant await, should be removed
                            for (let i = 0; i < fileFormats.length; i++) { // handling each record's resume
                                await new Promise((resolve, reject) => {
                                    fs.access(`${fileDir}/data/${SESSION.TYPE}_cv/${record.id}.${fileFormats[i]}`, async (err) => {
                                        if (!err) {
                                            if (fileFormats[i] == 'pdf') {
                                                recordCount.PDF.push(record.id);

                                                resumeArchive.file(`${fileDir}/data/${SESSION.TYPE}_cv/${record.id}.pdf`, { // append the resume to archive stream
                                                    name: `${record.id}.pdf`
                                                });
                                            } else {
                                                console.log('Converting Word or Image CV to PDF..');

                                                await toPdf(`${fileDir}/data/${SESSION.TYPE}_cv/${record.id}.${fileFormats[i]}`, `${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/datafeeds_ResumeFiles_${batchID}/`, record.id)
                                                    .then(() => { // convert to pdf and then append to archive
                                                        resumeArchive.file(`${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/datafeeds_ResumeFiles_${batchID}/${record.id}.pdf`, {
                                                            name: `${record.id}.pdf`
                                                        });
                                                    });

                                                if (fileFormats[i] == 'doc' || fileFormats[i] == 'docx') {
                                                    recordCount.Word.push(record.id);
                                                } else {
                                                    recordCount.Image.push(record.id);
                                                }
                                            }
                                            found = true;
                                        } else {
                                            if (i == fileFormats.length - 1) {
                                                recordCount.InconsistentCV.push(record.id);
                                                inconsistent = true;
                                            }
                                        }
                                        resolve();
                                    });
                                });
                                if (found) {
                                    break;
                                }
                            }
                        })();

                        if (inconsistent) {
                            continue;
                        } else {
                            parsedData.CP += `${record.id},jip-1,candidate,en,${(new Date()).toISOString()},${record.id}.pdf,`; // manually append static data which is not being extracted from JSON
                        }

                        for (let key in mappings.CP) {
                            for (let i = 0; i < mappings.CP[key].length; i++) {
                                var el = mappings.CP[key][i];
                                if (personalInfo.hasOwnProperty(el)) {
                                    if (personalInfo[el].toLowerCase() == 'n/a') {
                                        parsedData.CP += ',';
                                    } else {
                                        parsedData.CP += `"${personalInfo[el]}",`; // encode in double quotations to keep escape characters  like comma inside CSV
                                    }
                                    break;
                                }
                            }
                        }

                        parsedData.CP += `"${personalInfo['first_name']} ${personalInfo['family_name']}",Student,External,,,,,,,,,\n`; //manually handle full name and some other data

                        educationInfo.forEach((eduRecord, index) => {
                            parsedData.ED += `${record.id},jip-1,${index + 1},`;

                            for (let key in mappings.ED) {
                                for (let i = 0; i < mappings.ED[key].length; i++) {
                                    var el = mappings.ED[key][i];
                                    if (eduRecord.hasOwnProperty(el)) {
                                        if (eduRecord[el].toLowerCase() == 'n/a') {
                                            parsedData.ED += ',';
                                        } else {
                                            parsedData.ED += `"${eduRecord[el]}",`;
                                        }
                                        break;
                                    }
                                }
                            }
                            parsedData.ED += ',,,,,,,\n';
                        })

                        if (i == SESSION.RECORDS_IN_EACH_BATCH - 1 || (i + j * SESSION.RECORDS_IN_EACH_BATCH) == nRecords - 1) {
                            resolve();
                        }
                    };

                });

                // 2. Second Step: wait to pipe out resume archive stream before the resume archive can be appended into each Batch archive stream
                await new Promise((resolve, reject) => {
                    // var promises = [];
                    console.log(`Batch #${j + 1}: Writing parsed data to files..`);

                    // Write the comma-seperated strings object into their respective CSVs by directly appending the string to archive stream and saving a I/O (write) operation

                    if (j == 0) {
                        batchArchive.append(properties, {
                            name: `jardines_datafeeds_Delta_${SESSION.BATCH}.properties`
                        });

                        batchArchive.append(RP, {
                            name: `datafeeds_RP_${batchID}.csv`
                        });
                    }


                    for (let key in parsedData) {
                        batchArchive.append(parsedData[key], {
                            name: `datafeeds_${key}_${batchID}.csv`
                        })
                    }

                    console.log(`Batch #${j + 1}: Compressing CVs..`);

                    // pipe out the resume archive stream
                    resumeStream.on('close', () => {
                        resolve();
                    });

                    resumeArchive.on('error', err => {
                        reject(err);
                    });

                    resumeArchive.finalize();
                });

                // 3. Third Step: wait to pipe out the Final Batch archive stream before it can be encrypted
                await new Promise((resolve, reject) => {
                    console.log(`Batch #${j + 1}: Compressing batch..`);

                    batchArchive.file(`${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/datafeeds_ResumeFiles_${batchID}/datafeeds_ResumeFiles_${batchID}.zip`, { // append the zipped resumes into the Batch archive
                        name: `datafeeds_ResumeFiles_${batchID}.zip`
                    })

                    batchStream.on('close', () => {
                        resolve();
                    });

                    batchArchive.on('error', err => {
                        reject(err);
                    });

                    // pipe out the Batch Archive
                    batchArchive.finalize();
                });

                // 4. Last Step: encryption by executing a terminal command
                await new Promise((resolve, reject) => {

                    // https://gnupg.org/documentation/manpage.html 
                    exec(`gpg2 --recipient jardines --output jardines_datafeeds_Delta_${batchID}.zip.pgp --encrypt jardines_datafeeds_Delta_${batchID}.zip`, {
                        cwd: `${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/`
                    }, (err, stdout, sterr) => {
                        if (err) {
                            reject();
                        } else {
                            resolve();
                        }
                    })
                })

                fs.remove(`${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/datafeeds_ResumeFiles_${batchID}/`);

                if (j == nBatches - 1) {
                    resolve();
                }
            }
        })
        console.log('Parsing done')
        resolve(recordCount);
    })
}