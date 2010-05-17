Feature: user
  In order to use the site
  As a user
  I want to register and login
  
  Scenario: register
    When I go to the start page
      And I fill in "register_user" with "Hans"
      And I fill in "register_password" with "Test"
      And I press "Register"
      And I wait for the AJAX call to finish
    Then I should not see "Register"
      And I should not see "Login"
      But I should see "Logout"
    When I follow "Logout"
      And I fill in "register_user" with "Hans"
      And I fill in "register_password" with "Test"
      And I press "Register"
    Then I should see "User already registered."
      And I should see "Register"
      And I should not see "Logout"
      
  Scenario: login
    When I go to the start page
      And I fill in "register_user" with "Hans"
      And I fill in "register_password" with "Test"
      And I press "Register"
      And I wait for the AJAX call to finish
      And I follow "Logout"
      And I fill in "login_user" with "Hans"
      And I fill in "login_password" with "Test"
      And I press "Login"
    Then I should not see "Register"
      And I should not see "Login"
      But I should see "Logout"
  
  
  
