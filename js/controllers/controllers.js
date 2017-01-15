var app = angular.module('app', [
    'appControllers',
    'hljs',
    'ADM-dateTimePicker'
]);

app.config(['ADMdtpProvider',

    function(ADMdtp) {

        ADMdtp.setOptions({});
        
    }
]).run(function(ADMdtp) {
    
    //console.info(ADMdtp.getOptions());
    
})

var appControllers = angular.module('appControllers', []);
