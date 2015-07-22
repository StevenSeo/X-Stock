var ezStockApp = angular.module('ezStockApp');


ezStockApp.factory('portfolioService', ['$http', function($http){
    return{
      get: function(callback){
        
		var promise = $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%27AAPL%27)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
		promise.success(function(data) {			
			callback(data);
        });
		promise.error(function(response, status) {  
			console.log("The request failed with response " + response + " and status code " + status);
		});
		
      },
	  
      getDetail: function(symbol, callback){
         
		 //var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';
         //var query = 'select * from yahoo.finance.historicaldata where symbol = "' + symbol + '" and startDate = "' + start + '" and endDate = "' + end + '"';
         //var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + format;

			
		var param = escape("'" + symbol + "'");
		$http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('+param+')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
				
		.success(function(data) {			
			callback(data);
        })
		.error(function(response, status) {  
			console.log("The request failed with response " + response + " and status code " + status);
		});

      },
	  
        getChartData: function(symbol, callback){		
	 
		//$http.get('http://chartapi.finance.yahoo.com/instrument/1.0/'+symbol+'/chartdata;type=quote;range=1d/csv')
		$http.get('http://nodejs-xstock.rhcloud.com/getdata/'+symbol)
		.success(function(data) {	
			var chartData = [];
				var lines = data.split('\n');
				var previous_close = lines[8].split(':')[1];
				
				for (var i = 17; i<lines.length-1; i++) {
					var values = lines[i].split(',');
				chartData.push({x: values[0]*1000, y: values[1]});
				//chartData.push([parseInt(values[0]),parseFloat(values[1])]);
				}
			callback(chartData, previous_close);
                })
		.error(function(response, status) {  
			console.log("The request failed with response " + response + " and status code " + status);
		});

        },
	  
        getChart: function(symbol, period_type, callback){

            var period = getPeriod(period_type);
            
              var promise = $http.get('http://nodejs-xstock.rhcloud.com/geteod/'+symbol+'/'+period);
              promise.success(function(data) {

                  var chartData = [];
                  var lines = data.split('\n');

                  for (var i = 1; i<lines.length-1; i++) {
                      var values = lines[i].split(',');
                      //chartData.push({x: new Date(values[0]).getTime(), y: values[4]});                        
                      chartData.splice(0, 0, {x: new Date(values[0]).getTime(), y: values[4]});
                  }
                  callback(chartData);
              });
              promise.error(function(response, status) {  
                      console.log("The request failed with response " + response + " and status code " + status);
              });
		
        },
      
	  addPortfolio: function(symbol){
		  var table = new AWS.DynamoDB();
			var param = {
				"Item": {
					"UserId": {"N":"1"},
					"Symbol": {"S":symbol}
				},
				"TableName": "Portfolio"
			};
			
			table.putItem(param, function(err, data) {				
				if (err) {
					console.log(err);
				}
				else {
					console.log(symbol + ' added successfully.');
				}
			});
	  },
          
          deletePortfolio: function(symbol){
		  var table = new AWS.DynamoDB();
			var param = {
				"Key": {
					"UserId": {"N":"1"},
					"Symbol": {"S":symbol}
				},
				"TableName": "Portfolio"
			};
			
			table.deleteItem(param, function(err, data) {				
				if (err) {
					console.log(err);
				}
				else {
					console.log(symbol + ' deleted successfully.');
				}
			});
	  },
	  
	  getPortfolio: function(callback){
		  var table = new AWS.DynamoDB();
			var param = {
				"KeyConditions": {
					"UserId": {
						"AttributeValueList": [{"N":"1"}],
						"ComparisonOperator": "EQ"
					}
				},
				"TableName": "Portfolio"
			};
			
			table.query(param, function(err, data) {				
				
				var str = [];
				angular.forEach(data.Items, function(value, key) {					
					this.push("'"+value.Symbol.S+"'");
				}, str);
	
					$http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('+str+')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
						
				.success(function(d) {			
					var result = [];
					angular.forEach(data.Items, function(value, key) {
						
						var lastprice = 0, change = 0, changeinPercent = 0, gainloss = 0, marketvalue = 0;
						angular.forEach(d.query.results.quote, function(v) {
							if (v.symbol == value.Symbol.S) {
								lastprice = v.LastTradePriceOnly;
								change = v.Change;
								changeinPercent = v.ChangeinPercent;
							}
						});
						gainloss = (Number(lastprice) - Number(value.UnitPrice.N)) * value.Share.N;
						marketvalue = Number(lastprice) * value.Share.N;
						this.push({"symbol":value.Symbol.S,"lastprice":Number(lastprice),"unitprice":Number(value.UnitPrice.N), "change":Number(change), "changeinPercent":changeinPercent, "qty":Number(value.Share.N), "gainloss":gainloss, "marketvalue":marketvalue});						
					}, result);
					
					callback(result);
				})
				.error(function(response, status) {  
					console.log("The request failed with response " + response + " and status code " + status);
				});
		
			});
	  },
	  
	  addWatch: function(symbol){
		  var table = new AWS.DynamoDB();
			var param = {
				"Item": {
					"UserId": {"N":"1"},
					"Symbol": {"S":symbol}
				},
				"TableName": "Watch"
			};
			
			table.putItem(param, function(err, data) {				
				if (err) {
					console.log(err);
				}
				else {
					console.log(symbol + ' added successfully.');
				}
			});
	  },
          
          deleteWatch: function(symbol){
		  var table = new AWS.DynamoDB();
			var param = {
				"Key": {
					"UserId": {"N":"1"},
					"Symbol": {"S":symbol}
				},
				"TableName": "Watch"
			};
			
			table.deleteItem(param, function(err, data) {				
				if (err) {
					console.log(err);
				}
				else {
					console.log(symbol + ' deleted successfully.');
				}
			});
	  },
	  
	  getHistory: function(callback){
		  var table = new AWS.DynamoDB();
			var param = {
				"KeyConditions": {
					"UserId": {
						"AttributeValueList": [{"N":"1"}],
						"ComparisonOperator": "EQ"
					}
				},
				"TableName": "History"
			};
			
			table.query(param, function(err, data) {	
			
				var chartData = [];
				angular.forEach(data.Items, function(value) {
					chartData.push({x: value.Date.S*1000, y: Number(value.Amount.N)});
				});
			
				callback(chartData);
			});
	  },
	  
	  getWatch: function(callback){
		  var table = new AWS.DynamoDB();
			var param = {
				"KeyConditions": {
					"UserId": {
						"AttributeValueList": [{"N":"1"}],
						"ComparisonOperator": "EQ"
					}
				},
				"TableName": "Watch"
			};
			
			table.query(param, function(err, data) {				
				
				var str = [];
				
				angular.forEach(data.Items, function(value, key) {					
					this.push("'"+value.Symbol.S+"'");
				}, str);
				
				$http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('+str+')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
						
				.success(function(data) {	
					
					callback(data);
				})
				.error(function(response, status) {  
					console.log("The request failed with response " + response + " and status code " + status);
				});
		
			});
	  },
	  
	  getSymbol: function(callback){
        
		var promise = $http.get('symbol.txt');
		promise.success(function(data) {		
			var result = [];
			var lines = data.split('\n');
		
			lines.forEach(function(d) {
				var values = d.split('|');
				result.push({name: values[1], code: values[0]});
			});
	
			callback(result);
        });
		promise.error(function(response, status) {  
			console.log("The request failed with response " + response + " and status code " + status);
		});		
      },
	  
	  getTest: function(callback){
		  var table = new AWS.DynamoDB();
			var param = {
				"Key": {
					"Id": {
						"N":"1"
					}
				},
				"TableName": "User"
			};
			
			table.getItem(param, function(err, data) {				
				callback(data);
			});
	  }
    };
  }]);
