'use strict';

exports.ok = function(values, res) {
  var data = {
      'status': 200,
      'message': 'success',
      'values': values
  };
  res.json(data);
  res.end();
};


exports.err = function(values, res) {
  var data = {
      'status': 99,
      'message': 'error',
      'values': values
  };
  res.json(data);
  res.end();
};

exports.noRekNotFound = function(values,res) {
  var data = {
    'status' : 80,
    'message' : 'not found'
  };
  res.json(data);
  res.end;
}

exports.uniqueField = function(values,res) {
  var data = {
    'status' : 10,
    'message' : 'Existing Data',
    'values' : values
  }
  res.json(data);
res.end;
}



exports.datanotfound = function(values, res) {
  var data = {
      'status': 14,
      'message' : 'wrong input',
      'values': (values ? values : 'data not found')
  };
  res.json(data);
  res.end();
};