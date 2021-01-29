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
    table_parsed = []
    start_pos = html_file.find(START_TABLE)
    start_pos = html_file.find(">", start_pos)
    end_pos = html_file.find(END_TABLE)

    table_not_parsed = html_file[start_pos:end_pos]

    while table_not_parsed:
        start_curr_row = table_not_parsed.find(START_ROW)
        if start_curr_row == -1:
            break
        end_curr_row = table_not_parsed.find(END_ROW)

        curr_row = table_not_parsed[start_curr_row+len(START_ROW):end_curr_row]

        # parse the 1° row
        start_curr_col = curr_row.find(START_COL)
        end_curr_col = curr_row.find(END_COL)

        frst_col = curr_row[start_curr_col+len(START_COL):end_curr_col]

        # extract hred for the current country
        href_start = frst_col.find(H_REF)
        href_end = frst_col.find(">", href_start)

        link = frst_col[href_start+len(H_REF)+1:href_end-1]

        # extract the current country name
        name = frst_col[href_end+1:]

        # add the information extradet to the data
        table_parsed.append([name, link])

        table_not_parsed = table_not_parsed[end_curr_row+len(END_ROW):]
    
    # save as csv
    df = pd.DataFrame(table_parsed, columns=["Country", "Link"])
    df.to_csv("./data/table.csv")

if __name__ == "__main__":
    f = io.open("./data/table.html", mode="r", encoding="utf-8")
    f_str = f.read()
    table_parser(f_str)
