# Couple Hapi Plugins horizontally

Hapi is awesome. Period. We use it for all our backend projects and it provides a good eventing system along the flow of the request. To distinguish both eventing systems we call this approach vertically eventing.

Since we really love to encapsulate business logic into plugins, we often have the requirement to couple them to properly use the provided functionality. Hapi offers 2 namespaces for that. The server.methods and the server.plugins namespace, but to offer more flexibility hapi does not make any assumptions on what functions to put there and it's not really event-driven.

So we decided to adopt the good messaging patterns from Backbone.Events and Backbone.Radio and put it in this plugin. This covers the event-driven communication between loosely coupled plugins and we consider this as horizontally eventing.

## Install

```javascript
npm install hapi-intercom
```

## Usage

With
```javascript
var channel = server.methods.intercom.getChannel()
```
you get a channel object, where you can use the publish/subscribe, request/reply and the command/comply pattern. You can provide a channel name, to seperate the events, otherwise you get the universal channel.

If the channel does not exist, Backbone.Radio will create it for you, so there is no need to check for existence. Just use getChannel and couple your plugins.

## Publish/Subscribe

```javascript
channel.on("someEvent", doSomething)

channel.emit("someEvent")
```

The well-known pattern to inform subscribers that something has happened in an event-driven way.

## Request/Reply

```javascript
channel.reply("giveMeSomething", returnSomethingAwesome)

var promise = channel.request("giveMeSomething")
```
We changed the request/reply api of Backbone.Radio to always return a promise or throw an error, when nothing is returned. So your reply function should return a Promise, otherwise the reply api will wrap it for you.

If there are more than one plugin, which want to reply to one event, the last one registered wins and is the only one replying. 

Use this to acquire a transient ressource, e.g. requesting a connection from a connection pool of your database plugin.

## Command/Comply

```javascript
channel.comply("myCommand", function() {
    //do some work that can be triggered from different handlers/plugins in your app
});

//trigger command execution
channel.command("myCommand");
```
Use this to encapsulate business logic that should be easily accessible everywhere in your app. We use this to easily update a session in our session plugin no matter if triggered from a socket connection or a regular http request.

