import io
import json
import shutil
import os
import pandas as pd

from numpy.lib.function_base import _i0_dispatcher

data_temp_folder = "./data_temp"

data_csv_table = "./remaining_data/missing_links.csv"
if __name__ == "__main__":
    
    country_csv = pd.read_csv("./data_manipulaion/script compare/compare data/to_modify.csv")
    table_csv = pd.read_csv(data_csv_table)

    modify_list = country_csv.values.tolist()#[("Antigua and Barb.", "Antigua and Barbuda")]
    i=0
    
    country = table_csv["region"].tolist()
    for new_name, original  in modify_list:
        
        #print(original,"->",new_name)
        idx = table_csv["region"].tolist().index(original)

        table_csv.at[idx, 'region'] = new_name

    table_csv.drop(columns=["Unnamed: 0"], inplace=True)
    table_csv.to_csv("./remaining_data/missing_links_modified.csv", na_rep="NaN")
