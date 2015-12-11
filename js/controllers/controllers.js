var app = angular.module('app', [
    'ngRoute',
    'appControllers',
    'ngAnimate',
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
 
        ADMdtp.setOptions({}); //gregorian jalali
        
    }
]).run(function(ADMdtp) {
    
    //console.info(ADMdtp.getOptions());
    
})

var appControllers = angular.module('appControllers', []);