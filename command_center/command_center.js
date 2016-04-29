'use strict';

// Azure IoT packages
var Protocol = require('azure-iot-device-amqp').Amqp;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var ConnectionString = require('azure-iot-device').ConnectionString;

// String containing Hostname, Device Id & Device Key in the following formats:
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

var Cylon = require("cylon");

Cylon.robot({
    connections: {
        edison: { adaptor: "intel-iot" }
    },

    devices: {
        // analog
        temp: { driver: "temperature-sensor", pin: 0 },
        gas: { driver: "analog-sensor", pin: 1 },
        humid: { driver: "analog-sensor", pin: 3 },

        // digital
        dust: { driver: "upm-ppd42ns", pin: 2 },
        fan: { driver: "led", pin: 8 }
    },

    work: function (my) {
        my.dustData = {
            lowPulseOccupancy: 0,
            ratio: 0,
            concentration: 0
        };

        this.gas.on("analogRead", function (data) {
            var value = data.toScale(0, 100);
            if (value >= 5) {
                my.fan.turnOn();
            } else {
                my.fan.turnOff();
            }
        });

        // only read dust sensor every 30 seconds, because it takes a while
        setInterval(function () {
            console.log("Reading dust sensor...");

            my.dustData = my.dust.getData();
            console.log("Low pulse occupancy: " + my.dustData.lowPulseOccupancy);
            console.log("Ratio: " + my.dustData.ratio);
            console.log("Concentration: " + my.dustData.concentration);
        }, 30000);

        var setAirResistance = function (position) {
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
                        switch (command.Name) {
                            case 'TurnFanOn':
                                my.fan.turnOn();
                                break;
                            case 'TurnFanOff':
                                my.fan.turnOff();
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

                // Create a message and send it to the IoT Hub every 5 seconds
                var sendInterval = setInterval(function () {
                    var data = JSON.stringify({
                        DeviceId: deviceId,
                        EventTime: new Date().toISOString(),

                        Mtemperature: my.temp.celsius(),
                        Humidity: my.humid.analogRead(),
                        Gas: my.gas.analogRead(),
                        Dustd: my.dustData.concentration
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
    }
}).start();