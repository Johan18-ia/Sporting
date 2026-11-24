const users = [
  { id: 1, name: 'Admin', lastname: 'Sporting', email: 'admi@gmail.com', role: 'admin', user_type: 'none', is_active: 1 },
  { id: 2, name: 'Vendedor', lastname: 'Prueba', email: 'seller@sporting.test', role: 'seller', user_type: 'none', is_active: 1 },
  { id: 3, name: 'Estudiante', lastname: 'Prueba', email: 'estudiante01@sporting.test', role: 'user', user_type: 'student', is_active: 1, category_id: 1 },
  { id: 4, name: 'Cuenta', lastname: 'Inactiva', email: 'inactivo@sporting.test', role: 'user', user_type: 'none', is_active: 0 }
]

const students = [
  { id: 41, name: 'Ana', lastname: 'Pérez', document: '1001001001', category_id: 1, birth_date: '2014-03-10', phone: '3001234567' },
  { id: 42, name: 'Luis', lastname: 'Gómez', document: '1001001002', category_id: 2, birth_date: '2015-04-12', phone: '3001234568' }
]

const categories = [
  { id: 1, category_year: 2014, description: 'Categoría 2014' },
  { id: 2, category_year: 2015, description: 'Categoría 2015' }
]

const tokenFor = (id, email, role) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ id, email, role, exp: Math.floor(Date.now() / 1000) + 3600 }))
  return `${header}.${payload}.cypress-signature`
}

const roleUser = (role) => users.find((user) => user.role === role) || users[2]

Cypress.Commands.add('stubDashboardApi', (role = 'admin') => {
  const loggedInUser = roleUser(role)
  cy.intercept('GET', '**/api/users', { statusCode: 200, body: { success: true, data: users } }).as('getUsers')
  cy.intercept('GET', '**/api/students', { statusCode: 200, body: { success: true, data: students } }).as('getStudents')
  cy.intercept('GET', '**/api/categories', { statusCode: 200, body: { success: true, data: categories } }).as('getCategories')
  cy.intercept('GET', '**/api/products', { statusCode: 200, body: { success: true, data: [] } }).as('getProducts')
  cy.intercept('GET', '**/api/schedules', { statusCode: 200, body: { success: true, data: [] } }).as('getSchedules')
  cy.intercept('GET', '**/api/tournaments', { statusCode: 200, body: { success: true, data: [] } }).as('getTournaments')
  cy.intercept('GET', '**/api/teams', { statusCode: 200, body: { success: true, data: [] } }).as('getTeams')
  cy.intercept('GET', '**/api/users/*', (request) => {
    const id = Number(request.url.split('/').pop())
    request.reply({ statusCode: 200, body: { success: true, data: users.find((user) => user.id === id) || loggedInUser } })
  })
})

Cypress.Commands.add('loginAs', (role) => {
  const user = roleUser(role)
  cy.stubDashboardApi(role)
  cy.intercept('POST', '**/api/users/login', {
    statusCode: 200,
    body: {
      success: true,
      message: 'Usuario autenticado',
      data: { ...user, session_token: `JWT ${tokenFor(user.id, user.email, user.role)}` }
    }
  }).as('login')
  cy.visit('/login')
  cy.get('input[name="email"]').type(user.email)
  cy.get('input[name="password"]').type(role === 'admin' ? 'admin123' : '12345')
  cy.get('button[type="submit"]').click()
  cy.wait('@login')
  cy.location('pathname').should('eq', '/dashboard')
})

Cypress.Commands.add('loginAsAdmin', () => cy.loginAs('admin'))
Cypress.Commands.add('loginAsSeller', () => cy.loginAs('seller'))
Cypress.Commands.add('loginAsUser', () => cy.loginAs('user'))
Cypress.Commands.add('loginAsStudent', () => cy.loginAs('user'))
