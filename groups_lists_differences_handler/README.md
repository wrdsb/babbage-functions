# Groups Lists Differences Handler
Watches for differences in lists of groups and then handles those differences.

* Overwrites 'previous' file with 'now' file to prepare for the next diff calculation
* Manufactures events by publishing individual changes or change sets to ServiceBus topic
* Logs changes to Skyline