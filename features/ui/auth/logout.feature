Feature: Logout
  Test repository path: Toolshop/UI/Authentication

  @AUTH-05 @smoke @regression @ui @auth
  Scenario: Logout clears the session and protects the account page
    Given I am logged in as the demo customer
    When I sign out from the user menu
    Then I should be on the login page
    When I open the "/account" page directly
    Then I should be redirected to the login page
