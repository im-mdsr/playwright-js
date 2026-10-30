Feature: Product list
  Test repository path: Toolshop/UI/Catalog

  @CAT-01 @smoke @regression @ui @catalog
  Scenario: Home page lists products with name, price and image
    Given I am on the home page
    Then I should see 9 product cards
    And every product card should show a name, a price and an image
