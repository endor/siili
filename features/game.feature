Feature: Game
  In order to play
  As a user
  I want create and join games
    
  Scenario: create a new game
    Given I am logged in as "Hans/Test"
    When I follow "New Game"
      And I wait for the AJAX call to finish
    Then I should see "Players"
      And I should see "Hans"
      And I should see a game id
      And I should see an empty board
  
  Scenario: see index of games
    Given a user "Klaus"
      And a user "Hans"
      And "Hans" created a game
      And "Klaus" joined that game
      And "Klaus" created a game
    When I log in as "Klaus/Test"
    Then I should see "2" games

  Scenario: join a game
    Given a user "Klaus/Test"
      And a user "Hans/Test"
    When I log in as "Hans/Test"
      And I follow "New Game"
      And I wait for the AJAX call to finish
      And I look up the game id
      And I follow "Join Game"
      And I fill in the game id
      And I press the join button
    Then I should see "You cannot join your own game."
    When I follow "Logout"
      And I log in as "Klaus/Test"
      And I follow "Join Game"
      And I fill in the game id
      And I press "Join"
      And I wait for the AJAX call to finish
    Then I should see "Klaus"
      And I should see "Hans"
      And I should see a game id