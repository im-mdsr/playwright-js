Feature: Registration
  Test repository path: Toolshop/UI/Authentication

  @AUTH-06 @regression @ui @auth
  Scenario: Register a new user and log in with the new account
    Given I am on the registration page
    When I register a new user with valid unique details
    Then I should be on the login page
    When I log in with the new user's credentials
    Then I should be on the "My account" page

  @AUTH-07 @regression @ui @auth @data-driven
  Scenario Outline: Registration validates its fields
    Given I am on the registration page
    When I submit the registration form with "<case>"
    Then I should see the validation error for "<case>"

    Examples:
      | case                |
      | all fields empty    |
      | a malformed email   |
      | a weak password     |

  @AUTH-08 @regression @ui @auth @negative
  Scenario: Registering with an already used email is rejected
    Given a registered user exists
    And I am on the registration page
    When I register using that user's email
    Then I should see the "email already registered" error
    And I should remain on the registration page
