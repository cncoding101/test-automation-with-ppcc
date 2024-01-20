Feature: As a user I expect to able to navigate to the home page

  Scenario: As a user I expect to be able to see contacts
    Given I am on the "home" page
    And  The "header logo" should be displayed
    Then The "contacts header" should contain the text "Contacts"