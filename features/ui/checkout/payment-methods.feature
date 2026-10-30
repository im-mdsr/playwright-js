Feature: Payment methods
  Test repository path: Toolshop/UI/Checkout

  @CHK-03 @regression @ui @checkout @data-driven
  Scenario Outline: Every payment method can complete an order
    Given I am logged in as the demo customer
    And the cart contains 1 unit of "Combination Pliers"
    And I am on the payment step with a valid billing address
    When I pay with "<method>" using valid details
    And I confirm the order
    Then I should see the order confirmation with an invoice number

    Examples:
      | method            |
      | Bank Transfer     |
      | Cash on Delivery  |
      | Credit Card       |
      | Buy Now Pay Later |
      | Gift Card         |
