'use strict';

var services = services || angular.module('mdwiki.services', []);

services.factory('PageService', ['$http', '$q', function ($http, $q) {
  var updatePagesObservers = [];

  var getPage = function (page) {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: '/api/page/' + page
    })
    .success(function (data, status, headers, config) {
      deferred.resolve(data);
    })
    .error(function (data, status, headers, config) {
      var error = new Error();
      error.message = status === 404 ? 'Content not found' : 'Unexpected server error';
      error.code = status;
      deferred.reject(error);
    });

    return deferred.promise;
  };

  var getPages = function () {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: '/api/pages'
    })
    .success(function (data, status, headers, config) {
      var pages = data || [];

      notifyObservers(pages);
      deferred.resolve(pages);
    })
    .error(function (data, status, headers, config) {
      var error = new Error();
      error.code = status;
      error.message = status === 404 ? 'Content not found' : 'Unexpected server error';
      deferred.reject(error);
    });

    return deferred.promise;
  };

  var registerObserver = function (callback) {
    updatePagesObservers.push(callback);
  };

  var notifyObservers = function (pages) {
    angular.forEach(updatePagesObservers, function (callback) {
      callback(pages);
    });
  };

  return {
    getPage: getPage,
    getPages: getPages,
    registerObserver: registerObserver
  };
}]);
