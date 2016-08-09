const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Record = require('./record');

const app = express();
app.use(bodyParser.json());

var db = mongoose.connection;
db.on('error', function(err) {
  console.log(err);
  process.exit(1);
});
db.once('open', function() {
  console.log("Database connection ready");
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});
mongoose.connect('mongodb://localhost/signal-server');

function handleError(res, reason, message, code) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({
    'status': 'FAILED',
    'error': message
  });
}

function getValue(body, key) {
  return (body.key) ? body.key : null;
}

app.post('/record', function(req, res) {
  const body = req.body;
  const record = new Record({
    id: body.id,
  });
  if (body.latitude && body.longitude) {
    record.location = [{
      latitude: body.latitude,
      longitude: body.longitude,
      type: 'GPS'
    }];
  }
  if (body.battery) {
    record.battery = {
      level: body.battery.level,
      capacity: body.battery.capacity
    }
  }
  if (body.device) {
    record.device = {
      IMEI: body.device.IMSIL,
      IMSI: body.device.IMSI,
      apiLevel: body.device.apiLevel,
      device: body.device.device,
      model: body.device.model,
      osVersion: body.device.osVersion,
      product: body.device.product
    }
  }
  if (body.signalRecord) {
    record.signal = {
      statutSignal: body.signalRecord.statutSignal,
      noise: body.signalRecord.noise,
      evdoEci: body.signalRecord.evdoEci,
      signalDb: body.signalRecord.signalDb,
      level: body.signalRecord.level,
      isGsm: body.signalRecord.isGsm
    }
  }
  if (body.cellularTowers) {
    record.cellularTowers = body.cellularTowers.map(function(tower) {
        return {
          mcc: tower.mcc,
          mnc: tower.mnc,
          lac: tower.lac,
          cid: tower.cid,
          latitude: tower.latitude,
          longitude: tower.longitude,
          asuLevel: tower.asuLevel,
          signalLevel: tower.signalLevel,
          signalDbm: tower.signalDbm
        };
    });
  }
  record.save(function(err) {
    if (err) {
      handleError(
        res,
        err,
        'impossible to save the new record', 401
      );
      return;
    }
    res.status(200).json({
      'status': 'OK',
      record: record
    });
  });
});

app.get('/record', function(req, res) {
  Record.find({}, function(err, records) {
    if (err) {
      handleError(
        res,
        'error find records',
        'impossible to find records'
      );
      return;
    }
    res.status(200).json({
      'status': 'OK',
      records: records
    });
  });
});

app.get('/record/:id', function(req, res) {
  const id = req.params.id;
  Record.find({deviceId: id}, function(err, device) {
    if (err) {
      handleError(
        res,
        'error find records',
        'impossible to find records'
      );
      return;
    }
    res.status(200).json({
      'status': 'OK',
      record: record
    });
  });
});
