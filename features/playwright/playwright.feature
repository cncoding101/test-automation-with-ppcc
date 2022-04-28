@ignore
Feature: Playwright docs

  Background: Navigation
    Given Go to the playwright website

  Scenario: Change theme
    Given A bored activity is recieved
    Then debug
    When Change theme to "light" mode
    # And Screen matches the base image "Dark Mode"
    Then We see "light" mode
# And Screen matches the base image "Dark Mode"
