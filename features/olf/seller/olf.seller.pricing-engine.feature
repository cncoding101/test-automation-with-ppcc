@olfstaging @sellers @1
Feature: Viewing the pricing engine

    Background: Enabled pricing engine
        Given Seller has pricing engine enabled

    Scenario: Open the pricing engine tab
        Given A seller has navigated to "Meine Angebote"
        When The seller clicks the "Pricing Engine" button
        Then A popup with the pricing engine rules is displayed
