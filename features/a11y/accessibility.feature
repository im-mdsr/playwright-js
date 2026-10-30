Feature: Accessibility
  Test repository path: Toolshop/Quality/Accessibility

  @A11Y-01 @regression @a11y
  Scenario: Accessibility scan of the home page
    Given I have opened the home page
    When I scan the page for accessibility violations
    Then there should be no critical or serious violations

  @A11Y-02 @regression @a11y
  Scenario: Accessibility scan of the product detail page
    Given I have opened the product detail page
    When I scan the page for accessibility violations
    Then there should be no critical or serious violations

  @A11Y-03 @regression @a11y
  Scenario: Accessibility scan of the login page
    Given I have opened the login page
    When I scan the page for accessibility violations
    Then there should be no critical or serious violations

  @A11Y-04 @regression @a11y
  Scenario: Accessibility scan of the cart page
    Given I have opened the cart page
    When I scan the page for accessibility violations
    Then there should be no critical or serious violations
