var exec = require('child_process').exec; // https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback (to execute terminal commands)

module.exports = (filePath, outDir, id) => {

  return new Promise(function (resolve, reject) {

    // https://www.libreoffice.org/ (to convert files to pdf)

    var cmd = 'soffice --headless --convert-to pdf ' + filePath + ' --outdir ' + outDir;

    exec(cmd, function (error, stdout, stderr) {
      if (error) {
        reject(error)
      } else {
        resolve(id)
      }
    });
  });

}
