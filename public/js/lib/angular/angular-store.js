// define a dataStore
// check it out: https://gist.github.com/turingou/5908791
window.store = angular.module('store', ['ngResource']).factory('Store', function($resource) {
  return {
    user: $resource('/user/:action', {action:'@action'})
  }
});