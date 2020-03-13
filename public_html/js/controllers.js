angular.module('app.controllers', [])

        .controller('escanerCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$document', '$window', '$ionicPlatform', 'personaFactory',

            function ($scope, $stateParams, $ionicLoading, $ionicPopup, $document, $window, $ionicPlatform, personaFactory) {

                $scope.var = {
                    textoLeido: '',
                    formatoLeido: '',
                    contenidoCsv: 'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA NACIM;FECHA EMISION DNI\n',
                    pathCsv: ''
                };


                $ionicPlatform.ready(function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fs.root.getFile("Download/listado.csv", {create: false, exclusive: false}, function (fileEntry) {
                            $scope.var.pathCsv = fileEntry.fullPath;

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
                
                $scope.getPersonas = function () {
                    return personaFactory.personas;
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

                                    if ($scope.var.textoLeido !== '') {
                                        let vecTextoLeido = $scope.var.textoLeido.split(";");
                                        //'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA NACIM;FECHA EMISION DNI
                                        if (personaFactory.personas.length === 0) {
                                            personaFactory.personas.push({
                                                TRAMITE: vecTextoLeido[0],
                                                APELLIDO: vecTextoLeido[1],
                                                NOMBRE: vecTextoLeido[2],
                                                SEXO: vecTextoLeido[3],
                                                DNI: vecTextoLeido[4],
                                                EJEMPLAR: vecTextoLeido[5],
                                                FECHA_NACIM: vecTextoLeido[6],
                                                FECHA_EMISION_DNI: vecTextoLeido[7]
                                            });
                                        } else {
                                            for (var i = 0; i < personaFactory.personas.length; i++) {
                                                if (personaFactory.personas[i] !== $scope.var.textoLeido) {
                                                    personaFactory.personas.push({
                                                        TRAMITE: vecTextoLeido[0],
                                                        APELLIDO: vecTextoLeido[1],
                                                        NOMBRE: vecTextoLeido[2],
                                                        SEXO: vecTextoLeido[3],
                                                        DNI: vecTextoLeido[4],
                                                        EJEMPLAR: vecTextoLeido[5],
                                                        FECHA_NACIM: vecTextoLeido[6],
                                                        FECHA_EMISION_DNI: vecTextoLeido[7]
                                                    });
                                                }
                                            }
                                        }
                                        //$scope.guardarArchivo(false);

                                        $ionicPopup.alert({
                                            title: 'Info',
                                            template: 'Escaneo exitoso: <br/>' +
                                                    'DNI: ' + vecTextoLeido[4] + "<br/>" +
                                                    'Apellido: ' + vecTextoLeido[1] + "<br/>" +
                                                    'Nombre: ' + vecTextoLeido[2]
                                        });
                                    }

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


                $scope.guardarArchivo = function (mostrarMsjExito) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fs.root.getFile("Download/listado.csv", {create: true, exclusive: false}, function (fileEntry) {
                            // fileEntry.name == 'someFile.txt'
                            // fileEntry.fullPath == '/someFile.txt'
                            $scope.var.pathCsv = fileEntry.fullPath;
                            fileEntry.createWriter(function (fileWriter) {

                                fileWriter.onwriteend = function () {
                                    $ionicLoading.hide();
                                    if (mostrarMsjExito) {
                                        $ionicPopup.alert({
                                            title: 'Info',
                                            template: 'Archivo creado con exito en: ' + fileEntry.fullPath
                                        });
                                    }
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
                };


                $scope.subirArchivo = function () {
                    cordova.plugin.ftp.connect('ftp.agurait.com', 'u542060829.escaner', 'escaner', function (ok) {
                        //alert("ftp: conexion ok=" + ok);
                        cordova.plugin.ftp.upload('/storage/emulated/0/Download/listado.csv', '/listado1.csv', function (percent) {
                            if (percent === 1) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Datos subidos con exito'
                                });
                            } else {
                                $ionicLoading.show({
                                    template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                                });
                                //alert("ftp: upload porcentaje=" + percent * 100 + "%");
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Info',
                                template: "ftp: error en la subida=" + error
                            });
                        });

                    }, function (error) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: "ftp: error en la conexion=" + error
                        });
                    });
                };
            }])

        .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            }]);
 