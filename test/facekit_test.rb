require 'minitest/autorun'
require 'capybara/dsl'
require 'capybara/poltergeist'
require 'faraday'
require 'open3'

Capybara.default_driver = :poltergeist
Capybara.app = Rack::Builder.new do
  root = File.expand_path('../../docs', __FILE__)
  use Rack::Static, index: 'index.html', urls: ['/'], root: root
  run -> (env) { [ 200, {}, ['Not Found']] }
end

`bundle exec build`

class FacekitTest < MiniTest::Test
  include Capybara::DSL
  
  def test_toggling_panel
    visit '/'
    assert_equal(true, page.has_css?('.panel', text: 'This panel is toggleable. Click on the header to toggle.'))
    find('.panel-heading', text: 'Panel').click
    assert_equal(false, page.has_css?('.panel', text: 'This panel is toggleable. Click on the header to toggle.'))
  end
  
  def test_toggling_tabs
    visit '/'
    click_on 'Tabs'

    within_example do
      assert_equal(true, page.has_css?('[data-tab-view-pane]', text: 'This is the the first tab. With any luck, it contains something very interesting.'))
      assert_equal(false, page.has_css?('[data-tab-view-pane]', text: 'This is the second tab. With not much luck, it contains even more interesting information than does tab 1.'))
    end
    
    click_on 'Tab 2'
    within_example do
      assert_equal(false, page.has_css?('[data-tab-view-pane]', text: 'This is the the first tab. With any luck, it contains something very interesting.'))
      assert_equal(true, page.has_css?('[data-tab-view-pane]', text: 'This is the second tab. With not much luck, it contains even more interesting information than does tab 1.'))
    end
  end

  def test_dismiss_message
    visit '/'
    click_on 'Flash'
    
    within_example do
      within '.message' do
        find('.delete').click
      end
      
      assert_equal(false, page.has_css?('[data-tab-view-pane]', text: 'Dismiss Body'))
    end
  end

  def test_modal
    visit '/'
    click_on 'Modal'
    
    within_example do
      click_on 'Launch Modal'
      assert_equal(true, page.has_css?('.modal', text: 'Modal This modal is truly amazing.'))
      find('.modal-close').click
      assert_equal(false, page.has_css?('.modal', text: 'Modal This modal is truly amazing.'))
    end
  end
  
  def test_dropdown
    visit '/'
    click_on 'Dropdown'
    
    within_example do
      assert_equal(false, page.has_css?('.dropdown-content', text: 'Dropdown Content'))
      click_on 'Toggle Dropdown'
      assert_equal(true, page.has_css?('.dropdown-content', text: 'Dropdown Content'))
      click_on 'Toggle Dropdown'
      assert_equal(false, page.has_css?('.dropdown-content', text: 'Dropdown Content'))
    end
  end
  
  def test_contexts
    visit '/'
    click_on 'Experimental Features'
    
    within_example do
      # All the right things are showing at the beginning.
      assert_equal(true, page.has_css?('.title', text: 'Main'))
      assert_equal(true, page.has_css?('.button', text: 'Auxiliary'))
      
      assert_equal(false, page.has_css?('.title', text: 'Auxiliary'))
      assert_equal(false, page.has_css?('.button', text: 'reset'))
      
      assert_equal(true, page.has_css?('p', text: 'remain here'))
      
      # Click the toggle.
      click_on 'Auxiliary Action'
      
      # Everything switched.
      assert_equal(false, page.has_css?('.title', text: 'Main'))
      assert_equal(true, page.has_css?('.title', text: 'Auxiliary'))
      
      assert_equal(true, page.has_css?('.button', text: 'reset'))
      assert_equal(false, page.has_css?('.button', text: 'Auxiliary'))
      
      assert_equal(true, page.has_css?('p', text: 'remain here'))
      
      # Reset
      click_on 'reset'
      
      # Everything switched back.
      assert_equal(true, page.has_css?('.title', text: 'Main'))
      assert_equal(true, page.has_css?('.button', text: 'Auxiliary'))

      assert_equal(false, page.has_css?('.title', text: 'Auxiliary'))
      assert_equal(false, page.has_css?('.button', text: 'reset'))

      assert_equal(true, page.has_css?('p', text: 'remain here'))
    end
  end
  
  def test_remote
    visit '/'
    click_on 'Remote'
  
    within_example do
      assert_equal(true, page.has_content?('Loaded from /remote/basic.html!'))
    end
    
    first('a', text: 'Form').click

    within_example do
      click_on 'Submit'
      assert_equal(true, page.has_content?('Thanks for trying the demo! If you have actual feedback, please click here to send it to me!'))
    end
  end
  
  protected
  
  def save_screen
    f = File.open('docs/screen.html', 'wb+')
    f.write(page.html)
    f.close
    `open http://localhost:9393/screen.html`
  end
  
  def within_example
    within('.is-half', text: 'Example') do
      yield
    end
  end
end
