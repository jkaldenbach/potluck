angular.module('starter.controllers', ['ui.router'])

/*******************************************************************/
/*******************************************************************/


.controller('DashCtrl', function($scope, $state) {
  $scope.deploy = function() {
    $state.go('tab.deploy');
  };

  $scope.map = function() {
    $state.go('tab.potMap');
  };

  $scope.report = function() {
    $state.go('tab.report');
  };

  $scope.retrieve = function() {
    $state.go('tab.retrieve');
  };

})

/*******************************************************************/
/*******************************************************************/


.controller('ReportCtrl', function($scope, $state) {
  $scope.deployments = [
    {name: "Pot1", state: "Lost", count: "10", lost_count: ""},
    {name: "Pot2", state: "Lost", count: "10", lost_count: ""},
    {name: "Pot3", state: "Lost", count: "10", lost_count: ""}
  ];


})

/*******************************************************************/
/*******************************************************************/


.controller('DeployCtrl', function($scope, mapService, $http, $ionicLoading, $ionicPopup) {
  $scope.pots = [];
  $scope.waitingForLocation = true;

  $scope.deployment = {
    name: new Date().getMonth() + "/" + new Date().getDate() + "/" + new Date().getFullYear(),
    count: 1,
    loss_count: 0,
    loss_public: false,
    state: "deployed",
    locations: []
  };

  $scope.submitDeployment = function(pot){
    $ionicPopup.confirm({
      title: 'Confirmation',
      template: 'You are about to deploy'
    }).then(function(res) {
      if(res){
        $scope.deployment.name += pot.id;
        $scope.deployment.pot = pot.id;

        $scope.deployment.latitude = $scope.newMarker.position.lat();
        $scope.deployment.longitude = $scope.newMarker.position.lng();

        $http.post('http://localhost:8000/deployments/', $scope.deployment).then(function(response){
          console.log(response);
          $ionicLoading.hide();
          resetDeployment();
        });
      }
      else{
        resetDeployment();
      }
    });

    // $scope.deployment.name += pot.id;
    // $scope.deployment.pot = pot.id;
    //
    // $http.post('http://localhost:8000/deployments/', $scope.deployment).then(function(response){
    //   $ionicLoading.hide();
    // });
  };

  function resetDeployment(){
    $scope.deployment = {
      name: new Date().getMonth() + "/" + new Date().getDate() + "/" + new Date().getFullYear(),
      count: 1,
      loss_count: 0,
      loss_public: false,
      state: "deployed"
    };
  }

  function init(){
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
      $scope.newMarker.setPosition(markerOptions.position);
    }
    else{
      $scope.newMarker = new google.maps.Marker(markerOptions);
    }
  });

  init();

})

/*******************************************************************/
/*******************************************************************/

.controller('PotMapCtrl', function($scope, mapService, $http, $ionicLoading, $ionicPopup){
  $scope.pots = [];
  $scope.waitingForLocation = true;

  $scope.deployment = {
    name: new Date().getMonth() + "/" + new Date().getDate() + "/" + new Date().getFullYear(),
    count: 1,
    loss_count: 0,
    loss_public: false,
    state: "deployed",
    locations: []
  };

  $scope.submitDeployment = function(pot){
    $ionicPopup.confirm({
      title: 'Confirmation',
      template: 'You are about to deploy'
    }).then(function(res) {
      if(res){
        $scope.deployment.name += pot.id;
        $scope.deployment.pot = pot.id;
        $scope.deployment.locations.push({

        });
        $http.post('http://localhost:8000/deployments/', $scope.deployment).then(function(response){
          console.log(response);
          $ionicLoading.hide();
          resetDeployment();
        });
      }
      else{
        resetDeployment();
      }
    });

    $scope.deployment.name += pot.id;
    $scope.deployment.pot = pot.id;

    $http.post('http://localhost:8000/deployments/', $scope.deployment).then(function(response){
      $ionicLoading.hide();
    });
  };

  function resetDeployment(){
    $scope.deployment = {
      name: new Date().getMonth() + "/" + new Date().getDate() + "/" + new Date().getFullYear(),
      count: 1,
      loss_count: 0,
      loss_public: false,
      state: "deployed"
    };
  }

  function init(){
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
      $scope.newMarker.setPosition(markerOptions.position);
    }
    else{
      $scope.newMarker = new google.maps.Marker(markerOptions);
    }
  });

  init();
})

/*******************************************************************/
/*******************************************************************/

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
        $scope.pots = data;
      }
    });

    $http({
      method: 'GET',
      url: 'http://localhost:8000/fishers/1'
    }).then(function(fisher) {
      $scope.user = fisher.data;
      $scope.user.password = '********';
      $scope.user.image = function() {
        var img = new Image();
        img.src = $scope.fisher.image_url;
        return img;
      };
    });
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
    if ($scope.newPot.name && $scope.newPot.type && $scope.newPot.base && $scope.newPot.contrast && $scope.newPot.placement && $scope.newPot.top && $scope.newPot.middle && $scope.newPot.bottom) {
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
