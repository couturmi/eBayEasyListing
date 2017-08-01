/**
 * Created by mitchcout on 7/25/2017.
 */
angular.module('easyListing').controller('confirmationModalCtrl', function ($scope, $uibModalInstance, header, message, confirmMessage) {

    //set modal display values
    $scope.header = header;
    $scope.message = message;
    $scope.confirmMessage = confirmMessage;

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.delete = function() {
        $uibModalInstance.close(true);
    }
});
