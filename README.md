# Couple Hapi Plugins horizontally

Hapi is awesome. Period. We use it for all our backend projects and it provides a good eventing system along the flow of the request. To distinguish both eventing systems we call this approach vertically eventing.

Since we really love to encapsulate business logic into plugins, we often have the requirement to couple them to properly use the provided functionality. Hapi offers 2 namespaces for that. The server.methods and the server.plugins namespace, but to offer more flexibility hapi does not make any assumptions on what functions to put there and it's not really event-driven.

So we decided to adopt the good messaging patterns from Backbone.Events and Backbone.Radio and put it in this plugin.

## Install

```javascript
npm install hapi-intercom
```

## Usage

With
```javascript
var channel = server.methods.intercom.getChannel()
```
you get a channel object, where you can use the publish/subscribe pattern and the request/reply pattern. You can provide a channel name, to seperate the events, otherwise you get the universal channel.

## Publish/Subscribe

```javascript
channel.on("someEvent", doSomething)

channel.trigger("someEvent")

```

## Request/Reply

```javascript
channel.reply("giveMeSomething", returnSomethingAwesome)

var promise = channel.request("giveMeSomething")

```
We also changed the request/reply api of Backbone.Radio to always return a promise or throw an error, when nothing is returned. So your reply function should return a Promise, otherwise the reply api will wrap it for you.

## Command/Comply

We decided to strip out the command pattern. It's awesome in a stateful frontend app, but useless in a stateless backend, since you don't have stateful singletons, that need keep track on the state of your app.


