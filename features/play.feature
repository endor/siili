Feature: Play
  In order to play
  As a user
  I want to set a stone

  Background:
    Given a clean database
      And a user "Black/Test"
      And a user "White/Test"
      
  Scenario: set a stone
    Given "White" created a game
      And "Black" joined that game
    When I log in as "White/Test"
      And I visit my first game
    Then I should see "White"
      And I should see "Black"
    When I set a stone to "1_1"
    Then I should see white on "1_1"
      And I should not see an empty board
    When I follow "Logout"
      And I log in as "Black/Test"
      And I visit my first game
    Then I should see white on "1_1"
      And I should not see an empty board
    When I set a stone to "1_2"
    Then I should see black on "1_2"
    When I follow "Logout"
      And I log in as "White/Test"
      And I visit my first game
    Then I should see black on "1_2"
    
  Scenario: play in turns
    Given "White" created a game
      And "Black" joined that game
    When I log in as "Black/Test"
      And I visit my first game
      And I set a stone to "1_1"
    Then I should not see black on "1_1"
      And I should see "It's not your turn."
    When I follow "Logout"
      And I log in as "White/Test"
      And I visit my first game
      And I set a stone to "1_1"
    Then I should see white on "1_1"
    When I set a stone to "1_2"
    Then I should not see white on "1_2"
      And I should see "It's not your turn."
      
  Scenario: cannot set stone if there already is a stone
    Given "White" created a game
      And "Black" joined that game
    When "White/Test" goes to the game
      And I set a stone to "1_1"
      And I follow "Logout"
      And "Black/Test" goes to the game
      And I set a stone to "1_1"
    Then I should see white on "1_1"
      And I should not see black on "1_1"