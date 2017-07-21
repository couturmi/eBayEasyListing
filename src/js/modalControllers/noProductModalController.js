/**
 * Created by mitchcout on 7/19/2017.
 */
angular.module('easyListing').controller('noProductModalCtrl', function ($scope, $uibModalInstance) {

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    }
});