Feature: Product filters
  Test repository path: Toolshop/UI/Catalog

  @CAT-04 @regression @ui @catalog
  Scenario: Filter products by category
    Given I am on the home page
    When I filter by category "Pliers"
    Then every product should belong to category "Pliers"
    And the number of products should match the API for category "Pliers"

  @CAT-05 @regression @ui @catalog
  Scenario: Filter products by brand
    Given I am on the home page
    When I filter by brand "ForgeFlex Tools"
    Then every product should belong to brand "ForgeFlex Tools"

  @CAT-08 @regression @ui @catalog
  Scenario: Search combined with a category filter
    Given I am on the home page
    And I filter by category "Pliers"
    When I search for "combination"
    Then every product should belong to category "Pliers"
    And every product should match "combination"
