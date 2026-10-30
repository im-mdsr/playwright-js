Feature: Forgot password
  Test repository path: Toolshop/UI/Authentication

  @AUTH-09 @regression @ui @auth
  Scenario: Forgot password form validates the email
    Given I am on the login page
    When I click the forgot password link
    Then I should see the forgot password form
    When I submit the forgot password form without an email
    Then I should see a required-field error for "email"
