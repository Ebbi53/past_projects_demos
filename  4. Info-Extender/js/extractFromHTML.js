const fs = require('fs');

function extractData(path) {
  return new Promise((resolve, reject) => {
    fs.open(path, 'r', (err, fd) => {
      if (err) {
        console.log(err);
        reject(err)
      } else {
        fs.readFile(path, 'utf8', function (err, cvData) {
          if (err) {
            console.log(err);
          } else {
            //Extracting data from the HTML produced from the uploaded file
            cvData = cvData.match(/id="page-container">(.*)<\/div>/is);
            cvData = cvData[1];
            cvData = cvData.replace(/<(.*?)>/gi, '\n').split('.').join(',').split(',').join('\n').split('\n');
            let len = cvData.length
            for (j = 0; j < len; j++) {
              if (cvData[j] == '' || cvData[j].length == 1) {
                cvData.splice(j, 1);
                j--;
                len--;
              }
            }

            cvData = new Set(cvData);
            cvData = Array.from(cvData);
            resolve(cvData);
          }
        })

        fs.close(fd, err => {
          if (err) {
            console.log(err);
          }
        })

      }
    })
  })
}

module.exports = extractData;