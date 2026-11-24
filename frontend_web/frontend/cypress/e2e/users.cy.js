describe('Gestión de usuarios - HU05, HU06, HU08, HU09 y HU10', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.on('window:confirm', () => true)
    cy.loginAsAdmin()
    cy.get('.app-sidebar-nav').contains('Usuarios').click()
    cy.get('.usr-grid').should('be.visible')
  })

  it('HU05 - lista usuarios en tarjetas', () => {
    cy.get('.usr-card').should('have.length', 4)
    cy.get('.usr-card').should('contain.text', 'admi@gmail.com')
    cy.get('.usr-card').should('contain.text', 'estudiante01@sporting.test')
  })

  it('HU06 - crea un usuario nuevo con correo único', () => {
    const email = `qa-${Date.now()}@sporting.test`
    cy.intercept('POST', '**/api/users/create', { statusCode: 201, body: { success: true, data: { id: 90, email } } }).as('createUser')
    cy.contains('button', '+ Nuevo Usuario').click()
    cy.get('.modal-content [name="name"]').type('Usuario')
    cy.get('.modal-content [name="lastname"]').type('QA')
    cy.get('.modal-content [name="email"]').type(email)
    cy.get('.modal-content [name="password"]').type('Sporty123')
    cy.get('.modal-content [name="confirmPassword"]').type('Sporty123')
    cy.get('.modal-content [name="role"]').select('user')
    cy.get('.modal-content button[type="submit"]').click()
    cy.wait('@createUser').its('request.body.email').should('eq', email)
    cy.get('.alert-success').should('contain.text', 'Usuario creado correctamente')
  })

  it('HU08 - edita los datos de un usuario', () => {
    cy.intercept('PUT', '**/api/users/3', { statusCode: 200, body: { success: true, message: 'Usuario actualizado' } }).as('updateUser')
    cy.get('.usr-card').filter(':contains("estudiante01@sporting.test")').contains('button', 'Editar').click()
    cy.get('.modal-content [name="name"]').clear().type('Estudiante actualizado')
    cy.get('.modal-content button[type="submit"]').click()
    cy.wait('@updateUser').then(({ request }) => {
      expect(request.url).to.match(/\/api\/users\/3$/)
      expect(request.body.name).to.eq('Estudiante actualizado')
    })
    cy.get('.alert-success').should('be.visible')
  })

  it('HU09 - activa o desactiva una cuenta y confirma la acción', () => {
    cy.intercept('PATCH', '**/api/users/toggle-status/3', { statusCode: 200, body: { success: true } }).as('toggleStatus')
    cy.get('.usr-card').filter(':contains("estudiante01@sporting.test")').contains('button', 'Desactivar').click()
    cy.wait('@toggleStatus')
    cy.get('.alert-success').should('contain.text', 'Usuario desactivado exitosamente')
  })

  it('HU09 - activa una cuenta inactiva', () => {
    cy.intercept('PATCH', '**/api/users/toggle-status/4', { statusCode: 200, body: { success: true } }).as('activateUser')
    cy.get('.usr-card').filter(':contains("inactivo@sporting.test")').contains('button', 'Activar').click()
    cy.wait('@activateUser').its('request.body.is_active').should('eq', 1)
    cy.get('.alert-success').should('contain.text', 'Usuario activado exitosamente')
  })

  it('HU10 - elimina un usuario y confirma la acción', () => {
    cy.intercept('DELETE', '**/api/users/delete/3', { statusCode: 200, body: { success: true } }).as('deleteUser')
    cy.get('.usr-card').filter(':contains("estudiante01@sporting.test")').contains('button', 'Eliminar').click()
    cy.wait('@deleteUser')
    cy.get('.alert-success').should('contain.text', 'Usuario eliminado exitosamente')
  })

  it('HU10 - impide la auto-eliminación', () => {
    cy.get('.usr-card').filter(':contains("admi@gmail.com")').contains('button', 'Eliminar').should('be.disabled')
  })

  it('HU09 - impide la auto-desactivación', () => {
    cy.get('.usr-card').filter(':contains("admi@gmail.com")').contains('button', 'Desactivar').should('be.disabled')
    cy.get('.usr-card').filter(':contains("admi@gmail.com")').find('.usr-status-pill').should('be.disabled')
  })

  it('HU05 - restringe al vendedor la eliminación y el cambio de estado', () => {
    cy.clearLocalStorage()
    cy.loginAsSeller()
    cy.get('.app-sidebar-nav').contains('Usuarios').click()
    cy.get('.usr-card').filter(':contains("estudiante01@sporting.test")').within(() => {
      cy.contains('button', 'Eliminar').should('be.disabled')
      cy.contains('button', 'Desactivar').should('be.disabled')
    })
  })

  it('HU05 - impide al vendedor la auto-eliminación y auto-desactivación', () => {
    cy.clearLocalStorage()
    cy.loginAsSeller()
    cy.get('.app-sidebar-nav').contains('Usuarios').click()
    cy.get('.usr-card').filter(':contains("seller@sporting.test")').within(() => {
      cy.contains('button', 'Eliminar').should('be.disabled')
      cy.contains('button', 'Desactivar').should('be.disabled')
    })
  })
})
