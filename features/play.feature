Feature: Play
  In order to play
  As a user
  I want to set a stone

  Scenario: set a stone
    Given a user "Black/Test"
      And a user "White/Test"
      And "White" created a game
      And "Black" joined that game
    When I log in as "White/Test"
      And I follow "My Games"
      And I visit my first game
      And I wait for the AJAX call to finish
    Then I should see "White"
      And I should see "Black"
    When I set a stone to "1_1"
      And I wait for the AJAX call to finish
    Then I should see white on "1_1"
      And I should not see an empty board
    When I follow "Logout"
      And I log in as "Black/Test"
      And I follow "My Games"
      And I visit my first game
      And I wait for the AJAX call to finish
    Then I should see white on "1_1"
      And I should not see an empty board
    When I set a stone to "1_2"
      And I wait for the AJAX call to finish
    Then I should see black on "1_2"
    When I follow "Logout"
      And I log in as "White/Test"
      And I follow "My Games"
      And I visit my first game
      And I wait for the AJAX call to finish
    Then I should see black on "1_2"