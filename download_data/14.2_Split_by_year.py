import pandas as pd
import io
import os
import json
import numpy as np

dataTmp_folder = "./download_data/data/countries"
dataYear_folder = "./download_data/data/years"

first_year = None
last_year = None

global_dict = {}

maxTmp = -9999
minTmp = 99999


def group_year(df):

    global first_year, last_year
    year_list = df.loc[:, "Year": "Month"]
    year_dict = {}
    find_start = False
    for idx, (year, month) in enumerate(year_list.values.tolist()):
        if year >= 1750 and month == 6:
            year_dict[year] = idx
        if (first_year is None or year < first_year) and (not np.isnan(df.loc[idx, "Five-year Anomaly"])):
            first_year = year
        if (not np.isnan(df.loc[idx, "Five-year Anomaly"])):
            last_year = year
    return year_dict


# initialize the year dictionary
folders_list = [(os.path.join(dataTmp_folder, country), country)
                for country in os.listdir(dataTmp_folder)]
folders_list.append(
    ("./download_data/data/regions/Global Land", "Global Land"))

for i, (dir_path, country) in enumerate(folders_list):

    df = pd.read_csv(dir_path + "/" + country + "_anomalyTable.csv")
    year_group = group_year(df)

    for year in year_group.keys():
        if year not in global_dict:
            global_dict[year] = pd.DataFrame(
                columns=["Country", "Anomaly"])

# filling the csv files
for i, (dir_path, country) in enumerate(folders_list):
    print("[{}/{}] {}".format(i, len(folders_list), country))

    df = pd.read_csv(dir_path + "/" + country+"_anomalyTable.csv")
    year_group = group_year(df)

    for year in global_dict.keys():
        if year in year_group.keys():
            year_mean = df.loc[year_group[year], "Five-year Anomaly"]

            year_df = global_dict[year]
            new_row = {"Country": country,
                       "Anomaly": year_mean}
            global_dict[year] = year_df.append(new_row, ignore_index=True)
        else:
            year_df = global_dict[year]
            new_row = {"Country": country, "Anomaly": np.float64("NaN")}
            global_dict[year] = year_df.append(new_row, ignore_index=True)

for year in global_dict.keys():
    if not os.path.exists(dataYear_folder+"/"+str(year)):
        os.makedirs(dataYear_folder+"/"+str(year))
    curr_max = np.max(global_dict[year]["Anomaly"])
    curr_min = np.min(global_dict[year]["Anomaly"])

    maxTmp = max(maxTmp, curr_max)
    minTmp = min(minTmp, curr_min)

    global_dict[year].to_csv(
        dataYear_folder+"/"+str(year)+"/5-year_mean.csv", index=False)

print()
new_row = {"Average": "five_years",
           "First_year": first_year,
           "Last_year": last_year,
           "min_temp": minTmp,
           "max_tmp": maxTmp}
df = pd.read_csv("./download_data/extra-data/14.1_info_yearsDivision.csv", index_col=0)
df = df.append(new_row, ignore_index=True)
df.to_csv("./download_data/extra-data/14.2_info_yearsDivision.csv")
print(df)

print("Saved the files that contains the division by years, PART 2.")
