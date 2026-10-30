Feature: Favorites
  Test repository path: Toolshop/UI/Favorites

  @FAV-01 @regression @hybrid @favorites
  Scenario: A favorite appears in the list and can be removed
    Given a new user with the favorite "Combination Pliers" exists through the API
    And I am logged in as that user in the browser
    When I open my favorites
    Then "Combination Pliers" should be listed
    When I remove "Combination Pliers" from my favorites
    Then my favorites list should be empty
