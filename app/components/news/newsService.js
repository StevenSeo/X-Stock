var ezStockApp = angular.module('ezStockApp');


ezStockApp.factory('newsService', ['$http', function($http){
    return{
      
	  get: function(symbol, callback){
         		
                $http.get('http://nodejs-xstock.rhcloud.com/getnews/'+symbol)
		
		//$http.get('http://finance.yahoo.com/rss/headline?s='+symbol) 
        	//$http.get('https://www.google.com/finance/company_news?output=rss&q=NASDAQ:'+symbol) 
                
		.success(function(data) {  
			callback(data);
        })
		.error(function(response, status) {  
			console.log("The request failed with response " + response + " and status code " + status);
		});

      }
	  
	 
		 
    };
  }]);
