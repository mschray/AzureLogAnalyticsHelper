/**
 * This returns a date in ms-x-date formate
 */
var aliasGetFormattedDate = function getFormattedDate() {
    // Mon, 24 Aug 2009 22:08:56 GMT 
    var d = new Date();

    var returnValue = "";

    var dow = d.getUTCDay();
    var weekDay = dayOfWeekShortName(dow);

    var thisMonth = d.getUTCMonth();
    var monthString = monthShortName(thisMonth);

    // Mon, 24 Aug 2009 22:08:56 GMT 
    returnValue = weekDay 
    + ", " 
    + twodigitFormat(d.getUTCDate())
    + " " 
    + monthString
    + " "
    + d.getUTCFullYear()
    + " "
    + twodigitFormat(d.getUTCHours())
    + ":"
    + twodigitFormat(d.getUTCMinutes())
    + ":"
    + twodigitFormat(d.getUTCSeconds())
    + " GMT"
    ;

    return returnValue;

}

/**
 * This function will zero pad the number if necessary to create a two digit number
 * @param {*} num the number to ensure is a two digit number number - it will zero pad the number if necessary for it to be two digits
 */
function twodigitFormat(num) {
    var s = "00" + num;
    return s.substr(s.length-2);
}

/**
 * This takes a numeric day of the week and returns a three letter abreviation for the day of the week
 * @param {*} dow numeric day of the week 
 */
function dayOfWeekShortName(dow){
    var weekDay = "";

    switch (dow) {
        case 0:
            weekDay = "Sun";
            break;
        case 1:
            weekDay = "Mon";
            break;
        case 2:
            weekDay = "Tue";
            break;
        case 3:
            weekDay = "Wed";
            break;
        case 4:
            weekDay = "Thu";
            break;
        case 5:
            weekDay = "Fri";
            break;
        case 6:
            weekDay = "Sat";
            break;
        default:
            weekDay = ""; // we don't have a valid day
    }

    return weekDay;
    
}

/**
 * This function takes a month number and returns a three letter abreviation for the month
 * @param {*} month value of a month 0 to 11
 */
function monthShortName(month){

    var monthString = "";
    switch (month) {
        case 0:
            monthString = "Jan";
            break;
        case 1:
            monthString = "Feb";
            break;
        case 2:
            monthString = "Mar";
            break;
        case 3:
            monthString = "Apr";
            break;
        case 4:
            monthString = "May";
            break;
        case 5:
            monthString = "Jun";
            break;
        case 6:
            monthString = "Jul";
            break;
        case 7:
            monthString = "Aug";
            break;
        case 8:
            monthString = "Sep";
            break;
        case 9:
            monthString = "Oct";
            break;
        case 10:
            monthString = "Nov";
            break;
        case 11:
            monthString = "Dec";
            break;
        default:
            monthString = ""; // we don't have a valid month
    }

    return monthString;
}
module.exports.getFormattedDate = aliasGetFormattedDate;  