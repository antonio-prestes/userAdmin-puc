describe("Gestão de usuários", () => {

    beforeEach(() => {
        cy.exec('npm --prefix ../user-api run clear:db')
    })

    describe("Listagem", () => {
        it('contém 1 usuario ', () => {
            cy.request('POST', 'http://localhost:4000/users', {
                name: "Diego",
                emails: "diego@diego.com"
            }).should(response => {
                expect(response.status).to.eq(201)
                cy.visit("/users")
                cy.get('.MuiTable-root tbody tr').should('have.length', 1)
            })
        });
        it('sem usuários', () => {
            cy.visit("/users")
            cy.contains('No User yet').should('exist')
            cy.contains('Do you want to add one?').should('exist')
            cy.contains('Create').should('exist')
        });
    })

    it("Criar usuário", () => {
        cy.visit('#/users')
        cy.wait(500)
        cy.get('a[aria-label=Create]').click()
        cy.get('#name').type("Diego")
        cy.get('#email').type("diego@diego")
        cy.get('button[type=submit]').click()
        cy.get('a[href="#/users"]').click()
        cy.get('.MuiTable-root tbody tr').should('have.length', 1)
    })

    it('Editar usuário', () => {
        cy.request('POST', 'http://localhost:4000/users', {
            name: "Diego",
            email: "diego@diego.com"
        }).should(res => {
            expect(res.status).to.eq(201)
            cy.visit(`#/users/${res.body.id}`)
            cy.wait(100)
            cy.get('#name').should('have.value', 'Diego')
            cy.get('#email').should('have.value', 'diego@diego.com')
            cy.get('#name').clear().type('Diogo')
            cy.get('#email').clear().type('diogo@diogo.com')
            cy.get('.RaToolbar-defaultToolbar-67 > .MuiButton-contained').click()
            cy.visit(`#/users/${res.body.id}`)
            cy.get('#name').should('have.value', 'Diogo')
            cy.get('#email').should('have.value', 'diogo@diogo.com')
        })
    });

    describe('Exclusão', () => {
        it('listagem', () => {
            cy.request('POST', 'http://localhost:4000/users', {
                name: "Diego",
                email: "diego@diego.com"
            }).should(res => {
                expect(res.status).to.eq(201)
                cy.visit(`#`)
                cy.get('.MuiTableBody-root > .MuiTableRow-root > .MuiTableCell-paddingCheckbox > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-89').check()
                cy.get('[data-test="bulk-actions-toolbar"] > .MuiToolbar-root > .MuiButtonBase-root > .MuiButton-label > .RaButton-label-7').click()
                cy.get('.MuiTable-root tbody tr').should('have.length', 0)
            })
        });
        it.only('formulário de edição', () => {
            cy.request('POST', 'http://localhost:4000/users', {
                name: "Diego",
                email: "diego@diego.com"
            }).should(res => {
                expect(res.status).to.eq(201)
                cy.visit(`#/users/${res.body.id}`)
                cy.get('.MuiButton-text > .MuiButton-label > .RaButton-label-7').click()
                cy.get('.MuiTable-root tbody tr').should('have.length', 0)
                cy.contains('Element deleted').should('exist')
            })
        })
    })

})