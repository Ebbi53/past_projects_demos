const google = require('./google');
const fs = require('fs');
// const fileDir = process.cwd() + '/files/';

function googleSearch (word) {
    // console.log('as');
  
    google.resultsPerPage = 2
    google.searchType = ''
    var nextCounter = 0
    
    // wstream1 = fs.createWriteStream('./files/searchResults.txt', {
    //   flags: 'w',
    //   //autoclose: 'false'
    // });
    return new Promise((resolve, reject) => {

      google(word, function (err, res){
        if (err) {
          console.error(err)
          reject(err)
        } else {
          res = JSON.parse(res);
          // console.log(res)
          var items = res.items, i = 1,
          keys = ['title', 'link', 'snippet'],
          startTag = ['<h5>',`<a href=`, '<p>'],
          endTag = ['</h5>', `</a>`, '</p>'],
          result = '';
          // var link = res.links[0];
          // if (link.href == null) {
          //   link = res.links[1]
          // }
          // wstream1.write('Keyword: ' + word + '\n')
          items.forEach(item => {
            result += '<h5>Result #' + i++ + '<br></h5>';
            keys.forEach((element, index, array) => { //to populate the Search results with 
              //HTML tags
              if (element == 'link') {
                result += startTag[index] + `"${item[element]}" target="_blank">` + item[element] + '<br>' + endTag[index];
              } else {
                result += startTag[index] + item[element] + '<br>' + endTag[index];
              }
              // wstream1.write(element + ': ' + item[element] + '\n')
            })
            result += '<br>';
          })
          resolve(result);
        }
      })
    })
  };

  module.exports = googleSearch;