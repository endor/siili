Then /I should see "(\d)" games/ do |number|
  page.should have_css("li.game", :count => number.to_i)
end

Then /I should see "(\d)" open game/ do |number|
  page.should have_css(".open_game", :count => number.to_i)
end
    
Then /I should see an empty board/ do
  page.should have_css("#current_game .field.empty", :count => 81)
end

Then /I should not see an empty board/ do
  page.should_not have_css("#current_game .field.empty", :count => 81)
end

When /I fill in the game id/ do
  # TODO: for some odd reason selenium thinks this input is hidden and
  #       so it doesn't fill in the game_id. why?
  patiently do
    find(:xpath, "//div[@id='facebox']//input[@class='game_id']").set @game_id
  end
end

When /I press the join button/ do
  patiently do
    find(:xpath, "//div[@id='facebox']//input[@class='join_game']").click
  end
end

When /I visit my first game/ do
  patiently do
    find(:css, "li.game:first").click
  end
end

Given /"(\w+)" created a game/ do |user|
  When "I log in as \"#{user}/Test\""
    And 'I follow "New Game"'
    patiently do
      @game_id = find(:css, "li.game:first").native.attribute('data-identifier')
    end
    And 'I follow "Logout"'
end

Given /"(\w+)" joined that game/ do |user|
  When "I log in as \"#{user}/Test\""
  sleep 1
  page.execute_script("$.ajax({ url: '/games/#{@game_id}', type: 'PUT', data: { action: 'join', user: siili.store.get('user') } })")
  When 'I follow "Logout"'
end

When /"([^\"]+)" goes to the game/ do |user_password|
  When "I log in as \"#{user_password}\""
  And 'I visit my first game'
end

Then /I should see that the current game has ended/ do
  page.should have_css("li.game.ended")
end