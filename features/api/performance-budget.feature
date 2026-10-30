Feature: API response time budget
  Test repository path: Toolshop/API

  @API-08 @regression @api @performance
  Scenario Outline: Responses stay within the time budget
    When I request "<endpoint>"
    Then the response time should be under 2000 ms

    Examples:
      | endpoint  |
      | /products |
      | /brands   |
