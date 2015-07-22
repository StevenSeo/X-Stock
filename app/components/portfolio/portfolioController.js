var ezStockApp = angular.module('ezStockApp');

ezStockApp.controller('portfolioController', ['$scope', '$location', 'portfolioService', function($scope, $location, portfolioService) {
    
	$scope.loadHistory = function(){
            portfolioService.getHistory(function(data){
                $scope.historyData = data;    
            });
    };
		
	$scope.loadPortfolio = function() {
		portfolioService.getPortfolio(function(data){
		
		//console.log(JSON.stringify(data.query.results.quote));
		
		
		$scope.data = data;
		$scope.url = $location.path();  
		
		var gainlossTotal = 0, marketPriceTotal = 0;
		for(var i = 0; i < $scope.data.length; i++){
			var product = $scope.data[i];
			gainlossTotal += (product.gainloss);
			marketPriceTotal +=(product.marketvalue);
		}			
		$scope.gainlossTotal = gainlossTotal;
		$scope.marketPriceTotal = marketPriceTotal;
		
		$scope.portfolioData = data;
		
		//$scope.$apply();
		});
	};
	
	$scope.loadWatch = function() {
		portfolioService.getWatch(function(data){
		
		if (!angular.isArray(data.query.results.quote)) {			
			data.query.results.quote = [data.query.results.quote];
		}
		
		$scope.dataWatch = data.query.results;
		$scope.url = $location.path();  
		//$scope.$apply();
		});
	};
	
	//Load Portfolio
	$scope.loadPortfolio();
	
	//Load Watch
	$scope.loadWatch();
	
	//Load History
	$scope.loadHistory();
	
	portfolioService.getSymbol(function(data){
		$scope.symbol = data;			
		//console.log(data);	
	});
	
        
        
    $scope.add = function (id) {
	portfolioService.addPortfolio(id);
	$scope.loadPortfolio();
    };
        
    $scope.delete = function (id) {
        portfolioService.deletePortfolio(id);
	$scope.loadPortfolio();
    };
	
	$scope.addWatch = function (id) {
	portfolioService.addWatch(id);
	$scope.loadWatch();
    };
        
    $scope.deleteWatch = function (id) {
        portfolioService.deleteWatch(id);
	$scope.loadWatch();
    };
                        
}]);