import pandas as pd
import io
import json
import os
import numpy as np

dataTmp_folder = ["./download_data/data/counties", "./download_data/data/regions"]
dataYear_folder = "./download_data/data/years"

global_dict = {}

maxTmp = -9999
minTmp = 99999


def group_year(year_list):

    year_dict = {}
    for idx, (year, month) in enumerate(year_list.values.tolist()):
        if year not in year_dict or month == 5:
            year_dict[year] = idx
    return year_dict

# initialize the year dictionary
country_list = os.listdir(dataTmp_folder)
for i, country in enumerate(country_list):
    
    try:
        df = pd.read_csv(dataTmp_folder+"/" + country +
                         "/" + country+"_anomalyTable.csv")
    except:
        df = pd.read_csv(dataTmp_folder+"/" + country +
                         "/" + country+"._anomalyTable.csv")

    year_group = group_year(df.loc[:,"Year": "Month"])

    for year in year_group.keys():
        year_mean = df.iloc[year_group[year], 5]
        unc_mean = df.iloc[year_group[year], 6]

        if year not in global_dict:
            global_dict[year] = pd.DataFrame(columns=["Country", "Anomaly", "Unc."])

# filling the csv files
for i, country in enumerate(country_list):
    print("[{}/{}] {}".format(i, len(country_list), country))

    try:
        df = pd.read_csv(dataTmp_folder+"/" + country +
                         "/" + country+"_anomalyTable.csv")
    except:
        df = pd.read_csv(dataTmp_folder+"/" + country +
                         "/" + country+"._anomalyTable.csv")

    year_group = group_year(df.loc[:,"Year": "Month"])

    for year in global_dict.keys():
        if year in year_group.keys():
            year_mean = df.iloc[year_group[year], 5]
            unc_mean = df.iloc[year_group[year], 6]

            year_df = global_dict[year]
            new_row = {"Country": country, "Anomaly": year_mean, "Unc.": unc_mean}
            global_dict[year] = year_df.append(new_row, ignore_index=True)
        else:
            year_df = global_dict[year]
            new_row = {"Country": country, "Anomaly": np.float64("NaN"), "Unc.": np.float64("NaN")}
            global_dict[year] = year_df.append(new_row, ignore_index=True)

for year in global_dict.keys():
    if not os.path.exists(dataYear_folder+"/"+str(year)):
                os.makedirs(dataYear_folder+"/"+str(year))
    curr_max = np.max(global_dict[year]["Anomaly"])
    curr_min = np.min(global_dict[year]["Anomaly"])

    maxTmp = max(maxTmp, curr_max)
    minTmp = min(minTmp, curr_min)
    
    global_dict[year].to_csv(dataYear_folder+"/"+str(year)+"/Annual_mean.csv")

print(minTmp, maxTmp)



