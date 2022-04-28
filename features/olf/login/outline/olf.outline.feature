@ignore
Feature: Login to the OLF platform

  Background: Navigation
    Given Go to the onlinefuel website login page

  Scenario Outline: Login success
    When I enter to the email input "<Email>"
    And The password input "<Password>"
    And Click the login button
    Then I successfully login and see the dashboard

    Examples:
      | Email                      | Password    |
      | jg+testrail@onlinefuels.de | 21OLF%1510s |

  Scenario Outline: Login failed
    When I enter to the email input "<Email>"
    And The password input "<Password>"
    And Click the login button
    Then I fail to login and I see a error message

    Examples:
      | Email                      | Password |
      | jg+testrail@onlinefuels.de | 123      |