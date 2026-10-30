Feature: Catalog matches API
  Test repository path: Toolshop/UI/Catalog

  @CAT-09 @regression @hybrid @catalog
  Scenario: UI product list matches the API for page 1
    Given the API returns products for page 1
    When I am on the home page
    Then the product names and prices shown should equal the API data in the same order
