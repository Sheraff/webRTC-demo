# webRTC-demo

1. Serve files w/ a php server. For local use:

``` bash
php -S localhost:5000
```

2. Open a first client

``` javascript
const rtcClient1 = new RTCPeer('some-id-1')
rtcClient1.startHosting('some-id-2')
```

3. open a second client

``` javascript
const rtcClient2 = new RTCPeer('some-id-2')
rtcClient2.joinHost('some-id-1')
```

The order of operations shouldn't matter.

----

You can also do everything in the same client but it's less fun

``` javascript
const rtcClient1 = new RTCPeer('some-id-1')
const rtcClient2 = new RTCPeer('some-id-2')
rtcClient1.startHosting('some-id-2')
rtcClient2.joinHost('some-id-1')
```
