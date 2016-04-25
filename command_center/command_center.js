// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// Azure IoT packages
var Protocol = require('azure-iot-device-amqp').Amqp;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// var Protocol = require('azure-iot-device-amqp-ws').AmqpWs;
// var Protocol = require('azure-iot-device-http').Http;
// var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var ConnectionString = require('azure-iot-device').ConnectionString;

// Edison packages
var five = require("johnny-five");
var Edison = require("edison-io");
//var upmBuzzer = require("jsupm_buzzer");
//var groveSensor = require('jsupm_grove');
var board = new five.Board({
  io: new Edison()
});

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
var connectionString = 'HostName=jpshub.azure-devices.net;DeviceId=jpsdevice01;SharedAccessKey=bNd32qZm0OI0EY+iO8559r+hDBGbYPkx81LvzuWyncM=';

// Retrieve the deviceId from the connectionString
var deviceId = ConnectionString.parse(connectionString)["DeviceId"];


// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

board.on("ready", function() {
    var temp = new five.Temperature({
        pin: "A0",
        controller: "GROVE"
    });

    var humid = new five.Temperature({
        pin: "A3",
        controller: "GROVE"
    });
  
  var gas = new five.Sensor({
    pin: "A1",
  });

  var dust = new five.Sensor(2);

  //var relay = new five.Relay(3);

  var led = new five.Led(8);

 // var myBuzzer = new five.Buzzer(6);

  var turnFanOn = function () {
      led.on();
      //relay.on();
      //chords.push(upmBuzzer.DO);
      
  };

  var turnFanOff = function() {
      led.off();
      //relay.off();
      //chords.off();
  };

  var setAirResistance = function(position) {
    console.log("Setting Air Resistance Position to " + position);
  };

  var connectCallback = function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
    } else {
      console.log('Client connected');
      client.on('message', function (msg) {
        console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
        try {
          var command = msg.data;
          switch(command.Name) {
            case 'TurnFanOn':
              turnFanOn();
              break;
            case 'TurnFanOff':
              turnFanOff();
              break;
            case 'SetAirResistance':
              setAirResistance(command.Parameters.Position);
              break;
            default:
              console.error('Unknown command received');
              break;
          }

          client.complete(msg, printResultFor('complete'));
        }
        catch (err) {
          printResultFor('parse received message')(err);
          client.reject(msg, printResultFor('reject'));
        }
      });

      var gassensor = 0;
      gas.scale(0, 100).on("change", function () {
          gassensor = this.value;
          if (gassensor >= 5.0)
              led.on();
          else led.off();
          });


      var dustsensor = 0;
      dust.scale(0, 1023).on("change", function () {
          //console.log(dust);
          dustsensor = this.value;
         
          
      });

      // Create a message and send it to the IoT Hub every 5 seconds 
      var sendInterval = setInterval(function () {
        var data = JSON.stringify({
          DeviceId: deviceId,
          EventTime: new Date().toISOString(),
         
          Mtemperature: temp.celsius,
          Humidity: humid.celsius,
          Gas: gassensor,
          Dustd: dustsensor
          
          
          
        });

        var message = new Message(data);
        console.log('Sending message: ' + message.getData());
        client.sendEvent(message, printResultFor('send'));
      }, 5000);

      client.on('error', function (err) {
        console.error(err.message);
      });

      client.on('disconnect', function () {
        clearInterval(sendInterval);
        client.removeAllListeners();
        client.connect(connectCallback);
      });
    }
  };

  client.open(connectCallback);
});
