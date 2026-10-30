Feature: Checkout address validation
  Test repository path: Toolshop/UI/Checkout

  @CHK-02 @regression @ui @checkout @data-driven
  Scenario Outline: Billing address validation
    Given I am logged in as the demo customer
    And the cart contains 1 unit of "Combination Pliers"
    And I am on the address step
    When I leave the "<field>" field empty
    Then I should not be able to proceed to payment

    Examples:
      | field        |
      | street       |
      | city         |
      | state        |
      | postal code  |
      | house number |
