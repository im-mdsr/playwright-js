Feature: Invoices
  Test repository path: Toolshop/UI/Checkout

  @CHK-07 @regression @hybrid @checkout
  Scenario: A completed order appears in My invoices
    Given a new user places an order through the API
    And I am logged in as that user in the browser
    When I open my invoices
    Then my invoices should list the new invoice number with the correct total
