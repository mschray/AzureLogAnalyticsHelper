
//https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-data-collector-api

const msXDateHelper = require('./MSxDateHelper.js');

// the file name of this file
//const fileName = __filename;
const fileName = require('path').basename(__filename);

// Update customerId to your Operations Management Suite workspace ID
var customerId ="";
                 
// For sharedKey, use either the primary or the secondary Connected Sources client authentication key   
var sharedKey = "";

// LogName is name of the event type that is being submitted to Log Analytics
var logName = "";

// You can use an optional field to specify the timestamp from the data. If the time field is not specified, Log Analytics assumes the time is the message ingestion time
var timeStampField = "";

/**
 * This method is used to load the various setting for using the Azure Log Analytics service including: 
 *  - the Operations Management Workspace ID
 *  - the Operateions Management Key for the Azure Log Analytis Service
 *  - the log name to use when logging to the Azure Log Analytics Service 
 * If you don't set these variables in code or call the version of initialize with arguments this version is called internally to (hopefully)
 * load the values from the environment
 */
function initialize() {

    // Get all the need information for this service to work
    if (customerId === "") 
        customerId = process.env.OPERATIONS_MANAGEMENT_WORKSPACE;
    
    if (sharedKey === "") 
        sharedKey = process.env.OPERATIONS_MANAGEMENT_KEY;
    
    if (logName === "")
        logName = process.env.LOG_ANALYTICS_APPNAME;


    // at this point validate that we have everything we need to operate the service and 
    // we don't throw an exception.  Use msg hold message for each setting we need.

    var msg = [];
    if (customerId === "" || customerId === null || typeof customerId === "undefined") 
        msg.push(`${fileName} in the initialize() function customerId is null, undefined or empty.  Set this in the environment or App Settings or pass it in to the initialize()`);
    
    if (sharedKey === "" || sharedKey === null || typeof sharedKey === "undefined") 
        msg.push(`${fileName} in the initialize() function sharedKey is null, undefined or empty.  Set this in the environment or App Settings or pass it in to the initialize()`);
    
    if (logName === "" || logName === null || typeof logName === "undefined")
        msg.push(`${fileName} in the initialize() function logName is null, undefined or empty. Set this in the environment or App Settings or pass it in to the initialize()`);
        
    // if the msg array > 0 there was a empty required setting so throw an exception
    if (msg.length > 0)
        throw msg.join(';');

}

/**
 * If you don't set CustomerId, SharedKey and LogName in code or via the environment call this function with these arguments to get everything 
 * setup and ready for use of the Azure Log Analytics
 * @param {*} theCustomerId the Operations Management Workspace ID
 * @param {*} theSharedKey  the Operateions Management Key for the Azure Log Analytis Service
 * @param {*} theLogName    the log name to use when logging to the Azure Log Analytics Service 
 */
const aliasInitialize = function initialize(theCustomerId, theSharedKey, theLogName) {

    customerId = theCustomerId;
    
    sharedKey = theSharedKey;
    
    logName = theLogName;

}

/**
 * this functions is to make local logging easy from the AzureLogAnalyticsHelper.js.  
 * @param {*} message message to log locally
 */
function writeToConsole(message) {
    console.log(`${fileName}: ${message}`);
}

/**
 * This function is meant to provide a super convenient way to write JSON formatted strings to the Azure Log Analytics Service
 * @param {*} context if you are using an Azure function this is the context if you are not using Azure Functions pass in null
 * @param {*} jsonMessage JOSN string (NOT object) representing the message to be written into Azure Stream Analytics
 */
const aliasWriteLogEntry = function writeLogEntry(context, jsonMessage) {
    // make sure all the needed app settings are loaded
    
    initialize();

    if (context) context.log(`${fileName}, writeLogEntry,  ${jsonMessage}`);

    // Create a hash for the API signature - need a date formatted in ms-x-date format - 'Fri, 24 Feb 2017 16:51:21 GMT';
    var datestring =  msXDateHelper.getFormattedDate();
    
    var stringToHash = "POST\n" + jsonMessage.length + "\napplication/json\n" + "x-ms-date:" + datestring + "\n/api/logs";
      
    var hashedString = buildSignature(stringToHash, sharedKey);
   
    var signature = "SharedKey " + customerId + ":" + hashedString;
    
    PostToLogAnalytics(signature, datestring, jsonMessage);
}

