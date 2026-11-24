describe('Vistas públicas', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.on('window:confirm', () => true)
  })

  it('muestra el catálogo sin iniciar sesión', () => {
    cy.intercept('GET', '**/api/products', { statusCode: 200, body: { success: true, data: [{ id: 1, nombre: 'Balón Sporting', descripcion: 'Balón de entrenamiento' }] } }).as('getProducts')
    cy.visit('/catalogo')
    cy.wait('@getProducts')
    cy.contains('h1', '¡Forma tus campeones ahora!').should('be.visible')
    cy.get('.public-catalog').should('contain.text', 'Catálogo')
    cy.get('.catalog-card').should('be.visible')
    cy.get('.navbar').should('be.visible')
    cy.window().then((window) => {
      expect(window.localStorage.getItem('auth_token')).to.be.null
    })
  })

  it('registra una cuenta pública de padre con email único', () => {
    const email = `padre-qa-${Date.now()}@sporting.test`
    cy.intercept('GET', '**/api/categories', { statusCode: 200, body: { success: true, data: [] } }).as('getCategories')
    cy.intercept('POST', '**/api/users/create', { statusCode: 201, body: { success: true, data: { id: 91, email } } }).as('register')
    cy.visit('/register')
    cy.wait('@getCategories')
    cy.get('[name="user_type"][value="parent"]').check()
    cy.get('input[name="name"]').type('Padre')
    cy.get('input[name="lastname"]').type('Prueba')
    cy.get('input[name="document"]').type('9000001234')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type('Sporty123')
    cy.get('input[name="confirmPassword"]').type('Sporty123')
    cy.get('input[name="phone"]').type('3001239876')
    cy.get('button[type="submit"]').click()
    cy.wait('@register').its('request.body.email').should('eq', email)
    cy.get('.alert-success').should('contain.text', 'Usuario creado exitosamente')
  })
})
