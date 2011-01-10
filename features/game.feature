Feature: Game
  In order to play
  As a user
  I want create and join games

  Background:
    Given a clean database

  Scenario: create a new game
    Given I am logged in as "White/Test"
    When I follow "New Game"
      And I visit my first game
    Then I should see "White"
      And I should see an empty board
  
  Scenario: see index of games
    Given a user "White"
      And a user "Black"
      And "Black" created a game
      And "White" joined that game
      And "White" created a game
    When I log in as "White/Test"
    Then I should see "2" games

  Scenario: resign game
    Given a user "White"
      And a user "Black"
      And "White" created a game
      And "Black" joined that game
    When I log in as "White/Test"
      And I visit my first game
      And I set a stone to "1_1"
      And I follow "Logout"
      And I log in as "Black/Test"
      And I visit my first game
      And I follow "Resign"
    Then I should see "You resigned."
    When I follow "Logout"
      And I log in as "White/Test"
      And I visit my first game
    Then I should see "Black resigned."
    When I follow "Logout"
      And I log in as "Black/Test"
      And I visit my first game
    Then I should see "You resigned."
      And I should see that the current game has ended

  Scenario: end game by passing
    Given a user "White"
      And a user "Black"
      And "White" created a game
      And "Black" joined that game
    When I log in as "White/Test"
      And I visit my first game
      And I follow "Pass"
      And I follow "Logout"
      And I log in as "Black/Test"
      And I visit my first game
    Then I should see "White passed."
    When I set a stone to "1_1"
      And I follow "Logout"
      And I log in as "White/Test"
      And I visit my first game
      And I follow "Pass"
      And I follow "Logout"
      And I log in as "Black/Test"
      And I visit my first game
      And I follow "Pass"
    Then I should see that the current game has ended
    When I follow "Logout"
      And I log in as "White/Test"
      And I visit my first game
    Then I should see that the current game has ended
      
  Scenario: see list of open games
    Given a user "White"
      And a user "Black"
      And "Black" created a game
      And "White" joined that game
      And "Black" created a game
    When I log in as "White/Test"
      And I follow "Open Games"
    Then I should see "1" open game