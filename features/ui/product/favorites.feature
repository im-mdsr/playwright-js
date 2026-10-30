Feature: Add to favorites
  Test repository path: Toolshop/UI/Product

  @PRD-04 @regression @ui @product
  Scenario: Add a product to favorites when logged in
    Given I am logged in as a new API-created user
    And I am on the page of the product "Combination Pliers"
    When I add the product to favorites
    Then I should see a favorite confirmation
    And "Combination Pliers" should be listed in my favorites
