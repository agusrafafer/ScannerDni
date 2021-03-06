angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('menu.ingreso', {
    url: '/home',
    views: {
      'side-menu21': {
        templateUrl: 'templates/ingreso.html',
        controller: 'escanerCtrl'
      }
    }
  })

  .state('menu.listado', {
    url: '/listado',
    views: {
      'side-menu21': {
        templateUrl: 'templates/listado.html',
        controller: 'escanerCtrl'
      }
    }
  })

  .state('menu.enviar', {
    url: '/enviar',
    views: {
      'side-menu21': {
        templateUrl: 'templates/enviar.html',
        controller: 'escanerCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

$urlRouterProvider.otherwise('/side-menu21/home')


});