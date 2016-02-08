appControllers.controller('homeControllers', function($scope, $sce, $http, $controller, $filter) {

    $scope.date3Message = [];
    
    $scope.availableOptions = [
        {name:'calType', type:'String', default:'gregorian', description:"<strong>'gregorian'</strong> & <strong>'jalali'</strong> are available"},
        {name:'dtpType', type:'String', default:'date&time', description:"<strong>'date&time'</strong> & <strong>'date'</strong> are available. (expect <strong>'time'</strong> in next version)"},
        {name:'default', type:'Number, String, Date', default:'--', description:"Initial date can be Number(UNIX), String or Date and also word <strong>'today'</strong> for auto set current date"},
        {name:'disabled', type:'Array', default:'--', description:"Disable specific days with format of String, Date and UNIX, or days with pattern of 'i+[NUM]' and '[NUM]d+[NUM]'"},
        {name:'freezeInput', type:'Boolean', default:'false', description:"Freeze input to prevent user changing text"},
        {name:'smartDisabling', type:'Boolean', default:'true', description:"Whether change Sunday from Gregorian calendar to Friday in Jalali calendar by switching calendar type or not"},
        {name:'format', type:'String', default:'YYYY/MM/DD hh:mm', description:"Any combination of <strong>YYYY</strong>, <strong>YY</strong>, <strong>MM</strong>, <strong>DD</strong>, <strong>hh</strong>, <strong>mm</strong>. (e.g. <strong>YY/MM/DD</strong>, <strong>MM-DD (hh:mm)</strong>)"},
        {name:'multiple', type:'Boolean', default:'true', description:'Whether user can change calendar type or not'},
        {name:'autoClose', type:'Boolean', default:'false', description:'Auto close ADMdtp on selecting a day'},
        {name:'transition', type:'Boolean', default:'true', description:'Transition on loading days'},
    ];
    
    $scope.availableOptions.forEach(function(item) {
        item.description = $sce.trustAsHtml(item.description);
    });
    
    $scope.testOpen = function() {
        $scope.date3Message = ['Open event Fired!'];
    }
    $scope.testClose = function() {
        $scope.$applyAsync(function() {
            $scope.date3Message = ['Close event Fired!'];
        })
    }
    $scope.testChange = function(_date) {
        $scope.date3Message.push('Input changed to ' + _date.formated);
    }
    $scope.testTimeChange = function(_date) {
        $scope.date3Message.push('Time changed to ' + _date.formated);
    }
    $scope.testDateChange = function(_date) {
        $scope.date3Message.push('Date changed to ' + _date.formated);
    }
    
    
    $scope.option2 = {calType:'gregorian', multiple:false, default:1450125000000};
    
    $scope.dtp1 = function(_date) {
        console.info(_date);
    }
    $scope.dtp2 = function(_date) {
        console.info(_date.formated, '2');
    }
    $scope.dtp3 = function(_date) {
        console.info(_date.formated, '3');
    }
    $scope.open = function() {
        console.info('open');
    }
    $scope.close = function() {
        console.info('close');
    }

});
