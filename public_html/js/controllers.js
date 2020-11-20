angular.module('app.controllers', [])

        .controller('escanerCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$document', '$window', '$ionicPlatform', 'personaFactory', '$state', 'sesionFactory', '$webSql', '$timeout', 'ionicDatePicker', '$filter',

            function ($scope, $stateParams, $ionicLoading, $ionicPopup, $document, $window, $ionicPlatform, personaFactory, $state, sesionFactory, $webSql, $timeout, ionicDatePicker, $filter) {

                var hoy = new Date();

                $scope.var = {
                    textoLeido: '',
                    formatoLeido: '',
                    cabeceraCsv: 'TRAMITE;APELLIDO;NOMBRE;SEXO;DNI;EJEMPLAR;FECHA_NACIM;FECHA_EMISION_DNI;TIPO;FECHA;HORA;AUTORIZADO\n',
                    contenidoCsv: '',
                    pathCsv: '',
                    nombreLugar: '',
                    urlRemota: 'https://www.agurait.com/escaner/visorListado.php',
                    fecha: hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear(),
                    hora: hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds()
                };

                $scope.db = $webSql.openDatabase('listadoDnis', '1.0', 'Lista de DNI', 2 * 1024 * 1024);

                $scope.getNombreLugar = function () {
                    return sesionFactory.nombreLugar;
                };

                $scope.getPersonas = function () {
                    const arrayAux = $filter('filter')(personaFactory.personas, {FECHA: $scope.var.fecha});
                    return arrayAux;
                };

                $scope.cargarNombreLugar = function () {
                    $scope.var.nombreLugar = sesionFactory.nombreLugar;
                    if (sesionFactory.nombreLugar === '') {
                        $ionicPopup.show({
                            template: '<input type="text" ng-model="var.nombreLugar">',
                            title: 'Ingrese el nombre de su area',
                            scope: $scope,
                            buttons: [
                                {
                                    text: '<b>Ok</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        if ($scope.var.nombreLugar === '') {
                                            //don't allow the user to close unless he enters wifi password
                                            e.preventDefault();
                                        } else {
                                            let nombreConGuiones = $scope.var.nombreLugar;
                                            nombreConGuiones = nombreConGuiones.replace(/ /g, '_');
                                            sesionFactory.nombreLugar = nombreConGuiones.toUpperCase();
                                            $scope.db.del("lugar", {"NOMBRE": sesionFactory.nombreLugar.toUpperCase()});
                                            $scope.db.insert('lugar', {"NOMBRE": sesionFactory.nombreLugar.toUpperCase()});
                                            return $scope.var.nombreLugar.toUpperCase();
                                        }
                                    }
                                }
                            ]
                        });

                    }
                };

                function cargaDatosInicial() {
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fs.root.getFile("Download" + sesionFactory.nombreCSVautorizados, {create: false, exclusive: false}, function (fileEntry) {

                            fileEntry.file(function (file) {
                                var reader = new FileReader();

                                reader.onloadend = function () {
                                    let vecTextoLeido = this.result.split("/\t/");
                                    personaFactory.personasAutorizadas = [];
                                    for (let i = 0; i < vecTextoLeido.length; i++) {
                                        personaFactory.personasAutorizadas.push(vecTextoLeido[i].replace(/\n/g, ""));
                                    }
                                    //personaFactory.personasAutorizadas = vecTextoLeido;//ignoro la cabecera del csv
                                    $ionicPopup.alert({
                                        title: 'Texto de autorizados',
                                        template: this.result
                                    });
                                    $ionicPopup.alert({
                                        title: 'Lista de autorizados',
                                        template: personaFactory.personasAutorizadas.length
                                    });
                                };

                                reader.readAsText(file);

                            }, function (errorReadFile) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Error al leer el archivo de autorizados'
                                });
                            });

                        }, function (errorCreateFile) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Info',
                                template: 'Error al obtener el archivo de autorizados'
                            });
                        });
                    }, function (errorLoadFs) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'Error al cargar el archivo de autorizados'
                        });
                    });


                    $scope.db.selectAll("lugar").then(function (results) {
                        if (results.rows.length > 0) {
                            sesionFactory.nombreLugar = results.rows.item(0).NOMBRE.toUpperCase();
                            $scope.var.nombreLugar = sesionFactory.nombreLugar;
                        } else {
                            $scope.cargarNombreLugar();
                        }
                    });
                    $scope.db.select("persona", {"FECHA": $scope.var.fecha}).then(function (results) {
                        if (results.rows.length > 0) {
                            personaFactory.personas = [];
                            for (let i = 0; i < results.rows.length; i++) {
                                personaFactory.personas.push({
                                    TRAMITE: results.rows.item(i).TRAMITE,
                                    APELLIDO: results.rows.item(i).APELLIDO,
                                    NOMBRE: results.rows.item(i).NOMBRE,
                                    SEXO: results.rows.item(i).SEXO,
                                    DNI: results.rows.item(i).DNI,
                                    EJEMPLAR: results.rows.item(i).EJEMPLAR,
                                    FECHA_NACIM: results.rows.item(i).FECHA_NACIM,
                                    FECHA_EMISION_DNI: results.rows.item(i).FECHA_EMISION_DNI,
                                    TIPO: results.rows.item(i).TIPO,
                                    FECHA: results.rows.item(i).FECHA,
                                    HORA: results.rows.item(i).HORA,
                                    AUTORIZADO: results.rows.item(i).AUTORIZADO
                                });
                            }
                            $ionicLoading.hide();
                        } else {
                            $ionicLoading.hide();
                        }
                    });
                }

                $scope.$on('$ionicView.afterEnter', function () {
                    sesionFactory.contador = sesionFactory.contador + 1;
                    if ($state.current.name === 'menu.ingreso' && sesionFactory.contador === 1) {
                        $ionicLoading.show({
                            template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                        });

                        $timeout(function () {
                            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                                fs.root.getFile("Download" + sesionFactory.nombreCSVautorizados, {create: true, exclusive: false}, function (fileEntry) {
                                    // fileEntry.name == 'someFile.txt'
                                    // fileEntry.fullPath == '/someFile.txt'
                                    //$scope.var.pathCsv = fileEntry.fullPath;
                                    fileEntry.createWriter(function (fileWriter) {

                                        fileWriter.onwriteend = function () {
                                            cordova.plugin.ftp.connect(sesionFactory.urlFTP, sesionFactory.usuFTP, sesionFactory.passFTP, function (ok) {
                                                //alert("ftp: conexion ok=" + ok);
                                                cordova.plugin.ftp.download('/storage/emulated/0/Download' + sesionFactory.nombreCSVautorizados, sesionFactory.nombreCSVautorizados, function (percent) {
                                                    if (percent === 1) {
                                                        cargaDatosInicial();
                                                    }
                                                }, function (error) {
                                                    $ionicLoading.hide();
                                                    $ionicPopup.alert({
                                                        title: 'Info',
                                                        template: "ftp: error en la descarga=" + error
                                                    });
                                                    cargaDatosInicial();
                                                });

                                            }, function (error) {
                                                $ionicLoading.hide();
                                                $ionicPopup.alert({
                                                    title: 'Info',
                                                    template: "ftp: error en la conexion=" + error
                                                });
                                                cargaDatosInicial();
                                            });

                                        };

                                        fileWriter.onerror = function (e) {
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({
                                                title: 'Info',
                                                template: 'Error: ' + e.toString()
                                            });
                                        };

                                        // Se crea un blob y luego se guarda el archivo
                                        let dataObj = new Blob([''], {type: 'text/plain'});
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
                        }, 1000);
                        //$ionicLoading.hide();
                    }
                });

                $scope.gotoListado = function () {
                    $state.go('menu.listado', {}, {location: "replace"});
                };

                $scope.abrirEscaner = function (opcionEscaneo) {
                    hoy = new Date();
                    $scope.var.fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
                    $scope.var.hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
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
                                        var autorizada = false;
                                        for (let i = 0; i < personaFactory.personasAutorizadas.length; i++) {
                                            if (personaFactory.personasAutorizadas[i].toString() === vecTextoLeido[4] || personaFactory.personasAutorizadas[i].toString() === vecTextoLeido[1]) {
                                                autorizada = true;
                                                break;
                                            }
                                        }
                                        let existe = false;
                                        for (let i = 0; i < personaFactory.personas.length; i++) {
                                            if ((personaFactory.personas[i].DNI === vecTextoLeido[4] || personaFactory.personas[i].DNI === vecTextoLeido[1])
                                                    && personaFactory.personas[i].TIPO === opcionEscaneo
                                                    && personaFactory.personas[i].FECHA === $scope.var.fecha
                                                    && personaFactory.personas[i].HORA === $scope.var.hora) {
                                                existe = true;
                                                break;
                                            }
                                        }
                                        if (!existe) {
                                            let fecNac = vecTextoLeido[6];
                                            //Si en la posicion 6 del vector no hay una fecha de nacimiento
                                            //entonces el escaneo es para un codigo qr que no es el habitual
                                            //en los dni's
                                            if (!validarFecha(fecNac)) {
                                                personaFactory.personas.push({
                                                    TRAMITE: '',
                                                    APELLIDO: vecTextoLeido[4],
                                                    NOMBRE: vecTextoLeido[5],
                                                    SEXO: '',
                                                    DNI: vecTextoLeido[1],
                                                    EJEMPLAR: vecTextoLeido[2],
                                                    FECHA_NACIM: vecTextoLeido[7],
                                                    FECHA_EMISION_DNI: '',
                                                    TIPO: opcionEscaneo.toUpperCase(),
                                                    FECHA: $scope.var.fecha,
                                                    HORA: $scope.var.hora,
                                                    AUTORIZADO: autorizada ? 'SI' : 'NO'
                                                });
                                            } else {
                                                personaFactory.personas.push({
                                                    TRAMITE: vecTextoLeido[0],
                                                    APELLIDO: vecTextoLeido[1],
                                                    NOMBRE: vecTextoLeido[2],
                                                    SEXO: vecTextoLeido[3],
                                                    DNI: vecTextoLeido[4],
                                                    EJEMPLAR: vecTextoLeido[5],
                                                    FECHA_NACIM: vecTextoLeido[6],
                                                    FECHA_EMISION_DNI: vecTextoLeido[7],
                                                    TIPO: opcionEscaneo.toUpperCase(),
                                                    FECHA: $scope.var.fecha,
                                                    HORA: $scope.var.hora,
                                                    AUTORIZADO: autorizada ? 'SI' : 'NO'
                                                });
                                            }

                                            $scope.db.insert('persona',
                                                    {"TRAMITE": vecTextoLeido[0],
                                                        "APELLIDO": vecTextoLeido[1],
                                                        "NOMBRE": vecTextoLeido[2],
                                                        "SEXO": vecTextoLeido[3],
                                                        "DNI": vecTextoLeido[4],
                                                        "EJEMPLAR": vecTextoLeido[5],
                                                        "FECHA_NACIM": vecTextoLeido[6],
                                                        "FECHA_EMISION_DNI": vecTextoLeido[7],
                                                        "TIPO": opcionEscaneo.toUpperCase(),
                                                        "FECHA": $scope.var.fecha,
                                                        "HORA": $scope.var.hora,
                                                        "AUTORIZADO": autorizada ? 'SI' : 'NO'
                                                    }
                                            ).then(function (results) {

                                            });
                                        }
                                        //Si en la posicion 6 del vector no hay una fecha de nacimiento
                                        //entonces el escaneo es para un codigo qr que no es el habitual
                                        //en los dni's
                                        let dniLeido = vecTextoLeido[4];
                                        let apeLeido = vecTextoLeido[1];
                                        let nomLeido = vecTextoLeido[2];
                                        if (!validarFecha(vecTextoLeido[6])) {
                                            dniLeido = vecTextoLeido[1];
                                            apeLeido = vecTextoLeido[4];
                                            nomLeido = vecTextoLeido[5];
                                        }
                                        let alertPopup = $ionicPopup.alert({
                                            title: 'Info',
                                            template: (autorizada === true) ? 'Persona autorizada: <br/>' : 'Persona <b>NO</b> autorizada: <br/>' +
                                                    'DNI: ' + dniLeido + "<br/>" +
                                                    'Apellido: ' + apeLeido + "<br/>" +
                                                    'Nombre: ' + nomLeido
                                        });
                                        alertPopup.then(function (res) {
                                            $scope.guardarArchivo(false);
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

                $scope.guardarArchivo = function (preguntarSiAbrirArchivoRemoto) {
                    if (personaFactory.personas.length <= 0) {
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'No hay datos para sincronizar'
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
                                personaFactory.personas[i].EJEMPLAR + ";" + personaFactory.personas[i].FECHA_NACIM + ";" + personaFactory.personas[i].FECHA_EMISION_DNI + ";" +
                                personaFactory.personas[i].TIPO + ";" + personaFactory.personas[i].FECHA + ";" + personaFactory.personas[i].HORA + ";" +
                                personaFactory.personas[i].AUTORIZADO + "\n";
                    }
                    $scope.var.contenidoCsv = $scope.var.cabeceraCsv + contenido;


                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fs.root.getFile("Download/listado_" + $scope.var.fecha + ".csv", {create: true, exclusive: false}, function (fileEntry) {
                            // fileEntry.name == 'someFile.txt'
                            // fileEntry.fullPath == '/someFile.txt'
                            $scope.var.pathCsv = fileEntry.fullPath;
                            fileEntry.createWriter(function (fileWriter) {

                                fileWriter.onwriteend = function () {
                                    $ionicLoading.hide();
                                    $scope.subirArchivo(preguntarSiAbrirArchivoRemoto);
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

                $scope.subirArchivo = function (preguntarSiAbrirArchivoRemoto) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });
                    cordova.plugin.ftp.connect(sesionFactory.urlFTP, sesionFactory.usuFTP, sesionFactory.passFTP, function (ok) {
                        //alert("ftp: conexion ok=" + ok);
                        cordova.plugin.ftp.upload('/storage/emulated/0/Download/listado_' + $scope.var.fecha + '.csv', '/listado_' + sesionFactory.nombreLugar + '_' + $scope.var.fecha + '.csv', function (percent) {
                            if (percent === 1) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Datos subidos con exito!'
                                });

                                if (preguntarSiAbrirArchivoRemoto) {
                                    var confirmPopup = $ionicPopup.confirm({
                                        title: 'Info',
                                        template: '¿Desea abrir el archivo remoto?',
                                        okText: 'Si',
                                        cancelText: 'No'
                                    });

                                    confirmPopup.then(function (res) {
                                        if (res) {
                                            let url = $scope.var.urlRemota + '?lugar=' + sesionFactory.nombreLugar + '&fecha=' + $scope.var.fecha + '';
                                            cordova.InAppBrowser.open(url, "_system");
                                        }
                                    });
                                }
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
                        template: '¿Desea abrir el archivo remoto? <br />' + $scope.var.urlRemota + '?lugar=' + sesionFactory.nombreLugar + '&fecha=' + $scope.var.fecha + '',
                        okText: 'Si',
                        cancelText: 'No'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {
                            let url = $scope.var.urlRemota + '?lugar=' + sesionFactory.nombreLugar + '&fecha=' + $scope.var.fecha + '';
                            cordova.InAppBrowser.open(url, "_system");
                        }
                    });
                };

                $scope.verUrlRemota = function () {
                    $ionicPopup.show({
                        template: "<p style='-webkit-user-select: text;-moz-user-select: text;-ms-user-select: text;user-select: text;'>" + $scope.var.urlRemota + "?lugar=" + sesionFactory.nombreLugar + "&fecha=" + $scope.var.fecha + "</p>",
                        title: 'Abra esta URL en su PC',
                        scope: $scope,
                        buttons: [
                            {
                                text: '<b>Ok</b>',
                                type: 'button-positive'
                            }
                        ]
                    });
                };

                $scope.eliminarRegistro = function (idx, persona) {

                    let confirmar;

                    if (idx === -1) {
                        confirmar = $ionicPopup.confirm({
                            title: 'Info',
                            template: 'Esto eliminara todos los registros actuales ¿Seguro desea continuar?',
                            cancelText: 'No',
                            okText: 'Si'
                        });
                        confirmar.then(function (res) {
                            if (res) {
                                let i = personaFactory.personas.length;
                                while (personaFactory.personas.length > 0) {
                                    i--;
                                    //$scope.db.del("persona", {"id": personaFactory.personas[i].id});
                                    $scope.db.del("persona", {"DNI": {"operator": '=', "value": personaFactory.personas[i].DNI, "union": 'AND'}, "TIPO": personaFactory.personas[i].TIPO});
                                    personaFactory.personas.pop();
                                }
                            }
                        });
                    } else {
                        confirmar = $ionicPopup.confirm({
                            title: 'Info',
                            template: 'Esto eliminara el registro actual ¿Seguro desea continuar?',
                            cancelText: 'No',
                            okText: 'Si'
                        });
                        confirmar.then(function (res) {
                            if (res) {
                                //$scope.db.del("persona", {"id": persona.id});
                                $scope.db.del("persona", {"DNI": {"operator": '=', "value": persona.DNI, "union": 'AND'}, "TIPO": {"operator": '=', "value": persona.TIPO, "union": 'AND'}, "FECHA": {"operator": '=', "value": persona.FECHA, "union": 'AND'}, "HORA": persona.HORA});
                                personaFactory.personas.splice(idx, 1);
                            }
                        });
                    }
                };

                $scope.mostrarDatePicker = function ($event) {
                    var opciones = {
                        callback: function (val) {  //Mandatory
                            let date = new Date(val);
                            $scope.var.fecha = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                            $scope.var.hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                            $ionicLoading.show({
                                template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                            });
                            $scope.db.select("persona", {"FECHA": $scope.var.fecha}).then(function (results) {
                                if (results.rows.length > 0) {
                                    personaFactory.personas = [];
                                    for (let i = 0; i < results.rows.length; i++) {
                                        personaFactory.personas.push({
                                            TRAMITE: results.rows.item(i).TRAMITE,
                                            APELLIDO: results.rows.item(i).APELLIDO,
                                            NOMBRE: results.rows.item(i).NOMBRE,
                                            SEXO: results.rows.item(i).SEXO,
                                            DNI: results.rows.item(i).DNI,
                                            EJEMPLAR: results.rows.item(i).EJEMPLAR,
                                            FECHA_NACIM: results.rows.item(i).FECHA_NACIM,
                                            FECHA_EMISION_DNI: results.rows.item(i).FECHA_EMISION_DNI,
                                            TIPO: results.rows.item(i).TIPO,
                                            FECHA: results.rows.item(i).FECHA,
                                            HORA: results.rows.item(i).HORA,
                                            AUTORIZADO: results.rows.item(i).AUTORIZADO
                                        });
                                    }
                                    $ionicLoading.hide();
                                } else {
                                    $ionicLoading.hide();
                                }
                            });

                        },
                        disabledDates: [],
                        inputDate: new Date(),
                        mondayFirst: true,
                        disableWeekdays: [],
                        closeOnSelect: false,
                        templateType: 'popup',
                        setLabel: 'Ok',
                        closeLabel: 'Cancelar'
                    };
                    ionicDatePicker.openDatePicker(opciones);
                };

            }])

        .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            }]);
 