var app = angular.module('app', [
    'ngRoute',
    'appControllers',
    'hljs',
    'ADM-dateTimePicker'
]);

app.config(['$routeProvider', 'ADMdtpProvider',

    function($routeProvider, ADMdtp) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home/home.html',
                controller: 'homeControllers'
            })
            .when('/home', {
                templateUrl: 'views/home/home.html',
                controller: 'homeControllers'
            });
 
        ADMdtp.setOptions({});
        
    }
]).run(function(ADMdtp) {
    
    //console.info(ADMdtp.getOptions());
    
})

var appControllers = angular.module('appControllers', []);