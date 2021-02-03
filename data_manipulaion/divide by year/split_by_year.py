import pandas as pd
import io
import json
import os
import numpy as np

dataTmp_folder = "./data/data_temp"
dataYear_folder = "./data/data_year"

global_dict = {}

max = -9999
min = 99999


def group_year(year_list):

    year_dict = {}
    for idx, (year, month) in enumerate(year_list.values.tolist()):
        if year not in year_dict or month == 5:
            year_dict[year] = idx
    return year_dict

country_list = os.listdir(dataTmp_folder)
for i, country in enumerate(country_list):
    print("[{}/{}] {}".format(i, len(country_list), country))
    try:
        df = pd.read_csv(dataTmp_folder+"/" + country +
                         "/" + country+"_anomalyTable.csv")
    except:
        df = pd.read_csv(dataTmp_folder+"/" + country +
                         "/" + country+"._anomalyTable.csv")

    year_group = group_year(df.loc[:,"Year": "Month"])

    for year in year_group.keys():
        print(year, df.iloc[year_group[year], 5])

        year_mean = df.iloc[year_group[year], 5]
        unc_mean = df.iloc[year_group[year], 6]

        if year not in global_dict:
            global_dict[year] = pd.DataFrame(columns=["Country", "Anomaly", "Unc."])

        year_df = global_dict[year]
        new_row = {"Country": country, "Anomaly": year_mean, "Unc.": unc_mean}
        global_dict[year] = year_df.append(new_row, ignore_index=True)
    exit()

for year in global_dict.keys():
    if not os.path.exists(dataYear_folder+"/"+str(year)):
                os.makedirs(dataYear_folder+"/"+str(year))
    curr_max = np.max(global_dict[year]["Anomaly"])
    curr_min = np.min(global_dict[year]["Anomaly"])
    if(curr_max > max):
        max = curr_max
    if(curr_min < min):
        min = curr_min
    global_dict[year].to_csv(dataYear_folder+"/"+str(year)+"/Annual_mean.csv")

print(min, max)



