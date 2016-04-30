# Team Stardust

<p align="center">
  <img src="https://pbs.twimg.com/media/Cg1TJAyUUAAsmrR.jpg" alt="Team Stardust"/>
</p>

## THE CHALLENGE: AIRCHECK
#### EARTH

Develop an app or platform to crowd-source information for comparing changes in environmental factors, such as temperature, relative humidity, air pollution, with occurrence of symptoms of allergies and respiratory diseases. Create tools for public entry and grading of symptoms, including but not limited to cough, shortness of breath, wheezing, sneezing, nasal obstruction, itchy eyes; and geographic mapping of symptom frequency and intensity. Create a platform for comparison of symptom map with NASA provided data, with visualization options for web and/or smart phone.


## SOLUTION

### Jarvis Sensor System (Made in Mars)

[Jarvis Sensor System Control - http://jpsweb.azurewebsites.net](http://jpsweb.azurewebsites.net "Jarvis Sensor System Control")

<p align="center">
  <img alt="Hardware" src="https://pbs.twimg.com/media/Cg1TJGJUgAENVNg.jpg">
</p>


What we can’t see can still harm us. That’s the more insidious sinister thing that lies beneath. We have the means to check air quality on earth, but as we continue venturing deeper into space, the necessity of creating and expanding on current technology to protect humans grows. Stories from past Apollo Missions depicted lunar dust sticking onto space suits and eventually being inhaled by the astronauts causing negative side effects. Martian dust is no exception. It’s sticky, fine, and when inhaled at certain sizes can prove deadly. If NASA hopes to keep their astronauts safe and colonize Mars in the future, we need to make sure technology is able to keep their environments and suits sterile.
To address this, we propose the Jarvis Particle Sensor. Using IoT Technology provided by Intel’s Edison and Microsoft’s Azure, we were able to create a sensor that communicates particle readings in volume to the Azure Cloud, where it was then processed by stream analytics close to real time. The data was projected on a GUI hosted on the Azure cloud network.

The sensor has a red LED light that activates when the concentration of dust is beyond a pre-determined threshold. This feature allows you to detect when hazardous chemicals are crossing the threshold.
Considerations for further Mars exploration is how do we continue making these on a planet far, far away?! Here's the kicker - we plan to be resourceful and use the materials available - we're going to be making these particle sensors through Mars materials. The dream is to create cost effective, easily testable, lightweight tubes that collect volume using basalt rocks straight from Martian soil. 3D designs and testing can be prepared prior to Mars travel while rocks are being mined beforehand, ground finely, and then spun into a thread into a 3D printer ready for the astronaut to continue to use once landing on Mars.

## RESOURCES USED

### Hardware
* Intel Edison Board 
* Grove Starter Kits
* Dust/particle Sensor
* Gas Sensor
* Temperature Sensor
* Humidity Sensor
* LED light

### Software
* Microsoft Azure - cloud hosted responsive web/mobile app and data
[Jarvis Sensor System](http://jpsweb.azurewebsites.net/)

#### Software Programming
* Front-end: Angular.js
* Back-end: Node.js

#### Hardware Programming: 
* Node.js
* Cylon.js

[Making a Home from Materials on Mars](http://www.mae.ucla.edu/making-a-home-from-materials-on-mars)

#### Future Implications
We are currently developing prototypes for a lightweight, 3D-printed sensor casing, capable of containing particles of interest for analysis.  Please check back soon for possible designs. 

