# AzureLogAnalyticsHelper

This project is an Azure Functions based wrapper over the Azure Log Analytics REST API.  To use this 
Azure function you need to add three settings to your [Azure Functions App Settings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings).

### OPERATIONS_MANAGEMENT_WORKSPACE ###
### OPERATIONS_MANAGEMENT_KEY ###
### LOG_ANALYTICS_APPNAME ###

##Where do I get the values for this setttings?

The OPERATIONS_MANAGEMENT_WORKSPACE is the "name" (really a GUIDish thing) that is shows up under overview in the Azure Portal after you've created the Azure Log Analytics service.  [Create your Azure Log Analytics Workspace](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-get-started).

The OPERATIONS_MANAGEMENT_KEY can be obtained the by looking at the data sources in this [article](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-windows-agents).

The LOG_ANALYTICS_APPNAME should be the name you want to appear for your app in the Log Analytics Service.  Don't uses spaces of special characters.

## How do I deploy this?
[Deploy](https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment) it using continuous deployment.


## How do I call this endpoint?
Get the endpoint as described in this [acticle](https://docs.microsoft.com/en-us/azure/azure-functions/functions-test-a-function#test-a-function-within-functions).

## What does it expect?
It will take any JSON in the body and send it off to the Azure Log Anayltics Service.

