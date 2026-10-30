Feature: Categories and brands API
  Test repository path: Toolshop/API

  @API-04 @regression @api
  Scenario: Categories and brands endpoints
    When I request the categories
    Then the response status should be 200
    And the list should not be empty
    When I request the brands
    Then the response should contain the brands "ForgeFlex Tools" and "MightyCraft Hardware"
    When I request the category tree
    Then the response status should be 200