/**
 * This function is meant to be used if you are using it from Azure Functions, it lets you pass in the name of the Azure Function and the function 
 * invoking this function.  It adds the name of the Azure Function and calling function to the JSON strings its part of the logging
 * @param {*} context if you are using an Azure function this is the context if you are not using Azure Functions pass in null
 * @param {*} azureFunction string representing the name of calling Azure Function (e.g. foo) 
 * @param {*} method string representing the name of the function calling this function (e.g. could be run)
 * @param {*} jsonMessage JOSN string (NOT object) representing the message to be written into Azure Stream Analytics
 */
const aliasWriteAzureFunctionLogEntry = function writeAzureFunctionLogEntry(context, azureFunction, method, jsonMessage) {

    if (context) context.log(`Azure Function: ${azureFunction}, Method ${method}  ${jsonMessage}`);

    // parse incoming JSON jsonMessage
    var input = JSON.parse(jsonMessage);
    
    // Add details about Azure function and method to the JSON
    input["AzureFunction"] = azureFunction;
    input["Method"] = method;

    var revisedMessage = JSON.stringify(input);

    aliasWriteLogEntry(context,revisedMessage);
}

// 
/**
 * Build the API signature to use the Azure Stream Analytics Service
 * @param {*} message this is the contents of the message that you'll be sending to the Azure Stream Analytics Service
 * @param {*} secret this is your key to the Operation Management Workspace 
 */
function buildSignature( message, secret) {
    //http://stackoverflow.com/questions/36016567/hmacsha256-in-c-sharp-vs-node-js
    
    var crypto = require('crypto');
    
    var keyByte = new Buffer(secret,'base64');
    var messageBytes = new Buffer(message,"ascii"); 

    var hmacsha256 = crypto.createHmac('SHA256', keyByte).update(messageBytes,"ascii").digest('base64');

    return hmacsha256;
}

/**
 * This function is used to post data into Azure Stream Analytics REST endpoint
 * @param {*} signature - this is the signature used for the auth of this requet.  This signature is built using the BuildSignature function
 * @param {*} date - this is a ms-x-date formatted string
 * @param {*} json  - this is the json information to send to Azure Log Analytics
 */
// Send a request to the POST API endpoint
function PostToLogAnalytics(signature, date, json) {

    // setup on the endpoint and path for Azure Log Analytics service
    var url = customerId +".ods.opinsights.azure.com"
    var path = "/api/logs?api-version=2016-04-01";

    // Setup HTTP
    var https = require('https');

    // configure the needed options for our request
    var options = {
        hostname: url,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Log-Type': logName,
            'Authorization': signature,
            'x-ms-date': date,
            'time-generated-field': timeStampField,
        }
    };

    // stores the request object
    var req;

    try {

        req = https.request(options, function(response){
            var str = '';

            writeToConsole(`PostData request status code: ${response.statusCode} and message: ${response.statusMessage}`);

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                writeToConsole(`PostData response data: ${str}`);
            });

        });
    } catch (error) {
        writeToConsole(`An error occured in method PostData ${error.message}`);
    }


    try {
        // write the request to the stream
        req.write(json); 

        req.on('error', (err) => {
            writeToConsole(`An error on the request occured method PostData: ${err}`);
        });


    } catch (err) {
        writeToConsole(`An error on the request occured method PostData: ${err}`);

    } finally {
        if (req) req.end();
    }

};

module.exports.initialize = aliasInitialize;
module.exports.writeLogEntry =aliasWriteLogEntry;
module.exports.writeAzureFunctionLogEntry =aliasWriteAzureFunctionLogEntry;
 
