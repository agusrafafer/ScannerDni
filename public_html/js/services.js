angular.module('app.services', [])

        .factory('personaFactory', [function () {
                return {
                    personaSel: '',
                    personas: [],
                    personasAutorizadas: []
                };
            }])
        
        .factory('sesionFactory', [function () {
                return {
                    contador: 0,
                    nombreLugar: '',
                    urlFTP: 'ftp.agurait.com',
                    usuFTP: 'u542060829.escaner',
                    passFTP: 'escaner',
                    nombreCSVautorizados: 'autorizados.csv'
                };
            }])

        .service('BlankService', [function () {

            }]);