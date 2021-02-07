import os
import shutil
import pandas as pd


data_temp_folder = "./remaining_data/data_new"

data_temp_remove = "./remaining_data/data_new_removed"


if __name__ == "__main__":

    remove_csv = pd.read_csv("./data_manipulaion/script compare/compare data/to_remove.csv")

    remove_list = remove_csv.values.tolist()  
    for [region]  in remove_list:

        dir = os.path.join(data_temp_folder, region )

        if not os.path.exists(dir):
            if os.path.exists(os.path.join(data_temp_remove, region)):
                print(region, " already removed!")
            else:
                print(region, "don't exist!")
            continue

        dest = shutil.move(dir, data_temp_remove)

        print(dest)


    
    # Remove folder_OLD
    folders = os.listdir(data_temp_folder)

    for folder in folders:

        if folder[-3:] =="OLD":
            dir = os.path.join(data_temp_folder, folder )
                

            dest = shutil.move(dir, data_temp_remove)
            print(dest)