var ezStockApp = angular.module('ezStockApp');

ezStockApp.controller('homeController', ['$scope', 'portfolioService', function($scope, portfolioService) {
    
	var symbols = ['^IXIC','^GSPC'];
	
	portfolioService.getDetail(symbols, function(data){      
		//console.log(JSON.stringify(data.query.results));
		$scope.data = data.query.results;
    });
     
}]);