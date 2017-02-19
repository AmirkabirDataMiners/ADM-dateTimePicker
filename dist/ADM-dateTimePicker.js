/*
 * Picking date & time in AngularJS is easier than ever.
 * 
 * Demo: http://amirkabirdataminers.github.io/ADM-dateTimePicker
 *
 * @version 1.2.0
 *
 * © 2017 Amirkabir Data Miners <info@adm-co.net> - www.adm-co.net
 */

(function(angular) {
    'use strict';
    
    if (!angular.merge)
        angular.merge = angular.extend;

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
    Array.prototype.dtp_toDate = function(type) {
        var splitter = '-';
        if (/invalid/i.test(new Date('1991-9-12')))
            splitter = '/';
        
        var date = this.join(splitter);
        if (this.length == 5)
            date = this.slice(0,3).join(splitter) +' '+ this.slice(3,5).join(':')
        if (!type) return date;
        date = new Date(date);
        if (type == 'unix')
            return date.getTime();
        return date;
    };
    Number.prototype.lZero = function() {
        return (this<10 ? '0'+this : this);
    };
    Date.prototype.dtp_shortDate = function () {
        return [this.getFullYear(), this.getMonth() + 1, this.getDate()].dtp_toDate();
    }
    
    var ADMdtpProvider = function() {

        var options = {
            calType: 'gregorian',
            format: 'YYYY/MM/DD hh:mm', 
            multiple: true,
            autoClose: false,
            transition: true,
            disabled: [],
            smartDisabling: true,
            minuteStep: 1,
            gregorianStartDay: 0,
            gregorianDic: {
                title: 'Gregorian',
                monthsNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                daysNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                todayBtn: 'Today',
            },
            jalaliDic: {
                title: 'جلالی',
                monthsNames: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
                daysNames: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
                todayBtn: 'امروز'
            }
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
                options = angular.merge(options, customOptions);
                return;
            }
            options[type] = angular.merge(options[type] || {}, customOptions);
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
            var leaspYearCount = howManyGregorianLeapsYearPassed(year);
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
            var leaspYearCount = howManyGregorianLeapsYearPassed(year);
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
            if (day == 0)
            {
                day = 31;
                month = 12;
                year--;
            }
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
            if (!date.year) return '';

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
            
            for(var i=0,j=formats.length;i<j;i++) {
                var _isValid = new RegExp('^' + formats[i].replace(/[a-z]+/gi, function(key) {
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
                }).replace(/[(]/g, '[(]').replace(/[)]/g, '[)]') + '$').test(str);

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
            if (!date) return false;
            
            if (typeof date == "string")
                date = this.parseString(date, format);
            else if (typeof date == "number")
                date = this.convertFromUnix(date, type);
            
            if (!date) return false;

            if (date.year<=99)
                date.year = ((type == 'jalali') ? 1300+date.year : 2000+date.year);
            
            return [date.year, date.month.lZero(), date.day.lZero(), date.hour.lZero(), date.minute.lZero()].dtp_toDate();
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
            return [date.getFullYear(), date.getMonth()+1, date.getDate()].dtp_toDate('date');
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
                if (/invalid/i.test(_gDate))
                    return false;
                var _pDate = this.convertToJalali(_gDate);
                _dateTime = angular.merge(_pDate, {hour: _gDate.getHours(), minute: _gDate.getMinutes()});
            }
            else if (typeof input == "string")
                _dateTime = this.parseString(input, format);
            
            else if (input instanceof Object)
                _dateTime = input;
            
            if (!_dateTime) return false;
            
            var _date = [_dateTime.year, _dateTime.month, _dateTime.day];
            var _time = [_dateTime.hour, _dateTime.minute];
            
            if (this.validateJalaliDateSeparate(_date, _time)) {
                var _gDateC = ADMdtpConvertor.toGregorian(_date[0],_date[1],_date[2]);
                var _gDate = [_gDateC.year, _gDateC.month, _gDateC.day, _time[0], _time[1]].dtp_toDate('date');
                
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
                return (/invalid/i.test(_dateTime))?null:_dateTime.getTime();
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
                return angular.merge(ADMdtpConvertor.toJalali(date.year, date.month, date.day), {unix: date.unix});
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
                        if (!/invalid/i.test(_gDate))
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
            isDayDisable: this.isDayDisable,
            counter: 0
        }
    }
    
    var ADMdtpCalendarDirective = function(ADMdtp, ADMdtpConvertor, ADMdtpFactory, constants, $timeout) {

        return {
            restrict: 'E',
            replace: true,
            //require: '^^admDtp',
            link: function(scope, element, attrs) {

                var admDtp = scope.api;
                
                var _standValue;
                if (!scope.dtpValue.unix)
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
                    value *= (variable=='minute' ? scope.option.minuteStep : 1);
                    
                    var _num = (Number(scope.time[variable]) + value + ((variable=='hour')?24:60)) % ((variable=='hour')?24:60);
                    var _timeCopy = angular.copy(scope.time);
                    _timeCopy[variable] = _num.lZero();
                    
                    if (scope.dtpValue.unix) {
                        if (scope.minDate || scope.maxDate) {
                            var _dateTime = ADMdtpFactory.joinTime(scope.dtpValue.unix, _timeCopy);
                            if ((scope.minDate && !ADMdtpFactory.isDateBigger(_dateTime,scope.minDate)) || (scope.maxDate && !ADMdtpFactory.isDateBigger(scope.maxDate,_dateTime)))
                                return;
                        }
                    }
                    
                    scope.time[variable] = _num.lZero();
                    
                    
                    if (scope.dtpValue.unix)
                        admDtp.updateMasterValue(false, 'time');
                    
                    admDtp.reload();
                }
                
                scope.modelChanged = function(input) {
                    
                    var _value = (angular.isDefined(input) ? input : scope.dtpValue.formated);
                    
                    if (!_value) {
                        if (scope.dtpValue.unix)
                            scope.destroy();
                        return;
                    }
                    
                    var _inputUnix = ADMdtpFactory.convertToUnix(_value, scope.calType, scope.option.format);
                    if (!_inputUnix || scope.option.freezeInput || scope.disable || ((scope.minDate && !ADMdtpFactory.isDateBigger(_inputUnix,scope.minDate)) || (scope.maxDate && !ADMdtpFactory.isDateBigger(scope.maxDate,_inputUnix)))) {
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
                admDtp.modelChanged = scope.modelChanged;
                
                scope.calTypeChanged = function(calType) {
                    scope.calType = (calType ? calType : ((scope.calType=='gregorian')?'jalali':'gregorian'));
                    
                    scope.monthNames = scope.option[scope.calType + 'Dic'].monthsNames;
                    scope.daysNames = scope.option[scope.calType + 'Dic'].daysNames;
                    
                    var _cur = angular.copy(scope.current);
                    var _mainDate;
                    
                    if (scope.calType == 'jalali') {
                        _mainDate = ADMdtpConvertor.toJalali(_cur.year, _cur.month, 15);
                    }
                    else {
                        _mainDate = ADMdtpConvertor.toGregorian(_cur.year, _cur.month, 15);
                        _mainDate = [_mainDate.year, _mainDate.month, _mainDate.day].dtp_toDate('date');
                    }
                    
                    if (scope.dtpValue.unix) {
                        admDtp.updateMasterValue(ADMdtpFactory.convertFromUnix(scope.dtpValue.unix, scope.calType));
                    }
                    
                    admDtp.fillDays(_mainDate, true);
                    
                }

                
            },
            //templateUrl: 'js/ADM-dateTimePicker/ADM-dateTimePicker_calendar.html'
            template: '<div class="ADMdtp-box ADMdtp-calendar-container" ng-class="{rtl: (calType==\'jalali\'), square: monthPickerStat||timePickerStat}"> <div class="dtpNewBox" ng-class="{active: monthPickerStat}"> <i class="calendarIcon" ng-class="{show: monthPickerStat}" ng-click="monthPickerStat = false"> <svg class="dtp-i" viewBox="0 0 24 24"> <use xlink:href="#dtp-i-calendar" /> </svg> </i> <div class="content"> <div class="ADMdtpMonths" ng-class="{onYear: yearSelectStat, rtl: (calType==\'jalali\')}"> <div class="ADMdtpYears"> <svg class="dtp-i dtp-i-180 dtp-trs-3 arrow left" viewBox="0 0 24 24" ng-if="yearSelectStat" ng-click="previousYear()"> <use xlink:href="#dtp-i-right" /> </svg> <p class="dtp-trs-3" ng-click="selectYearInit()">{{current.year | digitType:calType}}</p> <svg class="dtp-i dtp-trs-3 arrow right" viewBox="0 0 24 24" ng-if="yearSelectStat" ng-click="nextYear()"> <use xlink:href="#dtp-i-right" /> </svg> </div> <span ng-repeat="yearName in generatedYears" ng-if="yearSelectStat"><span class="dtp-trs-5" ng-class="{selected: yearName==current.year}" ng-click="selectYear(yearName)">{{yearName | digitType:calType}}</span></span> <span ng-repeat="monthName in monthNames" ng-if="!yearSelectStat"><span class="dtp-trs-5" ng-class="{selected: monthName==current.monthDscr}" ng-click="selectMonth($index)">{{monthName}}</span></span> </div> </div> </div> <div class="dtpNewBox" ng-class="{active: timePickerStat}"> <i class="calendarIcon" ng-class="{show: timePickerStat}" ng-click="timePickerStat = false"> <svg class="dtp-i" viewBox="0 0 24 24"> <use xlink:href="#dtp-i-calendar" /> </svg> </i> <div class="content"> <div class="ADMdtpTime"> <span class="dtpIcon null up" ng-click="changeTimeValue(\'hour\', 1)"><svg class="dtp-i dtp-trs-5 dtp-i-270" viewBox="0 0 24 24"><use xlink:href="#dtp-i-right" /></svg></span><!-- --><span></span><!-- --><span class="dtpIcon null up" ng-click="changeTimeValue(\'minute\', 1)"><svg class="dtp-i dtp-trs-5 dtp-i-270" viewBox="0 0 24 24"><use xlink:href="#dtp-i-right" /></svg></span><!-- --><span>{{time.hour}}</span><!-- --><span class="period">:</span><!-- --><span>{{time.minute}}</span><!-- --><span class="dtpIcon null down" ng-click="changeTimeValue(\'hour\', -1)"><svg class="dtp-i dtp-trs-5 dtp-i-90" viewBox="0 0 24 24"><use xlink:href="#dtp-i-right" /></svg></span><!-- --><span></span><!-- --><span class="dtpIcon null down" ng-click="changeTimeValue(\'minute\', -1)"><svg class="dtp-i dtp-trs-5 dtp-i-90" viewBox="0 0 24 24"><use xlink:href="#dtp-i-right" /></svg></span> </div> </div> </div> <header> <svg class="dtp-i dtp-i-180 dtp-trs-3 arrow left" viewBox="0 0 24 24" ng-click="previousMonth()"> <use xlink:href="#dtp-i-right" /> </svg> <span class="yearMonth" ng-click="selectMonthInit()">{{current.monthDscr}} {{current.year | digitType:calType}}</span> <svg class="dtp-i dtp-trs-3 arrow right" viewBox="0 0 24 24" ng-click="nextMonth()"> <use xlink:href="#dtp-i-right" /> </svg> </header> <div class="daysNames"> <span ng-repeat="dayName in daysNames">{{dayName}}</span> </div> <hr> <div class="ADMdtpDays" ng-class="{loading:loadingDays}"> <span ng-repeat="day in current.days" ng-click="selectThisDay(day)"><span ng-class="[{disable: day.disable||!day.valid, today: day.today, selected: day.selected, valid:(day.valid==2)}, (day.isMin)?((calType==\'jalali\')?\'max\':\'min\'):\'\', (day.isMax)?((calType==\'jalali\')?\'min\':\'max\'):\'\']">{{day.day | digitType:calType}}</span></span> </div> <hr> <footer> <div class="calTypeContainer dtp-trs-3" ng-class="$parent.calType" ng-click="calTypeChanged()" ng-if="option.multiple"> <p class="gregorian">{{option.gregorianDic.title}}</p> <p class="jalali">{{option.jalaliDic.title}}</p> </div> <button type="button" class="today dtp-trs-3" ng-click="today()">{{option[calType + "Dic"].todayBtn}}</button> <svg class="dtp-i dtp-trs-5 timeSelectIcon" viewBox="0 0 24 24" ng-show="option.dtpType != \'date\'" ng-click="timePickerStat = !timePickerStat"> <use xlink:href="#dtp-i-clock" /> </svg> </footer> </div>'
        }
    }

    var ADMdtpDirective = function(ADMdtp, ADMdtpConvertor, ADMdtpFactory, constants, $compile, $timeout) {

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: ['ngModel', 'admDtp'],
            scope: {
                options: '=?',
                fullData: '=?',
                name: '=?',
                ngRequired: '=?',
                onChange: '&?',
                onDatechange: '&?',
                onTimechange: '&?',
                onOpen: '&?',
                onClose: '&?',
            },
            link: function(scope, element, attrs, ctrls) {
                var ngModel = ctrls[0], admDtp = ctrls[1];
                scope.api = admDtp;
                scope.dtpId = 'adm-' + (++ADMdtpFactory.counter);
                
                if (!element.find('ng-transclude').children().length) {
                    scope.defaultTemplate = true;
                    element.find('ng-transclude').remove();
                }
                
                var _options = scope.options;
                if (!(_options instanceof Object))
                    _options = {};
                scope.option = angular.merge(angular.copy(ADMdtp.getOptions()), _options);
                scope.option.minuteStep = Math.max(Math.min(scope.option.minuteStep, 60), 1);
                var dayNames = angular.copy(scope.option.gregorianDic.daysNames);
                scope.option.gregorianDic.daysNamesUntouched = dayNames;
                scope.option.gregorianDic.daysNames = dayNames.slice(scope.option.gregorianStartDay,7).concat(dayNames.slice(0,scope.option.gregorianStartDay));
                
                scope.disableDays = ADMdtpFactory.parseDisablePattern(scope.option);
                scope.calType = scope.option.calType;
                scope.monthNames = scope.option[scope.calType + 'Dic'].monthsNames;
                scope.daysNames = scope.option[scope.calType + 'Dic'].daysNames;
                scope.timeoutValue = [0,0];
                scope.dtpValue = {};

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
                        newDate = (scope.dtpValue.unix ? scope.dtpValue : {});
                        

                    scope.$applyAsync(function() {
                        scope.dtpValue = newDate;
                        var minute = Number(scope.time.minute);
                        minute -= minute % scope.option.minuteStep;
                        scope.time.minute = minute.lZero();
                        scope.dtpValue.formated = ADMdtpFactory.dateFormat(newDate, scope.time, scope.option.format);
                        scope.dtpValue.fullDate = ADMdtpFactory.joinTime(newDate.unix, scope.time);
                        scope.fullData = {
                            formated: scope.dtpValue.formated,
                            lDate: scope.dtpValue.fullDate.dtp_shortDate(),
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
                            
                        if (scope.hasInputDtp)
                            element[0].querySelector('[dtp-input]').value = scope.dtpValue.formated;

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
                            _dateTime = (/invalid/i.test(_dateTime))?false:_dateTime;
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
                    if (!val && scope.dtpValue.unix) {
                        scope.destroy();
                    }
                    else if (scope.dtpValue && val == scope.dtpValue.formated) {
                    }
                    else {
                        scope.parseInputValue(val, false, true);
                    }

                    return val;
                });
                
                if (scope.option.watchingOptions) {
                    //return;
                    scope.$watch('options', function(nuVal, old) {
                        if (!nuVal || typeof nuVal != 'object') return;
                        if (old && JSON.stringify(old) == JSON.stringify(nuVal)) return;
                        
                        var daysNamesUntouched = scope.option.gregorianDic.daysNamesUntouched;
                        scope.option = angular.merge(angular.copy(ADMdtp.getOptions()), nuVal);
                        scope.option.minuteStep = Math.max(Math.min(scope.option.minuteStep, 60), 1);
                        
                        if (nuVal.gregorianDic && nuVal.gregorianDic.daysNames)
                            scope.option.gregorianDic.daysNamesUntouched = nuVal.gregorianDic.daysNames;
                        else
                            scope.option.gregorianDic.daysNamesUntouched = daysNamesUntouched;
                        
                        var dayNames = angular.copy(scope.option.gregorianDic.daysNamesUntouched);
                        scope.option.gregorianDic.daysNames = dayNames.slice(scope.option.gregorianStartDay,7).concat(dayNames.slice(0,scope.option.gregorianStartDay));

                        scope.disableDays = ADMdtpFactory.parseDisablePattern(scope.option);
                        if (scope.calTypeChanged) scope.calTypeChanged(scope.option.calType);
                    }, true);
                }                
                
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

                scope.onKeydown = function(e) {
                    if (e.keyCode == 9)
                        scope.closeCalendar();
                }
                
                scope.openCalendar = function() {
                    if (scope.showCalendarStat || scope.disable)
                        return;
                    
                    scope.timeoutValue[0] = 0;
                    scope.showCalendarStat = true;
                    
                    var _admDtpCalendarHtml = angular.element('<adm-dtp-calendar id="'+ scope.dtpId +'" style="opacity:0; z-index: '+ scope.option.zIndex +';"></adm-dtp-calendar>');
                    angular.element(document.body).append(_admDtpCalendarHtml);

                    scope.$applyAsync(function () {
                        $compile(_admDtpCalendarHtml)(scope);
                    });
                    
                    $timeout(function() {
                        var top = document.documentElement.scrollTop || document.body.scrollTop;
                        var popup = document.getElementById(scope.dtpId);
                        var popupBound = popup.getBoundingClientRect();
                        var _input = element.children().children()[0];
                        var _inputBound = _input.getBoundingClientRect();
                        var _corner = {
                            x: _inputBound.left,
                            y: _inputBound.top + _inputBound.height
                        }

                        var _totalSize = {
                            width: popupBound.width + _corner.x,
                            height: popupBound.height + _corner.y
                        }
                        
                        var _pos = {
                            top: '',
                            bottom: '',
                            left: '',
                            right: ''
                        }
                        if (_totalSize.height > window.innerHeight)
                            _pos.top = (top + _inputBound.top - popupBound.height) + 'px';
                        else
                            _pos.top = (top + _inputBound.top + _inputBound.height) + 'px';
                        
                        if (_totalSize.width > window.innerWidth)
                            _pos.left = (_corner.x + window.innerWidth - _totalSize.width - 20) + 'px';
                        else
                            _pos.left = _corner.x + 'px';
                        
                        angular.element(popup).css({top: _pos.top, bottom: _pos.bottom, left: _pos.left, opacity: 1});
                        
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
                
                    var popup = document.getElementById(scope.dtpId);
                    if (popup) {
                        angular.element(popup).remove();
                        
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

                scope.destroy = function(noRefresh) {
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
                    scope.dtpValue = {};
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
                    
                    if (!noRefresh)
                        admDtp.fillDays(_standValue, !scope.option.transition);
                    
                    if (scope.onChange)
                        scope.onChange({date:scope.fullData});
                }
                                
                var dtpOpen = element[0].querySelector('[dtp-open]') || {};
                dtpOpen.onclick = scope.openCalendar;
                
                var dtpClose = element[0].querySelector('[dtp-close]') || {};
                dtpClose.onclick = scope.closeCalendar;

                var dtpToggle = element[0].querySelector('[dtp-toggle]') || {};
                dtpToggle.onclick = scope.toggleCalendar;
                
                var dtpDestroy = element[0].querySelector('[dtp-destroy]') || {};
                dtpDestroy.onclick = scope.destroy;
            },
            controller: ['$scope', function($scope) {

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
                        date = [_gDate.year, _gDate.month, _gDate.day].dtp_toDate('date');
                    }

                    var _input = {
                        year: date.getFullYear(),
                        month: date.getMonth()+1,
                        day: date.getDate()
                    }

                    $scope.$applyAsync(function() {
                        var _month = _mainDate.month || (_mainDate.getMonth()+1);
                        angular.merge($scope.current, {
                            year: _mainDate.year || _mainDate.getFullYear(),
                            month: _month,
                            monthDscr: $scope.monthNames[_month-1]
                        });
                    });

                    var startDay, shift = startDay = $scope.option.gregorianStartDay;

                    if ($scope.calType == 'jalali')
                        shift = 0, startDay = 6;

                    var _today = new Date();
                    _today = [_today.getFullYear(), _today.getMonth()+1, _today.getDate(), 1, 0].dtp_toDate('unix');

                    var _selected = ($scope.dtpValue.unix || -1), _selectedIdx;

                    var _currDay = [_input.year, _input.month, _input.day, 1, 0].dtp_toDate('date');
                    var _firstDayName = new Date(angular.copy(_currDay).setDate(1)).getDay();

                    var _days = [];

                    var _diff = -1 * (_firstDayName - shift + 7) % 7,
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

                        if (_disable && _thisDay < 8 && _ite_date.getDay() == startDay)
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
                    var _date = [_cur.year, _cur.month, 8].dtp_toDate('date');
                    if ($scope.calType == 'jalali')
                        _date = _cur;
                    this.fillDays(_date, !$scope.option.transition);
                }

                this.vm = $scope;
            }],
            //templateUrl: 'js/ADM-dateTimePicker/ADM-dateTimePicker_view.html'
            template: '<div class="ADMdtp ADMdtp-container" ng-class="{rtl: (calType==\'jalali\'), touch: option.isDeviceTouch, disable: disable}"> <div class="clickOutContainer" click-out="closeCalendar()"  alias="{{dtpId}}"> <ng-transclude></ng-transclude> <div ng-if="defaultTemplate" class="ADMdtpInput masterInput" ng-class="{touch: option.isDeviceTouch, disable: disable, open: showCalendarStat}"> <input type="text" name="{{name}}" ng-model="dtpValue.formated" ng-focus="openCalendar()" ng-click="openCalendar()" ng-readonly="option.freezeInput || option.isDeviceTouch || disable" ng-blur="modelChanged()" ng-keydown="onKeydown($event)" ng-required="ngRequired" > <div class="dtp-ig" ng-click="toggleCalendar()"> <svg class="dtp-i fakeIcon" viewBox="0 0 24 24"> <use xlink:href="#dtp-i-right" /> </svg> <svg class="dtp-i calendarIcon" viewBox="0 0 24 24"> <use xlink:href="#dtp-i-calendar" /> </svg> <svg class="dtp-i closeIcon" viewBox="0 0 24 24"> <use xlink:href="#dtp-i-off" /> </svg> </div> <svg class="removeIcon" viewBox="0 0 24 24" ng-if="dtpValue.formated" ng-click="destroy()"> <use xlink:href="#dtp-i-close" /> </svg> </div> </div> <svg style="display:none;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"> <defs> <g id="dtp-i-calendar"> <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/> <path d="M0 0h24v24H0z" fill="none"/> </g> <g id="dtp-i-clock"> <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/> <path d="M0 0h24v24H0z" fill="none"/> <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/> </g> <g id="dtp-i-right"> <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/> <path d="M0 0h24v24H0z" fill="none"/> </g> <g id="dtp-i-close"> <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/> <path d="M0 0h24v24H0z" fill="none"/> </g> <g id="dtp-i-off"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/> </g> </defs> </svg> </div>'
        };
    }
    
    var dtpInputDirective = function() {
        return {
            require: ['^^admDtp', 'ngModel'],
            link: function(scope, element, attrs, ctrls) {
                var admDtp = ctrls[0], ngModel = ctrls[1];

                ngModel.$parsers.push(function() {
                    return ngModel.$modelValue;
                })

                admDtp.vm.hasInputDtp = true;

                element.on('focus', function() {
                    admDtp.vm.openCalendar();
                });
                element.on('blur', function() {
                    admDtp.vm.modelChanged(element[0].value);
                });
                
            }
        }
    }

    /* https://github.com/IamAdamJowett/angular-click-outside */
    var clickOutside = function($document) {
        return {
            restrict: 'A',
            scope: {
                clickOut: '&'
            },
            link: function ($scope, elem, attr) {
                if (attr.id == undefined) attr.$set('id', 'id_' + Math.random());

                $document.on('click contextmenu', function (e) {
                    var i = 0,
                        element;

                    if (!e.target) return;
                    
                    var classList = (attr.alias !== undefined) ? attr.alias.replace(', ', ',').split(',') : [];
                    classList.push(attr.id);

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
        
        ADMdtp.setOptions({isDeviceTouch: ('ontouchstart' in window || navigator.maxTouchPoints)});
        
        var style = document.createElement('style');
        style.type = 'text/css';
        
        var vendor = function(css) {
            return '-moz-' + css + '-o-' + css + '-webkit-' + css + css;
        }
        
        for (var i=1; i<51; i++)
            style.innerHTML += '.ADMdtpDays>span:nth-child('+ i +')>span {'+ vendor('transition: all .5s, transform 0.2s '+ i*.01 +'s cubic-bezier(0.680, -0.550, 0.265, 1.550); ') +'}';

        document.getElementsByTagName('head')[0].appendChild(style);
        
    }

    return angular.module('ADM-dateTimePicker', [])
        .constant('constants', {})
        .provider('ADMdtp', ADMdtpProvider)
        .filter('digitType', [ADMdtpDigitTypeFilter])
        .factory('ADMdtpConvertor', [ADMdtpConvertor])
        .factory('ADMdtpFactory', ['ADMdtpConvertor', ADMdtpFactory])
        .directive('admDtp', ['ADMdtp', 'ADMdtpConvertor', 'ADMdtpFactory', 'constants', '$compile', '$timeout', ADMdtpDirective])
        .directive('admDtpCalendar', ['ADMdtp', 'ADMdtpConvertor', 'ADMdtpFactory', 'constants', '$timeout', ADMdtpCalendarDirective])
        .directive('dtpInput', [dtpInputDirective])
        .directive('clickOut', ['$document', clickOutside])
        .config(['ADMdtpProvider', ADMdtpConfig]);
}(window.angular));



