'use strict';
describe('Sandman', function() {
  xdescribe('Proyectos', function() {
    it('Debe mostrar la lista de proyectos', function() {
      browser().navigateTo('proyectos.html');
    });
    it('Debe tener un agregar proyecto y que muestre formulario de agregar proyecto', function(){
      browser().navigateTo('eventos.html');
      element('a#agregar_proyecto').click();
    });
  })
  describe('Eventos', function() {
    var dummy = '';
    beforeEach(function() {
      if(!dummy) {
        var list = ['Ivana','Silas','Iniaki','Mario','Luana','Peron'];
        dummy = list[Math.floor(Math.random() * list.length) + 1];
      }
      console.log('DUMMY: ' + dummy);
    });
    it('Debe tener un link "agregar evento"', function() {
      browser().navigateTo('eventos.html');
      expect(element('a#agregar_evento').text()).toBe('Agregar Evento');
    });
    it('Debe al clickear a#agregar_evento ser visible y debe dejar de ser visible', function() {
      browser().navigateTo('eventos.html');
      element('a#agregar_evento').click();
      expect(element('div#form_editar_evento:visible').count()).toBe(1);
    });
    it('Debe al clickear a#agregar_evento y el editor esta visible, resetaer al editor', function(){
      browser().navigateTo('eventos.html');
      element('a#agregar_evento').click();
      input('nuevo_evento.fecha').enter('1');
      input('nuevo_evento.descripcion').enter('Descripcion e2e');
      element('a#agregar_evento').click();
      expect(element('div#form_editar_evento:visible').count()).toBe(1);
    });
    it('Debe haber un boton cancelar que desactive el editor de eventos', function(){
      browser().navigateTo('eventos.html');
      element('a#agregar_evento').click();
      element('a#editor_cancelar_evento').click();
      expect(element('div#form_agregar_evento:visible').count()).toBe(0);
    });
    it('Debe al agregar un evento modificar la tabla', function() {
      browser().navigateTo('eventos.html');
      element('a#agregar_evento').click();
      input('nuevo_evento.fecha').enter('1');
      input('nuevo_evento.descripcion').enter(dummy);
      element('a#guardar_evento').click();
      expect(element('div#tabla2 div ul li:contains("'+dummy+'")').text()).toMatch(dummy);
    });
    it('Debe al elegirse un evento modificar ese evento en la tabla', function(){
      browser().navigateTo('eventos.html');
      element('div#tabla2 div ul li:contains("'+dummy+'") a.editar').click();
      input('nuevo_evento.descripcion').enter(dummy + ' es un dummy que tambien es un tonto');
      element('a#guardar_evento').click();
      expect(element('li:contains("'+dummy+'")').text()).toMatch(/tonto/);
    })
    it('debe elegir una palabra dentro de una palabra y visualidar el editor de palabras', function(){
      browser().navigateTo('eventos.html');
      element('div#tabla2 div ul li:contains("'+dummy+'") span:nth-child(1)').click();
      expect(element('div#form_editar_palabra:visible').count()).toBe(1);
    });
    it('debe permitir crear un objeto con una palabra desde el editor de palabras', function(){
      browser().navigateTo('eventos.html');
      element('div#tabla2 div ul li:contains("'+dummy+'") span:contains("dummy")').click();
      expect(element('div#form_editar_palabra:visible').count()).toBe(1);
      expect(element('div#form_editar_palabra div:nth-child(1) strong').text()).toMatch('dummy');
      element('div#form_editar_palabra div:nth-child(1) a.agregar').click();
    });
    it('debe cerrar el editor de palabras', function(){
      browser().navigateTo('eventos.html');
      element('div#tabla2 div ul li:contains("'+dummy+'") span:nth-child(1)').click();
      element('div#form_editar_palabra a.cerrar').click();
      expect(element('div#form_editar_palabra:visible').count()).toBe(0);
    });
    it('debe permitir crear un key a un objeto con una palabra', function(){
      browser().navigateTo('eventos.html');
      element('div#tabla2 div ul li:contains("'+dummy+'") span:contains("tonto")').click();
      expect(element('div#form_editar_palabra:visible').count()).toBe(1);
      input('palabra.alias_a_objeto').enter('dummy');
      element('div#form_editar_palabra div:nth-child(2) a.agregar').click();
    });
    it('Debe ven estar definidos los objetos creados', function(){
      browser().navigateTo('eventos.html');
      expect(element('div#Balkin span:nth-child(1)').text()).toBe('Balkin');
      expect(element('div#dummy span:nth-child(1)').text()).toBe('dummy');
      expect(element('div#dummy span:nth-child(2) ul').text()).toMatch('dummy');
      expect(element('div#dummy span:nth-child(2) ul').text()).toMatch('tonto');
    })
    it('Debe borrar un evento cuando se lo elije', function(){
      browser().navigateTo('eventos.html');
      expect(element('div#tabla2 div ul li:contains("'+dummy+'")').count()).toBe(1);
      element('div#tabla2 div ul li:contains("'+dummy+'") a.borrar').click();
      expect(element('div#tabla2 div ul li:contains("'+dummy+'")').count()).toBe(0);
    })
  });
});
