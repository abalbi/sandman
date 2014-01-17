'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(function(){
  	module('burgo');
  });
  describe('Tabla', function(){
    it('debe recibir un evento y agregar un row a la tabla', inject(function($controller) {
      var scope = {}
      var ctrl = $controller('TablaCtrl', { $scope: scope});
      scope.tabla = {};
      scope.eventos = [];
      scope.tabla_evento({
        fecha: 1,
        lugar: 'A',
        descripcion: "descripcion"
      });
      expect(scope.tabla['1970:01:02:00:00:00'].data.A[0].descripcion).toBe('descripcion');
    }));
    var $httpBackend;
    it('debe cargar todos los eventos en la tabla', inject(function(_$httpBackend_, $rootScope, $controller) {
      var $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('eventos.json').respond([
        { fecha: 1, lugar: 'A', descripcion: "descripcion1" },
        { fecha: 1, lugar: 'B', descripcion: "descripcion2" },
        { fecha: 2, lugar: 'A', descripcion: "descripcion3" },
        { fecha: 2, lugar: 'C', descripcion: "descripcion4" },
        { fecha: 1, lugar: 'A', descripcion: "descripcion5" }
      ]);
      var scope = {};
      var ctrl = $controller('TablaCtrl', { $scope: scope});
      scope.tabla = {};
      $httpBackend.expectGET('/objetos').respond([]);
      $httpBackend.flush();
      expect(scope.tabla2.data['1970:01:02:00:00:00'].length).toBe(3);
      expect(scope.tabla2.data['1970:01:03:00:00:00'].length).toBe(2);
    }));
    it('debe poder agregar un evento y mandarlo a backend', inject(function(_$httpBackend_, $rootScope, $controller) {
      var $httpBackend = _$httpBackend_;
      var scope = {};
      var ctrl = $controller('TablaCtrl', { $scope: scope});
      scope.nuevo_evento = { fecha: 1, lugar: 'A', descripcion: "descripcion11" };
      $httpBackend.expectGET('eventos.json').respond([]);
      $httpBackend.expectGET('evento/guardar?obj='+JSON.stringify(scope.nuevo_evento)).respond({ fecha: 1, lugar: 'A', descripcion: "descripcion1" });
      scope.guardar_evento();
    }));
    it('debe borrar un elemento cuando se lo hace',  inject(function(_$httpBackend_, $rootScope, $controller) {
      var $httpBackend = _$httpBackend_;
      var scope = {};
      var _id = "__un_id__";
      $httpBackend.expectGET('eventos.json').respond([]);
      $httpBackend.expectGET('/objetos').respond([]);
      $httpBackend.expectGET('evento/borrar?_id='+_id).respond([]);
      $httpBackend.expectGET('eventos.json').respond([]);
      $httpBackend.expectGET('/objetos').respond([]);
      var ctrl = $controller('TablaCtrl', { $scope: scope});
      scope.borrar_evento(_id);
      $httpBackend.flush();
    }));
    it('debe manejar la seleccion de una palabra si esta no es ninguna en especial', inject(function(_$httpBackend_, $rootScope, $controller) {
      var $httpBackend = _$httpBackend_;
      var scope = {};
      var ctrl = $controller('TablaCtrl', { $scope: scope});
      $httpBackend.expectGET('eventos.json').respond([]);
      $httpBackend.expectGET('/objetos').respond([]);
      $httpBackend.expectGET('palabra/Ivana.json').respond({palabra:"Ivana"});
      scope.seleccionar_palabra({palabra:"Ivana"});
      $httpBackend.flush();
      expect(scope.palabra.palabra).toBe("Ivana");
    }));
  });
});
