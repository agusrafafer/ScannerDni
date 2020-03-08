angular.module('app.controllers', [])

        .controller('ingresoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


                $scope.abrirEscaner = function () {
                    cordova.plugins.barcodeScanner.scan(
                            function (result) {
                                alert("Escaneo exitoso: \n" +
                                        "Result: " + result.text + "\n" +
                                        "Format: " + result.format + "\n" +
                                        "Cancelled: " + result.cancelled);
                            },
                            function (error) {
                                alert("Fallo el escaner: " + error);
                            },
                            {
                                preferFrontCamera: true, // iOS and Android
                                showFlipCameraButton: true, // iOS and Android
                                showTorchButton: true, // iOS and Android
                                torchOn: true, // Android, launch with the torch switched on (if available)
                                saveHistory: true, // Android, save scan history (default false)
                                prompt: "Por favor acerque el DNI al area de escaneo", // Android
                                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                                formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                                orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                                disableAnimations: true, // iOS
                                disableSuccessBeep: false // iOS and Android
                            }
                    );
                };

            }])

        .controller('escanearDNICtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            }])

        .controller('enviarCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            }])

        .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            }])
 