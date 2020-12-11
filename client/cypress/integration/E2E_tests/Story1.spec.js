const studentLogin = () => {
    cy.visit('http://localhost:3000/');
    cy.url().should('contain' , 'http://localhost:3000/login');
    cy.contains('Username').click().type('student1');
}




describe('As a student I want to book a seat for one of my lectures so that I can attend it', () =>{
    it('Student login', () => {
        studentLogin();
    })
})