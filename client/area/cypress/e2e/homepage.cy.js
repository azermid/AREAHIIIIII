describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8081')    
        cy.contains('Log In').should('be.visible');
        cy.contains('Log In').click();
        cy.url().should('include', '/login');
  });
});