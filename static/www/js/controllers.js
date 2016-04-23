angular.module('starter.controllers', ['ui.router'])

.controller('DashCtrl', function($scope, $state) {
  $scope.deploy = function() {
    $state.go('tab.deploy');
  };

  $scope.check = function() {
    $state.go('check');
  };

  $scope.claim = function() {
    $state.go('claim');
  };

})

.controller('DeployCtrl', function($scope, mapService, $http) {
  $scope.pots = [];

  function init() {
    $http({
      method: 'GET',
      url: 'http://localhost:8000/pots/'
    }).then(function (res) {
      var i,
      arr = [],
      data = res.data,
      len = res.data.length;

      if (data) {
        arr = data.filter(prepPots);
        $scope.pots = arr;
      }
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            markerOptions = mapService.setupMarker(event, map),
            position = {
              lat: pos.k,
              lng: pos.B
            },
            markerOptions = mapService.setupMarker(event, map);

        console.log(pos);
        $scope.map.setCenter(pos);
        $scope.newMarker = new google.maps.Marker(markerOptions);
      });
    });
  }

  function prepPots(a) {
    a.name = !a.name ? "Pot" : a.name;
    a.state = a.state.charAt(0).toUpperCase() + a.state.slice(1);
    return a;
  }

  var mapOptions = {
    center: {
      lat: 45,
      lng: -73
    },
    zoom: 8
  },
  map = new google.maps.Map(document.getElementById("gmap-deploy"), mapOptions),
  processing = false;

  // google.maps.event.addListener(map, 'bounds_changed', function(){
  //   if(!processing){
  //     processing = true;
  //     setTimeout(function(){
  //       processing = false;
  //     }, 250);
  //   }
  // });
  google.maps.event.addListener(map, 'click', function(event){
    var markerOptions = mapService.setupMarker(event, map);

    if($scope.newMarker){
      $scope.newMarker.setPosition(markerOptions.position)
    }
    else{
      $scope.newMarker = new google.maps.Marker(markerOptions);
    }
  });

  init();

})

.controller('AccountCtrl', function($scope, $http, $ionicModal) {

  // VARIABLES //

  $scope.pots = [];
  $scope.newPot = {};

  $scope.colors = [
    {value: "Red", code: "red"},
    {value: "Yellow", code: "ylw"},
    {value: "Green", code: "grn"},
    {value: "Blue", code: "blu"},
    {value: "Purple", code: "prp"},
    {value: "White", code: "wht"},
    {value: "Black", code: "blk"}
  ];

  $scope.placements = [
    {value: "Threaded", code: "thd"},
    {value: "Banded", code: "bnd"}
  ];

  $scope.types = [
    {value: "Lobster"},
    {value: "Bass"},
    {value: "Crab"},
    {value: "Eel"}
  ];

  $scope.user = {
    name: "Ishmael",
    password: "*******",
    license: "SC-1044D",
    image: function() {
      var img = new Image();
      img.src = "www/img/buoy.jpg";
      return img;
    }
  };

  // FUNCTIONS //

  function init() {
    $http({
      method: 'GET',
      url: 'http://localhost:8000/pots/'
    }).then(function(res) {
      var i,
      arr = [],
      data = res.data,
      len = res.data.length;

      if (data) {
        arr = data.filter(prepPots);
        $scope.pots = arr;
      }
    });
  }

  function prepPots(a) {
    a.name = !a.name ? "Pot" : a.name;
    a.size = a.size == "lg" ? "Large" : "Small";
    a.buoy = "./img/buoy.jpg";
    a.state = a.state.charAt(0).toUpperCase() + a.state.slice(1);
    return a;
  }

  // SCOPE FUNCTIONS //

  $scope.potForm = false;

  $scope.createPot = function() {
    $scope.modal.show();
  };

  $scope.deletePot = function(index) {
    $scope.pots.splice(index, 1);
  };

  $scope.savePot = function(a) {
    a.size = a.size.code;
    a.state = "deployed";

    $http({
      method: 'POST',
      url: 'http://localhost:8000/pots/',
      data: {pot:a}
    }).then(function (res) {
      console.log(res);
    });

    $scope.modal.hide();
  };

  $scope.buttonCheck = function() {
    if ($scope.newPot.name && $scope.newPot.color && $scope.newPot.size) {
      return false;
    } else {
      return true;
    }
  };

  // IONIC MODAL //

  $ionicModal.fromTemplateUrl('templates/newPotModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // INIT //
  init();

});
