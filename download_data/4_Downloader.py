import pandas as pd
import io
import requests
import re
import json
from os import path
import os

countries_df = "./download_data/extra-data/countries.csv"
regions_df = "./download_data/extra-data/regions.csv"

URL_ROOT = "http://berkeleyearth.lbl.gov"
DATA_FOLDER = "/auto/Regional/TAVG/Text/"

DATE_FORMAT = "%d-%b-%Y %H:%M:%S"


def pars_file(web_content, regName, data_folder):
    country_info = {"LastUpdate": None, "Name": None, "LatitudeRange": None,
                    "LongitudeRange": None, "Area(Km^2)": None, "global_landArea(%)": None,
                    "Num_stations": None, "Num_observations": None,
                    "absolute_temp(C)": None, "absTemp_unc(C)": None}
    monthly_temp = None
    anomaly_table = None

    c = 0
    while True:
        end_line = web_content.find("\n")
        line = web_content[:end_line]

        s1 = "This analysis was run on "
        s2 = "Name: "
        s3 = "Latitude Range: "
        s4 = "Longitude Range: "
        s5 = "Area: "
        s6 = "Percent of global land area: "
        s7 = "Approximate number of temperature stations: "
        s8 = "Approximate number of monthly obeservations: "
        s9 = "Estimated Jan 1951-Dec 1980 absolute temperature (C): "
        s10 = "Estimated Jan 1951-Dec 1980 monthly absolute temperature (C):"
        if line.find(s1) != -1:
            p = line.find(s1) + len(s1)
            country_info["LastUpdate"] = line[p:]
        elif line.find(s2) != -1:
            p = line.find(s2) + len(s2)
            country_info["Name"] = line[p:]
        elif line.find(s3) != -1:
            p = line.find(s3) + len(s3)
            p1 = line.find(" to ")
            country_info["LatitudeRange"] = [
                float(line[p:p1]), float(line[p1+4:])]
        elif line.find(s4) != -1:
            p = line.find(s4) + len(s4)
            p1 = line.find(" to ")
            country_info["LongitudeRange"] = [
                float(line[p:p1]), float(line[p1+4:])]
        elif line.find(s5) != -1:
            p = line.find(s5) + len(s5)
            country_info["Area(Km^2)"] = float(line[p:-5])
        elif line.find(s6) != -1:
            p = line.find(s6) + len(s6)
            country_info["global_landArea(%)"] = float(line[p:-2])
        elif line.find(s7) != -1:
            p = line.find(s7) + len(s7)
            country_info["Num_stations"] = int(line[p:])
        elif line.find(s8) != -1:
            p = line.find(s8) + len(s8)
            country_info["Num_observations"] = int(line[p:])
        elif line.find(s9) != -1:
            p = line.find(s9) + len(s9)
            p1 = line.find(" +/-")
            country_info["absolute_temp(C)"] = float(line[p:p1])
            country_info["absTemp_unc(C)"] = float(line[p1+5:])
        elif line.find(s10) != -1:
            web_content = web_content[end_line+1:]
            end_line = web_content.find("\n")
            month = web_content[:end_line]
            month = re.sub('\s+', ' ', month[1:]).split(" ")
            web_content = web_content[end_line+1:]
            end_line = web_content.find("\n")
            temp = web_content[:end_line]
            temp = re.sub('\s+', ' ', temp[2:]).split(" ")
            web_content = web_content[end_line+1:]
            end_line = web_content.find("\n")
            unc_tmp = web_content[:end_line].replace("+/-", "")
            unc_tmp = re.sub('\s+', ' ', unc_tmp[2:]).split(" ")

            monthly_temp = pd.DataFrame(
                [temp[1:], unc_tmp[1:]], columns=month[1:])

        elif line[0] != "%":
            web_content = web_content[end_line+1:]
            data = []
            web_content = re.sub(' +', ' ', web_content)
            while web_content:
                c += 1
                end_line = web_content.find("\n")
                line = web_content[:end_line].strip()

                row = line.split(" ")
                data.append(row)

                web_content = web_content[end_line+1:]
            cols = ["Year", "Month",
                    "Monthly Anomaly", "Monthly Unc.",
                    "Annual Anomaly", "Annual Unc.",
                    "Five-year Anomaly", "Five-year Unc.",
                    "Ten-year Anomaly", "Ten-year Unc.",
                    "Twenty-year Anomaly", "Twenty-year Unc."]
            anomaly_table = pd.DataFrame(data, columns=cols)
            break
        web_content = web_content[end_line+1:]

    if country_info["Name"] is None:
        print("\tWarning: Ragion Name Not Found!!!")
        country_info["Name"] = regName

    # SAVE ALL DATA
    data_folder = data_folder+"/"+country_info["Name"]
    os.makedirs(data_folder)
    anomaly_table.to_csv(
        path.join(data_folder, country_info["Name"]+"_anomalyTable.csv"))
    monthly_temp.to_csv(
        path.join(data_folder, country_info["Name"]+"_monthlyAbsoluteTemperature.csv"))

    json_f = json.dumps(country_info)
    f = open(path.join(data_folder, country_info["Name"]+"_info.json"), "w")
    f.write(json_f)
    f.close()


if __name__ == "__main__":
    df = pd.read_csv("../download_data/extra-data/countries.csv")
    error = []

    for index, row in df.iterrows():
        # Extract the DataTable url from the main page
        country_name = row[1]
        response = requests.get(row[2], allow_redirects=True)
        if response.status_code == 200:
            webContent = response.content.decode("ISO-8859-1", "backslashreplace")
            p1 = webContent.find("Data Table")
            p2 = webContent[:p1].rfind("href=")
            url = webContent[p2+6:p1-2]
        else:  # if is notpossible try to infer the url using only the country name
            print("ELSE")
            url = URL_ROOT + DATA_FOLDER + country_name.lower() + "-TAVG-Trend.txt"

        print("{}/{}  {}".format(index, len(df), country_name))

        # download thw document
        response = requests.get(url, allow_redirects=True)
        if response.status_code != 200:
            error.append((index, country_name))
            continue
        webContent = response.content.decode("ISO-8859-1", "backslashreplace")

        pars_file(webContent, country_name, "./download_data/data/counties")

    print("ERROR({}):".format(len(error)), error)
