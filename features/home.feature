Feature: Home Page
  As a user
  I want to visit the home page
  So that I can see the Google Photos Picker demo

  Scenario: User sees Google Photos Picker demo
    Given I am on the home page
    Then I should see the heading "Google Photos Picker API Demo"
    And I should see the text "Google Photos Picker Demo"
    And I should see a button "Start OAuth Flow"
