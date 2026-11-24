describe('Gestión de estudiantes', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.on('window:confirm', () => true)
    cy.loginAsAdmin()
    cy.get('.app-sidebar-nav').contains('Estudiantes').click()
  })

  it('HU - lista estudiantes y categorías', () => {
    cy.get('.stu-grid .stu-card').should('have.length', 2)
    cy.get('.stu-grid').should('contain.text', 'Ana Pérez')
    cy.get('.stu-stats').should('contain.text', 'Categorías')
  })

  it('HU - filtra estudiantes por categoría', () => {
    cy.get('.stu-chips').contains('button', '2014').click()
    cy.get('.stu-grid .stu-card').should('have.length', 1).and('contain.text', 'Ana Pérez')
    cy.get('.stu-grid').should('not.contain.text', 'Luis Gómez')
  })

  it('HU - crea un estudiante con una categoría existente', () => {
    cy.intercept('POST', '**/api/students/create', { statusCode: 201, body: { success: true, data: { id: 43 } } }).as('createStudent')
    cy.contains('button', '+ Nuevo Estudiante').click()
    cy.get('.stu-form-card [name="name"]').type('Nuevo')
    cy.get('.stu-form-card [name="lastname"]').type('Deportista')
    cy.get('.stu-form-card [name="document"]').type('1001001099')
    cy.get('.stu-form-card [name="category_id"]').select('1')
    cy.get('.stu-form-card button[type="submit"]').click()
    cy.wait('@createStudent').its('request.body.category_id').should('eq', 1)
    cy.get('.alert-success').should('contain.text', 'Estudiante registrado exitosamente')
  })
})
