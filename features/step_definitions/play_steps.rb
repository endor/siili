When /I set a stone to "([^\"]+)"/ do |id|
  $browser.div(:xpath, "//div[@id='#{id}']").click
end

Then /I should see (\w+) on "([^\"]+)"/ do |color, id|
  $browser.div(:xpath, "//div[@id='#{id}']").class_name.should match(/field #{color}/)
end

Then /I should not see (\w+) on "([^\"]+)"/ do |color, id|
  $browser.div(:xpath, "//div[@id='#{id}']").class_name.should_not match(/field #{color}/)
end