const fs = require('fs-extra'),
    fileDir = process.cwd();

module.exports = (recordCount, SESSION) => {
    return new Promise(async (resolve, reject) => {
        var records = `${(Object.keys(recordCount)).join(',')}\n`,
            max = 0;

        await new Promise((resolve, reject) => {
            console.log('Statistics:')
            for (let key in recordCount) {
                max = recordCount[key].length > max ? recordCount[key].length : max;

                console.log(`${recordCount[key].length} ${key}${key == 'Image' || key == 'InconsistentCV' ? `${recordCount[key].length > 0 ? ` (IDs: ${recordCount[key].join(', ')})` : ''}` : ''}`);

                if (key == 'InconsistentCV') {
                    resolve();
                }
            }
        })

        //populating stats object and then writing it to recordsStats.csv
        await new Promise((resolve, reject) => {
            for (let i = 0; i < max; i++) {
                for (let key in recordCount) {
                    records += i < recordCount[key].length ? `${recordCount[key][i]},` : ','
                    if (key == 'InconsistentCV') {
                        records += '\n'
                    }
                }
                if (i == max - 1) {
                    resolve()
                }
            }
        })

        fs.writeFile(`${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/recordsStats.csv`, records, err => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}