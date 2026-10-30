Feature: Users API
  Test repository path: Toolshop/API

  @API-06 @regression @api @auth @data-driven
  Scenario Outline: Register a user: success and rejection
    When I register through the API with <payload>
    Then the response status should be <status>

    Examples:
      | payload                         | status |
      | a valid unique user             | 201    |
      | the same email again            | 409    |
      | a payload without the email     | 422    |
      | a payload without the password  | 422    |
