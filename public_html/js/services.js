angular.module('app.services', [])

        .factory('personaFactory', [function () {
                return {
                    personaSel: '',
                    personas: []
                };
            }])
        
        .factory('sesionFactory', [function () {
                return {
                    contador: 0,
                    nombreLugar: ''
                };
            }])

        .service('BlankService', [function () {

            }]);