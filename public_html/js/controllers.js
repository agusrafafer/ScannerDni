angular.module('app.controllers', [])

        .controller('ingresoCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $ionicLoading, $ionicPopup, $window) {

                $scope.var = {
                    textoLeido = '',
                    formatoLeido = ''
                };

                $scope.abrirEscaner = function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    cordova.plugins.barcodeScanner.scan(
                            function (result) {
                                $ionicLoading.hide();
                                $scope.var.textoLeido = result.text;
                                $scope.var.textoLeido = result.format;

                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Escaneo exitoso: \n' +
                                            'Resultado: ' + $scope.var.textoLeido + "\n" +
                                            'Formato: ' + $scope.var.textoLeido + "\n" +
                                            'Cancelado: ' + result.cancelled
                                });
                            },
                            function (error) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Fallo el escaner: ' + error
                                });
                            },
                            {
                                preferFrontCamera: false, // iOS and Android
                                showFlipCameraButton: true, // iOS and Android
                                showTorchButton: true, // iOS and Android
                                torchOn: true, // Android, launch with the torch switched on (if available)
                                saveHistory: true, // Android, save scan history (default false)
                                prompt: "Por favor acerque el DNI a la camara para realizar el escaneo", // Android
                                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                                formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                                orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                                disableAnimations: true, // iOS
                                disableSuccessBeep: false // iOS and Android
                            }
                    );


                };


                $scope.descargarArchivo = function () {
//                    $ionicPopup.alert({
//                        title: 'Info',
//                        template: 'Proximamente!'
//                    });


                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    if ($scope.var.textoLeido.length <= 0) {
                        return;
                    }
                    
                    let contenidoCsv = 'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA NACIM;FECHA EMISION DNI\n';
                    $scope.var.textoLeido = $scope.var.textoLeido.replace(/@/g, ';');
                    contenidoCsv += $scope.var.textoLeido + '\n';
                    

                    var filename = 'listados-dnis.csv';
                    var contentType = 'text/plain';

                    var linkElement = document.createElement('a');
                    try {
                        var blob = new Blob([$scope.var.textoLeido], {type: contentType});
                        var url = $window.URL.createObjectURL(blob);

                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", filename);

                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(clickEvent);
                    } catch (ex) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: '<b>Tuvimos un inconveniente: </b>' + ex
                        });
                    }
                    $ionicLoading.hide();
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
 