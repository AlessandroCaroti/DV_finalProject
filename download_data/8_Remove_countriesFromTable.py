import pandas as pd
import json
import io

countriesCsv_path = "./download_data/extra-data/2_countries.csv"
countriesToIgnoreList_path = "./download_data/extra-data/8_toRemove(creted_manually).txt"

if __name__ == "__main__":
    idx_toRemove = []

    with open(countriesToIgnoreList_path) as f:
        content = f.readlines()
    remove_list = [x.strip() for x in content]

    # Crete a list with the country of which we have the temperatures
    df = pd.read_csv(countriesCsv_path)
    countryName_list = df["Country"].tolist()

    for to_remove in remove_list:
        idx_toRemove.append(countryName_list.index(to_remove))
    
    df = df.drop(df.index[idx_toRemove])
    df.to_csv("./download_data/extra-data/8_countries.csv")
    print("Update countrues.csv removing the country not needed.")



