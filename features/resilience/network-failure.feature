Feature: Network resilience
  Test repository path: Toolshop/Quality/Resilience

  @RES-01 @regression @resilience
  Scenario: Products API failure: the UI degrades gracefully
    Given the products API responds with status 500
    When I open the home page
    Then I should see no products
    And there should be no uncaught page errors

  @RES-02 @regression @resilience
  Scenario: Slow products response shows loading then content
    Given the products API responds after 3 seconds
    When I open the home page
    Then I should see the loading state
    And I should see 9 product cards after loading

  @RES-03 @regression @resilience
  Scenario: Empty products list shows the empty state
    Given the products API returns an empty list
    When I open the home page
    Then I should see the no-results message
