Feature: Product search
  Test repository path: Toolshop/UI/Catalog

  @CAT-02 @smoke @regression @ui @catalog
  Scenario: Search by keyword returns matching products
    Given I am on the home page
    When I search for "pliers"
    Then I should see at least 1 product
    And every product should match "pliers"

  @CAT-03 @regression @ui @catalog @negative
  Scenario: Search with no match shows the empty state
    Given I am on the home page
    When I search for "zzzzqq"
    Then I should see no products
    And I should see the no-results message
