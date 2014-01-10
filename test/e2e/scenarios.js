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
    beforeEach(function() {
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
      input('nuevo_evento.lugar').enter('A');
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
      input('nuevo_evento.lugar').enter('A');
      input('nuevo_evento.descripcion').enter('Descripcion e2e');
      element('a#guardar_evento').click();
      expect(element('table tbody tr:nth-child(1) td:nth-child(2) div').text()).toMatch(/Descripcion e2e/);
      expect(element('table thead tr:nth-child(1) td:nth-child(2)').text()).toMatch(/A/);
    });
    it('Debe al elegirse un evento modificar ese evento en la tabla', function(){
      browser().navigateTo('eventos.html');
      element('table tbody tr:nth-child(1) td:nth-child(2) div:nth-child(1) a.editar').click();
      input('nuevo_evento.descripcion').enter('Descripcion e2e MOD');
      element('a#guardar_evento').click();
      expect(element('table tbody tr:nth-child(1) td:nth-child(2) div:nth-child(1)').text()).toMatch(/MOD/);
    })
    it('debe elegir una palabra dentro de una palabra y visualidar el editor de palabras', function(){
      browser().navigateTo('eventos.html');
      element('table tbody tr:nth-child(1) td:nth-child(2) div:nth-child(1) span:nth-child(1)').click();      
      expect(element('div#form_editar_palabra:visible').count()).toBe(1);
    });
    it('Debe borrar un evento cuando se lo elije', function(){
      browser().navigateTo('eventos.html');
      expect(element('table tbody tr:nth-child(1) td:nth-child(2) div:nth-child(1)').count()).toBe(1);
      element('table tbody tr:nth-child(1) td:nth-child(2) div:nth-child(1) a.borrar').click();
      expect(element('table tbody tr:nth-child(1) td:nth-child(2) div:nth-child(1)').count()).toBe(0);
    })
  });
});
