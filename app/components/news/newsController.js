var ezStockApp = angular.module('ezStockApp');

ezStockApp.controller('newsController', ['$scope', '$routeParams', 'newsService', function($scope, $routeParams, newsService) {
    
	newsService.get('mnst', function(data){
		var jsonData = x2js.xml_str2json(data);		
		$scope.data = jsonData.rss.channel;
    });
     
}]);