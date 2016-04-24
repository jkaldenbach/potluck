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


.controller('ReportCtrl', function($scope, $state, $http) {
  $scope.check = false;

  $scope.submitReport = function(index) {
    var deployment = $scope.deployments[index];
    deployment.state = "Lost";
    $http.put('http://localhost:8000/deployments/' + deployment.id + '/', deployment);
    $scope.deployments.splice(index, 1);
    $scope.check = $scope.deployments.length ? true : false;
  };

  function getRange() {
    angular.forEach($scope.deployments, function(a) {
      var int = parseInt(a.count);
      range = [];
      for (var i=1; i<int+1; i++) {
        range.push(i);
      }
      a.range = range;
    });
  }

  $http.get('http://localhost:8000/deployments')
  .then(function(res) {
    $scope.deployments = res.data.filter(function(dep) {
      return dep.state === 'Deployed';
    });
    $scope.check = $scope.deployments.length ? true : false;
  })
  .then(getRange);
})

/*******************************************************************/
/*******************************************************************/


.controller('RetrieveCtrl', function($scope, $state, $http) {
  $scope.check = false;

  function getRange() {
    angular.forEach($scope.deployments, function(a) {
      var int = parseInt(a.count);
      range = [];
      for (var i=1; i<int+1; i++) {
        range.push(i);
      }
      a.range = range;
    });
  }

  $http.get('http://localhost:8000/deployments')
  .then(function(res) {
    $scope.deployments = res.data.filter(function(dep) {
      return dep.state !== 'Collected';
    });
    $scope.check = $scope.deployments.length ? true : false;
  })
  .then(getRange);

  $scope.predictPot = function(deployment) {
    $state.go('tab.predict', {pot: deployment})
  };

  $scope.retrievePot = function(index) {
    var deployment = $scope.deployments[index];
    deployment.state = "Collected";
    $http.put('http://localhost:8000/deployments/' + deployment.id + '/', deployment);
    $scope.deployments.splice(index, 1);
    $scope.check = $scope.deployments.length ? true : false;
  };
})

/*******************************************************************/
/*******************************************************************/


.controller('PredictCtrl', function($scope, $state) {
  $scope.pot = $state.params.pot;
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
    state: "Deployed",
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

        console.log($scope.deployment);

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
  };

  function resetDeployment(){
    $scope.deployment = {
      name: new Date().getMonth() + "/" + new Date().getDate() + "/" + new Date().getFullYear(),
      count: 1,
      loss_count: 0,
      loss_public: false,
      state: "Deployed"
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
      lat: 33,
      lng: -80
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

  function showDeploymentModal(deployment){
    $ionicPopup.show({
      template: 'Latitude: ' + deployment.latitude +
      "\n Longitude: " + deployment.longitude +
      "\n Pot: " + (deployment.pot ? deployment.pot.name : "No Pot Defined") +
      "<br> Status: " + deployment.state,
      title: 'Deployment '+deployment.id,
      scope: $scope,
      buttons: [
        {
          text: 'Cancel',
          type: 'button-default'
        },
        {
          text: 'Report',
          type: 'button-assertive',
          onTap: function() {
            $http.patch('http://localhost:8000/deployments/' + deployment.id + '/', {id: deployment.id, state: "Lost"}).then(function(){
              location.reload();
            });
          }
        },
        {
          text: 'Retrieve',
          type: 'button-energized',
          onTap: function(){
            $http.patch('http://localhost:8000/deployments/' + deployment.id + '/', {id: deployment.id, state: "Collected"}).then(function(){
              location.reload();
            });
          }
        }
      ]
    });
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
      $http({
        method: 'GET',
        url: 'http://localhost:8000/deployments/'
      }).then(function(response){
        if(response.data){
          $scope.deployments = response.data;

          $scope.deployments.forEach(function(deployment){
            var icon;
            switch(deployment.state){
              case "Deployed":
                icon = "http://maps.google.com/mapfiles/kml/paddle/grn-circle-lv.png";
                break;
              case "Lost":
                icon = "http://maps.google.com/mapfiles/kml/paddle/red-circle-lv.png";
                break;
              default:
                icon = "";
            }
            if(icon){
              var markerOptions = mapService.setupMarker(deployment, map, icon);

              deployment.marker = new google.maps.Marker(markerOptions);

              google.maps.event.addListener(deployment.marker, 'click', function(event){
                showDeploymentModal(deployment);
              });
            }
          });

          navigator.geolocation.getCurrentPosition(function(position) {
            position = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var markerOptions = mapService.setupMarker(position, map, "http://maps.google.com/mapfiles/kml/paddle/blu-circle-lv.png");
            $scope.currentLocationMarker = new google.maps.Marker(markerOptions);
            $scope.currentLocationMarker.setZIndex(0);

            google.maps.event.addListener($scope.currentLocationMarker, 'click', function(event){
              $ionicPopup.alert({
                title: 'Current Location',
                template: 'This is your current location'
              });
            });

            map.setCenter(position);

            $scope.waitingForLocation = false;
            $ionicLoading.hide();

            $scope.$apply();
          });
        }
      });
    });
  }

  var mapOptions = {
    center: {
      lat: 33,
      lng: -80
    },
    zoom: 8
  },
  map = new google.maps.Map(document.getElementById("gmap-pot-map"), mapOptions),
  processing = false;

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

  $scope.savePot = function(pot) {
    $http({
      method: 'POST',
      url: 'http://localhost:8000/pots/',
      data: pot
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
