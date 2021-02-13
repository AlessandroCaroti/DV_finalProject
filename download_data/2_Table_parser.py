import pandas as pd
import io

START_ROW = "<tr>"
END_ROW = "</tr>"

START_COL = "<td>"
END_COL = "</td>"

START_TABLE = "<table"
END_TABLE = "</table>"

H_REF = "href="


def table_parser(html_file: str):
    countries = []
    regions = []
    table_not_parsed = html_file

    while table_not_parsed:
        start_curr_row = table_not_parsed.find(START_ROW)
        if start_curr_row == -1:
            break
        end_curr_row = table_not_parsed.find(END_ROW)

        curr_row = table_not_parsed[start_curr_row+len(START_ROW):end_curr_row]
        country, region = parse(curr_row)

        countries.append(country)
        regions.append(region)

        table_not_parsed = table_not_parsed[end_curr_row+len(END_ROW):]

    # remove duplicates
    regions = set(tuple(row) for row in regions)

    # Save countries data
    df = pd.DataFrame(countries, columns=["Country", "Link", "Region"])
    df.to_csv("./download_data/extra-data/countries.csv")
    
    # Save regions data
    df = pd.DataFrame(regions, columns=["Region", "Link"])
    df.to_csv("./download_data/extra-data/reagions.csv")

def parse(row):
    row_parsed = []
    while row:
        start_col = row.find(START_COL)
        if start_col == -1:
            break
        end_col = row.find(END_COL, start_col)

        col = row[start_col+len(START_COL):end_col]
        row = row[end_col:]
        
        if col.find(H_REF) == -1:
            continue

        href_start = col.find(H_REF)
        href_end = col.find(">", href_start)

        name = col[href_end+1:]
        link = col[href_start+len(H_REF)+1:href_end-1]
        
        row_parsed.append([name, link])
    
    # If resent add the ragion associated to the country
    row_parsed.append(["",""])
    row_parsed[0].append(row_parsed[1][0])
    
    return row_parsed[0], row_parsed[1] 
        



if __name__ == "__main__":
    f = io.open("./download_data/extra-data/table.html",
                mode="r", encoding="ISO-8859-1")
    f_str = f.read()

    # pass only the table
    start = f_str.find("<table class=\"table table-condensed table-hover\">")
    start = f_str.find("</tr>", start) + len("</tr>")
    end = f_str.find("</table>", start)

    table_parser(f_str[start: end])
