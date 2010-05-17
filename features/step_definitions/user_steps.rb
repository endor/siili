Given /I am logged in as "(\w+)\/(\w+)"/ do |user, password|
  When 'I go to the start page'
  $browser.text_field(:xpath, "//div[@id='facebox']//input[@id='register_user']").set user
  $browser.text_field(:xpath, "//div[@id='facebox']//input[@id='register_password']").set password
  $browser.button(:xpath, "//div[@id='facebox']//input[@value='Register']").click
  And 'I wait for the AJAX call to finish'
end

When /I log in as "(\w+)\/(\w+)"/ do |user, password|
  When 'I go to the start page'
  $browser.text_field(:xpath, "//div[@id='facebox']//input[@id='login_user']").set user
  $browser.text_field(:xpath, "//div[@id='facebox']//input[@id='login_password']").set password
  $browser.button(:xpath, "//div[@id='facebox']//input[@value='Login']").click
  And 'I wait for the AJAX call to finish'
end

Given /a user "(\w+)\/(\w+)"/ do |user, password|
  create_user(user, password)
end

Given /a user "(\w+)"/ do |user|
  create_user(user, 'Test')
end

def create_user(user, password)
  When 'I go to the start page'
  $browser.text_field(:xpath, "//div[@id='facebox']//input[@id='register_user']").set user
  $browser.text_field(:xpath, "//div[@id='facebox']//input[@id='register_password']").set password
  $browser.button(:xpath, "//div[@id='facebox']//input[@value='Register']").click
  And 'I wait for the AJAX call to finish'
  And 'I follow "Logout"'
end