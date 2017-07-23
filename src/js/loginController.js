/**
 * Created by mitchcout on 5/14/2017.
 */
var app = angular.module('easyListing');
app.controller('loginCtrl', ['$scope', function($scope) {

    $scope.openLoginModal = function() {
        var modal = document.getElementById('loginModal');
        modal.style.display = "block";
    };

    $scope.closeLoginModal = function() {
        var modal = document.getElementById('loginModal');
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the login modal, close it
    window.onclick = function(event) {
        var modal = document.getElementById('loginModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}]);