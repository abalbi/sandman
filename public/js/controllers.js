'use strict';
/* Controllers */

angular.module('burgo.controllers', []).
  controller('TablaCtrl', function($scope, $http) {
    $scope.mostrar_evento = false;
    $scope.mostrar = function(){
      $scope.mostrar_evento = !$scope.mostrar_evento;
    }
    $scope.nuevo_evento = {};
    $scope.modificar_evento = function (fecha, lugar, item, indice){
      $scope.mostrar();
      $scope.nuevo_evento.fecha = fecha;
      $scope.nuevo_evento.lugar = lugar;
      $scope.nuevo_evento._id = item._id;
      $scope.nuevo_evento.descripcion = item.descripcion;
    }
    $scope.agregar_evento = function(){
      if ($scope.nuevo_evento.fecha && $scope.nuevo_evento.lugar && $scope.nuevo_evento.descripcion) {
        $http.get('evento/guardar?obj='+JSON.stringify($scope.nuevo_evento)).success(function(data){
          $scope.tabla_evento(data);
          $scope.tabla_cargar_eventos($http);
          $scope.nuevo_evento = {};
          $scope.mostrar_evento = false;
        });
      }
    }
    $scope.lugares = [];
    $scope.tabla = {};
    $scope.tabla_evento = function(evento) {
      if(!evento) return;
      if(!$scope.tabla[evento.fecha]) {
        $scope.tabla[evento.fecha] = {};
      }
      $scope.agregar_lugar(evento.lugar);
      if(!$scope.tabla[evento.fecha][evento.lugar]) {
        $scope.tabla[evento.fecha][evento.lugar] = [];
      }
      angular.forEach($scope.lugares, function(lugar, key){
        if(!$scope.tabla[evento.fecha][lugar]) {
          $scope.agregar_lugar(lugar);
          $scope.tabla[evento.fecha][lugar] = [];
        }
      });
      $scope.tabla[evento.fecha][evento.lugar].push({"descripcion": evento.descripcion, "_id": evento._id});
    }
    $scope.agregar_lugar = function(lugar) {
      var boo = true;
      angular.forEach($scope.lugares, function(item) {
        if(item == lugar){
          boo = false;
        }
      });
      if(boo) $scope.lugares.push(lugar);
    }
    $scope.actualizar_lugares = function(){
      var eventos = $scope.eventos;
      angular.forEach($scope.eventos, function(evento, key){
        $scope.agregar_lugar(evento.lugar);
      });
      return $scope.lugares;
    }
    $scope.tabla_cargar_eventos = function($http){
      $scope.eventos = [];
      $http.get('eventos.json').success(function(data){
        angular.forEach(data, function(evento){
          $scope.eventos.push(evento);
        });
        $scope.tabla = {};
        $scope.actualizar_lugares();
        angular.forEach($scope.eventos, function(evento, key){
          $scope.tabla_evento(evento);
        });
      });
    }
    $scope.tabla_cargar_eventos($http);
  })
;