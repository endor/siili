When /I set a stone to "([^\"]+)"/ do |id|
  find(:xpath, "//div[@id='#{id}']").click
end

When /"([^\"]+)" sets a stone to "([^\"]+)"/ do |user, id|
  When %Q{I log in as "#{user}/Test"}
  And %Q{I visit my first game}
  And %Q{I set a stone to "#{id}"}
  And %Q{I follow "Logout"}
end

When /"([^\"]+)" passes/ do |user|
  When %Q{I log in as "#{user}/Test"}
  And %Q{I visit my first game}
  And %Q{I follow "Pass"}
  And %Q{I follow "Logout"}  
end

When /"([^\"]+)" marks "([^\"]+)" as dead/ do |user, id|
  When %Q{I log in as "#{user}/Test"}
  And %Q{I visit my first game}
  find(:xpath, "//div[@id='#{id}']").click
  And %Q{I follow "Logout"}
end

Then /I should see (\w+) on "([^\"]+)"/ do |color, id|
  find(:css, "##{id}.field.#{color}").should_not be_nil
end

Then /I should not see (\w+) on "([^\"]+)"/ do |color, id|
  page.should_not have_css("##{id}.field.#{color}")
end