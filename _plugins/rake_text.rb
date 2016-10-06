require 'rake_text'

module Jekyll
    module RakeTextS
      def rake_text(text)
        rake = RakeText.new
        a= rake.analyse text, ["custom","stopword","list"]
        a.keys
      end
  end
end

Liquid::Template.register_filter(Jekyll::RakeTextS)
