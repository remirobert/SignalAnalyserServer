const mongoose = require('mongoose');

const CellularTower = new mongoose.Schema({
  mcc: {type: Number},
  mnc: {type: Number},
  lac: {type: Number},
  cid: {type: Number},
  latitude: {type: Number},
  longitude: {type: Number},
  asuLevel: {type: Number},
  signalLevel: {type: Number},
  signalDbm: {type: Number}
});

const Battery = new mongoose.Schema({
  level: {type: Number},
  capacity: {type: Number}
});

const SignalRecord = new mongoose.Schema({
  statutSignal: {type: Number},
  noise: {type: Number},
  evdoEci: {type: Number},
  signalDb: {type: Number},
  level: {type: Number},
  isGsm: {type: Boolean}
});

const Location = new mongoose.Schema({
  latitude: {type: Number},
  longitude: {type: Number},
  type: {type: String}
});

const Device = new mongoose.Schema({
  IMEI: {type: String},
  IMSI: {type: String},
  apiLevel: {type: String},
  device: {type: String},
  model: {type: String},
  osVersion: {type: String},
  product: {type: String}
});

const Record = new mongoose.Schema({
  id: {type: String, required: true},
  createdAt: {
    type: Date,
    default: Date.now
  },
  device: Device,
  battery: Battery,
  signal: SignalRecord,
  location: [Location],
  cellularTowers: [CellularTower]
});

module.exports = mongoose.model('Record', Record);
