tamagoApp.controller("ConfirmDialogController", ConfirmDialogController);

ConfirmDialogController.$inject = ['$scope', 'data', 'callback', '$uibModalInstance'];

function ConfirmDialogController($scope, data, callback, $uibModalInstance) {
  $scope.data = data;
  $scope.callback = callback;

  $scope.okAction = function() {
    $uibModalInstance.close();
    $scope.callback(true, data.extra);
  };

  $scope.cancelAction = function() {
    $uibModalInstance.close();
    $scope.callback(false, data.extra);
  };
}
