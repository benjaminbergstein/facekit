def example
  html = yield
  escaped_html = html.gsub('<', '&lt;').gsub('>', '&gt;')
  whitespace = escaped_html.match(/\A\s+/).to_a.first
  escaped_html.gsub!("#{whitespace}", "\n")

  example_html = "<div>#{html}</div>\n"
  code_html = "<div><pre class='is-marginless'><code class='html is-paddingless is-marginless'>#{escaped_html}</code></pre></div>\n"
  "<div class='columns'><div class='column is-half'><div class='box'>#{example_html}</div></div><div class='column is-half'>#{code_html}</div></div>"
end