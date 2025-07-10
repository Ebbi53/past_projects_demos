const fs = require('fs');
// const fileDir = process.cwd() + '/files/';
var keywords = [];

function extractedKeywords(cvData) {
    return new Promise((resolve, reject) => {
        fs.open('./files/keywords.txt', 'r', (err, fd) => {
            if (err) {
                reject(err);
            } else {
                fs.readFile('./files/keywords.txt', 'utf8', (err, listData) => {
                    if (err) {
                        console.log(err)
                    } else {
                        listData = listData.split('\n');

                        wstream = fs.createWriteStream('./files/extractedKeywords.txt', {
                            flags: 'w',
                            //autoclose: 'false'
                        });

                        for (i = 0; i < cvData.length; i++) { //loop to go through each line in upload file
                            var info = cvData[i].toLowerCase();

                            for (j = 0; j < listData.length; j++) { //loop to go through each line in dataset
                                var keyword = listData[j].toLowerCase();

                                if (info.includes(keyword)) {
                                    var infoD = info.split(' '), //further break the line into words
                                        keywordD = keyword.split(' '),
                                        found;

                                    let len = infoD.length;
                                    for (p = 0; p < len; p++) { //remove irrelevant characters
                                        if (infoD[p] == '' || infoD[p] == '(' || infoD[p] == ')') {
                                            infoD.splice(p, 1);
                                            p--;
                                            len--;
                                        }
                                    }

                                    let len1 = keywordD.length;
                                    for (p = 0; p < len1; p++) {
                                        if (keywordD[p] == '') {
                                            keywordD.splice(p, 1);
                                            p--;
                                            len1--;
                                        }
                                    }
                                    // console.log(info)
                                    if (infoD.length >= keywordD.length) {
                                        for (a = 0; a < infoD.length; a++) { //perform exact matching                        
                                            if (infoD[a] == keywordD[0]) {
                                                found = true;
                                                for (b = 1; b < keywordD.length; b++) {
                                                    if (++a == infoD.length || infoD[a] != keywordD[b]) {
                                                        found = false;
                                                        a--;
                                                        break;
                                                    }
                                                }
                                                if (found) {
                                                    wstream.write(listData[j] + ' :-: ' + cvData[i] + '\n\n');
                                                    if (listData[j].toLowerCase() == 'university'
                                                        || listData[j].toLowerCase() == 'bachelor'
                                                        || listData[j].toLowerCase() == 'college'
                                                        || listData[j].toLowerCase() == 'gce' ||
                                                        listData[j].toLowerCase() == 'school') {
                                                        keywords.push(cvData[i]);
                                                    } else {
                                                        keywords.push(listData[j]);
                                                    }
                                                }
                                            } else {
                                                found = false;
                                            }
                                        }
                                    } else {
                                        found = false;
                                    }
                                    if (found) {
                                        // break;
                                    }
                                }
                            }
                        }
                        keywords = new Set(keywords);
                        keywords = Array.from(keywords);
                        resolve(keywords);
                    }
                });

                fs.close(fd, err => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        });
    })
}

module.exports = extractedKeywords;
