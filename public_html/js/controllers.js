angular.module('app.controllers', [])

        .controller('escanerCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$document', '$window', '$ionicPlatform', 'personaFactory', '$state', 'sesionFactory', '$webSql',

            function ($scope, $stateParams, $ionicLoading, $ionicPopup, $document, $window, $ionicPlatform, personaFactory, $state, sesionFactory, $webSql) {

                $scope.var = {
                    textoLeido: '',
                    formatoLeido: '',
                    cabeceraCsv: 'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA_NACIM;FECHA_EMISION_DNI\n',
                    contenidoCsv: '',
                    pathCsv: '',
                    urlRemota: 'https://www.agurait.com/escaner/visorListado.html'
                };

                $scope.db = $webSql.openDatabase('listadoDnis', '1.0', 'Lista de DNI', 2 * 1024 * 1024);

                $ionicPlatform.ready(function () {
                    sesionFactory.contador = sesionFactory.contador + 1;
                    if ($state.current.name === 'menu.ingreso' && sesionFactory.contador === 1) {
                        $ionicLoading.show({
                            template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                        });

                        $scope.db.selectAll("persona").then(function (results) {
                            if (results.rows.length > 0) {
                                for (let i = 0; i < results.rows.length; i++) {
                                    personaFactory.personas.push({
                                        TRAMITE: results.rows.item(i).TRAMITE,
                                        APELLIDO: results.rows.item(i).APELLIDO,
                                        NOMBRE: results.rows.item(i).NOMBRE,
                                        SEXO: results.rows.item(i).SEXO,
                                        DNI: results.rows.item(i).DNI,
                                        EJEMPLAR: results.rows.item(i).EJEMPLAR,
                                        FECHA_NACIM: results.rows.item(i).FECHA_NACIM,
                                        FECHA_EMISION_DNI: results.rows.item(i).FECHA_EMISION_DNI
                                    });
                                }
                                $ionicLoading.hide();
                            } else {
                                $ionicLoading.hide();
                            }
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

                                            $scope.db.insert('persona',
                                                    {"TRAMITE": vecTextoLeido[0], "APELLIDO": vecTextoLeido[1],
                                                        "NOMBRE": vecTextoLeido[2], "SEXO": vecTextoLeido[3],
                                                        "DNI": vecTextoLeido[4], "EJEMPLAR": vecTextoLeido[5],
                                                        "FECHA_NACIM": vecTextoLeido[6], "FECHA_EMISION_DNI": vecTextoLeido[7]
                                                    }
                                            ).then(function (results) {

                                            });
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


                $scope.guardarArchivo = function () {
                    if (personaFactory.personas.length <= 0) {
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'No hay datos para subir'
                        });
                        return;
                    }

                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    let contenido = "";
                    for (let i = 0; i < personaFactory.personas.length; i++) {
                        contenido += personaFactory.personas[i].TRAMITE + ";" + personaFactory.personas[i].APELLIDO + ";" +
                                personaFactory.personas[i].NOMBRE + ";" + personaFactory.personas[i].SEXO + ";" + personaFactory.personas[i].DNI + ";" +
                                personaFactory.personas[i].EJEMPLAR + ";" + personaFactory.personas[i].FECHA_NACIM + ";" + personaFactory.personas[i].FECHA_EMISION_DNI + "\n";
                    }
                    $scope.var.contenidoCsv = $scope.var.cabeceraCsv + contenido;


                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fs.root.getFile("Download/listado.csv", {create: true, exclusive: false}, function (fileEntry) {
                            // fileEntry.name == 'someFile.txt'
                            // fileEntry.fullPath == '/someFile.txt'
                            $scope.var.pathCsv = fileEntry.fullPath;
                            fileEntry.createWriter(function (fileWriter) {

                                fileWriter.onwriteend = function () {
                                    $ionicLoading.hide();
                                    $scope.subirArchivo();
                                };

                                fileWriter.onerror = function (e) {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: 'Error: ' + e.toString()
                                    });
                                };

                                // Se crea un blob y luego se guarda el archivo
                                let dataObj = new Blob([$scope.var.contenidoCsv], {type: 'text/plain'});
                                fileWriter.write(dataObj);
                            });

                        }, function (errorCreateFile) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Info',
                                template: 'Error al crear el archivo'
                            });
                        });
                    }, function (errorLoadFs) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'Error al cargar el archivo'
                        });
                    });
                    $ionicLoading.hide();
                };

                $scope.subirArchivo = function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });
                    cordova.plugin.ftp.connect('ftp.agurait.com', 'u542060829.escaner', 'escaner', function (ok) {
                        //alert("ftp: conexion ok=" + ok);
                        cordova.plugin.ftp.upload('/storage/emulated/0/Download/listado.csv', '/listado1.csv', function (percent) {
                            if (percent === 1) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Datos subidos con exito a: <br/>' + $scope.var.urlRemota
                                });

                                var confirmPopup = $ionicPopup.confirm({
                                    title: 'Info',
                                    template: '¿Desea abrir el archivo remoto?',
                                    okText: 'Si',
                                    cancelText: 'No'
                                });

                                confirmPopup.then(function (res) {
                                    if (res) {
                                        $window.open($scope.var.urlRemota, "_blank", "location=yes,clearsessioncache=yes,clearcache=yes");
                                    }
                                });
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

                $scope.abrirUrlRemota = function () {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Info',
                        template: '¿Desea abrir el archivo remoto? <br />' + $scope.var.urlRemota,
                        okText: 'Si',
                        cancelText: 'No'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {
                            $window.open($scope.var.urlRemota, "_blank", "location=yes,clearsessioncache=yes,clearcache=yes");
                        }
                    });
                };

                $scope.eliminarRegistro = function (idx, dni) {
                    if (idx === -1) {
                        let i = personaFactory.personas.length;
                        while (personaFactory.personas.length > 0) {
                            i--;
                            $scope.db.del("persona", {"DNI": personaFactory.personas[i].DNI});
                            personaFactory.personas.pop();
                        }
                    } else {
                        $scope.db.del("persona", {"DNI": dni});
                        personaFactory.personas.splice(idx, 1);
                    }
                };

            }])

        .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            }]);
 