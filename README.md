# webRTC-demo

1. Serve files w/ a php server. For local use:

``` bash
php -S localhost:5000
```

2. Open a first client (for local use: `http://localhost:5000`) and in the console, type

``` javascript
const rtcClient1 = window.initRTC('some-id-1')
rtcClient1.startHosting('some-id-2')
```

3. open a second client and in the console, type

``` javascript
const rtcClient2 = window.initRTC('some-id-2')
rtcClient2.startHosting('some-id-1')
```

The order of operations shouldn't matter.
