var ezStockApp = angular.module('ezStockApp');

ezStockApp.controller('portfolioDetailController', ['$scope', '$routeParams', 'portfolioService', function($scope, $routeParams, portfolioService) {
    	
	portfolioService.getDetail($routeParams.Id, function(data){
            $scope.data = data.query.results.quote;
            $scope.lastprice = data.query.results.quote.LastTradePriceOnly;
	  
            //console.log(data.query.results.quote);
        });
    
        $scope.loadTodayData = function(){
            portfolioService.getChartData($routeParams.Id, function(data, previousPrice){
                //console.log(JSON.stringify(data));		
                $scope.exampleData = data;
                //$scope.previousPrice = previousPrice;	
                //$scope.data = data.query.results.quote;
            });
            $scope.type = 1;            
        };
        
        $scope.loadPastData_1m = function(){
            portfolioService.getChart($routeParams.Id, '1m', function(data){
                $scope.exampleData = data;
		//console.log(JSON.stringify(data));	
            });
            $scope.type = 2;
        };
        
        $scope.loadPastData_6m = function(){
            portfolioService.getChart($routeParams.Id, '6m', function(data){
                $scope.exampleData = data;
		//console.log(JSON.stringify(data));	
            });
            $scope.type = 3;
        };
        
        $scope.loadPastData_1y = function(){
            portfolioService.getChart($routeParams.Id, '1y', function(data){
                $scope.exampleData = data;
		//console.log(JSON.stringify(data));	
            });
            $scope.type = 4;
        };
        
        $scope.loadTodayData();
        
}]);