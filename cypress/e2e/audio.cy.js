describe("Audio Player", () => {
  it("plays audio", () => {
    cy.visit("/");
    cy.get(".composition-name:first").click();

    if (Cypress.config("viewportWidth") >= 1024) {
      cy.get("#play-btn-pc").click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
      cy.get("#player-play-btn-pc").click();
    } else {
      cy.get("#play-btn-mobile").click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
      cy.get("#player-play-btn-mobile").click();
    }
  });
});
