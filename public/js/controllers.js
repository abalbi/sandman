'use strict';
/* Controllers */

angular.module('burgo.controllers', []).
  controller('TablaCtrl', function($scope, $http) {
    $scope.fecha_inicio = function(){
      return '1970:01:01:00:00:00';
    }
    $scope.mostrar_fecha = function(fecha) {
      return fecha;
    };
    $scope.fecha_convertir = function(fecha) {
      if(typeof fecha == 'undefined') fecha = 0;
      fecha = fecha.toString();
      if(fecha.match(/\d+\:\d+\:\d+\:\d+\:\d+\:\d+/)) {
        return fecha;
      }  
      var letras = {y:0, m:1, d:2, h:3, n:4, s:5};
      var array = $scope.fecha_inicio().split(':');
      var string = fecha;
      var re = /(\-*\d+)([y|m|d|h|n|s]*)/;
      var res;
      while(res = string.match(re)) {
        if(!res[2]) {
          res[2] = 'd'
        }
        array[letras[res[2]]] = parseInt(array[letras[res[2]]]) + parseInt(res[1]);
        string = string.replace(re,'').replace(' ','');
      }
      var rtn = array.join(':');
      rtn = rtn.replace(/\:(\d)\:/g, function(mtc,m1){
        return ':0' + m1 + ':';
      }) 
      return rtn;
    }
    $scope.mostrar_evento = false;
    $scope.mostrar = function(){
      $scope.mostrar_evento = !$scope.mostrar_evento;
    }
    $scope.nuevo_evento = {};
    $scope.modificar_evento = function (fecha, lugar, item, indice){
      $scope.mostrar();
      $scope.nuevo_evento.fecha = item.fecha;
      $scope.nuevo_evento.lugar = lugar;
      $scope.nuevo_evento._id = item._id;
      $scope.nuevo_evento.descripcion = item.descripcion;
    }
    $scope.borrar_evento = function(_id) {
      $http.get('evento/borrar?_id='+_id).success(function(data){
        $scope.tabla_evento(data);
        $scope.tabla_cargar_eventos($http);
        $scope.nuevo_evento = {};
        $scope.mostrar_evento = false;
      });
    }
    $scope.guardar_evento = function(){
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
      var fecha = $scope.fecha_convertir(evento.fecha);
      if(!$scope.tabla[fecha]) {
        $scope.tabla[fecha] = { data: {} };
      }
      var row = $scope.tabla[fecha];
      $scope.agregar_lugar(evento.lugar);
      if(!row.data[evento.lugar]) {
        row.data[evento.lugar] = [];
      }
      angular.forEach($scope.lugares, function(lugar, key){
        if(!row.data[lugar]) {
          $scope.agregar_lugar(lugar);
          row.data[lugar] = [];
        }
      });
      row.data[evento.lugar].push({"fecha" : evento.fecha, "descripcion": evento.descripcion, "_id": evento._id});
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