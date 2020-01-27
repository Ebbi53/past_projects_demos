const googleTrends = require('google-trends-api');
const fs = require('fs');
// const fileDir = process.cwd() + '/files/';

function GoogleTrends(word) {
  return new Promise((resolve, reject) => {

    googleTrends.interestOverTime(
      {
        keyword: word,
        startTime: new Date(2016),

      })
      .then(function (results) {
        resolve(results)
      })
      .catch(function (err) {
        console.error('Oh no there was an error', err);
      });
  })
}

module.exports = GoogleTrends;