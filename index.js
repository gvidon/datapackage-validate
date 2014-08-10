var url = require('url')
  , fs = require('fs')
  , jsonlint = require('json-lint')
  , path = require('path')
  , tv4 = require('tv4')
  , request = require('request')  
  ;

var schemasPath = path.join(__dirname, 'schemas');

var schemas = {
  'dataPackage': JSON.parse(fs.readFileSync(
      path.join(schemasPath, 'data-package.json')
    ))
};

exports.validate = function(raw) {
  var json = raw;
  if (typeof(json) == 'string') {
    var lint = jsonlint(json);
    if (lint.error) {
      return {
        valid: false,
        errors: [
          {
            message: 'Invalid JSON: ' + lint.error,
            line: lint.line,
            character: lint.character
          }
        ]
      };
    }
    json = JSON.parse(raw);
  }

  var report = tv4.validateMultiple(json, schemas.dataPackage);
  var errors = report.errors;
  if (errors.length === 0) {
    return {
      valid: true,
      errors: []
    };
  } else {
    return {
      valid: false,
      errors: errors
    };
  }
}

exports.validateUrl = function(dpurl, callback) {
  request(dpurl, function(err, response, body) {
    if (err) {
      callback({
        valid: false,
        errors: [{
          message: err.toString()
        }]
      });
    }
    else if (response.statusCode !== 200) {
      callback({
        valid: false,
        errors: [{
          message: 'Error loading the datapackage.json file. HTTP Error code: ' + response.statusCode
        }]
      });
    } else {
      callback(exports.validate(body));
    }
  });
}


