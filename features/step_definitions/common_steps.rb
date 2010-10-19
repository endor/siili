Given /a clean database/ do
  url = 'http://localhost:5984'
  db_name = 'siili'
  HTTParty.delete "#{url}/#{db_name}" rescue nil
  HTTParty.put "#{url}/#{db_name}"
  HTTParty.put Capybara.app_host + "/update_views"
  When "I go to the start page"
  page.execute_script("siili.store.clear('user')")
end

Then /^I should see "([^\"]*)" before "([^\"]*)"$/ do |first, second|
  div = $browser.div('container')
  unless div.html.match(/#{first}.*#{second}/im) 
    raise("#{first} can't be found before #{second}") 
  end
end

When /I wait for "(\d)"s/ do |seconds|
  sleep seconds.to_i
end