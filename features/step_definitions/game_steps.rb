Then /I should see "(\d)" games/ do |number|
  $browser.ul(:id, 'games').html.split('<li').select{|li| li.match(/class="game"/)}.size.should == number.to_i
end

Then /I should see a game id/ do
  $browser.h1(:text, /siili - \d+/).should exist
end

Then /I should see an empty board/ do
  fields = $browser.div(:id, 'go').html.split('div').select{|div| div.match(/class="field empty"/)}
  fields.size.should == 81
end

Then /I should not see an empty board/ do
  fields = $browser.div(:id, 'go').html.split('div').select{|div| div.match(/class="field empty"/)}
  fields.size.should_not == 81
end

When /I look up the game id/ do
  @game_id = $browser.h1(:text, /siili - \d+/).html.match(/siili - (\d+)/)[1]
end

When /I fill in the game id/ do
  $browser.text_field(:xpath, "//div[@id='facebox']//input[@class='game']").set @game_id
end

When /I press the join button/ do
  $browser.button(:xpath, "//div[@id='facebox']//input[@class='join_game']").click
end

When /^I visit my first game$/ do
  $browser.link(:xpath, "//a[@class='game']").click
  When 'I wait for the AJAX call to finish'
end

Given /"(\w+)" created a game/ do |user|
  When "I log in as \"#{user}/Test\""
    And 'I follow "New Game"'
    And 'I wait for the AJAX call to finish'
    @game_id = $browser.h1(:text, /siili - \d+/).html.match(/siili - (\d+)/)[1]
    And 'I follow "Logout"'
end

Given /"(\w+)" joined that game/ do |user|
  When "I log in as \"#{user}/Test\""
    And 'I follow "Join Game"'
    And 'I fill in the game id'
    And 'I press the join button'
    And 'I follow "Logout"'
end

When /"([^\"]+)" goes to the game/ do |user_password|
  When "I log in as \"#{user_password}\""
  And 'I visit my first game'
end