angular.module('app.controllers', [])

        .controller('escanerCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$document', '$window', '$ionicPlatform', 'personaFactory', '$state', 'sesionFactory',

            function ($scope, $stateParams, $ionicLoading, $ionicPopup, $document, $window, $ionicPlatform, personaFactory, $state, sesionFactory) {

                $scope.var = {
                    textoLeido: '',
                    formatoLeido: '',
                    cabeceraCsv: 'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA_NACIM;FECHA_EMISION_DNI\n',
                    contenidoCsv: '',
                    pathCsv: ''
                };

                $ionicPlatform.ready(function () {
                    sesionFactory.contador = sesionFactory.contador + 1;
                    if ($state.current.name === 'menu.ingreso' && sesionFactory.contador === 1) {
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
                                        //alert(this.result);
                                        //alert(personaFactory.personas.length);
                                        $scope.var.contenidoCsv = this.result;
                                        $scope.csv2Objeto();
                                        //alert(personaFactory.personas.length);
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
                    }
                });

                $scope.getPersonas = function () {
                    return personaFactory.personas;
                };

                $scope.gotoListado = function () {
                    $state.go('menu.listado', {}, {location: "replace"});
                };

                $scope.csv2Objeto = function () {
                    let vecLineas = $scope.var.contenidoCsv.split("\n");
                    for (let i = 1; i < vecLineas.length - 1; i++) {
                        let subVeclinea = vecLineas[i].split(";");
                        let existe = false;
                        for (let j = 0; j < personaFactory.personas.length; j++) {
                            if (personaFactory.personas[j].DNI === "" || personaFactory.personas[j].DNI === subVeclinea[4]) {
                                existe = true;
                                break;
                            }
                        }
                        if (!existe) {
                            personaFactory.personas.push({
                                TRAMITE: subVeclinea[0],
                                APELLIDO: subVeclinea[1],
                                NOMBRE: subVeclinea[2],
                                SEXO: subVeclinea[3],
                                DNI: subVeclinea[4],
                                EJEMPLAR: subVeclinea[5],
                                FECHA_NACIM: subVeclinea[6],
                                FECHA_EMISION_DNI: subVeclinea[7]
                            });
                        }
                    }
                };

                $scope.objeto2Csv = function () {
                    let contenido = "";
                    for (let i = 0; i < personaFactory.personas.length; i++) {
                        contenido += personaFactory.personas[i].TRAMITE + ";" + personaFactory.personas[i].APELLIDO + ";" +
                                personaFactory.personas[i].NOMBRE + ";" + personaFactory.personas[i].SEXO + ";" + personaFactory.personas[i].DNI + ";" +
                                personaFactory.personas[i].EJEMPLAR + ";" + personaFactory.personas[i].FECHA_NACIM + ";" + personaFactory.personas[i].FECHA_EMISION_DNI + "\n";
                    }
                    $scope.var.contenidoCsv = $scope.var.cabeceraCsv + contenido;
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
                                    let vecTextoLeido = $scope.var.textoLeido.split(";");

                                    if ($scope.var.textoLeido !== '') {
                                        let existe = false;
                                        for (let i = 0; i < personaFactory.personas.length; i++) {
                                            if (personaFactory.personas[i].DNI === vecTextoLeido[4]) {
                                                existe = true;
                                                break;
                                            }
                                        }
                                        if (!existe) {
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
                                            if ($scope.var.contenidoCsv === '') {
                                                $scope.var.contenidoCsv = $scope.var.cabeceraCsv + $scope.var.textoLeido + '\n';
                                            } else {
                                                $scope.var.contenidoCsv += $scope.var.textoLeido + '\n';
                                            }
                                            //$scope.eliminarArchivo();
                                            $scope.guardarArchivo(false);
                                        }
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
                                    saveHistory: false, // Android, save scan history (default false)
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
                                //$scope.var.contenidoCsv += $scope.var.textoLeido + '\n';
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

                $scope.eliminarArchivo = function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fs.root.getFile("Download/listado.csv", {create: false, exclusive: false}, function (fileEntry) {
                            fileEntry.remove(function () {
                                // Archivo removido con exito
                                $ionicLoading.hide();
                            }, function (error) {
                                // Error deleting the file
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Error borrando el archivo'
                                });
                            }, function () {
                                // The file doesn't exist
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Error el archivo no existe'
                                });
                            });

                        }, function (errorCreateFile) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Info',
                                template: 'Error creando el archivo'
                            });
                        });
                    }, function (errorLoadFs) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'Error cargando el archivo'
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

                $scope.eliminarRegistro = function (idx) {
                    if (idx === -1) {
                        while (personaFactory.personas.length > 0) {
                            personaFactory.personas.pop();
                        }
                        //personaFactory.personas = personaFactory.personas.splice(1, personaFactory.personas.lenght);
                        //personaFactory.personas.lenght = 0;
                        //personaFactory.personas = [];
                    } else {
                        personaFactory.personas.splice(idx, 1);
                    }
                    $scope.objeto2Csv();
                    //$scope.eliminarArchivo();
                    $scope.guardarArchivo(false);
                };

            }])

        .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            }]);
 