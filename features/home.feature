Feature: Home Page
  As a user
  I want to visit the home page
  So that I can see the welcome message

  Scenario: User sees welcome message
    Given I am on the home page
    Then I should see the heading "Welcome to Next.js"
    And I should see the text "A TypeScript Next.js starter with Vitest and Tailwind CSS"
