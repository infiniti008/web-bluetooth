var myDevice;

var intervalId;

var servicesList = {
  genericAccess : {
    id : '00001800-0000-1000-8000-00805F9B34FB',
    deviceName : '00002A00-0000-1000-8000-00805F9B34FB'
  },
  deviceInfo : {
    id : '0000180A-0000-1000-8000-00805F9B34FB',
    softwareVersion : '00002A28-0000-1000-8000-00805F9B34FB'
  },
  imediateAlert : {
    id : '00001802-0000-1000-8000-00805F9B34FB',
    alertLevel : '00002A06-0000-1000-8000-00805F9B34FB'
  },
  unknown : {
    id : '0000FEE0-0000-1000-8000-00805F9B34FB',
    currTime : '00002A2B-0000-1000-8000-00805F9B34FB'
  }
}     

var optionalServices = [];

for (const service in servicesList) {
  for (const cahr in servicesList[service]) {

    servicesList[service][cahr] = servicesList[service][cahr].toLowerCase();
 
    optionalServices.push(servicesList[service][cahr]);
  }
}

console.log(optionalServices)

function test(){
  navigator.bluetooth.requestDevice({
    filters: [{
      name : "Mi Band 3"
    }],       // you can't use filters and acceptAllDevices together
    optionalServices: optionalServices
  })
  .then(function(device) {
    // save the device returned so you can disconnect later:
    myDevice = device;
    console.log(device);
    device.addEventListener('gattserverdisconnected', onDisconnected);
    // connect to the device once you find it:
    return device.gatt.connect();
  })
  .then(function(server) {
    console.log(1);
    // get the primary service:
    return server.getPrimaryService(servicesList.unknown.id);
  })
  .then(function(service) {
    console.log(2);
    // get the  characteristic:
    return service.getCharacteristic(servicesList.unknown.currTime);
  })
  // .then(function(characteristics) {
  //   // subscribe to the characteristic:
  //   for (c in characteristics) {
  //     characteristics[c].startNotifications()
  //     .then(subscribeToChanges);
  //   }
  // })

  .then(characteristics => {
    console.log(3)
    console.log(characteristics)

    intervalId = setInterval(function(){
    characteristics.readValue()
      .then(val => {
        // console.log(val.buffer)
        var enc = new TextDecoder
        var hours = new DataView(val.buffer.slice(4, 5), 0).getInt8(0)
        var minuts = new DataView(val.buffer.slice(5, 6), 0).getInt8(0)
        var seconds = new DataView(val.buffer.slice(6, 7), 0).getInt8(0)

        console.log(`${hours}:${minuts}:${seconds}`);

        writeTime(hours, minuts, seconds)
      })
    }, 1000)
  })
  .catch(function(error) {
    // catch any errors:
    console.error('Connection failed!', error);
  });
}

function onDisconnected(event) {
  let device = event.target;
  console.log('Device ' + device.name + ' is disconnected.');
  clearInterval(intervalId)
}

function writeTime (h, m, s){
  document.getElementById('hh').innerHTML = h;
  document.getElementById('mm').innerHTML = m;
  document.getElementById('ss').innerHTML = s;
}