Feature: Products API
  Test repository path: Toolshop/API

  @API-01 @smoke @regression @api
  Scenario: List products returns a paginated, schema-valid response
    When I request the products list for page 1
    Then the response status should be 200
    And the response should contain the pagination fields
    And the page should contain 9 products
    And every product should match the product schema

  @API-02 @regression @api
  Scenario: Get a single product: found and not found
    Given an existing product id taken from the product list
    When I request that product
    Then the response status should be 200
    And the product should match the product schema
    When I request the product with id "doesnotexist"
    Then the response status should be 404
    And the message should be "Requested item not found"

  @API-03 @regression @api @data-driven
  Scenario Outline: Sorting, price range and search parameters
    When I request products with query "<query>"
    Then the response status should be 200
    And <assertion>

    Examples:
      | query                      | assertion                         |
      | sort=price,asc             | prices are in ascending order     |
      | sort=name,desc             | names are in descending order     |
      | between=price,1,20         | every price is between 1 and 20   |

  @API-10 @regression @api @data-driven
  Scenario Outline: Product search endpoint
    When I search products for "<term>"
    Then the response status should be 200
    And the total of results should be <outcome>

    Examples:
      | term   | outcome            |
      | pliers | greater than zero  |
      | zzzzqq | zero               |
