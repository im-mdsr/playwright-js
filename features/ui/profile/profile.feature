Feature: Profile
  Test repository path: Toolshop/UI/Account

  @ACC-01 @regression @ui @account
  Scenario: Update profile details
    Given I am logged in as a new API-created user
    When I open my profile
    And I change my phone and city and save
    Then I should see the profile saved message
    When I reload my profile
    Then my profile should show the new phone and city
