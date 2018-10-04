# Plugin format the rows of csv file 
module Jekyll
    module RowFormat
        def row_format_csv(input, limit)
           if input.length < limit
             input.push(['']*(limit - input.length)).flatten!.join(',')
           else
             input.join(',')
           end
        end
    end
end

Liquid::Template.register_filter(Jekyll::RowFormat)
