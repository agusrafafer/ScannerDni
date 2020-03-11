angular.module('app.controllers', [])

        .controller('ingresoCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$document', '$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $ionicLoading, $ionicPopup, $document, $window) {

                $scope.var = {
                    textoLeido: '',
                    formatoLeido: '',
                    contenidoCsv: 'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA NACIM;FECHA EMISION DNI\n',
                    csvFile: null
                };

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
                                    preferFrontCamera: false, // iOS and Android
                                    showFlipCameraButton: true, // iOS and Android
                                    showTorchButton: true, // iOS and Android
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


                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, 1024*1024, function (dir) {
                        $ionicLoading.hide();
                        //alert("got main dir: " + JSON.stringify(dir));
                        dir.getFile("logScanner.txt", {create: true}, function (file) {
                            alert("got the file: " + JSON.stringify(file));
                            $scope.var.csvFile = file;
//                            writeLog("App started");
//                            $ionicLoading.hide();  
                            $scope.var.csvFile.createWriter(function (fileWriter) {

                                fileWriter.seek(fileWriter.length);
                                $scope.var.contenidoCsv += $scope.var.textoLeido + '\n';
                                
                                var blob = new Blob([$scope.var.contenidoCsv], {type: 'text/plain'});
                                fileWriter.write(blob);
                                alert("ok, in theory i worked");
                            }, function(error) {
                                alert(error.toString());
                            });
                        });
                    });

//                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
//
//                        //console.log('file system open: ' + fs.name);
//                        fs.root.getFile("listado.csv", {create: true, exclusive: false}, function (fileEntry) {
//
//                            alert("fileEntry is file?" + fileEntry.isFile.toString());
//                            // fileEntry.name == 'someFile.txt'
//                            // fileEntry.fullPath == '/someFile.txt'
//                            fileEntry.createWriter(function (fileWriter) {
//
//                                fileWriter.onwriteend = function () {
//                                    $ionicLoading.hide();
//                                    $ionicPopup.alert({
//                                        title: 'Info',
//                                        template: 'Archivo creado con exito'
//                                    });
//                                    //readFile(fileEntry);
//
//                                };
//
//                                fileWriter.onerror = function (e) {
//                                    $ionicLoading.hide();
//                                    $ionicPopup.alert({
//                                        title: 'Info',
//                                        template: 'Error: ' + e.toString()
//                                    });
//                                };
//
//                                // If data object is not passed in,
//                                // create a new Blob instead.
//                                $scope.var.contenidoCsv += $scope.var.textoLeido + '\n';
////                                if (!dataObj) {
//                                let dataObj = new Blob($scope.var.contenidoCsv, {type: 'text/plain'});
////                                }
//
//                                fileWriter.write(dataObj);
//                            });
//
//                        }, function (errorCreateFile) {
//                            $ionicLoading.hide();
//                            $ionicPopup.alert({
//                                title: 'Info',
//                                template: errorCreateFile.toString()
//                            });
//                        });
//                    }, function (errorLoadFs) {
//                        $ionicLoading.hide();
//                        $ionicPopup.alert({
//                            title: 'Info',
//                            template: errorLoadFs.toString()
//                        });
//                    });
                    $ionicLoading.hide();

//                    try {
////                        if ($scope.var.textoLeido.length <= 0) {
////                            $ionicLoading.hide();
////                            return;
////                        }
//
//                        let today = new Date();
//                        let dd = today.getDate();
//
//                        let mm = today.getMonth() + 1;
//                        let yyyy = today.getFullYear();
//                        if (dd < 10)
//                        {
//                            dd = '0' + dd;
//                        }
//
//                        if (mm < 10)
//                        {
//                            mm = '0' + mm;
//                        }
//                        today = dd + '-' + mm + '-' + yyyy;
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
 