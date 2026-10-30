Feature: Checkout flow
  Test repository path: Toolshop/UI/Checkout

  @CHK-01 @smoke @regression @e2e @checkout
  Scenario: End-to-end purchase as a logged-in customer
    Given I am logged in as the demo customer
    And the cart contains 1 unit of "Combination Pliers"
    When I proceed from the cart to the address step
    And I fill in a valid billing address
    And I proceed to the payment step
    And I pay with "Cash on Delivery"
    And I confirm the order
    Then I should see the order confirmation with an invoice number
