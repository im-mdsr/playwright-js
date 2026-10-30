Feature: Product detail
  Test repository path: Toolshop/UI/Product

  @PRD-01 @smoke @regression @ui @product
  Scenario: Product detail matches the card and the API
    Given I am on the home page
    When I open the product "Combination Pliers"
    Then the product detail should match the list card
    And the product detail should match the API data

  @PRD-02 @regression @ui @product
  Scenario: Change quantity with the plus and minus controls
    Given I am on the page of the product "Combination Pliers"
    When I increase the quantity 2 times
    Then the quantity should be 3
    When I decrease the quantity 1 time
    Then the quantity should be 2
    When I decrease the quantity 5 times
    Then the quantity should be 1
