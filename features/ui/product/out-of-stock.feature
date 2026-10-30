Feature: Out-of-stock products
  Test repository path: Toolshop/UI/Product

  @PRD-05 @regression @ui @product @edge
  Scenario: An out-of-stock product cannot be added to the cart
    Given an out-of-stock product exists
    And I am on the page of that product
    Then I should see the out-of-stock marker
    And I should not be able to add it to the cart
