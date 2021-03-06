'use strict';

var q = require('q'),
  storage = require('../lib/pageStorageFS'),
  errors = require('../lib/errors');

module.exports = function (req, res) {
  var pageName = 'index';

  if (req.params.page) {
    pageName = req.params.page;
  }

  storage.getPageContentAsHtml(pageName)
    .then(function (html) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      // the Buffer solves the problem with the automatic UTF-8 conversion
      res.setHeader('Content-Length', new Buffer(html).length);
      res.status(200);
      res.send(html);
    })
    .catch(function (error) {
      if (error instanceof errors.FileNotFoundError) {
        res.setHeader('Content-Type', 'text/plain');
        res.send(404, 'page not found');
      } else {
        res.setHeader('Content-Type', 'text/plain');
        res.send(500, 'server error: ' + error);
      }
    })
    .done(function () {
      res.end();
    });
};
