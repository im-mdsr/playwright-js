Feature: Language switch
  Test repository path: Toolshop/UI/Catalog

  @CAT-10 @regression @ui @i18n
  Scenario: Language switch changes the UI text
    Given I am on the home page
    When I switch the language to "DE"
    Then the navigation labels should be shown in "DE"
    When I switch the language to "EN"
    Then the navigation labels should be shown in "EN"
