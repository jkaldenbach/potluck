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

.controller('DeployCtrl', function($scope) {

})

.controller('AccountCtrl', function($scope, $ionicModal) {

  // VARIABLES //

  $scope.user = {
    name: "Ishmael",
    password: "*******"
  };

  $scope.pots = [
    {
      name: "Pot1",
      color: "Red",
      size: "Large",
      state: "Deployed"
    },
    {
      name: "Pot2",
      color: "Blue",
      size: "Small",
      state: "Lost"
    },
    {
      name: "Pot3",
      color: "Red",
      size: "Large",
      state: "Collected"
    }
  ];

  // SCOPE FUNCTIONS //

  $scope.potForm = false;

  $scope.createPot = function() {
    $scope.modal.show();
  };

  $scope.deletePot = function(index) {
    $scope.pots.splice(index, 1);
  };

  $scope.savePot = function(a) {
    // By DEFAULT, Deployed State //
    a.state = "Deployed";
    $scope.pots.push(a);
    $scope.modal.hide();
  };

  // IONIC MODAL //

  $ionicModal.fromTemplateUrl('templates/newPotModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
});
