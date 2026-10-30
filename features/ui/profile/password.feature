Feature: Change password
  Test repository path: Toolshop/UI/Account

  @ACC-02 @regression @ui @account
  Scenario: Change password and log in with the new one
    Given I am logged in as a new API-created user
    When I change my password to a new strong password
    Then I should see the password changed message
    When I sign out from the user menu
    And I log in with the new password
    Then I should be on the "My account" page
    When I sign out from the user menu
    And I log in with the old password
    Then I should see the invalid credentials error
