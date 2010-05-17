Then /I should see a game id/ do
  $browser.h1(:text, /siili - \d+/).should exist
end

Then /I should see an empty board/ do
  fields = $browser.div(:id, 'go').html.split('div').select{|div| div.match(/class="field empty"/)}
  fields.size.should == 81
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