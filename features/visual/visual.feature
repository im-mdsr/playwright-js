Feature: Visual regression
  Test repository path: Toolshop/Quality/Visual

  @VIS-01 @regression @visual
  Scenario: Visual snapshot of the header and navigation
    Given I am on the home page with dynamic content masked
    Then the header and navigation should match its visual baseline

  @VIS-02 @regression @visual
  Scenario: Visual snapshot of the first product card
    Given I am on the home page with dynamic content masked
    Then the first product card should match its visual baseline

  @VIS-03 @regression @visual
  Scenario: Visual snapshot of the footer
    Given I am on the home page with dynamic content masked
    Then the footer should match its visual baseline
