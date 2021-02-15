import pandas as pd
import io

START_ROW = "<tr>"
END_ROW = "</tr>"

START_COL = "<td>"
END_COL = "</td>"

START_TABLE = "<table"
END_TABLE = "</table>"

H_REF = "href="


def table_parser(table_not_parsed: str):
    countries = []

    while table_not_parsed:
        start_curr_row = table_not_parsed.find(START_ROW)
        if start_curr_row == -1:
            break
        end_curr_row = table_not_parsed.find(END_ROW)

        curr_row = table_not_parsed[start_curr_row+len(START_ROW):end_curr_row]
        country = parse(curr_row)

        countries.append(country)

        table_not_parsed = table_not_parsed[end_curr_row+len(END_ROW):]

    # Save countries data
    df = pd.DataFrame(countries, columns=["Country", "Link"])
    df.to_csv("./download_data/extra-data/2_countries.csv")
    print("Countries links saved.")


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
        
    return row_parsed[0]
        



if __name__ == "__main__":
    f = io.open("./download_data/extra-data/1_table.html",
                mode="r", encoding="ISO-8859-1")
    f_str = f.read()

    # pass only the table
    start = f_str.find("<table class=\"table table-condensed table-hover\">")
    start = f_str.find("</tr>", start) + len("</tr>")
    end = f_str.find("</table>", start)

    table_parser(f_str[start: end])
