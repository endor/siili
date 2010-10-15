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
      And I visit my first game
    Then I should see "White"
      And I should see "Black"
    When I set a stone to "1_1"
      And I wait for the AJAX call to finish
    Then I should see white on "1_1"
      And I should not see an empty board
    When I follow "Logout"
      And I log in as "Black/Test"
      And I visit my first game
    Then I should see white on "1_1"
      And I should not see an empty board
    When I set a stone to "1_2"
      And I wait for the AJAX call to finish
    Then I should see black on "1_2"
    When I follow "Logout"
      And I log in as "White/Test"
      And I visit my first game
    Then I should see black on "1_2"
    
  Scenario: play in turns
    Given a user "Black2/Test"
      And a user "White2/Test"
      And "White2" created a game
      And "Black2" joined that game
    When I log in as "Black2/Test"
      And I visit my first game
      And I set a stone to "1_1"
      And I wait for the AJAX call to finish
    Then I should not see black on "1_1"
      And I should see "It's not your turn."
    When I follow "Logout"
      And I log in as "White2/Test"
      And I visit my first game
      And I set a stone to "1_1"
      And I wait for the AJAX call to finish
    Then I should see white on "1_1"
    When I set a stone to "1_2"
      And I wait for the AJAX call to finish
    Then I should not see white on "1_2"
      And I should see "It's not your turn."
      
  Scenario: cannot set stone if there already is a stone
    Given a user "Black/Test"
      And a user "White/Test"
      And "White" created a game
      And "Black" joined that game
    When "White/Test" goes to the game
      And I set a stone to "1_1"
      And I wait for the AJAX call to finish
      And I follow "Logout"
      And "Black/Test" goes to the game
      And I set a stone to "1_1"
    Then I should see white on "1_1"
      And I should not see black on "1_1"