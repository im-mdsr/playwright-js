Feature: Product sorting
  Test repository path: Toolshop/UI/Catalog

  @CAT-06 @regression @ui @catalog @data-driven
  Scenario Outline: Sort products
    Given I am on the home page
    When I sort the products by "<option>"
    Then the products should be ordered by <field> <direction>

    Examples:
      | option             | field | direction  |
      | Name (A - Z)       | name  | ascending  |
      | Name (Z - A)       | name  | descending |
      | Price (Low - High) | price | ascending  |
      | Price (High - Low) | price | descending |
