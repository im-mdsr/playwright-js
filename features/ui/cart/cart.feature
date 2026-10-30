Feature: Shopping cart
  Test repository path: Toolshop/UI/Cart

  @CRT-01 @smoke @regression @ui @cart
  Scenario: Add multiple products and see them in the cart
    Given I am on the home page
    When I add 1 unit of "Combination Pliers" to the cart
    And I add 2 units of "Pliers" to the cart
    And I open the cart
    Then the cart should list "Combination Pliers" with quantity 1
    And the cart should list "Pliers" with quantity 2

  @CRT-02 @regression @ui @cart
  Scenario: Changing the quantity recalculates the totals
    Given the cart contains 1 unit of "Combination Pliers"
    When I open the cart
    And I change the quantity of "Combination Pliers" to 3
    Then the line price should be the unit price times 3
    And the cart total should equal the sum of the line prices

  @CRT-03 @regression @ui @cart
  Scenario: Remove an item from the cart
    Given the cart contains 1 unit of "Combination Pliers" and 1 unit of "Pliers"
    When I open the cart
    And I remove "Pliers" from the cart
    Then the cart should not list "Pliers"
    And the cart count should be 1
    And the cart total should equal the sum of the line prices

  @CRT-04 @regression @ui @cart
  Scenario: Empty cart state
    Given the cart is empty
    When I open the cart
    Then I should see an empty cart
    And I should not be able to proceed to checkout

  @CRT-05 @regression @ui @cart
  Scenario: Cart persists after a page reload
    Given the cart contains 1 unit of "Combination Pliers"
    When I reload the page
    Then the cart count should be 1
    When I open the cart
    Then the cart should list "Combination Pliers" with quantity 1
