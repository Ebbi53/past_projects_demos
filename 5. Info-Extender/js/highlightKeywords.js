const fs = require('fs');

function updatePDFhtml ({path, keywords}) {
    // var path = info.path, keywords = info.keywords;
    return new Promise((resolve, reject) => {
      fs.open(path, 'r', (err, fd) => {
        if (err) {
          console.log(err);
              reject(err)
              // return reject(err);
        } else {
          fs.readFile(path, 'utf8', function(err, htmlContent) {
            if (err) {
              console.log(err);
              reject(err)
            } else {

              new Promise((resolve, reject) => {
                htmlBodyContent = htmlContent.match(/<body>(.*)<\/body>/is); //Extract body from the HTML
                resolve(htmlBodyContent[0])
              }).then((htmlBodyContent) => {
                htmlBodyContent = htmlBodyContent.split('<div ');
                resolve({
                  body: htmlBodyContent,
                  html: htmlContent
                });
              })
            }
          });
          
          fs.close(fd, err => {
            if (err) {
              console.log(err);
            }
          })
        }
      })
    }).then((data) => {
      return new Promise((resolve, reject) => {
        var htmlBodyContent = data.body, i, j;

        wstream3 = fs.createWriteStream('updatedPDF.html', {
          flags: 'w',
          //autoclose: 'false'
        });

        (async function loop2() { //asynchronous loop which waits for the inner loop to be completed first
          for (i = 0; i < keywords.length; i++) {
            var keyword = keywords[i].split(' ');
            let len = keyword.length;
            for (r = 0; r < len; r++) {
              if (keyword[r] == '') { //remove whitespaces
                keyword.splice(r, 1);
                r--; 
                len--;
              }
            }
            keyword = keyword.join(' ');
            await (async function loop1() { //another asynchronous loop which will wait for the body to be executed first before going to the next iteration
              for (j = 0; j < htmlBodyContent.length; j++) {
                var info = htmlBodyContent[j], temp, found;

                // var regex = new RegExp(keyword.split(' ').join('_').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
                // if (info.includes('class="keyword"')) { //to check whether the keyword is already highlighted
                //   continue;
                // }

                await new Promise((resolve, reject) => { //to clean the HTML code by removing the tags and attributes and store it to the temp variable
                  temp = info.replace(/class="(.*?)">/gi, ' ')
                  .replace(/<span |<\/span>/gi, ' ')
                  .replace(/<\/div>/gi, ' ')
                  .replace(/img (.*?)"\/>/gi, ' ');
                  resolve(1);
                }).then(() => {
                  return new Promise((resolve, reject) => {
                    temp = temp.toLowerCase();
                    temp = temp.split(',').join(' ').split(' '); //further break into separate words to perform exact matching
                    let len = temp.length;
                    for (q = 0; q < len; q++) {
                      if (temp[q] == '' || temp[q] == ' ') { //remove whitespaces
                        temp.splice(q, 1);
                        q--; 
                        len--;
                      }
                    }
                    resolve(1)
                  })
                }).then(() => {
                  return new Promise((resolve, reject) => {
                    if (temp.length == 0) {
                      return resolve(1);
                    } else {
                      if (temp.join(' ').includes(keyword.toLowerCase())) { //perform matching
                        var keywordD = keyword.toLowerCase().split(' '),
                        start, end;
          
                        for (a = 0; a < temp.length; a++) {                         
                          if (temp[a] == keywordD[0] && !temp[a].includes('id="')) {
                            found = true;
                            for (b = 1; b < keywordD.length; b++) {
                              if (++a == temp.length || temp[a] != keywordD[b]) {
                                found = false;
                                break;
                              }
                            }
                            if (found) { //convert the keyword into a link by surrounding it with the <a></a> tags
                              
                              if (info.toLowerCase().indexOf(keyword.toLowerCase()) != info.toLowerCase().lastIndexOf(keyword.toLowerCase())) {
                                start = info.toLowerCase().indexOf(keyword.toLowerCase());
                                while (info.toLowerCase().charAt(start-1) == '_') {
                                  start = info.toLowerCase().indexOf(keyword.toLowerCase(), start + 1);
                                }
                              } else {
                                start = info.toLowerCase().indexOf(keyword.toLowerCase());
                              }
                              end = start + keyword.length + 1;
                              info = info.split('');
                              // info.splice(start, 0, `<a href="" id="${keyword.split(' ').join('_').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}" class="keyword">`);
                              info.splice(start, 0, `<a href="" id="${keyword.split(' ').join('_')}" class="keyword">`);
                              info.splice(end, 0, `</a>`);
                              info = info.join('');
                              break;
                            }
                          } else {
                            found = false;
                          }
                        }
                      } else {
                        found = false;
                      }
                    }
                    resolve(1);
                  })
                })

                if (found) { //replace the original HTML with the updated one
                  htmlBodyContent[j] = info;
                  break; 
                }
              }
            })();

            if (i == keywords.length-1) {
              resolve({
                body: htmlBodyContent,
                html: data.html
              })
            }
          }
        })();
      })
    }).then((data) => {
      return new Promise((resolve, reject) => {
        var htmlBodyContent = data.body, htmlContent = data.html;

        htmlBodyContent = htmlBodyContent.join('<div ');
        htmlContent = htmlContent.replace(/<body>(.*?)<\/body>/is, htmlBodyContent); //replace the HTML body with the updated body
        resolve(htmlContent);
      })
    }).then((htmlContent) => { //for inserting bootstrap library and modal code inside the HTML generated from the uploaded file (not being used now)
      return new Promise((resolve, reject) => {
        // var bootstrap = '<script src="https://code.jquery.com/jquery-3.3.1.min.js" crossorigin="anonymous"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>\n<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">\n<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>',
        // modal = '<div class="modal fade" id="myModal" role="dialog">\n<div class="modal-dialog">\n<!-- Modal content-->\n<div class="modal-content">\n<div class="modal-header">\n<button type="button" class="close" data-dismiss="modal">&times;</button>\n<h4 class="modal-title">Modal Header</h4>\n</div>\n<div class="modal-body">\n<p>Some text in the modal.</p>\n</div>\n<div class="modal-footer">\n<button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>';
        // htmlContent = htmlContent.slice(0, htmlContent.indexOf('<style')) + bootstrap + htmlContent.slice(htmlContent.indexOf('<style'));
        // htmlContent = htmlContent.slice(0, htmlContent.indexOf('</body>')) + modal + htmlContent.slice(htmlContent.indexOf('</body'));
        resolve(htmlContent);
      })
    }).then((htmlContent) => {
      return new Promise((resolve, reject) => {
        fs.writeFile("updatedPDF.html", htmlContent, err => {
          if (err) {
            console.log(err)
          } else {
            //console.log(typeof '2001')
          }
        })
        resolve(1);
      })
    }) 
}

module.exports = updatePDFhtml;