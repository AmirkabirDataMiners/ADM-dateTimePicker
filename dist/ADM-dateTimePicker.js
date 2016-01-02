/*
 * Picking date & time in AngularJS is easier than ever.
 * Demo:
 *
 * @version 1.0.0
 *
 * © 2015 Amirkabir Data Miners <info@adm-co.net> - www.adm-co.net
 */

(function(angular) {
    'use strict';

    var ADMdtpProvider = function() {
        'use strict';

        var options = {
            calType: 'gregorian',
            format: 'YYYY/MM/DD HH:MM', 
            multiple: true,
            autoClose: false,
            transition: true,
            disabled: [],
            smartDisabling: true
        };

        var ADMdtp = {
            getOptions: function(type) {
                var typeOptions = type && options[type] || options;
                return typeOptions;
            }
        };

        this.setOptions = function(type, customOptions) {
            if (!customOptions) {
                customOptions = type;
                options = angular.extend(options, customOptions);
                return;
            }
            options[type] = angular.extend(options[type] || {}, customOptions);
        };

        this.$get = function() {
            return ADMdtp;
        };

    };

    var ADMdtpConvertor = function() {
        'use strict';
        
        function getJalaliDate(date) {
            var daysPassedInGregorianCalender = getDaysPassedInGregorianCalender(date);
            daysPassedInGregorianCalender -= 226894;
            return getJalaliDateOfDay(daysPassedInGregorianCalender);
        }
        function getJalaliDateOfDay(daysPassedInJalaliCalender) {
            var yearOfDay = getYearJalaliCalender(daysPassedInJalaliCalender);

            var monthOfDay = getMonthJalaliCalender(daysPassedInJalaliCalender, yearOfDay);

            var dayOfMonth = getDayJalaliCalender(daysPassedInJalaliCalender, yearOfDay, monthOfDay);
            var date =
                {
                    day: dayOfMonth,
                    month: monthOfDay,
                    year: yearOfDay
                };
            return date;
        }
        function getDayJalaliCalender(daysPassedInJalaliCalender, yearOfDay, monthOfDay) {
            var leaps = howManyLeapsYearPassedInJalaliCalender(yearOfDay);
            daysPassedInJalaliCalender -= leaps + ((yearOfDay - 1) * 365);
            for (var i = 1; i < monthOfDay; i++) {
                if (i <= 6) {
                    daysPassedInJalaliCalender -= 31;
                }
                else {
                    daysPassedInJalaliCalender -= 30;
                }
            }
            return daysPassedInJalaliCalender;
        }
        function getMonthJalaliCalender(daysPassedInJalaliCalender, yearOfDay) {
            var leaps = howManyLeapsYearPassedInJalaliCalender(yearOfDay);
            daysPassedInJalaliCalender -= leaps + ((yearOfDay - 1) * 365);
            var jalaliMonths = getJalaliMonths();
            for (var i = 0; i < jalaliMonths.length; i++) {
                if (daysPassedInJalaliCalender <= jalaliMonths[i].count) {
                    return jalaliMonths[i].id;
                }
                daysPassedInJalaliCalender -= jalaliMonths[i].count;
            }
            return 12;
        }
        function getJalaliMonths() {
            return [
                { id: 1, count: 31 },
                { id: 2, count: 31 },
                { id: 3, count: 31 },
                { id: 4, count: 31 },
                { id: 5, count: 31 },
                { id: 6, count: 31 },
                { id: 7, count: 30 },
                { id: 8, count: 30 },
                { id: 9, count: 30 },
                { id: 10, count: 30 },
                { id: 11, count: 30 },
                { id: 12, count: 29 }
            ];
        }
        function getYearJalaliCalender(daysPassedInJalaliCalender) {
            var years = Math.floor((daysPassedInJalaliCalender - 1) / 365);
            var leapsCount = 0;
            if (years > 22) {
                var year1 = years - 22 - 1;
                var year2 = years - 22;

                var siose = Math.floor(year1 / 33);
                var remainYear = (year2 - (siose * 33));
                if (remainYear >= 28) {
                    remainYear = 28;
                }
                var a = Math.floor(remainYear / 4);
                var sum = a + (siose * 8) + 6;
                var sal = Math.floor((daysPassedInJalaliCalender - sum) / 365);
                leapsCount = howManyLeapsYearPassedInJalaliCalender(sal);
                if (daysPassedInJalaliCalender - (sal * 365) - leapsCount - (isLeapYearInJalaliCalender(sal) ? 1 : 0) > 0) {
                    sal++;
                    return sal;
                }
                else if (daysPassedInJalaliCalender - (sal * 365) + leapsCount <= 0) {
                    return sal;
                }
                return sal;

            }
            else {
                if (years < 1) {
                    leapsCount = 0;
                }
                else if (years >= 1 && years <= 4) {
                    leapsCount = 1;
                }
                else if (years >= 5 && years <= 8) {
                    leapsCount = 2;
                }
                else if (years >= 9 && years <= 12) {
                    leapsCount = 3;
                }
                else if (years >= 13 && years <= 16) {
                    leapsCount = 4;
                }
                else if (years >= 17 && years < 22) {
                    leapsCount = 5;
                }
                else {
                    leapsCount = 6;
                }
                years = Math.floor((daysPassedInJalaliCalender - leapsCount - 1) / 365);

                return years + 1;
            }
        }
        function howManyLeapsYearPassedInJalaliCalender(year) {
            if (year < 23) {
                switch (year) {
                    case 1:
                        return 0;
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        return 1;
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        return 2;
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                        return 3;
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                        return 4;
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                        return 5;


                }
            }
            var yearAfterFirstEra = year - 22;
            var countSioSe = Math.floor((yearAfterFirstEra - 1) / 33);
            var remainOfNormalLeapsYear = yearAfterFirstEra - countSioSe * 33;
            if (remainOfNormalLeapsYear > 28) {
                remainOfNormalLeapsYear = 28;
            }
            var leapsCount = Math.floor(remainOfNormalLeapsYear / 4) + countSioSe * 8 + 6;
            if (isLeapYearInJalaliCalender(year) && (yearAfterFirstEra - countSioSe * 33) <= 28) {
                leapsCount--;
            }
            return leapsCount;
        }
        
        function getDaysPassedInGregorianCalender(date) {
            var gregorianMonths = getGregorianMonths();
            var passedLeapYears = howManyGregorianLeapsYearPassed(date.year);
            var days = passedLeapYears;
            var isMiladiLeaps = isGregorianLeapYear(date.year);
            days += (date.year - 1) * 365;
            for (var i = 0; i < date.month - 1; i++) {
                if (isMiladiLeaps && i + 1 == 2) {
                    gregorianMonths[i].count = 29;
                }
                days += gregorianMonths[i].count;

            }
            days += date.day;
            return days;
        }
        function getGregorianMonths() {
            return [
                { id: 1, count: 31 },
                { id: 2, count: 28 },
                { id: 3, count: 31 },
                { id: 4, count: 30 },
                { id: 5, count: 31 },
                { id: 6, count: 30 },
                { id: 7, count: 31 },
                { id: 8, count: 31 },
                { id: 9, count: 30 },
                { id: 10, count: 31 },
                { id: 11, count: 30 },
                { id: 12, count: 31 }
            ];
        }
        function isGregorianLeapYear(year) {
            if (year % 4 != 0) {
                return false;
            }
            if (year % 100 != 0) {
                return true;
            }
            if (year % 400 != 0) {
                return false;
            }
            return true;
        }
        function howManyGregorianLeapsYearPassed(year) {
            var yearsPassed = year - 1;
            var countOfFourYears = Math.floor(yearsPassed / 4);
            var countOfHandredYears = Math.floor(yearsPassed / 100);
            var countOfFourHandredYears = Math.floor(yearsPassed / 400);
            return countOfFourYears - countOfHandredYears + countOfFourHandredYears;
        }
        function getGregorianYear(gregorianPassedDays) {
            var pureYear = Math.floor((gregorianPassedDays) / 365);
            var gregorianLeapsYear = howManyGregorianLeapsYearPassed(pureYear);
            var year = Math.floor((gregorianPassedDays - gregorianLeapsYear) / 365);
            var remainDay = gregorianPassedDays - year * 365 - gregorianLeapsYear;
            if (remainDay != 0) {
                year++;
            }
            else if (isGregorianLeapYear(year + 1)) {
                year += gregorianLeapsYear / 365;
            }
            return Math.floor(year);
        }
        function getGregorianMonth(daysPassed) {
            var year = getGregorianYear(daysPassed);
            var leaspYearCount = howManyGregorianLeapsYearPassed(year - 1);
            daysPassed -= (year - 1) * 365 + leaspYearCount;
            var months = getGregorianMonths();
            var month = 0;
            var isCurrentYearLeaps = isGregorianLeapYear(year);
            for (var i = 0; i < months.length; i++) {
                if (isCurrentYearLeaps && months[i].id == 2) {
                    months[i].count = 29;
                }
                if (daysPassed < months[i].count) {
                    if (daysPassed != 0 || month == 0) {
                        month++;
                    }
                    return month;
                }
                daysPassed -= months[i].count;
                month = months[i].id;
            }
            return month;
        }
        function getGregorianDayOfMonthByPassedDay(daysPassed) {
            var year = getGregorianYear(daysPassed);
            var month = getGregorianMonth(daysPassed);
            return getGregorianDayOfMonth(year, month, daysPassed);
        }

        function getGregorianDayOfMonth(year, month, daysPassed) {
            var leaspYearCount = howManyGregorianLeapsYearPassed(year - 1);
            var months = getGregorianMonths();
            var sumOfMonths = 0;
            for (var i = 0; i < months.length; i++) {
                if (months[i].id < month) {
                    sumOfMonths += months[i].count;
                }
            }
            if (isGregorianLeapYear(year) && month > 2) {
                sumOfMonths++;
            }
            return daysPassed - (year - 1) * 365 - leaspYearCount - sumOfMonths;
        }
        function getDaysPassedInJalaliCalander(date) {
            var days = date.day;
            days += passedDaysFromMonthsInJalaliCalander(date.month);
            days += passedDaysToYearsInJalaliCalander(date.year);
            return days;
        }

        function passedDaysFromMonthsInJalaliCalander(month) {
            var days = 0;
            var months = getJalaliMonths();
            for (var i = 0; i < month - 1; i++) {
                days += months[i].count;
            }
            return days;
        }

        function passedDaysToYearsInJalaliCalander(years) {
            var days = howManyLeapsYearPassedInJalaliCalender(years);
            days += (years - 1) * 365;
            return days;
        }

        function getGregorianDate(date) {
            var daysPassed = getDaysPassedInJalaliCalander(date) + 226894;
            var day = getGregorianDayOfMonthByPassedDay(daysPassed);
            var month = getGregorianMonth(daysPassed);
            var year = getGregorianYear(daysPassed);
            return {
                day: day,
                month: month,
                year: year
            };

        }
        var isLeapYearInJalaliCalender = function(years) {
            if (years == 1 || years == 5 || years == 9 || years == 13 || years == 17 || years == 22) {
                return true;
            }
            else if (years < 22) {
                return false;
            }
            var year = years - 22;
            var siosesal = Math.floor(year / 33);
            return ((year - (siosesal * 33)) % 4 == 0) && (year - (siosesal * 33)) / 4 != 8;
        }
        var getPersianDate = function(year, month, day) {

            var date = { year: year, month: month, day: day };
            date = getJalaliDate(date);
            return date;
        }
        var getGregorianDates = function(year, mont, day) {
            var date= getGregorianDate( {
                day: day,
                month: mont,
                year: year
            });
            return date;
        }
        
        return {
            toJalali: getPersianDate,
            toGregorian: getGregorianDates,
            isLeapJalali: isLeapYearInJalaliCalender
        }
    }
    
    var ADMdtpFactory = function(ADMdtpConvertor) {
        'use strict';

        this.leadingZero = function(num) {
            return (num < 10) ? ('0' + num) : num;
        };
        this.dateFormat = function(date, time, format) {
            var year = date.year;
            var month = this.leadingZero(date.month);
            var day = this.leadingZero(date.day);
            var hour = time.hour;
            var minute = time.minute;

            switch (format) {
                case 'MM/DD/YYYY':
                    return (month + '/' + day + '/' + year);
                case 'MM/DD/YYYY HH:MM':
                    return (month + '/' + day + '/' + year + ' ' + hour + ':' + minute);
                case 'YYYY/MM/DD':
                    return (year + '/' + month + '/' + day);
                case 'YYYY/MM/DD HH:MM':
                    return (year + '/' + month + '/' + day + ' ' + hour + ':' + minute);
            }

        };
        this.isDateEqual = function(date1, date2) {
            var diff = new Date(date1) - new Date(date2);
            return diff==0;
        };
        this.isDateBigger = function(date1, date2) {
            var diff = new Date(date1) - new Date(date2);
            return diff>=0;
        };
        this.isMonthBigger = function(date1, date2) {
            var diff = new Date(date1.year, date1.month) - new Date(date2.year, date2.month);
            return diff>=0;
        };
        this.joinTime = function(date, time) {
            return new Date(new Date(new Date(date).setHours(time.hour)).setMinutes(time.minute));
        };
        this.removeTime = function(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        this.convertArrayItemToNumber = function(arr) {
            for(var i=0,j=arr.length;i<j;i++) {
                arr[i] = Number(arr[i]);
            }
            return arr;
        };
        this.validateJalaliDateSeparate = function(date, time) {
            if (date.length!=3 || time.length!=2)
                return false;

            if (time[0]>23 || time[0]<0 || time[1]>59 || time[1]<0 || date[0]<0 || date[1]<1 || date[1]>12)
                return false;

            if (date[1]>0 && date[1]<7) {
                if (date[2]<1 || date[2]>31)
                    return false;
            }
            else if (date[1]>6 && date[1]<12) {
                if (date[2]<1 || date[2]>30)
                    return false;
            }
            else if (date[1] == 12) {
                var isLeap = ADMdtpConvertor.isLeapJalali(date[0]);
                if ((isLeap && (date[2]<1 || date[2]>30)) || (!isLeap && (date[2]<1 || date[2]>29)))
                    return false;
            }

            return true;
        }
        this.validateJalaliDate = function(str) {
            if (typeof str == "number") {
                var _gDate = new Date(str);
                if (_gDate == 'Invalid Date')
                    return false;
                var _pDate = this.convertToJalali(_gDate);
                str = _pDate.year+'/'+_pDate.month+'/'+_pDate.day+' '+_gDate.getHours()+':'+_gDate.getMinutes();
            }
            
            var _dateTime = str.split(' ');
            var _date = this.convertArrayItemToNumber(_dateTime[0].split('/'));
            var _time = this.convertArrayItemToNumber((_dateTime.length>1)?_dateTime[1].split(':'):[0,0]);
            if (this.validateJalaliDateSeparate(_date, _time)) {
                var _gDateConvertResult = ADMdtpConvertor.toGregorian(_date[0],_date[1],_date[2]);
                var _gDate = new Date(_gDateConvertResult.year, _gDateConvertResult.month-1, _gDateConvertResult.day, _time[0], _time[1]);
                
                return {
                    year: _date[0],
                    month: _date[1],
                    day: _date[2],
                    hour: _time[0],
                    minute: _time[1],
                    unix: _gDate.getTime(),
                    gDate: _gDate
                }
            }
            return false;

        };
        this.convertToUnix = function(value, type) {
            if (!value)
                return null;
            if (typeof value == "number")
                return value;
            
            var _str;
            if (value instanceof Date)
                value = {year: value.getFullYear(), month: value.getMonth()+1, day: value.getDate(), hour: value.getHours(), minute: value.getMinutes()};
            if (value instanceof Object) {
                if (!value.year || !value.month || !value.day)
                    return null;
                _str = value.year +'/'+ value.month +'/'+ value.day +' '+ (value.hour||0) +':'+ (value.minute||0);
            }
            else if (typeof value == "string")
                _str = value;
            else
                return null;
            
            if (type == 'jalali') {
                var _dateTime = this.validateJalaliDate(_str);
                return _dateTime.unix || null;
            }
            else if (type == 'gregorian') {
                var _dateTime = new Date(_str);
                return (_dateTime=='Invalid Date')?null:_dateTime.getTime();
            }
            
            return null;
        };
        this.convertFromUnix = function(unix, type) {
            var _gDate = new Date(unix);
            if (type == 'jalali')
                return this.convertToJalali(_gDate);
            else if (type == 'gregorian')
                return {
                    year: _gDate.getFullYear(),
                    month: _gDate.getMonth()+1,
                    day: _gDate.getDate(),
                    unix: unix
                };
        };
        this.convertToJalali = function(date) {
            
            if (date instanceof Date) {
                var _date = {
                    year: date.getFullYear(),
                    month: date.getMonth()+1,
                    day: date.getDate(),
                    unix: date.getTime()
                }
                date = _date;
            }
            if (date instanceof Object) {
                return angular.extend(ADMdtpConvertor.toJalali(date.year, date.month, date.day), {unix: date.unix});
            }
        };
        this.parseDisablePattern = function(arr, smart, calType) {
            var _inWeek = Array.apply(null, Array(7)).map(Number.prototype.valueOf,0);
            var _inMonth = Array.apply(null, Array(31)).map(Number.prototype.valueOf,0);
            var _static = {};
            
            if (arr instanceof Array) {
                for (var i=0,j=arr.length; i<j; i++) {
                    if (typeof arr[i] == "number") {
                        var _gDate = new Date(arr[i]);
                        if (_gDate != 'Invalid Date')
                            _static[this.removeTime(_gDate).getTime()] = true;
                    }
                    else if (typeof arr[i] == "string") {
                        arr[i] = arr[i].toLowerCase();
                        if (arr[i].indexOf('d') == -1 && arr[i].indexOf('i') == -1) {
                            var _unix = this.convertToUnix(arr[i], calType);
                            if (_unix)
                                _static[_unix] = true;
                        }
                        else {
                            var _inMonthValid = new RegExp("^[!]?(([0-9]?[0-9])?[d]([+][0-9][0-9]?)?)([&]([0-9]?[0-9])?[d]([+][0-9][0-9]?)?)*?$").test(arr[i]);
                            var _inWeekhValid = new RegExp("^[!]?([i]([+][0-9][0-9]?)?)([&][i]([+][0-9][0-9]?)?)*?$").test(arr[i]);
                            
                            if (_inMonthValid || _inWeekhValid) {
                                var _not = arr[i][0]=='!';
                                arr[i] = _not?arr[i].split('!')[1]:arr[i];
                                var _patt = arr[i].split('&');
                                
                                if (_inMonthValid) {
                                    var _tmpObj = {};
                                    _patt.forEach(function(item) {
                                        var _params = item.split(/d[+]?/).map(function(str) {return Number(str);});
                                        _params[0] = _params[0]?_params[0]:1;
                                        _params[1]%=31;

                                        for (var k=0; k<31; k++) {
                                            if (_params[0]!=1 && k%_params[0] == _params[1] || _params[0]==1 && k==_params[1])
                                                _tmpObj[k] = 1;
                                        }
                                    });
                                    for (var k=0; k<31; k++) {
                                        if (_not) {
                                            if (!_tmpObj[k])
                                                _inMonth[k] = 1;
                                        }
                                        else {
                                            if (_tmpObj[k])
                                                _inMonth[k] = 1;
                                        }
                                    }
                                }
                                else if (_inWeekhValid) {
                                    var _tmpObj = {};
                                    _patt.forEach(function(item) {
                                        var _params = item.split(/i[+]?/).map(function(str) {return Number(str);});
                                        _params[1]%=7;
                                        _tmpObj[_params[1]] = 1;
                                    });
                                    for (var k=0; k<7; k++) {
                                        if (_not) {
                                            if (!_tmpObj[k])
                                                _inWeek[k] = 1;
                                        }
                                        else {
                                            if (_tmpObj[k])
                                                _inWeek[k] = 1;
                                        }
                                        
                                    }
                                }
                            }
                            else {
                                console.warn(arr[i] + " is not valid!");
                            }
                        }
                    }
                }
            }
            return {smart: smart, calType: calType, static: _static, inWeek: _inWeek, inMonth: _inMonth};
        }
        this.isDayDisable = function(calType, disabled, day) {
            if (disabled.static[day.unix])
                return true;
            
            var _gap = 0;
            
            if (disabled.smart) {
                if (disabled.calType=='gregorian' && calType=='jalali')
                    _gap = +1;
                else if (disabled.calType=='jalali' && calType=='gregorian')
                    _gap = -1;
            }
            else {
                if (disabled.calType=='gregorian' && calType=='jalali')
                    _gap = -1;
                else if (disabled.calType=='jalali' && calType=='gregorian')
                    _gap = +1;
            }
                
            
            var _dayName = (day.dayName + 7 + _gap)%7;
            
            if (disabled.inMonth[day.day-1])
                return true;
            
            return !!+disabled.inWeek[_dayName];
        }
        
        return {
            leadingZero: this.leadingZero,
            dateFormat: this.dateFormat,
            isDateEqual: this.isDateEqual,
            isDateBigger: this.isDateBigger,
            isMonthBigger: this.isMonthBigger,
            joinTime: this.joinTime,
            removeTime: this.removeTime,
            convertArrayItemToNumber: this.convertArrayItemToNumber,
            validateJalaliDateSeparate: this.validateJalaliDateSeparate,
            validateJalaliDate: this.validateJalaliDate,
            convertToUnix: this.convertToUnix,
            convertFromUnix: this.convertFromUnix,
            convertToJalali: this.convertToJalali,
            parseDisablePattern: this.parseDisablePattern,
            isDayDisable: this.isDayDisable
        }
    }

    var ADMdtpCalendarDirective = function(ADMdtp, ADMdtpConvertor, ADMdtpFactory, constants, $timeout) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^admDtp',
            link: function(scope, element, attrs, admDtp) {
                
                var _standValue;
                if (!scope.dtpValue)
                    _standValue = new Date();                   
                else
                    _standValue = new Date(scope.dtpValue.fullDate);
                
                if (scope.calType == 'jalali')
                    _standValue = ADMdtpFactory.convertToJalali(_standValue);
                
                admDtp.fillDays(_standValue, !scope.option.transition);

                scope.previousMonth = function(flag) {
                    if (scope.calType == 'jalali' && !flag) {
                        scope.nextMonth(true);
                        return;
                    }
                    
                    if (scope.current.month == 1)
                        scope.current.month = 12, scope.current.year--;
                    else
                        scope.current.month--
                    admDtp.reload();
                }

                scope.nextMonth = function(flag) {
                    if (scope.calType == 'jalali' && !flag) {
                        scope.previousMonth(true);
                        return;
                    }
                        
                    if (scope.current.month == 12)
                        scope.current.month = 1, scope.current.year++;
                    else
                        scope.current.month++
                    admDtp.reload();
                }

                scope.selectThisDay = function(day) {
                    if (day.valid == 0)
                        return;
                    
                    if (scope.dtpValue)
                        scope.dtpValue.selected = false;
                    
                    admDtp.updateMasterValue(day, 'day');
                    
                    if (scope.option.autoClose) {
                        $timeout(function() {
                            scope.closeCalendar();
                        },100);
                        return;
                    }
                        
                    
                    if (day.disable) {
                        $timeout(function() {
                            if (ADMdtpFactory.isMonthBigger(day, scope.current))
                                scope.nextMonth(true);
                            else
                                scope.previousMonth(true);
                        }, 0);
                    } else
                        day.selected = true;
                }
                
                scope.today = function() {
                    var _standValue = new Date();

                    if (scope.calType == 'jalali')
                        _standValue = ADMdtpFactory.convertToJalali(_standValue);

                    admDtp.fillDays(_standValue, !scope.option.transition);
                }

                scope.changeTimeValue = function(variable, value) {
                    var _num = (Number(scope.time[variable]) + value + ((variable=='hour')?24:60)) % ((variable=='hour')?24:60);
                    var _timeCopy = angular.copy(scope.time);
                    _timeCopy[variable] = ADMdtpFactory.leadingZero(_num);
                    
                    if (scope.dtpValue) {
                        if (scope.minDate || scope.maxDate) {
                            var _dateTime = ADMdtpFactory.joinTime(scope.dtpValue.unix, _timeCopy);
                            if ((scope.minDate && !ADMdtpFactory.isDateBigger(_dateTime,scope.minDate)) || (scope.maxDate && !ADMdtpFactory.isDateBigger(scope.maxDate,_dateTime)))
                                return;
                        }
                    }
                    
                    scope.time[variable] = ADMdtpFactory.leadingZero(_num);
                    
                    
                    if (scope.dtpValue)
                        admDtp.updateMasterValue(false, 'time');
                    
                    admDtp.reload();
                }

                scope.modelChanged = function() {
                    if (!scope.dtpValue)
                        return;
                    var _inputUnix = ADMdtpFactory.convertToUnix(scope.dtpValue.formated, scope.calType);
                    if (!_inputUnix || ((scope.minDate && !ADMdtpFactory.isDateBigger(_inputUnix,scope.minDate)) || (scope.maxDate && !ADMdtpFactory.isDateBigger(scope.maxDate,_inputUnix)))) {
                        admDtp.updateMasterValue(false);
                        return;
                    }
                        
                    if (_inputUnix == scope.fullData.unix)
                        return;
                    
                    scope.parseInputValue(scope.dtpValue.formated, false, true);
                    
                    var _gDate = new Date(_inputUnix);
                    if (scope.calType == 'jalali')
                        _gDate = ADMdtpFactory.convertToJalali(_gDate);
                    
                    admDtp.fillDays(_gDate, !scope.option.transition);
                    
                }
                
                scope.calTypeChanged = function() {
                    scope.calType = (scope.calType=='gregorian')?'jalali':'gregorian';
                    
                    scope.month = constants.calendars[scope.calType].monthsNames;
                    scope.daysNames = constants.calendars[scope.calType].daysNames;
                    
                    var _cur = angular.copy(scope.current);
                    var _mainDate;
                    
                    if (scope.calType == 'jalali') {
                        _mainDate = ADMdtpConvertor.toJalali(_cur.year, _cur.month, 15);
                    }
                    else {
                        _mainDate = ADMdtpConvertor.toGregorian(_cur.year, _cur.month, 15);
                        _mainDate = new Date(_mainDate.year, _mainDate.month-1, _mainDate.day);
                    }
                    
                    if (scope.dtpValue) {
                        admDtp.updateMasterValue(ADMdtpFactory.convertFromUnix(scope.dtpValue.unix, scope.calType));
                    }
                    
                    admDtp.fillDays(_mainDate, true);
                    
                }

                
            },
            //templateUrl: 'js/ADM-dateTimePicker/ADM-dateTimePicker_calendar.html'
            template: '<div class="ADMdtp-calendar-container"><header><span class="glyphicon glyphicon-menu-left" ng-click="previousMonth()"></span><span class="yearMonth">{{current.monthDscr +" "+ current.year}}</span><span class="glyphicon glyphicon-menu-right" ng-click="nextMonth()"></span></header><div class="daysNames"><span ng-repeat="name in daysNames">{{name}}</span></div><hr><div class="days" ng-class="{loading:loadingDays}"><span ng-repeat="day in current.days" ng-click="selectThisDay(day)"><span ng-class="[{disable: day.disable||!day.valid, notValid:!day.valid, today: day.today, selected: day.selected, valid:(day.valid==2)}, (day.isMin)?((calType==\'jalali\')?\'max\':\'min\'):\'\', (day.isMax)?((calType==\'jalali\')?\'min\':\'max\'):\'\']">{{day.day}}</span></span></div><hr><footer><div class="calTypeContainer" ng-class="$parent.calType" ng-click="calTypeChanged()"  ng-if="option.multiple"><p class="gregorian">Gregorian</p><p class="jalali">جلالی</p></div><button class="today" ng-click="today()">{{(calType=="jalali")?"امروز":"Today"}}</button></footer><div class="timePickerContainer" ng-class="{active: timePickerStat}"><span class="glyphicon timeSelectIcon" ng-class="(timePickerStat)?\'glyphicon-menu-down\':\'glyphicon-time\'" ng-click="timePickerStat = !timePickerStat"></span><div class="timePicker"><span class="glyphicon glyphicon-chevron-up" ng-click="changeTimeValue(\'hour\', 1)"></span><!----><span></span><!----><span class="glyphicon glyphicon-chevron-up" ng-click="changeTimeValue(\'minute\', 1)"></span><!----><span>{{time.hour}}</span><!----><span class="period">:</span><!----><span>{{time.minute}}</span><!----><span class="glyphicon glyphicon-chevron-down" ng-click="changeTimeValue(\'hour\', -1)"></span><!----><span></span><!----><span class="glyphicon glyphicon-chevron-down" ng-click="changeTimeValue(\'minute\', -1)"></span></div></div></div>'
        }
    }

    var ADMdtpDirective = function(ADMdtp, ADMdtpConvertor, ADMdtpFactory, constants, $compile, $timeout) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: 'ngModel',
            scope: {
                options: '=',
                fullData: '=',
                ngDisabled: '=',
                onChange: '&',
                onDatechange: '&',
                onTimechange: '&',
                onOpen: '&',
                onClose: '&',
            },
            link: function(scope, element, attrs, ngModel) {
                var _options = scope.options;
                if (!(_options instanceof Object))
                    _options = {};
                scope.option = angular.extend(angular.copy(ADMdtp.getOptions()), _options);
                scope.disableDays = ADMdtpFactory.parseDisablePattern(scope.option.disabled, scope.option.smartDisabling, scope.option.calType);
                scope.calType = scope.option.calType;
                scope.month = constants.calendars[scope.calType].monthsNames;
                scope.daysNames = constants.calendars[scope.calType].daysNames;
                scope.timeoutValue = [0,0];

                scope.minDate = scope.mindate?new Date(scope.mindate):null;
                scope.maxDate = scope.maxdate?new Date(scope.maxdate):null;
                
                scope.current = {
                    year: '',
                    month: '',
                    monthDscr: '',
                    days: []
                };
                

                scope.updateMasterValue = function(newDate, releaseTheBeast) {
                    if (!newDate)
                        newDate = scope.dtpValue;

                    scope.$applyAsync(function() {
                        scope.dtpValue = newDate;
                        scope.dtpValue.formated = ADMdtpFactory.dateFormat(newDate, scope.time, scope.option.format);
                        scope.dtpValue.fullDate = ADMdtpFactory.joinTime(newDate.unix, scope.time);
                        scope.fullData = {
                            formated: scope.dtpValue.formated,
                            gDate: scope.dtpValue.fullDate,
                            unix: scope.dtpValue.fullDate.getTime(),
                            year: newDate.year,
                            month: newDate.month,
                            day: newDate.day,
                            hour: Number(scope.time.hour),
                            minute: Number(scope.time.minute),
                            minDate: scope.minDate,
                            maxDate: scope.maxDate,
                            calType: scope.calType,
                            format: scope.option.format
                        }
                        ngModel.$setViewValue(scope.dtpValue.formated);
                        ngModel.$render();

                        if (releaseTheBeast) {
                            if (scope.onChange)
                                scope.onChange({date:scope.fullData});
                            if (releaseTheBeast == 'time' && scope.onTimechange)
                                scope.onTimechange({date:scope.fullData});
                            else if (releaseTheBeast == 'day' && scope.onDatechange)
                                scope.onDatechange({date:scope.fullData});
                        }

                    });
                }
                
                scope.parseInputValue = function(valueStr, resetTime, releaseTheBeast) {
                    var _dateTime = false;

                    if (valueStr) {

                        if (scope.calType == 'jalali') {
                            _dateTime = ADMdtpFactory.validateJalaliDate(valueStr);
                        }
                        else {
                            _dateTime = new Date(valueStr);
                            _dateTime = (_dateTime == 'Invalid Date')?false:_dateTime;
                        }
                    }

                    if (_dateTime) {
                        scope.dtpValue = {
                            year: _dateTime.year || _dateTime.getFullYear(),
                            month: _dateTime.month || _dateTime.getMonth()+1,
                            day: _dateTime.day || _dateTime.getDate(),
                            unix: _dateTime.unix || _dateTime.getTime(),
                            fullDate: _dateTime.gDate || _dateTime
                        }
                        
                        scope.dtpValue.fullDate = ADMdtpFactory.removeTime(scope.dtpValue.fullDate);
                        scope.dtpValue.unix = scope.dtpValue.fullDate.getTime();

                        scope.time = {
                            hour: ADMdtpFactory.leadingZero( (_dateTime.getHours)?_dateTime.getHours():_dateTime.hour ),
                            minute: ADMdtpFactory.leadingZero( (_dateTime.getMinutes)?_dateTime.getMinutes():_dateTime.minute )
                        }

                        scope.updateMasterValue(false, releaseTheBeast);
                    }
                    else {
                        if (resetTime)
                            scope.time = {
                                hour: '00',
                                minute: '00'
                            }
                        }
                }
                scope.parseInputValue(scope.option.default || ngModel.$viewValue, true, false);

                ngModel.$formatters.push(function (val) {
                    if (!val)
                        scope.destroy();
                    else if (val == scope.dtpValue.formated) {
                        console.info(val, scope.dtpValue.formated);
                        return;
                    }
                    else {
                        console.info(scope.calType, val, scope.dtpValue.formated);
                        scope.parseInputValue(val, false, true);
                    }

                    return val;
                });
                
                attrs.$observe("disable", function (_newVal) {
                    scope.$applyAsync(function() {
                        _newVal = scope.$eval(_newVal);
                        scope.disable = _newVal;
                    });
                });
                
                attrs.$observe("mindate", function (_newVal) {
                    scope.$applyAsync(function() {
                        _newVal = scope.$eval(_newVal);
                        scope.minDate = ADMdtpFactory.convertToUnix(_newVal, scope.calType);
                    });
                });
                
                attrs.$observe("maxdate", function (_newVal) {
                    scope.$applyAsync(function() {
                        _newVal = scope.$eval(_newVal);
                        scope.maxDate = ADMdtpFactory.convertToUnix(_newVal, scope.calType);
                    });
                });
                
                
                
                scope.openCalendar = function() {
                    
                    if (scope.showCalendarStat || scope.disable)
                        return;
                    
                    scope.timeoutValue[0] = 0;
                    scope.showCalendarStat = true;
                    
                    var _admDtpCalendarHtml = angular.element('<adm-dtp-calendar style="opacity:0;"></adm-dtp-calendar>');
                    angular.element(element.children()[0]).append(_admDtpCalendarHtml);

                    scope.$applyAsync(function () {
                        $compile(_admDtpCalendarHtml)(scope);
                    });
                    
                    $timeout(function() {
                        var _element = angular.element(element.children()[0]).children()[1];
                        var _elementBound = _element.getBoundingClientRect();
                        var _input = element.children().children()[0];
                        var _inputBound = _input.getBoundingClientRect();
                        var _corner = {
                            x: _inputBound.left,
                            y: _inputBound.top + _inputBound.height
                        }

                        var _totalSize = {
                            width: _elementBound.width + _corner.x,
                            height: _elementBound.height + _corner.y
                        }
                        
                        var _pos = {
                            top: '',
                            bottom: '',
                            left: '',
                            right: ''
                        }
                        if (_totalSize.height > window.innerHeight)
                            _pos.bottom = _inputBound.height + 'px';
                        else
                            _pos.top = _inputBound.height + 'px';
                            
                        if (_totalSize.width > window.innerWidth)
                            _pos.left = (window.innerWidth - _totalSize.width - 20) + 'px';
                        else
                            _pos.left = 0;
                        
                        angular.element(_element).css({top: _pos.top, bottom: _pos.bottom, left: _pos.left, opacity: 1});
                        
                    }, 70);
                    
                    if (scope.onOpen)
                        scope.onOpen();
                }
                scope.closeCalendar = function() {
                    if (!scope.showCalendarStat)
                        return;
                    
                    scope.showCalendarStat = false;
                    if (angular.element(element.children()[0]).children()[1]) {
                        angular.element(element.children()[0]).children()[1].remove();
                        
                        if (scope.onClose)
                            scope.onClose();
                    }
                    
                }
                
                scope.toggleCalendar = function() {
                    if (scope.showCalendarStat)
                        scope.closeCalendar();
                    else
                        scope.openCalendar();
                }

                scope.destroy = function() {
                    if (scope.disable)
                        return;
                    
                    scope.current = {
                        year: '',
                        month: '',
                        monthDscr: '',
                        days: []
                    };
                    scope.dtpValue = false;
                    scope.fullData = {
                        minDate: scope.minDate,
                        maxDate: scope.maxDate
                    }
                    scope.time = {
                        hour: '00',
                        minute: '00'
                    }
                    var _standValue = new Date();                   

                    if (scope.calType == 'jalali')
                        _standValue = ADMdtpFactory.convertToJalali(_standValue);

                    ngModel.$setViewValue('');
                    ngModel.$render();
                    
                    scope.fillDays(_standValue, !scope.option.transition);
                    
                    if (scope.onChange)
                        scope.onChange({date:scope.fullData});
                }
            },
            controller: ['$scope',
                function($scope) {

                    this.updateMasterValue = function(newDate, releaseTheBeast) {
                        $scope.updateMasterValue(newDate, releaseTheBeast);
                    }

                    this.fillDays = function(date, noTransition) {
                        
                        if (noTransition)
                            $scope.timeoutValue[0] = 0;
                        else
                            $scope.loadingDays = true;

                            
                            var _mainDate = angular.copy(date);

                            if ($scope.calType == 'jalali') {
                                var _gDate = ADMdtpConvertor.toGregorian(date.year, date.month, 29);
                                date = new Date(_gDate.year, _gDate.month-1, _gDate.day);
                            }

                            var _input = {
                                year: date.getFullYear(),
                                month: date.getMonth()+1,
                                day: date.getDate()
                            }

                            $scope.$applyAsync(function() {
                                var _month = _mainDate.month || (_mainDate.getMonth()+1);
                                angular.extend($scope.current, {
                                    year: _mainDate.year || _mainDate.getFullYear(),
                                    month: _month,
                                    monthDscr: $scope.month[_month-1]
                                });
                            });

                            var _today = new Date();
                            _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate()).getTime();

                            var _selected = -1, _selectedIdx;
                            if ($scope.dtpValue) {
                                _selected = $scope.dtpValue.unix;
                            }

                            var _currDay = new Date(_input.year, _input.month-1, _input.day);
                            var _firstDayName = new Date(angular.copy(_currDay).setDate(1)).getDay();

                            var _days = [];

                            var _diff = -1 * _firstDayName,
                                _ite_date, _disable = true;
                            var _lastValidStat = -1;

                            if ($scope.calType == 'jalali') {
                                var _ite_date = new Date(angular.copy(_currDay).setDate(_diff));
                                var _pDate = ADMdtpConvertor.toJalali(_ite_date.getFullYear(), _ite_date.getMonth()+1, _ite_date.getDate());
                                _diff -= (Math.ceil((_pDate.day-1)/7)*7 + 1);
                            }

                            while (true) {
                                _diff++;
                                var _ite_date = new Date(angular.copy(_currDay).setDate(_diff));
                                var _pDate = false;

                                if ($scope.calType == 'jalali') {
                                    _pDate = ADMdtpConvertor.toJalali(_ite_date.getFullYear(), _ite_date.getMonth()+1, _ite_date.getDate());
                                }

                                var _thisDay = _pDate.day || _ite_date.getDate();

                                if (_thisDay == 1)
                                    _disable = !_disable;

                                if (_disable && _thisDay < 8)
                                    if (($scope.calType == 'jalali' && _ite_date.getDay() == 6) || ($scope.calType == 'gregorian' && _ite_date.getDay() == 0))
                                        break;


                                var _isMin = false;
                                var _valid = 1;
                                if ($scope.minDate || $scope.maxDate) {
                                    var _dateTime = ADMdtpFactory.joinTime(_ite_date, $scope.time);
                                    if (($scope.minDate && !ADMdtpFactory.isDateBigger(_dateTime,$scope.minDate)) || ($scope.maxDate && !ADMdtpFactory.isDateBigger($scope.maxDate,_dateTime))) {
                                        _valid = 0;

                                        if (_lastValidStat == 2)
                                            _days[_days.length-1].isMax = true;
                                    }
                                    else {
                                        _valid = 2;

                                        if (_lastValidStat == 0)
                                            _isMin = true;
                                    }
                                    _lastValidStat = _valid;
                                }

                                var _unix = _ite_date.getTime();
                                var _dayName = _ite_date.getDay() + (($scope.calType=='jalali')?1:0);

                                var _day = {
                                    day: _thisDay,
                                    month: _pDate.month || _ite_date.getMonth()+1,
                                    year: _pDate.year || _ite_date.getFullYear(),
                                    dayName: _dayName,
                                    fullDate: _ite_date,
                                    disable: _disable,
                                    today: (_unix == _today),
                                    selected: (_unix == _selected),
                                    unix: _unix,
                                    valid: _valid,
                                    isMin: _isMin
                                }
                                
                                if (ADMdtpFactory.isDayDisable($scope.calType, $scope.disableDays, _day))
                                    _day.valid = 0;

                                if (_day.selected)
                                    _selectedIdx = _days.length;

                                _days.push(_day);
                            }
                        
                        $timeout(function() {
                            
                            $scope.timeoutValue[0] = 500;
                            
                            $scope.$applyAsync(function() {
                                $scope.current.days = _days;
                                if (_selectedIdx)
                                    $scope.updateMasterValue($scope.current.days[_selectedIdx]);
                                $timeout(function() {
                                    $scope.loadingDays = false;
                                }, $scope.timeoutValue[1]);
                            });
                            
                        }, $scope.timeoutValue[0]);
                        
                        
                    }
                    
                    this.reload = function() {
                        var _cur = angular.copy($scope.current);
                        _cur.day = 29;
                        var _date = new Date(_cur.year, _cur.month-1, 8);
                        if ($scope.calType == 'jalali')
                            _date = _cur;
                        this.fillDays(_date, !$scope.option.transition);
                    }
                    
                    $scope.fillDays = this.fillDays;
                }
            ],
            //templateUrl: 'js/ADM-dateTimePicker/ADM-dateTimePicker_view.html'
            template: '<div class="ADMdtp-container" ng-class="{rtf: (calType==\'jalali\'), touch: option.isDeviceTouch, disable: disable}"><div class="clickOutContainer" click-out="closeCalendar()"><div class="input-group masterInput" ng-class="{touch: option.isDeviceTouch, disable: disable, open: showCalendarStat}"><div class="input-group-addon iconContainer" ng-click="(option.isDeviceTouch)?toggleCalendar():destroy()"><i class="glyphicon glyphicon-unchecked fakeIcon"></i><i class="glyphicon glyphicon-calendar calendarIcon"></i><i class="glyphicon glyphicon-remove removeIcon"></i><i class="glyphicon glyphicon-off closeIcon"></i></div><input type="text" class="form-control" ng-model="dtpValue.formated" ng-focus="openCalendar()" ng-disabled="option.isDeviceTouch || disable" ng-blur="modelChanged()"><i class="glyphicon glyphicon-remove removeIcon" ng-if="dtpValue.formated" ng-click="destroy()"></i></div></div></div>'
        };
    }
    
    

    var clickOutside = function($document) {
        return {
            restrict: 'A',
            scope: {
                clickOut: '&'
            },
            link: function ($scope, elem, attr) {
                var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [];
                if (attr.id == undefined) attr.$set('id', 'id_' + Math.random());
                if (attr.id !== undefined) classList.push(attr.id);

                $document.on('click contextmenu', function (e) {
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

                    $scope.$eval($scope.clickOut);
                });
            }
        };
    }
    
    var ADMdtpConfig = function(ADMdtp) {
        try {  
            document.createEvent("TouchEvent");  
            ADMdtp.setOptions({isDeviceTouch: true});
        } catch (e) {  
            ADMdtp.setOptions({isDeviceTouch: false});
        } 
    }

    return angular.module('ADM-dateTimePicker', [])
        .constant('constants', {
            calendars: {
                gregorian: {
                    monthsNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    daysNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                },
                jalali: {
                    monthsNames: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
                    daysNames: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
                }
            }
        })
        .provider('ADMdtp', ADMdtpProvider)
        .factory('ADMdtpConvertor', [ADMdtpConvertor])
        .factory('ADMdtpFactory', ['ADMdtpConvertor', ADMdtpFactory])
        .directive('admDtp', ['ADMdtp', 'ADMdtpConvertor', 'ADMdtpFactory', 'constants', '$compile', '$timeout', ADMdtpDirective])
        .directive('admDtpCalendar', ['ADMdtp', 'ADMdtpConvertor', 'ADMdtpFactory', 'constants', '$timeout', ADMdtpCalendarDirective])
        .directive('clickOut', ['$document', clickOutside])
        .config(['ADMdtpProvider', ADMdtpConfig]);
}(window.angular));