Feature: Pagination
  Test repository path: Toolshop/UI/Catalog

  @CAT-07 @regression @ui @catalog
  Scenario: Pagination moves through pages without duplicates
    Given I am on the home page
    And I note the product names on page 1
    When I go to the next page
    Then I should see different products from page 1
    And no product should appear on both pages
    When I go to the previous page
    Then I should see the same products as the first visit to page 1
