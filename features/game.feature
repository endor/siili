Feature: Game
  In order to play
  As a user
  I want create and join games

  Background:
    Given a clean database

  Scenario: create a new game
    Given I am logged in as "Hans/Test"
    When I follow "New Game"
    Then I should see "Players"
      And I should see "Hans"
      And I should see an empty board
  
  Scenario: see index of games
    Given a user "Klaus"
      And a user "Hans"
      And "Hans" created a game
      And "Klaus" joined that game
      And "Klaus" created a game
    When I log in as "Klaus/Test"
    Then I should see "2" games