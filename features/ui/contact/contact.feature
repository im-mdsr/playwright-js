Feature: Contact form
  Test repository path: Toolshop/UI/Contact

  @CON-01 @regression @ui @contact
  Scenario: Contact form submits successfully
    Given I am on the contact page
    When I send a message with subject "Customer service" and a valid message
    Then I should see the message sent confirmation

  @CON-02 @regression @ui @contact @data-driven
  Scenario Outline: Contact form validation
    Given I am on the contact page
    When I send a message with subject "<subject>" and message "<message>"
    Then I should see a validation error for "<error>"

    Examples:
      | subject          | message | error   |
      |                  |         | subject |
      | Customer service | hi      | message |
