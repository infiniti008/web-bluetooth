var myDevice;
var autoReconnect = false;

document.getElementById('autoReconnect').addEventListener('click', (event) => {
    console.log(event.target.checked)
    autoReconnect = event.target.checked;
})

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
        }],
        optionalServices: optionalServices
    })
    .then(function(device) {
        myDevice = device;
        console.log(device);
        device.addEventListener('gattserverdisconnected', onDisconnected);

        device.gatt.connect()
            .then(startServer)
            .catch(err => {
                console.log('Faild to connetc GATT')
                console.log(err)
        })
  })
}



  function startServer(server) {
    console.log(1);
    // get the primary service:
    server.getPrimaryService(servicesList.unknown.id)
      .then(function(service) {
        console.log(2);
        // get the  characteristic:
        return service.getCharacteristic(servicesList.unknown.currTime);
      })


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

//         console.log(`${hours}:${minuts}:${seconds}`);

        writeTime(hours, minuts, seconds)
      })
    }, 1000)
  })
  .catch(function(error) {
    // catch any errors:
    console.error('Connection failed!', error);
  });
}


function reconnect(){
    myDevice.gatt.connect()
        .then(startServer)
        .catch(err => {
            console.log('Faild to connetc GATT')
            console.log(err)
        })
}

function onDisconnected(event) {
    let device = event.target;
    console.log('Device ' + device.name + ' is disconnected.');
    clearInterval(intervalId);

    if(autoReconnect){
        device.gatt.connect()
            .then(startServer)
            .catch(err => {
                console.log('Faild to connetc GATT')
                console.log(err)
            })
    }
}

function writeTime (h, m, s){
  document.getElementById('hh').innerHTML = h;
  document.getElementById('mm').innerHTML = m;
  document.getElementById('ss').innerHTML = s;
}



if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
    });
}
