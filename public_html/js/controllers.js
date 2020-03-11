angular.module('app.controllers', [])

        .controller('ingresoCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$document', '$window', '$ionicPlatform', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $ionicLoading, $ionicPopup, $document, $window, $ionicPlatform) {

                $scope.var = {
                    textoLeido: '',
                    formatoLeido: '',
                    contenidoCsv: 'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA NACIM;FECHA EMISION DNI\n'
                };


                $ionicPlatform.ready(function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fs.root.getFile("listado.csv", {create: false, exclusive: false}, function (fileEntry) {

                            fileEntry.file(function (file) {
                                var reader = new FileReader();

                                reader.onloadend = function () {
                                    $ionicLoading.hide();
                                    $scope.var.contenidoCsv = this.result;
                                };

                                reader.readAsText(file);

                            }, function (errorReadFile) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: errorReadFile.toString()
                                });
                            });
                        }, function (errorCreateFile) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Info',
                                template: errorCreateFile.toString()
                            });
                        });
                    }, function (errorLoadFs) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: errorLoadFs.toString()
                        });
                    });
                    $ionicLoading.hide();
                });

                $scope.abrirEscaner = function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    try {
                        cordova.plugins.barcodeScanner.scan(
                                function (result) {
                                    $ionicLoading.hide();
                                    $scope.var.textoLeido = result.text;
                                    $scope.var.formatoLeido = result.format;
                                    $scope.var.textoLeido = $scope.var.textoLeido.replace(/@/g, ';');

                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: 'Escaneo exitoso: \n' +
                                                'Resultado: ' + $scope.var.textoLeido + "\n" +
                                                'Formato: ' + $scope.var.formatoLeido + "\n" +
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
                                    preferFrontCamera: false, // iOS y Android
                                    showFlipCameraButton: true, // iOS y Android
                                    showTorchButton: true, // iOS y Android
                                    torchOn: true, // Android, launch with the torch switched on (if available)
                                    saveHistory: true, // Android, save scan history (default false)
                                    prompt: "Por favor acerque el DNI a la camara para realizar el escaneo", // Android
                                    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                                    formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                                    orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                                    disableAnimations: true, // iOS
                                    disableSuccessBeep: false // iOS and Android
                                }
                        );
                    } catch (ex) {
                        $ionicLoading.hide();
                    }
                };


                $scope.descargarArchivo = function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fs.root.getFile("listado.csv", {create: true, exclusive: false}, function (fileEntry) {
                            // fileEntry.name == 'someFile.txt'
                            // fileEntry.fullPath == '/someFile.txt'
                            fileEntry.createWriter(function (fileWriter) {

                                fileWriter.onwriteend = function () {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: 'Archivo creado con exito en: ' + fileEntry.fullPath + '/' + fileEntry.name
                                    });
                                    //readFile(fileEntry);

                                };

                                fileWriter.onerror = function (e) {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: 'Error: ' + e.toString()
                                    });
                                };

                                // Se crea un blob y luego se guarda el archivo
                                $scope.var.contenidoCsv += $scope.var.textoLeido + '\n';
                                let dataObj = new Blob([$scope.var.contenidoCsv], {type: 'text/plain'});
                                fileWriter.write(dataObj);
                            });

                        }, function (errorCreateFile) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Info',
                                template: errorCreateFile.toString()
                            });
                        });
                    }, function (errorLoadFs) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: errorLoadFs.toString()
                        });
                    });
                    $ionicLoading.hide();

//                    try {
////                        if ($scope.var.textoLeido.length <= 0) {
////                            $ionicLoading.hide();
////                            return;
////                        }


//
//                        let contenidoCsv = 'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA NACIM;FECHA EMISION DNI\n';
//                        contenidoCsv += $scope.var.textoLeido + '\n';
//
//                        let linkDescarga = $document[0].getElementById("lnkDescarga");
//                        linkDescarga.setAttribute("href", 'data:Application/octet-stream,' + encodeURIComponent(contenidoCsv));
//                        linkDescarga.setAttribute("download", 'listado_' + today + '.csv');
//                        let clickEvent = new MouseEvent("click", {
//                            "view": $window,
//                            "bubbles": true,
//                            "cancelable": false
//                        });
//                        linkDescarga.dispatchEvent(clickEvent);
//                        $ionicLoading.hide();
//                    } catch (ex) {
//                        $ionicLoading.hide();
//                        $ionicPopup.alert({
//                            title: 'Info',
//                            template: '<b>Tuvimos un inconveniente: </b>' + ex
//                        });
//                    }
//                    let filename = 'listados-dnis.csv';
//                    let contentType = 'text/plain';
//
//                    let linkElement = document.createElement('a');
//                    try {
//                        let blob = new Blob([$scope.var.textoLeido], {type: contentType});
//                        let url = $window.URL.createObjectURL(blob);
//
//                        linkElement.setAttribute('href', url);
//                        linkElement.setAttribute("download", filename);
//
//                        let clickEvent = new MouseEvent("click", {
//                            "view": window,
//                            "bubbles": true,
//                            "cancelable": false
//                        });
//                        linkElement.dispatchEvent(clickEvent);
//                        $ionicLoading.hide();
//                    } catch (ex) {
//                        $ionicLoading.hide();
//                        $ionicPopup.alert({
//                            title: 'Info',
//                            template: '<b>Tuvimos un inconveniente: </b>' + ex
//                        });
//                    }

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


            }]);
 