Feature: Add to cart
  Test repository path: Toolshop/UI/Product

  @PRD-03 @smoke @regression @ui @product
  Scenario: Add a product to the cart shows a toast and the cart count
    Given I am on the page of the product "Combination Pliers"
    When I add the product to the cart
    Then I should see the toast "Product added to shopping cart."
    And the cart count should be 1
