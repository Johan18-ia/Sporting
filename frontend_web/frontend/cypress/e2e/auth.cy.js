const tokenFor = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + 3600 }))
  return `${header}.${payload}.test-signature`
}

const loginResponse = (user) => ({
  success: true,
  message: 'Usuario autenticado',
  data: { ...user, session_token: `JWT ${tokenFor(user)}` }
})

describe('Autenticación - HU01 y HU02', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.on('window:confirm', () => true)
  })

  it('HU01 - inicia sesión con credenciales válidas', () => {
    const admin = { id: 1, name: 'Admin', email: 'admi@gmail.com', role: 'admin', is_active: 1 }
    cy.stubDashboardApi('admin')
    cy.intercept('POST', '**/api/users/login', { statusCode: 200, body: loginResponse(admin) }).as('login')
    cy.visit('/login')
    cy.get('input[name="email"]').type('admi@gmail.com')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.wait('@login')
    cy.location('pathname').should('eq', '/dashboard')
    cy.get('.app-sidebar-nav').should('be.visible')
    cy.window().its('localStorage.auth_token').should('be.a', 'string')
  })

  it('HU01 - rechaza credenciales inválidas', () => {
    cy.intercept('POST', '**/api/users/login', {
      statusCode: 401,
      body: { success: false, message: 'Contraseña o correo incorrecto' }
    }).as('login')
    cy.visit('/login')
    cy.get('input[name="email"]').type('admi@gmail.com')
    cy.get('input[name="password"]').type('incorrecta')
    cy.get('button[type="submit"]').click()
    cy.wait('@login')
    cy.get('.alert-error').should('contain.text', 'Contraseña o correo incorrecto')
  })

  it('HU01 - informa que una cuenta inactiva no puede iniciar sesión', () => {
    cy.intercept('POST', '**/api/users/login', {
      statusCode: 403,
      body: { success: false, message: 'Usuario desactivado. Contacte al administrador.' }
    }).as('inactiveLogin')
    cy.visit('/login')
    cy.get('input[name="email"]').type('inactivo@sporting.test')
    cy.get('input[name="password"]').type('12345')
    cy.get('button[type="submit"]').click()
    cy.wait('@inactiveLogin')
    cy.get('.alert-error').should('contain.text', 'Usuario desactivado')
  })

  it('HU01 - valida los campos vacíos antes de enviar la petición', () => {
    cy.intercept('POST', '**/api/users/login').as('login')
    cy.visit('/login')
    cy.get('button[type="submit"]').click()
    cy.get('.alert-error').should('contain.text', 'Por favor complete todos los campos')
    cy.get('@login.all').should('have.length', 0)
  })

  it('HU01 - bloquea un email con formato inválido', () => {
    cy.intercept('POST', '**/api/users/login').as('login')
    cy.visit('/login')
    cy.get('input[name="email"]').type('correo-invalido')
    cy.get('input[name="password"]').type('12345')
    cy.get('input[name="email"]').then(($input) => {
      expect($input[0].checkValidity()).to.equal(false)
    })
    cy.get('button[type="submit"]').click()
    cy.get('@login.all').should('have.length', 0)
  })

  it('HU02 - cierra sesión y limpia el token persistido', () => {
    cy.loginAsAdmin()
    cy.get('button[title="Cerrar sesión"]').first().click()
    cy.window().its('localStorage.auth_token').should('be.undefined')
    cy.location('pathname', { timeout: 5000 }).should('eq', '/login')
  })
})
