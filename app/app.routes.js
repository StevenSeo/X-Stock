var ezStockApp = angular.module('ezStockApp', ['ngRoute', 'angucomplete']);

ezStockApp.config(['$routeProvider','$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {
    
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    
    $routeProvider.
      when('/', {
        templateUrl: 'app/components/home/homeView.html',
        controller: 'homeController'
      }).
	  when('/portfolio', {
        templateUrl: 'app/components/portfolio/portfolioView.html',
        controller: 'portfolioController'
      }).
      when('/portfolio/:Id', {
        templateUrl: 'app/components/portfolio/portfolioDetailView.html',
        controller: 'portfolioDetailController'
      }).
	  when('/news', {
        templateUrl: 'app/components/news/newsView.html',
        controller: 'newsController'
      }).
      otherwise({
        redirectTo: '/'
      });
	  
	  
  }]);
  
