function getPersianDate(year, month, day) {

    var date = { year: year, month: month, day: day };
    date = getJalaliDate(date);
    //console.log(date);
    return date;
}
function getJalaliDate(date) {
    var daysPassedInGregorianCalender = getDaysPassedInGregorianCalender(date);
    //DiffrentialOfCalenders
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
    //PureYear
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
        //1 || i == 5 ||i == 9 ||i == 13 ||i == 17 ||i == 22
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
                break;
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
function isLeapYearInJalaliCalender(years) {
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
function getDaysPassedInGregorianCalender(date) {
    var gregorianMonths = getGregorianMonths();
    var passedLeapYears = howManyGregorianLeapsYearPassed(date.year);
    var days = passedLeapYears;
    var isMiladiLeaps = isGregorianLeapYear(date.year);
    days += (date.year - 1) * 365;
    for (i = 0; i < date.month - 1; i++) {
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

//GregorianDate


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
function getGregorianDates(year, mont, day) {
    var date= getGregorianDate( {
        day: day,
        month: mont,
        year: year
    });
    //console.log(date);
    return date;
}
