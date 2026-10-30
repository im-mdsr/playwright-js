Feature: Product API contract
  Test repository path: Toolshop/API

  @API-09 @regression @api @contract
  Scenario: Product contract: required fields and types
    When I request the products list for page 1
    Then every product should have a string "id", a string "name" and a numeric "price"
    And every product should have a category name and a brand name
    And "in_stock" and "is_eco_friendly" should be booleans
