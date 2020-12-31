(async function () {
    const fs = require('fs-extra'),
        performance = require('performance-now'),
        readline = require('readline'),
        SESSION = {},
        fileDir = process.cwd(),
        dataCleansing = require('./js/dataCleansing'),
        parsing = require('./js/parsing'),
        stats = require('./js/stats'),
        sftpUpload = require('./js/sftpUpload');

    const rl = readline.createInterface({ //initializing the console input
        input: process.stdin,
        output: process.stdout
    });

    await new Promise((resolve, reject) => { //waiting for Batch number input and storing it in the SESSION object
        rl.question('Enter Batch Number: ', (ans) => {
            SESSION['BATCH'] = ans;
            resolve();
        })
    })

    await new Promise((resolve, reject) => { //waiting for Application Type input and storing it in the SESSION object
        rl.question('Enter Application Type (JIP or JETS): ', (ans) => {
            SESSION['TYPE'] = ans.toUpperCase();
            resolve();
        })
    })

    await new Promise((resolve, reject) => { //waiting for number of records input and storing it in the SESSION object
        rl.question('Enter Total number of records you want to process (can be "all" or some number): ', (ans) => {
            SESSION['TOTAL_RECORDS'] = ans;
            resolve();
        })
    })

    await new Promise((resolve, reject) => { //waiting for records in each BATCH input and storing it in the SESSION object
        rl.question('Enter Number of records in each BATCH: ', (ans) => {
            SESSION['RECORDS_IN_EACH_BATCH'] = ans;
            resolve();
        })
    })

    await new Promise(async (resolve, reject) => {
        rl.question('Do you want to Upload the parsed datafeeds to ftp server (yes/no)?: ', async (ans) => {
            if (ans.toLowerCase() == 'yes' || ans.toLowerCase() == 'y') {
                await new Promise((resolve, reject) => {
                    rl.question('Please enter the password for sFTP: ', (ans) => {
                        SESSION['FTPpassword'] = ans;
                        resolve();
                    })
                })
            } else {
                SESSION['FTPpassword'] = null;
            }
            resolve();
        })
    })

    rl.close(); //closing the console input stream
    var t0 = performance(), t2;

    console.log('Parsing started...')
    dataCleansing(`${fileDir}/data/${SESSION.TYPE}_data.json`)
        .then((JSONdata) => {
            return parsing(JSONdata, SESSION);
        })
        .then((recordCount) => {
            return stats(recordCount, SESSION);
        })
        .then(() => {
            var t1 = performance();
            console.log(`Parsing completed in ${((t1 - t0) / 60000)} minutes!`);
            t2 = performance();
            return sftpUpload(SESSION);
        }).then((upload) => {
            if (upload) {
                var t3 = performance();
                console.log(`All the batch files uploaded in ${(t3 - t2)/60000} minutes!`)
            }
        })
})();