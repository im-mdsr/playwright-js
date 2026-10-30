Feature: Payment validation
  Test repository path: Toolshop/UI/Checkout

  @CHK-04 @regression @ui @checkout @negative
  Scenario: Invalid payment details are rejected
    Given I am logged in as the demo customer
    And the cart contains 1 unit of "Combination Pliers"
    And I am on the payment step with a valid billing address
    When I pay with "Credit Card" using card number "1234" and an expired date
    And I try to confirm the order
    Then I should see payment validation errors
    And no order should be placed
