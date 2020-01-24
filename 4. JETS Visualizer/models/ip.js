const mongoose = require('mongoose');


let Schema = mongoose.Schema;
let IPAddress = new Schema({}, {bufferCommands: false });

let data = mongoose.model('data', IPAddress, 'validIPaddresses');

module.exports = data;