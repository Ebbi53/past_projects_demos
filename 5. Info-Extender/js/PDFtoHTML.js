const pdftohtml = require('pdftohtmljs'); // requires pdf2htmlEX (installed locally in /usr/local/Cellar/pdf2htmlex)

function PDFtoHTML(path) {
    return new Promise((resolve, reject) => {
      var converter = new pdftohtml(path, "./pdf.html");
      
      // presets: (ipad, default)
      // see https://github.com/fagbokforlaget/pdftohtmljs/blob/master/lib/presets/ipad.js
      converter.convert('default').then(function() {
        console.log("Successfully converted PDF to HTML");
        resolve({
          htmlPath: "./pdf.html",
          pdfPath: path
        });
      }).catch(function(err) {
        console.error("Conversion error: " + err);
        reject(1);
      });
      
      //To review progress
      converter.progress(function(ret) {
        console.log ((ret.current*100.0)/ret.total + " %");
      });
    })
  }

  module.exports = PDFtoHTML;