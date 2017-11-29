module Jekyll
    module ScanFilter
        def scan_filter(i,filter)
           !(i =~  Regexp.new(filter)).nil?
        end
    end
end

Liquid::Template.register_filter(Jekyll::ScanFilter)
