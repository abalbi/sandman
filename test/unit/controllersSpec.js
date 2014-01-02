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
      expect(scope.tabla['1'].A[0].descripcion).toBe('descripcion');
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
      $httpBackend.flush();
      expect(scope.tabla['1'].A.length).toBe(2);
      expect(scope.tabla['1'].B.length).toBe(1);
      expect(scope.tabla['1'].C.length).toBe(0);
      expect(scope.tabla['2'].A.length).toBe(1);
      expect(scope.tabla['2'].B.length).toBe(0);
      expect(scope.tabla['2'].C.length).toBe(1);
    }));
    it('debe poder agregar un evento y mandarlo a backend', inject(function(_$httpBackend_, $rootScope, $controller) {
      var $httpBackend = _$httpBackend_;
      var scope = {};
      var ctrl = $controller('TablaCtrl', { $scope: scope});
      scope.nuevo_evento = { fecha: 1, lugar: 'A', descripcion: "descripcion11" };
      $httpBackend.expectGET('eventos.json').respond([]);
      $httpBackend.expectGET('evento/guardar?obj='+JSON.stringify(scope.nuevo_evento)).respond({ fecha: 1, lugar: 'A', descripcion: "descripcion1" });
      $httpBackend.expectGET('eventos.json').respond([]);
      scope.agregar_evento();
    }));
  });
});
