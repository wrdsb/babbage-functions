# Groups Settings Changes Handler
Watches for changes in group settings and then handles those changes.

* Overwrites 'previous' file with 'now' file to prepare for the next diff calculation
* Manufactures events by publishing individual changes or change sets to ServiceBus topic
* Logs changes to Skyline
