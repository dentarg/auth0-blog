f = open("./keywords.txt")
$smartlist = []
f.each_line { |line| $smartlist.push line.strip }
f.close

module Jekyll
    module KeywordsText
      def keywords_text(text)
        @arr=[]
          $smartlist.map { |word|
            if text.scan(/#{word}/).flatten.any?
            	 @arr.push(word)
            end
          }

        @arr.join(',')
      end
  end
end

Liquid::Template.register_filter(Jekyll::KeywordsText)
