const fs = require('fs-extra'); // https://nodejs.org/api/fs.html

module.exports = (path) => {
    return new Promise((resolve, reject) => {
        fs.open(path, 'r', (err, fd) => { // https://nodejs.org/api/fs.html#fs_file_system_flags
            if (err) {
                reject(err)
            } else {
                fs.readFile(path, 'utf8', (err, JSONdata) => {
                    if (err) {
                        reject(err);
                    } else {

                        fs.close(fd, err => {
                            if (err) {
                                reject(err);
                            }
                        });

                        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace (for substring conversion)
                        // https://regex101.com/ (to test regular expressions)

                        resolve(JSON.parse(
                            JSONdata.replace(/\s/gi, ' ') //convert all the whitespaces to a single space
                                .replace(/([^\\])(')/gm, "$1\"") //convert all the single quotes except for the quotes inside the data e.g. in addresses (like John\'s road) to double quotations
                                .replace(/\\'/gi, '\'') // convert the single quotes inside the data e.g. in addresses (like John\'s road) to single quotes without backslash (like John's road)
                        ));

                    }
                });
            }
        })
    })

}