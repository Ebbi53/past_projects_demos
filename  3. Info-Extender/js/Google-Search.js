const google = require('./google');
const fs = require('fs');
// const fileDir = process.cwd() + '/files/';

function googleSearch(word) {
  google.resultsPerPage = 2
  google.searchType = ''
  var nextCounter = 0

  return new Promise((resolve, reject) => {

    google(word, function (err, res) {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        res = JSON.parse(res);
        var items = res.items, i = 1,
          keys = ['title', 'link', 'snippet'],
          startTag = ['<h5>', `<a href=`, '<p>'],
          endTag = ['</h5>', `</a>`, '</p>'],
          result = '';
        items.forEach(item => {
          result += '<h5>Result #' + i++ + '<br></h5>';
          keys.forEach((element, index, array) => { //to populate the Search results with 
            //HTML tags
            if (element == 'link') {
              result += startTag[index] + `"${item[element]}" target="_blank">` + item[element] + '<br>' + endTag[index];
            } else {
              result += startTag[index] + item[element] + '<br>' + endTag[index];
            }
          })
          result += '<br>';
        })
        resolve(result);
      }
    })
  })
};

module.exports = googleSearch;