Feature: Authentication API
  Test repository path: Toolshop/API

  @API-05 @smoke @regression @api @auth
  Scenario: Login returns a token for valid credentials and 401 otherwise
    When I log in through the API with the demo customer credentials
    Then the response status should be 200
    And the response should contain a JWT access token
    When I log in through the API with a wrong password
    Then the response status should be 401
    And the error should be "Unauthorized"

  @API-07 @regression @api @auth @data-driven
  Scenario Outline: Protected endpoints require a valid token
    When I request "<endpoint>" with <token>
    Then the response status should be <status>

    Examples:
      | endpoint    | token          | status |
      | /users/me   | no token       | 401    |
      | /favorites  | no token       | 401    |
      | /invoices   | no token       | 401    |
      | /users/me   | a valid token  | 200    |
      | /users/me   | a tampered one | 401    |
