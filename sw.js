self.addEventListener('install', function(event) {
    // event.waitUntil(
    //   caches.open('v1').then(function(cache) {
    //     return cache.addAll([
    //       '/sw-test/',
    //       '/sw-test/index.html',
    //       '/sw-test/style.css',
    //       '/sw-test/app.js',
    //       '/sw-test/image-list.js',
    //       '/sw-test/star-wars-logo.jpg',
    //       '/sw-test/gallery/',
    //       '/sw-test/gallery/bountyHunters.jpg',
    //       '/sw-test/gallery/myLittleVader.jpg',
    //       '/sw-test/gallery/snowTroopers.jpg'
    //     ]);
    //   })
    // );


    console.log('INSTALL EVENT')
});

this.addEventListener('activate', function(event) {
    console.log('ACTIVATE EVENT')
});

self.addEventListener('fetch', function(event) {
    
    console.log('FETCH EVENT: ' + event.request.url)

});