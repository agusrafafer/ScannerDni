angular.module('app.services', [])

        .factory('personaFactory', [function () {
                return {
                    personaSel: '',
                    personas: []
                };
            }])

        .service('BlankService', [function () {

            }]);