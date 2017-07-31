/**
 * Created by mitchcout on 7/27/2017.
 */
var app = angular.module('easyListing');
app.controller('defectsCtrl', ['$scope', function($scope) {
    /** Global Variables **/
    $scope.$parent.selectedDefectList = [];

    /** Form functions **/

    /* Create an object of 'blank'/negative values for all defects to simulate
       objects are unchecked. */
    $scope.$parent.blankSelectedDefectList = function() {
        var defectList = [];
        $scope.$parent.product_defects.forEach(function(defect){
            var tempDefect = {};
            tempDefect.checked = false;
            if(defect.levels != null) {
                tempDefect.level = 0;
            } else {
                tempDefect.level = null;
            }
            var subDefectList = [];
            if(defect.subDefects != null) {
                defect.subDefects.forEach(function () {
                    subDefectList.push(false);
                });
            }
            tempDefect.subDefectList = subDefectList;
            if(defect.subDefectsType == "radio") {
                tempDefect.subDefectsRadioIndex = 0;
            }
            defectList.push(tempDefect);
        });
        $scope.$parent.selectedDefectList = defectList;
    }

    //replace all instances of text in a string
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    //generates a new description based on the current defects selected
    $scope.generateDescription = function(){
        var firstLine = "";
        var lastLine = "";
        var description = "";

        var productType = "product";
        if($scope.$parent.currentListing.title.type != null) {
            productType = $scope.$parent.currentListing.title.type;
            //remove "Apple " from product type
            productType = productType.replace("Apple ", "");
        }

        //get scope variables
        var checkedList = $scope.$parent.selectedDefectList;
        var defectsList = $scope.$parent.product_defects;
        //check which defects are selected and generate description
        for(let i = 0; i < defectsList.length; i++){
            if(checkedList[i].checked){
                //Defect
                description += " " + defectsList[i].longValue;

                //Defect Level
                if(checkedList[i].level != null){
                    if(defectsList[i].levels.length > 0) {
                        description += defectsList[i].levels[checkedList[i].level].longValue;
                    }
                }

                //SubDefects
                let subDefectsList = defectsList[i].subDefects;
                //if checkboxes
                if(checkedList[i].subDefectsRadioIndex == null) {
                    for (let j = 0; j < defectsList[i].subDefects.length; j++) {
                        if (checkedList[i].subDefectList[j]) {
                            description += subDefectsList[j].longValue;
                        }
                    }
                }
                //if radio buttons
                else {
                    description += defectsList[i].subDefects[checkedList[i].subDefectsRadioIndex].longValue;
                }

                //end sentence
                description += ".";
            }
        }
        // add product type to description
        description = description.replaceAll("{{productType}}",productType);
        // if description has been generated, include first statement
        if(description != ""){
            firstLine = "This is for the "+ productType + " only.";
            lastLine = " (See Pictures) If you have any questions please ask."
        }
        $scope.$parent.currentListing.desc = firstLine + description + lastLine;
    }
}]);