angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.service('mapService', function(){
  return {
    setupMarker: function setupMarker(clickEvent, map, icon){
      var position = clickEvent, markerOptions;

      if(clickEvent.latLng){
        position = {
          lat: clickEvent.latLng.lat(),
          lng: clickEvent.latLng.lng(),
        };
      }

      if(typeof clickEvent.lat == "function"){
        position = {
          lat: clickEvent.lat(),
          lng: clickEvent.lng()
        };
      }

      if(clickEvent.coords){
        position = {
          lat: clickEvent.coords.latitude,
          lng: clickEvent.coords.longitude
        };
      }

      if(clickEvent.latitude){
        position = {
          lat: parseFloat(clickEvent.latitude),
          lng: parseFloat(clickEvent.longitude)
        };
      }

      markerOptions = {
        map: map,
        title: new Date().toString(),
        position: position
      };

      if(icon) markerOptions.icon = {url: icon};

      return markerOptions
    }
  }

});
