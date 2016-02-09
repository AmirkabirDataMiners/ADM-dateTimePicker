/*
 * Picking date & time in AngularJS is easier than ever.
 * 
 * Demo: http://amirkabirdataminers.github.io/ADM-dateTimePicker
 *
 * @version 1.1.0
 *
 * © 2016 Amirkabir Data Miners <info@adm-co.net> - www.adm-co.net
 */

(function(angular) {
    'use strict';

    String.prototype.toPersianDigits = function(){
        var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return this.replace(/[0-9]/g, function(w){
            return id[+w]
        });
    };
    String.prototype.toEnglishDigits = function(){
        var id= {'۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9'};
        return this.replace(/[^0-9.]/g, function(w){
            return id[w]||w;
        });
    };
    String.prototype.lZero = function() {
        return (this.length<2 ? '0'+this : this);
    };
    Array.prototype.toNumber = function() {
        return this.map(function(item) {return Number(item);});
    };
    Number.prototype.lZero = function() {
        return (this<10 ? '0'+this : this);
    };
    
    var ADMdtpProvider = function() {

        var options = {
            calType: 'gregorian',
            format: 'YYYY/MM/DD hh:mm', 
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
    
    var ADMdtpDigitTypeFilter = function() {
        return function(input, type) {
            return type=='jalali' ? String(input).toPersianDigits() : input;
        };
    };

    var ADMdtpConvertor = function() {
        
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
            year = (year<=99)?(2000+year):year;
            var date = { year: year, month: month, day: day };
            date = getJalaliDate(date);
            return date;
        }
        var getGregorianDates = function(year, mont, day) {
            year = (year<=99)?(1300+year):year;
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

        this.dateFormat = function(date, time, format, notView) {
            var year = date.year;
            var halfYear = notView ? date.year : date.year%100;
            var month = date.month.lZero();
            var day = date.day.lZero();
            var hour = time.hour.lZero();
            var minute = time.minute.lZero();
            
            var replaceMap = [
                {key: 'YYYY', value: year},
                {key: 'YY', value: halfYear},
                {key: 'MM', value: month},
                {key: 'DD', value: day},
                {key: 'hh', value: hour},
                {key: 'mm', value: minute}
            ]
            
            for(var i=0,j=replaceMap.length;i<j;i++) {
                format = format.replace(replaceMap[i].key, replaceMap[i].value);
            }
            
            return format;
        };
        this.parseString = function(str, format) {
            var _keys = [], _date = {};
            var formats = ['YY/MM/DD', 'YY/MM/DD hh:mm', 'YY-MM-DD', 'YY-MM-DD hh:mm', 'MM/DD/YY', 'MM-DD-YY', 'MM/DD/YY hh:mm', 'MM-DD-YY hh:mm'];
            formats.unshift(format);
            
            for(var i=0,j=format.length;i<j;i++) {
                var _isValid = new RegExp(formats[i].replace(/[a-z]+/gi, function(key) {
                    var _mustReplace = false;
                    if (key.indexOf('YY') != -1)
                        _keys.push('year'), _mustReplace=true;
                    else if (key.indexOf('MM') != -1)
                        _keys.push('month'), _mustReplace=true;
                    else if (key.indexOf('DD') != -1)
                        _keys.push('day'), _mustReplace=true;
                    else if (key.indexOf('hh') != -1)
                        _keys.push('hour'), _mustReplace=true;
                    else if (key.indexOf('mm') != -1)
                        _keys.push('minute'), _mustReplace=true;

                    if (_mustReplace)
                        return '[0-9]+';
                    else 
                        return key;
                }).replace(/[(]/g, '[(]').replace(/[)]/g, '[)]')).test(str);

                if (!_isValid)
                    continue;

                _keys.reverse();
                
                str.replace(/[0-9]+/g, function(value) {
                    _date[_keys.pop()] = Number(value);
                    return value;
                });
                _date.hour = _date.hour || 0;
                _date.minute = _date.minute || 0;

                return _date;
            }
            
            return false;
        };
        this.toRegularFormat = function(date, type, format) {
            if (typeof date == "string")
                date = this.parseString(date, format);
            else if (typeof date == "number")
                date = this.convertFromUnix(date, type);

            if (date.year<=99)
                date.year = ((type == 'jalali') ? 1300+date.year : 2000+date.year);
            
            return date.year+'/'+date.month.lZero()+'/'+date.day.lZero()+' '+date.hour.lZero()+':'+date.minute.lZero();
            
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
        this.validateJalaliDate = function(input, format) {
            var _dateTime;
            
            if (typeof input == "number") {
                var _gDate = new Date(input);
                if (_gDate == 'Invalid Date')
                    return false;
                var _pDate = this.convertToJalali(_gDate);
                _dateTime = angular.extend(_pDate, {hour: _gDate.getHours(), minute: _gDate.getMinutes()});
            }
            else if (typeof input == "string")
                _dateTime = this.parseString(input, format);
            
            else if (input instanceof Object)
                _dateTime = input;
            
            var _date = [_dateTime.year, _dateTime.month, _dateTime.day];
            var _time = [_dateTime.hour, _dateTime.minute];
            
            if (this.validateJalaliDateSeparate(_date, _time)) {
                var _gDateC = ADMdtpConvertor.toGregorian(_date[0],_date[1],_date[2]);
                var _gDate = new Date(_gDateC.year, _gDateC.month-1, _gDateC.day, _time[0], _time[1]);
                
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
        this.convertToUnix = function(value, type, format) {
            if (!value)
                return null;
            if (typeof value == "number")
                return value;
            
            if (typeof value == "string") {
                value = this.parseString(value, format);
            }
            else if (value instanceof Date)
                value = {year: value.getFullYear(), month: value.getMonth()+1, day: value.getDate(), hour: value.getHours(), minute: value.getMinutes()};
            else
                return null;
            
            if (value.year<=99)
                value.year = ((type == 'jalali') ? 1300+value.year : 2000+value.year);
            
            
            if (type == 'jalali') {
                var _dateTime = this.validateJalaliDate(value, format);
                return _dateTime.unix || null;
            }
            else if (type == 'gregorian') {
                var _dateTime = new Date(this.toRegularFormat(value, type));
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
        this.parseDisablePattern = function(options) {
            var arr = options.disabled, smart = options.smartDisabling, calType = options.calType, format = options.format;
            
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
                            var _unix = this.convertToUnix(arr[i], calType, format);
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
            dateFormat: this.dateFormat,
            parseString: this.parseString,
            toRegularFormat: this.toRegularFormat,
            isDateEqual: this.isDateEqual,
            isDateBigger: this.isDateBigger,
            isMonthBigger: this.isMonthBigger,
            joinTime: this.joinTime,
            removeTime: this.removeTime,
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

        return {
            restrict: 'E',
            replace: true,
            require: '^^admDtp',
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
                
                scope.previousYear = function(flag) {
                    if (scope.calType == 'jalali' && !flag) {
                        scope.nextYear(true);
                        return;
                    }

                    var _firstYear = scope.generatedYears.shift();
                    scope.generatedYears = [];
                    for (var i=1;i<17;i++) {
                        scope.generatedYears.push(_firstYear - 17 + i);
                    }
                }

                scope.nextYear = function(flag) {
                    if (scope.calType == 'jalali' && !flag) {
                        scope.previousYear(true);
                        return;
                    }

                    var _lastYear = scope.generatedYears.pop();
                    scope.generatedYears = [];
                    for (var i=1;i<17;i++) {
                        scope.generatedYears.push(_lastYear + i);
                    }
                }
                
                scope.selectMonthInit = function() {
                    scope.yearSelectStat = false;
                    scope.monthPickerStat = true;
                }
                
                scope.selectYearInit = function() {
                    scope.yearSelectStat = true;
                    scope.generatedYears = [];
                    for (var i=0;i<16;i++) {
                        scope.generatedYears.push(scope.current.year + i - 7);
                    }
                }
                
                scope.selectMonth = function(monthIdx) {
                    if (monthIdx+1 != scope.current.month) {
                        scope.current.month = monthIdx+1;
                        admDtp.reload();
                    }
                    scope.monthPickerStat = false;
                }
                
                scope.selectYear = function(yearName) {
                    if (yearName != scope.current.year) {
                        scope.current.year = yearName;
                        admDtp.reload();
                    }
                    scope.monthPickerStat = false;
                    //scope.yearSelectStat = false;
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
                    _timeCopy[variable] = _num.lZero();
                    
                    if (scope.dtpValue) {
                        if (scope.minDate || scope.maxDate) {
                            var _dateTime = ADMdtpFactory.joinTime(scope.dtpValue.unix, _timeCopy);
                            if ((scope.minDate && !ADMdtpFactory.isDateBigger(_dateTime,scope.minDate)) || (scope.maxDate && !ADMdtpFactory.isDateBigger(scope.maxDate,_dateTime)))
                                return;
                        }
                    }
                    
                    scope.time[variable] = _num.lZero();
                    
                    
                    if (scope.dtpValue)
                        admDtp.updateMasterValue(false, 'time');
                    
                    admDtp.reload();
                }

                scope.modelChanged = function(input) {
                    
                    if (!scope.dtpValue)
                        return;
                    
                    var _value = input || scope.dtpValue.formated;
                    
                    if (!_value) {
                        scope.destroy();
                        return;
                    }
                    
                    var _inputUnix = ADMdtpFactory.convertToUnix(_value, scope.calType, scope.option.format);
                    if (!_inputUnix || ((scope.minDate && !ADMdtpFactory.isDateBigger(_inputUnix,scope.minDate)) || (scope.maxDate && !ADMdtpFactory.isDateBigger(scope.maxDate,_inputUnix)))) {
                        admDtp.updateMasterValue(false);
                        return;
                    }
                        
                    if (_inputUnix == scope.fullData.unix)
                        return;
                    
                    scope.parseInputValue(_value, false, true);
                    
                    var _gDate = new Date(_inputUnix);
                    if (scope.calType == 'jalali')
                        _gDate = ADMdtpFactory.convertToJalali(_gDate);

                    admDtp.fillDays(_gDate, true);
                    
                }
                
                scope.calTypeChanged = function() {
                    scope.calType = (scope.calType=='gregorian')?'jalali':'gregorian';
                    
                    scope.monthNames = constants.calendars[scope.calType].monthsNames;
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
            template: '<div class="ADMdtp-calendar-container" ng-class="{square: monthPickerStat||timePickerStat}"><div class="monthPickerContainer" ng-class="{active: monthPickerStat}"><i class="calendarIcon" ng-class="{show: monthPickerStat}" ng-click="monthPickerStat = false"><svg viewBox="0 0 1664 1664"><use xlink:href="#dtpCalendar" /></svg></i><div class="content">            <div class="monthContainer" ng-class="{onYear: yearSelectStat, rtl: (calType==\'jalali\')}"><div class="yearContainer"><span ng-if="yearSelectStat" class="dtpIcon arrow left" ng-click="previousYear()"></span><p ng-click="selectYearInit()">{{current.year | digitType:calType}}</p><span ng-if="yearSelectStat" class="dtpIcon arrow right" ng-click="nextYear()"></span></div><span ng-repeat="yearName in generatedYears" ng-if="yearSelectStat"><span ng-class="{selected: yearName==current.year}" ng-click="selectYear(yearName)">{{yearName | digitType:calType}}</span></span><span ng-repeat="monthName in monthNames" ng-if="!yearSelectStat"><span ng-class="{selected: monthName==current.monthDscr}" ng-click="selectMonth($index)">{{monthName}}</span></span></div></div></div><div class="timePickerContainer" ng-class="{active: timePickerStat}"><i class="calendarIcon" ng-class="{show: timePickerStat}" ng-click="timePickerStat = false"><svg viewBox="0 0 1664 1664"><use xlink:href="#dtpCalendar" /></svg></i><div class="content"><div class="timePicker"><span class="dtpIcon null up" ng-click="changeTimeValue(\'hour\', 1)"><svg viewBox="0 0 1792 1792"><use xlink:href="#dtpDown" /></svg></span><!----><span></span><!----><span class="dtpIcon null up" ng-click="changeTimeValue(\'minute\', 1)"><svg viewBox="0 0 1792 1792"><use xlink:href="#dtpDown" /></svg></span><!----><span>{{time.hour}}</span><!----><span class="period">:</span><!----><span>{{time.minute}}</span><!----><span class="dtpIcon null down" ng-click="changeTimeValue(\'hour\', -1)"><svg viewBox="0 0 1792 1792"><use xlink:href="#dtpUp" /></svg></span><!----><span></span><!----><span class="dtpIcon null down" ng-click="changeTimeValue(\'minute\', -1)"><svg viewBox="0 0 1792 1792"><use xlink:href="#dtpUp" /></svg></span></div></div></div><header><span class="dtpIcon arrow left" ng-click="previousMonth()"></span><span class="yearMonth" ng-click="selectMonthInit()">{{current.monthDscr}} {{current.year | digitType:calType}}</span><span class="dtpIcon arrow right" ng-click="nextMonth()"></span></header><div class="daysNames"><span ng-repeat="dayName in daysNames">{{dayName}}</span></div><hr><div class="days" ng-class="{loading:loadingDays}"><span ng-repeat="day in current.days" ng-click="selectThisDay(day)"><span ng-class="[{disable: day.disable||!day.valid, today: day.today, selected: day.selected, valid:(day.valid==2)}, (day.isMin)?((calType==\'jalali\')?\'max\':\'min\'):\'\', (day.isMax)?((calType==\'jalali\')?\'min\':\'max\'):\'\']">{{day.day | digitType:calType}}</span></span></div><hr><footer><div class="calTypeContainer" ng-class="$parent.calType" ng-click="calTypeChanged()"  ng-if="option.multiple"><p class="gregorian">Gregorian</p><p class="jalali">جلالی</p></div><button class="today" ng-click="today()">{{(calType=="jalali")?"امروز":"Today"}}</button><svg class="timeSelectIcon" viewBox="0 0 1492 1592" ng-click="timePickerStat = !timePickerStat"><use xlink:href="#dtpClock" /></svg></footer></div>'
        }
    }

    var ADMdtpDirective = function(ADMdtp, ADMdtpConvertor, ADMdtpFactory, constants, $compile, $timeout) {

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: 'ngModel',
            scope: {
                options: '=?',
                fullData: '=?',
                onChange: '&',
                onDatechange: '&',
                onTimechange: '&',
                onOpen: '&',
                onClose: '&',
            },
            link: function(scope, element, attrs, ngModel) {
                if (!element.find('ng-transclude').children().length) {
                    scope.defaultTemplate = true;
                    element.find('ng-transclude').remove();
                }
                
                var _options = scope.options;
                if (!(_options instanceof Object))
                    _options = {};
                scope.option = angular.extend(angular.copy(ADMdtp.getOptions()), _options);
                scope.disableDays = ADMdtpFactory.parseDisablePattern(scope.option);
                scope.calType = scope.option.calType;
                scope.monthNames = constants.calendars[scope.calType].monthsNames;
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

                        ngModel.$setViewValue( scope.dtpValue.formated );
                        ngModel.$render();
                        
                        if (dtpInput.value)
                            dtpInput.value = scope.dtpValue.formated;

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
                    
                    if (valueStr == 'today') {
                        valueStr = ADMdtpFactory.removeTime(new Date()).getTime();
                    }
                    
                    var _dateTime = false;

                    if (valueStr) {

                        if (scope.calType == 'jalali') {
                            _dateTime = ADMdtpFactory.validateJalaliDate(valueStr, scope.option.format);
                        }
                        else {
                            if (typeof valueStr == "string")
                                valueStr = ADMdtpFactory.toRegularFormat(valueStr, scope.calType, scope.option.format);
                                
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
                            hour: ( _dateTime.getHours?_dateTime.getHours():_dateTime.hour ).lZero(),
                            minute: ( _dateTime.getMinutes?_dateTime.getMinutes():_dateTime.minute ).lZero()
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
                scope.parseInputValue(ngModel.$viewValue || scope.option.default, true, false);
                
                ngModel.$formatters.push(function (val) {
                    if (!val)
                        scope.destroy();
                    else if (scope.dtpValue && val == scope.dtpValue.formated) {
                        return;
                    }
                    else {
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
                        scope.minDate = ADMdtpFactory.convertToUnix(_newVal, scope.calType, scope.option.format);
                    });
                });
                
                attrs.$observe("maxdate", function (_newVal) {
                    scope.$applyAsync(function() {
                        _newVal = scope.$eval(_newVal);
                        scope.maxDate = ADMdtpFactory.convertToUnix(_newVal, scope.calType, scope.option.format);
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
                    
                    scope.$applyAsync(function() {
                        scope.monthPickerStat = false;
                        scope.timePickerStat = false;
                        scope.showCalendarStat = false;
                    });
                                        
                    if (angular.element(element.children()[0]).children()[1]) {
                        angular.element(angular.element(element.children()[0]).children()[1]).remove();
                        
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
                    
                    scope.monthPickerStat = false;
                    scope.timePickerStat = false;
                    
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

                var dtpInput = element[0].querySelector('[dtp-input]') || {};
                dtpInput.onblur = function() {
                    scope.modelChanged(this.value);
                }
                dtpInput.onfocus = scope.openCalendar;
                                
                var dtpOpen = element[0].querySelector('[dtp-open]') || {};
                dtpOpen.onclick = scope.openCalendar;
                
                var dtpClose = element[0].querySelector('[dtp-close]') || {};
                dtpClose.onclick = scope.closeCalendar;

                var dtpToggle = element[0].querySelector('[dtp-toggle]') || {};
                dtpToggle.onclick = scope.toggleCalendar;
                
                var dtpDestroy = element[0].querySelector('[dtp-destroy]') || {};
                dtpDestroy.onclick = scope.destroy;
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
                                    monthDscr: $scope.monthNames[_month-1]
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
            template: '<div class="ADMdtp-container" ng-class="{rtl: (calType==\'jalali\'), touch: option.isDeviceTouch, disable: disable}"><div class="clickOutContainer" click-out="closeCalendar()"><ng-transclude></ng-transclude> <div ng-if="defaultTemplate" class="masterInput" ng-class="{touch: option.isDeviceTouch, disable: disable, open: showCalendarStat}"><input type="text" ng-model="dtpValue.formated" ng-focus="openCalendar()" ng-disabled="option.freezeInput || option.isDeviceTouch || disable" ng-blur="modelChanged()"><div class="iconContainer" ng-click="toggleCalendar()"><i class="dtpIcon null fakeIcon"></i><svg class="calendarIcon" viewBox="0 0 1664 1664"><use xlink:href="#dtpCalendar" /></svg><svg class="closeIcon" viewBox="0 0 1400 1400"><use xlink:href="#dtpOff" /></svg></div><svg class="removeIcon" viewBox="0 0 1408 1408" ng-if="dtpValue.formated" ng-click="destroy()"><use stroke-width="20" xlink:href="#dtpTimes" /></svg></div></div><svg style="display:none;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><defs><path id="dtpCalendar" d="M128 -128h288v288h-288v-288zM480 -128h320v288h-320v-288zM128 224h288v320h-288v-320zM480 224h320v320h-320v-320zM128 608h288v288h-288v-288zM864 -128h320v288h-320v-288zM480 608h320v288h-320v-288zM1248 -128h288v288h-288v-288zM864 224h320v320h-320v-320z M512 1088v288q0 13 -9.5 22.5t-22.5 9.5h-64q-13 0 -22.5 -9.5t-9.5 -22.5v-288q0 -13 9.5 -22.5t22.5 -9.5h64q13 0 22.5 9.5t9.5 22.5zM1248 224h288v320h-288v-320zM864 608h320v288h-320v-288zM1248 608h288v288h-288v-288zM1280 1088v288q0 13 -9.5 22.5t-22.5 9.5h-64 q-13 0 -22.5 -9.5t-9.5 -22.5v-288q0 -13 9.5 -22.5t22.5 -9.5h64q13 0 22.5 9.5t9.5 22.5zM1664 1152v-1280q0 -52 -38 -90t-90 -38h-1408q-52 0 -90 38t-38 90v1280q0 52 38 90t90 38h128v96q0 66 47 113t113 47h64q66 0 113 -47t47 -113v-96h384v96q0 66 47 113t113 47 h64q66 0 113 -47t47 -113v-96h128q52 0 90 -38t38 -90z" /><path id="dtpOff" d="M1536 640q0 -156 -61 -298t-164 -245t-245 -164t-298 -61t-298 61t-245 164t-164 245t-61 298q0 182 80.5 343t226.5 270q43 32 95.5 25t83.5 -50q32 -42 24.5 -94.5t-49.5 -84.5q-98 -74 -151.5 -181t-53.5 -228q0 -104 40.5 -198.5t109.5 -163.5t163.5 -109.5 t198.5 -40.5t198.5 40.5t163.5 109.5t109.5 163.5t40.5 198.5q0 121 -53.5 228t-151.5 181q-42 32 -49.5 84.5t24.5 94.5q31 43 84 50t95 -25q146 -109 226.5 -270t80.5 -343zM896 1408v-640q0 -52 -38 -90t-90 -38t-90 38t-38 90v640q0 52 38 90t90 38t90 -38t38 -90z" /><path id="dtpClock" d="M896 992v-448q0 -14 -9 -23t-23 -9h-320q-14 0 -23 9t-9 23v64q0 14 9 23t23 9h224v352q0 14 9 23t23 9h64q14 0 23 -9t9 -23zM1312 640q0 148 -73 273t-198 198t-273 73t-273 -73t-198 -198t-73 -273t73 -273t198 -198t273 -73t273 73t198 198t73 273zM1536 640 q0 -209 -103 -385.5t-279.5 -279.5t-385.5 -103t-385.5 103t-279.5 279.5t-103 385.5t103 385.5t279.5 279.5t385.5 103t385.5 -103t279.5 -279.5t103 -385.5z" /><path id="dtpTimes" horiz-adv-x="1408" d="M1298 214q0 -40 -28 -68l-136 -136q-28 -28 -68 -28t-68 28l-294 294l-294 -294q-28 -28 -68 -28t-68 28l-136 136q-28 28 -28 68t28 68l294 294l-294 294q-28 28 -28 68t28 68l136 136q28 28 68 28t68 -28l294 -294l294 294q28 28 68 28t68 -28l136 -136q28 -28 28 -68 t-28 -68l-294 -294l294 -294q28 -28 28 -68z" /><path id="dtpUp" horiz-adv-x="1792" d="M1683 205l-166 -165q-19 -19 -45 -19t-45 19l-531 531l-531 -531q-19 -19 -45 -19t-45 19l-166 165q-19 19 -19 45.5t19 45.5l742 741q19 19 45 19t45 -19l742 -741q19 -19 19 -45.5t-19 -45.5z" /><path id="dtpDown" horiz-adv-x="1792" d="M1683 728l-742 -741q-19 -19 -45 -19t-45 19l-742 741q-19 19 -19 45.5t19 45.5l166 165q19 19 45 19t45 -19l531 -531l531 531q19 19 45 19t45 -19l166 -165q19 -19 19 -45.5t-19 -45.5z" /></defs></svg> </div>'
        };
    }

    /* https://github.com/IamAdamJowett/angular-click-outside */
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
                                if (id.indexOf(classList[i]) > -1 || (typeof classNames == 'string' && classNames.indexOf(classList[i]) > -1)) {
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
        .filter('digitType', [ADMdtpDigitTypeFilter])
        .factory('ADMdtpConvertor', [ADMdtpConvertor])
        .factory('ADMdtpFactory', ['ADMdtpConvertor', ADMdtpFactory])
        .directive('admDtp', ['ADMdtp', 'ADMdtpConvertor', 'ADMdtpFactory', 'constants', '$compile', '$timeout', ADMdtpDirective])
        .directive('admDtpCalendar', ['ADMdtp', 'ADMdtpConvertor', 'ADMdtpFactory', 'constants', '$timeout', ADMdtpCalendarDirective])
        .directive('clickOut', ['$document', clickOutside])
        .config(['ADMdtpProvider', ADMdtpConfig]);
}(window.angular));