var url = require('url')
  , fs = require('fs')
  , jsonlint = require('json-lint')
  , path = require('path')
  , tv4 = require('tv4')
  , request = require('request')  
  ;

var schemas = {
  'dataPackage': JSON.parse(Buffer('ewogICAgIiRzY2hlbWEiOiAiaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjIiwKICAgICJ0aXRsZSI6ICJEYXRhUGFja2FnZSIsCiAgICAiZGVzY3JpcHRpb24iOiAiSlNPTiBTY2hlbWEgZm9yIHZhbGlkYXRpbmcgZGF0YXBhY2thZ2UuanNvbiBmaWxlcyIsCiAgICAidHlwZSI6ICJvYmplY3QiLAogICAgInByb3BlcnRpZXMiOiB7CiAgICAgICAgIm5hbWUiOiB7CiAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIsCiAgICAgICAgICAgICJwYXR0ZXJuIjogIl4oW2EtejAtOVxcLlxcX1xcLV0pKyQiCiAgICAgICAgfSwKICAgICAgICAibGljZW5jZXMiOiB7CiAgICAgICAgICAgICJ0eXBlIjogImFycmF5IiwKICAgICAgICAgICAgIml0ZW1zIjogewogICAgICAgICAgICAgICAgInR5cGUiOiAib2JqZWN0IiwKICAgICAgICAgICAgICAgICJwcm9wZXJ0aWVzIjogewogICAgICAgICAgICAgICAgICAgICJpZCI6IHsgInR5cGUiOiAic3RyaW5nIiB9LAogICAgICAgICAgICAgICAgICAgICJ1cmwiOiB7ICJ0eXBlIjogInN0cmluZyIgfQogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICJhbnlPZiI6IFsKICAgICAgICAgICAgICAgICAgICB7ICJ0aXRsZSI6ICJpZCByZXF1aXJlZCIsICJyZXF1aXJlZCI6IFsiaWQiXSB9LAogICAgICAgICAgICAgICAgICAgIHsgInRpdGxlIjogInVybCByZXF1aXJlZCIsICJyZXF1aXJlZCI6IFsidXJsIl0gfQogICAgICAgICAgICAgICAgXQogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICAiZGF0YXBhY2thZ2VfdmVyc2lvbiI6IHsKICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgIH0sCiAgICAgICAgInRpdGxlIjogewogICAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICAiZGVzY3JpcHRpb24iOiB7CiAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIKICAgICAgICB9LAogICAgICAgICJob21lcGFnZSI6IHsKICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgIH0sCiAgICAgICAgInZlcnNpb24iOiB7CiAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIKICAgICAgICB9LAogICAgICAgICJzb3VyY2VzIjogewogICAgICAgICAgICAidHlwZSI6ICJhcnJheSIsCiAgICAgICAgICAgICJpdGVtcyI6IHsKICAgICAgICAgICAgICAgICJ0eXBlIjogIm9iamVjdCIsCiAgICAgICAgICAgICAgICAicHJvcGVydGllcyI6IHsKICAgICAgICAgICAgICAgICAgICAibmFtZSI6IHsgInR5cGUiOiAic3RyaW5nIiB9LAogICAgICAgICAgICAgICAgICAgICJ3ZWIiOiB7ICJ0eXBlIjogInN0cmluZyIgfSwKICAgICAgICAgICAgICAgICAgICAiZW1haWwiOiB7ICJ0eXBlIjogInN0cmluZyIgfQogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICJhbnlPZiI6IFsKICAgICAgICAgICAgICAgICAgICAgICAgeyAidGl0bGUiOiAibmFtZSByZXF1aXJlZCIsICJyZXF1aXJlZCI6IFsibmFtZSJdIH0sCiAgICAgICAgICAgICAgICAgICAgICAgIHsgInRpdGxlIjogIndlYiByZXF1aXJlZCIsICJyZXF1aXJlZCI6IFsid2ViIl0gfSwKICAgICAgICAgICAgICAgICAgICAgICAgeyAidGl0bGUiOiAiZW1haWwgcmVxdWlyZWQiLCAicmVxdWlyZWQiOiBbImVtYWlsIl0gfQogICAgICAgICAgICAgICAgXQogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICAia2V5d29yZHMiOiB7CiAgICAgICAgICAgICJ0eXBlIjogImFycmF5IiwKICAgICAgICAgICAgIml0ZW1zIjogewogICAgICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICAibGFzdF9tb2RpZmllZCI6IHsKICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgIH0sCiAgICAgICAgImltYWdlIjogewogICAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICAiYnVncyI6IHsKICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgIH0sCiAgICAgICAgIm1haW50YWluZXJzIjogewogICAgICAgICAgICAidHlwZSI6ICJhcnJheSIsCiAgICAgICAgICAgICJpdGVtcyI6IHsKICAgICAgICAgICAgICAgICJ0eXBlIjogIm9iamVjdCIsCiAgICAgICAgICAgICAgICAicHJvcGVydGllcyI6IHsKICAgICAgICAgICAgICAgICAgICAibmFtZSI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgImVtYWlsIjogewogICAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAid2ViIjogewogICAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICJyZXF1aXJlZCI6IFsibmFtZSJdCiAgICAgICAgICAgIH0KICAgICAgICB9LAogICAgICAgICJjb250cmlidXRvcnMiOiB7CiAgICAgICAgICAgICJ0eXBlIjogImFycmF5IiwKICAgICAgICAgICAgIml0ZW1zIjogewogICAgICAgICAgICAgICAgInR5cGUiOiAib2JqZWN0IiwKICAgICAgICAgICAgICAgICJwcm9wZXJ0aWVzIjogewogICAgICAgICAgICAgICAgICAgICJuYW1lIjogewogICAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAiZW1haWwiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICJ3ZWIiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgInJlcXVpcmVkIjogWyJuYW1lIl0KICAgICAgICAgICAgfQogICAgICAgIH0sCiAgICAgICAgInB1Ymxpc2hlciI6IHsKICAgICAgICAgICAgInR5cGUiOiAiYXJyYXkiLAogICAgICAgICAgICAiaXRlbXMiOiB7CiAgICAgICAgICAgICAgICAidHlwZSI6ICJvYmplY3QiLAogICAgICAgICAgICAgICAgInByb3BlcnRpZXMiOiB7CiAgICAgICAgICAgICAgICAgICAgIm5hbWUiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICJlbWFpbCI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgIndlYiI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAicmVxdWlyZWQiOiBbIm5hbWUiXQogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICAiZGVwZW5kZW5jaWVzIjogewogICAgICAgICAgICAidHlwZSI6ICJvYmplY3QiCiAgICAgICAgfSwKICAgICAgICAicmVzb3VyY2VzIjogewogICAgICAgICAgICAidHlwZSI6ICJhcnJheSIsCiAgICAgICAgICAgICJtaW5JdGVtcyI6IDEsCiAgICAgICAgICAgICJpdGVtcyI6IHsKICAgICAgICAgICAgICAgICJ0eXBlIjogIm9iamVjdCIsCiAgICAgICAgICAgICAgICAicHJvcGVydGllcyI6IHsKICAgICAgICAgICAgICAgICAgICAidXJsIjogewogICAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAicGF0aCI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgIm5hbWUiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICJmb3JtYXQiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICJtZWRpYXR5cGUiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogInN0cmluZyIsCiAgICAgICAgICAgICAgICAgICAgICAgICJwYXR0ZXJuIjogIl4oLispLyguKykkIgogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgImVuY29kaW5nIjogewogICAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAiYnl0ZXMiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogImludGVnZXIiCiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAiaGFzaCI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIiwKICAgICAgICAgICAgICAgICAgICAgICAgInBhdHRlcm4iOiAiXihbYS1mQS1GMC05XXszMn0pJCIKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICJtb2RpZmllZCI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAic3RyaW5nIgogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgInNjaGVtYSI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAib2JqZWN0IgogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgImRpYWxlY3QiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogIm9iamVjdCIKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgICJzb3VyY2VzIjogewogICAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJhcnJheSIsCiAgICAgICAgICAgICAgICAgICAgICAgICJpdGVtcyI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogIm9iamVjdCIsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAicHJvcGVydGllcyI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAibmFtZSI6IHsgInR5cGUiOiAic3RyaW5nIiB9LAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJ3ZWIiOiB7ICJ0eXBlIjogInN0cmluZyIgfSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiZW1haWwiOiB7ICJ0eXBlIjogInN0cmluZyIgfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJhbnlPZiI6IFsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyAidGl0bGUiOiAibmFtZSByZXF1aXJlZCIsICJyZXF1aXJlZCI6IFsibmFtZSJdIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgInRpdGxlIjogIndlYiByZXF1aXJlZCIsICJyZXF1aXJlZCI6IFsid2ViIl0gfSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyAidGl0bGUiOiAiZW1haWwgcmVxdWlyZWQiLCAicmVxdWlyZWQiOiBbImVtYWlsIl0gfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgXQogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAibGljZW5jZXMiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogImFycmF5IiwKICAgICAgICAgICAgICAgICAgICAgICAgIml0ZW1zIjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAib2JqZWN0IiwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJwcm9wZXJ0aWVzIjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJpZCI6IHsgInR5cGUiOiAic3RyaW5nIiB9LAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJ1cmwiOiB7ICJ0eXBlIjogInN0cmluZyIgfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJhbnlPZiI6IFsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ICJ0aXRsZSI6ICJpZCByZXF1aXJlZCIsICJyZXF1aXJlZCI6IFsiaWQiXSB9LAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgInRpdGxlIjogInVybCByZXF1aXJlZCIsICJyZXF1aXJlZCI6IFsidXJsIl0gfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgXQogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICJhbnlPZiI6IFsKICAgICAgICAgICAgICAgICAgICAgICAgeyAidGl0bGUiOiAidXJsIHJlcXVpcmVkIiwgInJlcXVpcmVkIjogWyJ1cmwiXSB9LAogICAgICAgICAgICAgICAgICAgICAgICB7ICJ0aXRsZSI6ICJwYXRoIHJlcXVpcmVkIiwgInJlcXVpcmVkIjogWyJwYXRoIl0gfQogICAgICAgICAgICAgICAgXSAgIAogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfSwKICAgICJyZXF1aXJlZCI6IFsibmFtZSIsICJyZXNvdXJjZXMiXQp9Cg==', 'base64')
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
            type: 'json',
            line: lint.line,
            character: lint.character
          }
        ]
      };
    }
    json = JSON.parse(raw);
  }

  var report = tv4.validateMultiple(json, schemas.dataPackage);
  var errors = report.errors.map(function(error) {
    delete error.stack;
    error.type = 'schema';
    return error;
  });
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


