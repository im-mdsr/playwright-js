Feature: Framework sanity
  Test repository path: Toolshop/Framework

  @sanity @framework
  Scenario: The shop UI is reachable
    Given I open the home page
    Then the page title should contain "Toolshop"
    And I should see the product list

  @sanity @framework
  Scenario: The shop API is reachable
    When I request "/products" from the API
    Then the API response status should be 200
