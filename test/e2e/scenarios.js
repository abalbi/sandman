'use strict';
describe('Burgo', function() {
  beforeEach(function() {
  });
  it('Debe tener un link "agregar evento"', function() {
    browser().navigateTo('eventos.html');
    expect(element('a#agregar_evento').text()).toBe('Agregar Evento');
  });
  it('Debe al clickear a#agregar_evento ser visible', function() {
    browser().navigateTo('eventos.html');
    element('a#agregar_evento').click();
    expect(element('div#form_agregar_evento:visible').count()).toBe(1);
  });
  it('Debe al agregar un evento modificar la tabla', function() {
    browser().navigateTo('eventos.html');
    element('a#agregar_evento').click();
    input('nuevo_evento.fecha').enter('1');
    input('nuevo_evento.lugar').enter('A');
    input('nuevo_evento.descripcion').enter('Descripcion e2e');
    element('a#a_agregar_evento').click();
    expect(element('table tbody tr:nth-child(1) td:nth-child(2)').text()).toMatch(/Descripcion e2e/);
    expect(element('table thead tr:nth-child(1) td:nth-child(2)').text()).toMatch(/A/);
  });
});
