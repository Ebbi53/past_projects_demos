const fs = require('fs'),
  performance = require('performance-now'),
  googleSearch = require('./js/Google-Search'),
  googleNews = require('./js/Google-News'),
  GoogleTrends = require('./js/Google-Trends'),
  PDFtoHTML = require('./js/PDFtoHTML'),
  wordDocToHTML = require('./js/wordDocToHTML'),
  extractData = require('./js/extractFromHTML'),
  extractKeywords = require('./js/extractKeywords'),
  updatePDFhtml = require('./js/highlightKeywords'),
  cleanData = require('./js/dataCleansing'),
  formidable = require('formidable'),
  express = require('express');
const google = require('./js/google');

const fileDir = process.cwd() + '/files/';
var promises = [];

var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))

// cleanData();

app.post('/fileupload', (req, resp) => { //handling the fileupload request
  var t0 = performance(), msg,
    form = new formidable.IncomingForm();
  // console.log({}.toString.call(req))
  // console.log(req.params)
  var saveFile = new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      // console.log(Object.entries(files));
      var oldpath = files.filetoupload.path,
        newpath = fileDir + files.filetoupload.name; //saving the file to my computer (local server)
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
          // throw err;
          reject(1);
        } else {
          msg = files.filetoupload.name + ' successfully uploaded!';
          resp.redirect('/');
          resolve(newpath);
        }
      })
    })
  })

  saveFile //Promise waiting for the file to be saved locally 
    .then((path) => {
      //After saving the file, convert it to HTML
      // return wordDocToHTML(path); 
      return PDFtoHTML(path);
    })
    .then(({ htmlPath, pdfPath }) => { //After the file is converted, display it on the frontend
      io.emit('uploadMsg',
        {
          msg: msg,
          path: htmlPath
        })
      return extractData(htmlPath); //After displaying, continue to process the file by extracting
      //data in the backend.
    }).then((data) => {
      return extractKeywords(data); //After extracting data from the uploaded file, extract
      //meaningful keywords from it
    })
    .then((keywords) => {
      return updatePDFhtml({ //After extracting keywords, update the HTML by making the keywords
        //into hyperlinks
        keywords: keywords,
        path: './pdf.html'
      });
    }).then(() => {
      var t1 = performance(); //Calculate the time taken to process the file
      console.log('Information Extended successfully in ' + ((t1 - t0) / 1000) + ' seconds!');
      io.emit('updateHTML'); //After the updated HTML is ready, send a request to frontend to 
      //allow the user to run the Info-Extender
    })
})

app.get('/updatedHTML', (req, resp) => { //To handle the user's request to run Info-Extender
  var credentials = req.query.credentials.split(', ');
  // credentials = credentials.split('\n')
  google.key = credentials[0];
  google.cx = credentials[1];
  resp.send('./updatedPDF.html');
})

app.get('/modalData', (req, resp) => { //To handle the user's click event on the specific 
  //keyword by performing its google search 
  var results = {}, keyword = req.query.keyword.split('_').join(' ');
  new Promise((resolve, reject) => {
    promises.push(
      googleSearch(keyword).then((result) => {
        return new Promise((resolve, reject) => {
          results['search'] = result;
          resolve(1);
        })
      }),
      googleNews(keyword).then((result) => {
        return new Promise((resolve, reject) => {
          results['news'] = result;
          resolve(1);
        })
      }),
      GoogleTrends(keyword).then((result) => {
        return new Promise((resolve, reject) => {
          results['trends'] = result;
          resolve(1);
        })
      })
    );
    Promise.all(promises).then(() => { //Wait for the search to complete and then forward the
      //results to frontend
      resolve(1);
    })
  }).then(() => {
    // console.log(results)
    resp.send(results);
  })
})

var server = http.listen(3000, () => {
  console.log('server is listening on port: ', server.address().port)
})