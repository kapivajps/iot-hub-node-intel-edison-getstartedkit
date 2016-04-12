---
services: iot-hub, stream-analytics, event-hubs, web-apps, documentdb, storage-accounts
platforms: yocto, node
author: hegate
---

# Get Started with Microsoft Azure IoT Starter Kit - Intel Edison

This page contains technical information to help you get familiar with Azure IoT using the Azure IoT Starter Kit - Intel Edison. You will find two tutorials that will walk you through different scenarios. The first tutorial will show you how to connect your Azure IoT Starter kit to our Remote Monitoring preconfigured solution from Azure IoT Suite. In the second tutorial, you will leverage Azure IoT services to create your own IoT solution.

You can choose to start with whichever tutorial you want to. If you've never worked with Azure IoT services before, we encourage you to start with the Remote Monitoring solution tutorial, because all of the Azure services will be provisioned for you in a built-in preconfigured solution. Then you can explore how each of the services work by going through the second tutorial.

We hope you enjoy the tutorials! Please provide feedback if there's anything that we can improve.
 
***
**Don't have a kit yet?:** Click [here](http://azure.com/iotstarterkits)
***

- [Running a Simple Remote Monitoring Solution with the Intel Edison](#running-a-simple-remote-monitoring-solution-with-the-sparkfun-thingdev)
- [Using Microsoft Azure IoT to Process and Use Sensor Data to Indicate Abnormal Temperatures](#using-microsoft-azure-iot-to-process-and-use-sensor-data-to-indicate-abnormal-temperatures)

# Running a Simple Remote Monitoring Solution with the Intel Edison

This tutorial describes the process of taking your Intel Edison Grove kit, and using it to develop a temperature, humidity and pressure reader that can communicate with the cloud using the  Microsoft Azure IoT SDK. 

## Table of Contents

- [1.1 Tutorial Overview](#11-tutorial-overview)
- [1.2 Before Starting](#12-before-starting)
  - [1.2.1 Required Software](#121-required-software)
  - [1.2.2 Required Hardware](#122-required-hardware)
- [1.3 Create a New Azure IoT Suite Remote Monitoring solution and Add Device](#13-create-a-new-azure-iot-suite-remote-monitoring-solution-and-add-device)
- [1.4 Prepare your device](#14-connect-the-dht22-sensor-module-to-your-device)
- [1.5 Connect the Grove Sensor Module to your Device](#15-connect-the-dht22-sensor-module-to-your-device)
- [1.6 Modify the Remote Monitoring sample](#16-modify-the-remote-monitoring-sample-)
- [1.7 View the Sensor Data from the Remote Monitoring Portal](#18-view-the-sensor-data-from-the-remote-monitoring-portal)
- [1.8 Next steps](#19-next-steps)

## 1.1 Tutorial Overview

In this tutorial, you'll be doing the following:
- Setting up your environment on Azure using the Microsoft Azure IoT Suite Remote Monitoring preconfigured solution, getting a large portion of the set-up that would be required done in one step.
- Setting your device and sensors up so that it can communicate with both your computer, and Azure IoT. 
- Updating the device code sample to include our connection data and send it to Azure to be viewed remotely.

## 1.2 Before Starting

### 1.2.1 Required Software

- Intel Edison drivers, available here: 
  - [Windows users](https://software.intel.com/en-us/get-started-edison-windows)
  - [Mac users](https://software.intel.com/en-us/get-started-edison-osx)
  - [Linux users](https://software.intel.com/en-us/get-started-edison-linux)
   

### 1.2.2 Required Hardware

- Intel Edison Grove kit
  - Two USB Mini cables 
  

## 1.3 Create a New Azure IoT Suite Remote Monitoring solution and Add Device

- Log in to [Azure IoT Suite](https://www.azureiotsuite.com/)  with your Microsoft account and click **Create a New Preconfigured Solution** 

***
**Note:** For first time users, click here to get your [Azure free trial](https://azure.microsoft.com/en-us/pricing/free-trial/) which gives you 200USD of credit to get started.
***

- Click select in the **Remote Monitoring** option
- Type in a solution name. For this tutorial we’ll be using _“EdisonSuite”_ (You will have to name it something else. Make it unique. I.E. "ContosoSample")
- Choose your subscription plan and geographic region, then click **Create Solution**
- Wait for Azure to finish provisioning your IoT suite (this process may take up to 10 minutes), and then click **Launch**

***
**Note:** You may be asked to log back in. This is to ensure your solution has proper permissions associated with your account. 
***

- Open the link to your IoT Suite’s “Solution Dashboard.” You may have been redirected there already. 
- This opens your personal remote monitoring site at the URL _&lt;Your Azure IoT Hub suite name&gt;.azurewebsites.net_ (e.g. _EdisonSuite.azurewebsites.net_)
- Click **Add a Device** at the lower left hand corner of your screen
- Add a new **custom device**
- Enter your desired `device ID`. In this case we’ll use _“Edison_Grove”_, and then click Check ID
- If Device ID is available, go ahead and click **Create**
- Make note of your `device ID`, `Device Key`, and `IoT Hub Hostname` to enter into the code you’ll run on your device later 

***
**Note:** The Remote Monitoring solution provisions a set of Azure IoT Services in your Azure account. To avoid unnecessary consumption, you may want to **disable** the simulated devices created with the solution (go to the devices tab, select the device simulators one by one and click on deactivate in the left menu. And once you are all done with the solution you can completely remove it from your subscription from the azureiotsuite.com portal. 
***

- For additional reference, refer to the following:
 - https://azure.microsoft.com/en-us/documentation/articles/iot-suite-remote-monitoring-sample-walkthrough/
 - https://azure.microsoft.com/en-us/documentation/articles/iot-suite-connecting-devices/
 
## 1.4 Prepare your device

If this is the first time you use your Intel Edison board, you will have to follow some steps to assemble it.

- Please follow steps 1-4 of the [instructions](https://software.intel.com/en-us/iot/library/edison-getting-started). Intel's IDE (Step 5) is optional for our tutorial.
- Flash your board with the latest [firmware](https://www-ssl.intel.com/content/www/us/en/support/boards-and-kits/000005990.html)

## 1.5 Connect the Grove Sensor Module to your Device

- Begin by placing the Base Shield over the pins on your Intel Edison board
- Using [this image](https://github.com/Azure-Samples/iot-hub-node-intel-edison-getstartedkit/blob/master/img/edison_remote_monitoring.png?raw=true) as a reference, connect your Grove sensor and the Intel Edison
- For sensor pins, we will use the following wiring:

| Edison Port   | Component    | 
| ------------- | ------------ | 
| A0            | Temperature  | 

- For more information, see: [Seeed studio's wiki](http://www.seeedstudio.com/wiki/Base_shield_v2).

**At the end of your work, your Intel Edison should be connected with a working sensor. We'll test it in the next sections.**


## 1.6 Modify, build and run the Remote Monitoring sample 

- In your Edison boards command line, type the following command to transfer the files to your board:

```  
wget https://raw.githubusercontent.com/Azure-Samples/iot-hub-node-intel-edison-getstartedkit/master/remote_monitoring/remote_monitoring.js
wget https://raw.githubusercontent.com/Azure-Samples/iot-hub-node-intel-edison-getstartedkit/master/remote_monitoring/package.json
```  

- Open the file **remote_monitoring.js** in a text editor using the command:

```
vi remote_monitoring.js
```

- Vi is not your normal text editor - Here is a guide to some of the important controls:

```
x	  Delete character to the right of cursor
X	  Delete character to the left of cursor
:x	  Exit, saving changes

Movement
h	  Move left
j	  Move down
k	  Move up
l	  Move right

[ESC] returns the editor to command mode after entering one of the below modes: 
i	  Insert before cursor
a	  Append after cursor
```

- Locate the following code in the file and update your connection data:

```
var hostName = '<IOTHUB_HOST_NAME>';
var deviceId = '<DEVICE_ID>';
var sharedAccessKey = '<SHARED_ACCESS_KEY>';
```

- Save with `Control-s`

- Run the sample application using the following commands:

```
npm install
node remote_monitoring.js
```

## 1.7 View the Sensor Data from the Remote Monitoring Portal

- Once you have the sample running, visit your dashboard by visiting azureiotsuite.com and clicking “Launch” on your solution
- Make sure the “Device to View” in the upper right is set to your device
- If the demo is running, you should see the graph change as your data updates in real time!

***
**Note:** Make sure to **stop** your remote monitoring solution once you have completed this to avoid unnecesary Azure consumption! 
***

## 1.8 Next steps

Please visit our [Azure IoT Dev Center](https://azure.microsoft.com/en-us/develop/iot/) for more samples and documentation on Azure IoT.


# Using Microsoft Azure IoT Services to Identify Temperature Anomalies

This tutorial describes the process of taking your Microsoft Azure IoT Starter Kit for the Intel Edison, and using it to develop a temperature and humidity reader that can communicate with the cloud using the  Microsoft Azure IoT SDK.

## Table of Contents

- [2.1 Tutorial Overview](#21-tutorial-overview)
- [2.2 Before Starting](#22-before-starting)
  - [2.2.1 Required Software](#221-required-software)
  - [2.2.2 Required Hardware](#222-required-hardware)
- [2.3 Connect the Sensor Module to your Device](#23-connect-the-sensor-module-to-your-device)
- [2.4 Create a New Microsoft Azure IoT Hub and Add Device](#24-create-a-new-microsoft-azure-iot-hub-and-add-device)
- [2.5 Create an Event Hub](#25-create-an-event-hub)
- [2.6 Create a Storage Account for Table Storage](#26-create-a-storage-account-for-table-storage)
- [2.7 Create a Stream Analytics job to Save IoT Data in Table Storage and Raise Alerts](#26-create-a-stream-analytics-job-to-save-iot-data-in-table-storage-and-raise-alerts)
- [2.8 Node Application Setup](#28-node-application-setup)
- [2.9 Modify Device Sample](#29-modify-device-sample)
- [2.10 View Your Command Center Application](#210-view-your-command-center-application)
- [2.11 Next steps](#211-next-steps)

## 2.1 Tutorial Overview

This tutorial has the following steps:
- Provision an IoT Hub instance on Microsoft Azure and adding your device. 
- Prepare the device, get connected to the device, and set it up so that it can read sensor data.
- Configure your Microsoft Azure IoT services by adding Event Hub, Storage Account, and Stream Analytics resources.
- Prepare your local web solution for monitoring and sending commands to your device.
- Update the sample code to respond to commands and include the data from our sensors, sending it to Microsoft Azure to be viewed remotely.

## 2.2 Before Starting

### 2.2.1 Required Software

- [Git](https://git-scm.com/downloads) - For cloning the required repositories
- [Node.js](https://nodejs.org) - For running the Node application
- Intel Edison drivers, available here: 
  - [Windows users](https://software.intel.com/en-us/get-started-edison-windows)
  - [Mac users](https://software.intel.com/en-us/get-started-edison-osx)
  - [Linux users](https://software.intel.com/en-us/get-started-edison-linux)
   
### 2.2.2 Required Hardware

- Intel Edison Grove kit
  - Two USB Mini cables 

## 2.3 Connect the Sensor Module to your Device

- Begin by placing the Base Shield over the pins on your Intel Edison board
- Using [this image](https://github.com/Azure-Samples/iot-hub-node-intel-edison-getstartedkit/blob/master/img/edison_command_center.png?raw=true) as a reference, connect your Grove sensor and the Intel Edison
- For sensor pins, we will use the following wiring:

| Edison Port   | Component       | 
| ------------- | --------------- | 
| A0            | Temperature     | 
| D8            | LED Socket Kit  | 

- For more information, see: [Seeed studio's wiki](http://www.seeedstudio.com/wiki/Base_shield_v2).

**At the end of your work, your Intel Edison should be connected with a working sensor. We'll test it in the next sections.**

## 2.4 Create a New Microsoft Azure IoT Hub and Add Device

- To create your Microsoft Azure IoT Hub and add a device, follow the instructions outlined in the [Setup IoT Hub Microsoft Azure Iot SDK page](https://github.com/Azure/azure-iot-sdks/blob/master/doc/setup_iothub.md).
- After creating your device, make note of your connection string to enter into the code you’ll run on your device later

## 2.5 Create an Event Hub
Event Hub is an Azure IoT publish-subscribe service that can ingest millions of events per second and stream them into multiple applications, services or devices.
- Log on to the [Microsoft Azure Portal](https://portal.azure.com/)
- Click on **New** -&gt; **Internet of Things**-&gt; **Event Hub**
- After being redirected, click "Custom Create", Enter the following settings for the Event Hub (use a name of your choice for the event hub and the namespace):
    - Event Hub Name: `EdisonEventHub`
    - Region: `Your choice`
    - Subscription: `Your choice`
    - Namespace Name: `Your Project Namespace, in our case “Edison2Suite”`
- Click the **arrow** to continue.
- Choose to create **4** partitions and retain messages for **7** days.
- Click the **check** at the bottom right hand corner to create your event hub.
- Click on your `Edison2Suite` service bus (what you named your service bus)
- Click on the **Event Hubs** tab
- Select the `EdisonEventHub` eventhub and go in the **Configure** tab in the **Shared Access Policies** section, add a new policy:
    - Name = `readwrite`
    - Permissions = `Send, Listen`
- Click **Save** at the bottom of the page, then click the **Dashboard** tab near the top and click on **Connection Information** at the bottom
- _Copy down the connection string for the `readwrite` policy you created._

## 2.6 Create a Storage Account for Table Storage
Now we will create a service to store our data in the cloud.
- Log on to the [Microsoft Azure Portal](https://portal.azure.com/)
- In the menu, click **New** and select **Data + Storage** then **Storage Account**
- Choose **Classic** for the deployment model and click on **Create**
- Enter the name of your choice (We chose `edisonstorage`) for the account name, `Standard-RAGRS` for the type, choose your subscription, select the resource group you created earlier, then click on **Create**
- You should try to create the storage account in the same region as your IoT Hub and Event Hub if possible.  
- Once the account is created, find it in the **resources blade** or click on the **pinned tile**, go to **Settings**, **Keys**, and write down the _primary connection string_.

## 2.7 Create a Stream Analytics job to Save IoT Data in Table Storage and Raise Alerts
Stream Analytics is an Azure IoT service that streams and analyzes data in the cloud. We'll use it to process data coming from your device.
- Log on to the [Microsoft Azure Portal](https://portal.azure.com/)
- In the menu, click **New**, then click **Internet of Things**, and then click **Stream Analytics Job**
- Enter a name for the job (We chose “EdisonStorageJob”), a preferred region, then choose your subscription. At this stage you are also offered to create a new or to use an existing resource group. Choose the resource group you created earlier (In our case, `Edison2Suite`).
- Once the job is created, open your **Job’s blade** or click on the **pinned tile**, and find the section titled _“Job Topology”_ and click the **Inputs** tile. In the Inputs blade, click on **Add**
- Enter the following settings:
    - Input Alias = _`TempSensors`_
    - Source Type = _`Data Stream`_
    - Source = _`IoT Hub`_
    - IoT Hub = _`Edison2Suite`_ (use the name for the IoT Hub you create before)
    - Shared Access Policy Name = _`device`_
    - Shared Access Policy Key = _The `device` primary key saved from earlier_
    - IoT Hub Consumer Group = "" (leave it to the default empty value)
    - Event serialization format = _`JSON`_
    - Encoding = _`UTF-8`_

- Back to the **Stream Analytics Job blade**, click on the **Query tile** (next to the Inputs tile). In the Query settings blade, type in the below query and click **Save**:

```
SELECT
    DeviceId,
    EventTime,
    MTemperature as TemperatureReading
INTO
    TemperatureTableStorage
from TempSensors
WHERE
   DeviceId is not null
   and EventTime is not null

SELECT
    DeviceId,
    EventTime,
    MTemperature as TemperatureReading
INTO   
    TemperatureAlertToEventHub
FROM
    TempSensors
WHERE TemperatureReading>25 
```

***
**Note:** You can change the `25` to `0` when you're ready to generate alerts to look at. This number represents the temperature in degrees celsius to check for when creating alerts. 25 degrees celsius is 77 degrees fahrenheit.
***

- Back to the **Stream Analytics Job blade**, click on the **Outputs** tile and in the **Outputs blade**, click on **Add**
- Enter the following settings then click on **Create**:
    - Output Alias = _`TemperatureTableStorage`_
    - Sink = _`Table Storage`_
    - Storage account = _`edisonstorage`_ (The storage you made earlier)
    - Storage account key = _(The primary key for the storage account made earlier, can be found in Settings -&gt; Keys -&gt; Primary Access Key)_
    - Table Name = _`TemperatureRecords`_*Your choice - If the table doesn’t already exist, Local Storage will create it
    - Partition Key = _`DeviceId`_
    - Row Key = _`EventTime`_
    - Batch size = _`1`_
- Back to the **Stream Analytics Job blade**, click on the **Outputs tile**, and in the **Outputs blade**, click on **Add**
- Enter the following settings then click on **Create**:
    - Output Alias = _`TemperatureAlertToEventHub`_
    - Source = _`Event Hub`_
    - Service Bus Namespace = _`Edison2Suite`_
    - Event Hub Name = _`edisoneventhub`_ (The Event Hub you made earlier)
    - Event Hub Policy Name = _`readwrite`_
    - Event Hub Policy Key = _Primary Key for readwrite Policy name (That's the one you wrote down after creating the event hub)_
    - Partition Key Column = _`0`_
    - Event Serialization format = _`JSON`_
    - Encoding = _`UTF-8`_
    - Format = _`Line separated`_
- Back in the** Stream Analytics blade**, start the job by clicking on the **Start **button at the top

***
**Note:** Make sure to **stop** your Command Center jobs once you have completed this to avoid unnecesary Azure consumption! 
***

## 2.8 Node Application Setup

 - If you do not have it already, install Node.js and NPM.
   - Windows and Mac installers can be found here: https://nodejs.org/en/download/
     - Ensure that you select the options to install NPM and add to your PATH.
   - Linux users can use the commands:

```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
``` 

- Additionally, make sure you have cloned the project repository locally by issuing the following command in your desired directory:

```
git clone https://github.com/Azure-Samples/iot-hub-node-intel-edison-getstartedkit.git
```

- Open the `command_center_node` folder in your command prompt (`cd path/to/command_center_node`) and install the required modules by running the following:

```
npm install -g bower
npm install express nconf tough-cookie azure-event-hubs azure-iot-device azure-iot-device-amqp azure-iothub azure-storage body-parser
bower install
```

- Open the `config.json` file and replace the information with your project

```
{
    "port": "3000",
    "eventHubName": "event-hub-name",
    "ehConnString": "Endpoint=sb://name.servicebus.windows.net/;SharedAccessKeyName=readwrite;SharedAccessKey=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=",
    "deviceConnString": "HostName=name.azure-devices.net;DeviceId=device-id;SharedAccessKey=aaaaaaaaaaaaaaaaaaaaaa==",
    "iotHubConnString": "HostName=name.azure-devices.net;SharedAccessKeyName=owner;SharedAccessKey=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=",
    "storageAcountName": "aaaaaaaaaaa",
    "storageAccountKey": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa==",
    "storageTable": "storage-table-name"
} 
```

- Now it is time to run it! Enter the following command:

```
node server.js
```

- You should then see something similar to:
```
app running on http://localhost:3000
client connected
``` 

- Visit the url in your browser and you will see the Node app running!
 
To deploy this project to the cloud using Azure, you can reference [Creating a Node.js web app in Azure App Service](https://azure.microsoft.com/en-us/documentation/articles/web-sites-nodejs-develop-deploy-mac/).

Next, we will update your device so that it can interact with all the things you just created.

## 2.9 Modify Device Sample

- In your Edison boards command line, type the following command to transfer the files to your board:

```  
wget https://raw.githubusercontent.com/Azure-Samples/iot-hub-node-intel-edison-getstartedkit/master/command_center/command_center.js
wget https://raw.githubusercontent.com/Azure-Samples/iot-hub-node-intel-edison-getstartedkit/master/command_center/package.json
```  
 
- Open the file **command_center.js** in a text editor using the command:

```
vi remote_monitoring.js
```

- Vi is not your normal text editor - Here is a guide to some of the important controls:

```
x	  Delete character to the right of cursor
X	  Delete character to the left of cursor
:x	  Exit, saving changes

Movement
h	  Move left
j	  Move down
k	  Move up
l	  Move right

[ESC] returns the editor to command mode after entering one of the below modes: 
i	  Insert before cursor
a	  Append after cursor
```

- Locate the following code in the file and update your connection data:

```
var hostName = '<IOTHUB_HOST_NAME>';
var deviceId = '<DEVICE_ID>';
var sharedAccessKey = '<SHARED_ACCESS_KEY>';
```
- Save with `Control-s`

- Run the sample application using the following commands:

```
npm install
node command_center.js
```
- Data is now being sent off at regular intervals to Microsoft Azure!

## 2.10 View Your Command Center Application

Head back and run your Node application and you will see the most recent updates and any alerts show up there.

***
**Note:** Make sure to **stop** your Command Center jobs in Stream Analytics once you have completed this to avoid unnecesary Azure consumption! 
***

## 2.11 Next steps

Please visit our [Azure IoT Dev Center](https://azure.microsoft.com/en-us/develop/iot/) for more samples and documentation on Azure IoT.
