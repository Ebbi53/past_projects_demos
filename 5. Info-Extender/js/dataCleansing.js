const fs = require('fs');
const fileDir = process.cwd() + '/files/';

function dataCleansing() {
    return new Promise((resolve, reject) => {
        fs.readFile(fileDir + 'keywords.txt', 'utf8', (err, data) => {
            if (err) {
              console.log(err)
            } else {

              //removing Case-Sensitive duplicates
              {
                // data = data.split('\n')
                // data.forEach((element, p, arr) => {
                //   arr[p] = element.toLowerCase()
                // })
                // data = new Set(data);
                // data = Array.from(data);
                // data = data.join('\n');
              }

              fs.readFile(fileDir + 'stopWords1.txt', 'utf8', (err, stopWords) => {
                if (err) {
                  console.log(err)
                } else {
                  new Promise ((resolve, reject) => {
                    data = data.split('\n')
                    //.join('"').split('"').join('(').split('(').join(')').split(')').join("'").split("'");
                    stopWords = stopWords.split('\n');

                    data.forEach((element, q, arr) => {

                      // removing whitespaces
                      {
                        // var elementD = element.split(' ');
                        // let len = elementD.length
                        // for (j = 0; j < len; j++) {
                        //   if (elementD[j] == '') {
                        //     elementD.splice(j, 1);
                        //     j--; 
                        //     len--;
                        //   }
                        // }
                        // arr[q] = elementD.join(' ');
                      }

                      stopWords.forEach(stopElement => {
                        stopElement = stopElement.toLowerCase();
                        element = element.toLowerCase();
                        if (element == stopElement) {
                          arr[q] = 'null';
                        }
                      })
                    });
                    resolve(1);
                    }).then(() => {
                      data = new Set(data);
                      data = Array.from(data);
                      data = data.join('\n')
                      console.log('done')
                      fs.writeFile(fileDir + 'work.txt', data, err => {
                        if (err) {
                          console.log(err)
                        } else {
                            resolve(data);
                          //console.log(typeof '2001')
                        }
                      })
                    })
              //removing duplicates
              {
              // data = data.split('\n')
              // data = new Set(data);
              // data = Array.from(data)
              // data = data.join('\n')
              
              // fs.writeFile(fileDir + 'work.txt', data, err => {
              //     if (err) {
              //       console.log(err)
              //     } else {
              //       //console.log(typeof '2001')
              //     }
              // })
              }
            }
            })
          }
        })
        /*
        if (!element.includes('3d') && !element.includes('2d')) {
        a = parseInt(element);
        if (!isNaN(a)) {
            //console.log(element)
            arr[j] = 'null';
        }
        //b = parseInt(a, 10);
        } 
        */    
      })
}

module.exports = dataCleansing;
    