Feature: Order totals
  Test repository path: Toolshop/UI/Checkout

  @CHK-05 @regression @ui @checkout
  Scenario: Order total equals the sum of price times quantity
    Given the cart contains the following products:
      | product            | quantity |
      | Combination Pliers | 2        |
      | Pliers             | 1        |
      | Bolt Cutters       | 3        |
    When I open the cart
    Then the cart total should equal the sum of price times quantity within 0.01
