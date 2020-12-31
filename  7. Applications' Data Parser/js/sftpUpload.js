const node_ssh = require('node-ssh'), // https://www.npmjs.com/package/node-ssh
  fileDir = process.cwd();

module.exports = (SESSION) => {
  return new Promise(async (resolve, reject) => {
    if (SESSION['FTPpassword']) {
      console.log('Starting sFTP file upload..')
      var ssh = new node_ssh(),
        promises = [];

      //establishing sftp connection through ssh
      await ssh.connect({
        host: 'slcfeuftp01.kenexa.com',
        username: 'jardines',
        port: 22,
        password: SESSION['FTPpassword'],
        tryKeyboard: true,
        onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
          if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
            finish([SESSION['FTPpassword']])
          }
        }
      });

      //asynchronously uploading encrypted files to the ftp server simultaneously and resolving on success
      for (let j = 0; j < SESSION.nBatches; j++) {
        var batchID = `${SESSION.BATCH}_${j == SESSION.nBatches - 1 ? 'EOB' : j + 1}`;
        promises.push(new Promise((resolve, reject) => {
          ssh.putFile(`${fileDir}/${SESSION.TYPE}_datafeeds/jardines_datafeeds_Delta_${SESSION.BATCH}/jardines_datafeeds_Delta_${batchID}.zip.pgp`, `/upload/jardines_datafeeds_Delta_${batchID}.zip.pgp`)
            .then(() => {
              console.log(`Batch ${batchID} successfully uploaded!`)
              resolve();
            }, (err) => {
              console.log('errorr!')
              reject(err)
            })
        }));
      }
      Promise.all(promises).then(() => {
        ssh.dispose();
        resolve(1);
      })
    } else {
      resolve(0)
    }
  })
}