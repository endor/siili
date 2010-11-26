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

  # | - - - - - - - - - |
  # |     w b           |
  # |     w b           |
  # |     w b           |
  # |     w b           |
  # |     w b           |
  # |     w b           |
  # |     w b           |
  # | - - - - - - - - - |
  Scenario: japanese counting for clean areas
    Given "White" created a game
      And "Black" joined that game
    When "White" sets a stone to "0_2"
      And "Black" sets a stone to "0_3"
      And "White" sets a stone to "1_2"
      And "Black" sets a stone to "1_3"
      And "White" sets a stone to "2_2"
      And "Black" sets a stone to "2_3"
      And "White" sets a stone to "3_2"
      And "Black" sets a stone to "3_3"
      And "White" sets a stone to "4_2"
      And "Black" sets a stone to "4_3"
      And "White" sets a stone to "5_2"
      And "Black" sets a stone to "5_3"
      And "White" sets a stone to "6_2"
      And "Black" sets a stone to "6_3"
      And "White" sets a stone to "7_2"
      And "Black" sets a stone to "7_3"
      And "White" sets a stone to "8_2"
      And "Black" sets a stone to "8_3"
      And "White" passes
      And "Black" passes
      And "White/Test" goes to the game
    Then I should see "Black has won by 27.0"
    When I follow "Logout"
      And "Black/Test" goes to the game
    Then I should see "You have won by 27.0"