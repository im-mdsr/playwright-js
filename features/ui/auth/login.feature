Feature: Login
  Test repository path: Toolshop/UI/Authentication

  @AUTH-01 @smoke @regression @ui @auth
  Scenario: Valid login lands on My account
    Given I am on the login page
    When I log in with the demo customer credentials
    Then I should be on the "My account" page
    And my name should be shown in the header menu

  @AUTH-02 @smoke @regression @ui @auth @negative
  Scenario: Login with wrong password shows error
    Given I am on the login page
    When I log in with the demo customer email and password "Wrong#123"
    Then I should see the invalid credentials error
    And I should remain on the login page

  @AUTH-03 @regression @ui @auth @negative
  Scenario: Login with unknown email shows error
    Given I am on the login page
    When I log in with an unregistered email and password "Pass#12345"
    Then I should see the invalid credentials error

  @AUTH-04 @regression @ui @auth @data-driven
  Scenario Outline: Login form validates empty fields
    Given I am on the login page
    When I log in with email "<email>" and password "<password>"
    Then I should see a required-field error for "<missing>"

    Examples:
      | email   | password | missing            |
      |         |          | email and password |
      | valid   |          | password           |
      |         | valid    | email              |
