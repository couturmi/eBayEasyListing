/**
 * Created by mitchcout on 7/23/2017.
 */
var app = angular.module('easyListing');
app.controller('addPhotoCtrl', ['$scope','$rootScope','$http', '$uibModal', function($scope, $rootScope, $http, $uibModal) {
    /** Global Variables **/
    const PHOTO_UPLOADS_PATH = "/img/temp/photoUploads/";
    const UPLOAD_URL = "http://localhost:8080/upload";

    $scope.$parent.currentListing.photoList = [];

    /** Form functions **/
    /* Add photo to listing */
    $scope.addPhoto = function(){
        //get file information from input
        var tempPhotoFile = document.getElementById("addPhotoInput"+"-tab"+$rootScope.currentTab).files[0];
        if($scope.$parent.currentListing.photoList.includes(PHOTO_UPLOADS_PATH + tempPhotoFile.name)){
            alert("Noooope! \nYou already added a file with the same name.");
            return;
        }

        // upload photo to server
        $http({
            method: 'POST',
            url: UPLOAD_URL,
            headers: {'Content-Type': undefined},
            data: {
                addPhoto: tempPhotoFile
            },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });
                return formData;
            }
        })
        .success(function (data) {
            // add name of file to list
            $scope.$parent.currentListing.photoList.push(PHOTO_UPLOADS_PATH + tempPhotoFile.name);
        })
        .error(function (data, status) {
            console.log("ERROR: failure uploading photo");
        });
    }

    /* Opens modal to confirm photo deletion */
    $scope.confirmPhotoDelete = function(photo) {
        let header = "Delete Photo";
        let message = "Are you sure you want to delete this photo?";
        let confirmMessage = "Delete";
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'html/modals/confirmationModal.html',
            controller: 'confirmationModalCtrl',
            resolve: {
                header: function() {
                    return header;
                },
                message: function() {
                    return message;
                },
                confirmMessage: function() {
                    return confirmMessage;
                }
            }
        });

        modalInstance.result.then(function (deletePhoto) {
            //remove photo if modal returns true
            if(deletePhoto == true) {
                let index = $scope.$parent.currentListing.photoList.indexOf(photo);
                if(index > -1){
                    $scope.$parent.currentListing.photoList.splice(index, 1);
                }
            }
        }, function () {
        });
    };
}]);