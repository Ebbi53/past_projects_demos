const GoogleNewsRss = require('google-news-rss');
const fs = require('fs');
// const fileDir = process.cwd() + '/files/';

function googleNews(word) {

  const googleNews = new GoogleNewsRss();

  wstream2 = fs.createWriteStream('./files/newsResults.txt', {
    flags: 'w',
    //autoclose: 'false'
  });

  return googleNews
    .search(word)
    .then(resp => {
      return new Promise((resolve, reject) => {
        var result = '', j, k = 0,
          startTag = ['<h5>', `<a href=`, '<h6>', '<p>', '<img src='],
          endTag = ['</h5>', `</a>`, '</h6>', '</p>'];
        wstream2.write('Keyword: ' + word + '\n')
        for (i = 0; i < resp.length && k < 2; i++) {
          j = 0;

          if (resp[i]['media:content'] == null) continue;

          result += `<h5>Result #${k + 1}<br></h5>`;
          for (key in resp[i]) { //to populate the News results with HTML tags
            if (key == 'source' || key == 'publisher') continue;
            if (key == 'link') {
              result += startTag[j] + `"${resp[i][key]}" target="_blank">` + resp[i][key] + '<br>' + endTag[j];
            }
            else if (key == 'title' || key == 'pubDate' || key == 'description') {
              result += startTag[j] + resp[i][key] + '<br>' + endTag[j];
            } else {
              result += startTag[j] + `"${resp[i][key].$.url}" style="display:block">`;
            }
            j++;
            wstream2.write(key + ': ' + resp[i][key] + '\n')
          }
          result += '<br><br>'
          wstream2.write('\n\n');
          k++
        }
        resolve(result)
      });

    })
}

module.exports = googleNews;
