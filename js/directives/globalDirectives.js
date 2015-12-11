app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if(!ngModelCtrl) {
                return; 
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace( /[^0-9]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if(event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

app.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
});

app.directive('modal', function() {
    return {
        restrict: 'E',
        scope: {
            show: '=',
            func: '&',
            hasAction: '='
        },
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {
            scope.hideModal = function() {
                scope.show = false;
                document.body.style.overflowY = 'visible';
            };
        },
        template: "<div class='ng-modal' ng-show='show'>"+
        "<div id='mainModal' class='reveal-modal' ng-show='show'>"+
        "<div ng-transclude></div>"+
        "<a class='close-reveal-modal' ng-click='hideModal()'>&#215;</a>"+
        "</div>"+
        "<div class='reveal-modal-bg' ng-click='hideModal()'></div>"+
        "</div>"
    };
});

(function () {
    app.directive('clickOutside', ['$document', clickOutside]);

    function clickOutside($document) {
        return {
            restrict: 'A',
            scope: {
                clickOutside: '&'
            },
            link: function ($scope, elem, attr) {
                var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [];
                if (attr.id == undefined) attr.$set('id', 'id_'+Math.random());
                if (attr.id !== undefined) classList.push(attr.id);

                $document.on('click', function (e) {
                    var i = 0,
                        element;

                    if (!e.target) return;

                    for (element = e.target; element; element = element.parentNode) {
                        var id = element.id;
                        var classNames = element.className;

                        if (id !== undefined) {
                            for (i = 0; i < classList.length; i++) {
                                if (id.indexOf(classList[i]) > -1 || classNames.indexOf(classList[i]) > -1) {
                                    return;
                                }
                            }
                        }
                    }

                    $scope.$eval($scope.clickOutside);
                });
            }
        };
    }
})();