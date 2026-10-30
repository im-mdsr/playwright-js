Feature: Checkout with API-seeded data
  Test repository path: Toolshop/UI/Checkout

  @CHK-06 @smoke @regression @hybrid @checkout
  Scenario: API-seeded user and cart, UI completes the checkout
    Given a new user and a cart with 2 products are created through the API
    And I am logged in as that user in the browser
    When I open the cart
    And I proceed from the cart to the address step
    And I fill in a valid billing address
    And I proceed to the payment step
    And I pay with "Cash on Delivery"
    And I confirm the order
    Then I should see the order confirmation with an invoice number
