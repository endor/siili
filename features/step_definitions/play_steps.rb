When /I set a stone to "([^\"]+)"/ do |id|
  find(:xpath, "//div[@id='#{id}']").click
end

Then /I should see (\w+) on "([^\"]+)"/ do |color, id|
  find(:css, "##{id}.field.#{color}").should_not be_nil
end

Then /I should not see (\w+) on "([^\"]+)"/ do |color, id|
  find(:css, "##{id}.field.#{color}").should be_nil
end