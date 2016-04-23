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

.controller('DeployCtrl', function($scope, mapService, $http, $ionicLoading) {
  $scope.pots = [];
  $scope.waitingForLocation = true;

  $scope.deployment = {
    name: new Date().getMonth() + "/" + new Date().getDate() + "/" + new Date().getFullYear(),
    count: 1,
    loss_count: 0,
    loss_public: false,
    state: "deployed"
  };

  $scope.submitDeployment = function(pot){
    $ionicLoading.show({
      template: 'Saving information...'
    });

    console.log(pot);
    $scope.deployment.name += pot.id;
    $scope.deployment.pot = pot.id;

    console.log($scope.deployment);

    $http.post('http://localhost:8000/deployments/', $scope.deployment).then(function(response){
      console.log(response);
      $ionicLoading.hide();
    })
  };

  function init() {
    $ionicLoading.show({
      template: 'Loading information...'
    });
    $http({
      method: 'GET',
      url: 'http://localhost:8000/pots/'
    }).then(function (res) {
      var i,
      arr = [],
      data = res.data;

      if (data) {
        $scope.pots = data;
      }

      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var markerOptions = mapService.setupMarker(position, map);

        position = {
          lat: pos.lat(),
          lng: pos.lng()
        };

        map.setCenter(pos);
        $scope.newMarker = new google.maps.Marker(markerOptions);

        $scope.waitingForLocation = false;
        $ionicLoading.hide();

        $scope.$apply();
      });
    });
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
    // a.name = !a.name ? "Pot" : a.name;
    // a.size = a.size == "lg" ? "Large" : "Small";
    // a.buoy = "./img/buoy.jpg";
    // a.state = a.state.charAt(0).toUpperCase() + a.state.slice(1);
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
