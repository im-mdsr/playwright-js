Feature: Known site defects
  Test repository path: Toolshop/Known defects

  Each scenario asserts the CORRECT behaviour of something that is broken on the site today, so it
  is expected to fail (@known-bug). Details and evidence are in docs/known-defects.md. When the
  site is fixed the scenario starts passing, Playwright reports that as a failure, and the tag and
  the entry in src/data/knownDefects.js should be removed.

  @KB-01 @D-01 @known-bug @a11y
  Scenario: Home page header controls have accessible names that contain their visible text
    Given I have opened the home page
    When I scan the page for accessibility violations
    Then there should be no "label-content-name-mismatch" violations

  @KB-02 @D-01 @known-bug @a11y
  Scenario: Cart page header controls have accessible names that contain their visible text
    Given I have opened the cart page
    When I scan the page for accessibility violations
    Then there should be no "label-content-name-mismatch" violations

  @KB-03 @D-02 @known-bug @a11y
  Scenario: Home page filter lists only contain list items
    Given I have opened the home page
    When I scan the page for accessibility violations
    Then there should be no "list" violations

  @KB-04 @D-03 @known-bug @a11y
  Scenario: Login page password visibility button has an accessible name
    Given I have opened the login page
    When I scan the page for accessibility violations
    Then there should be no "button-name" violations

  @KB-05 @D-04 @known-bug @resilience
  Scenario: Products API failure shows the shopper an error message
    Given the products API responds with status 500
    When I open the home page
    Then I should see an error or empty state
