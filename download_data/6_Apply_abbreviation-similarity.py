import pandas as pd
import json
import io
import os

mapFile_path = "./download_data/data/map/countries-10m_V34.json"
abbreviationFile_path = "./download_data/extra-data/4_abbreviation.csv"
similarityFile_path = "./download_data/extra-data/5_similarity.csv"


def modify_countriesName(data_map):
    found = False
    errors = []
    df_abbreviation = pd.read_csv(abbreviationFile_path)
    df_similarity = pd.read_csv(similarityFile_path)

    countries = data_map["objects"]["countries"]["geometries"]

    # Apply abbreviation
    print("APPLY ABBREVIATIONS:")
    for index, row in df_abbreviation.iterrows():
        print("{:>2}) {:>27} -> {:>40}...".format(index, row[1], row[2]), end="\t  ")
        for pos, el in enumerate(countries):
            if el["properties"]["name"] == row[1]:
                el["properties"]["name"] = row[2]
                found = True
        if found:
            print("DONE.")
        else:
            print("NOT FOUND!")
            errors.append([row[1], row[2]])
    print("--------------------------------------------------------------------------------------\n")

    # Apply similarity
    print("APPLY SIMILARITY:")
    for index, row in df_similarity.iterrows():
        print("{:>2}) {:>27} -> {:>40}...".format(index, row[1], row[2]), end="\t  ")
        for pos, el in enumerate(countries):
            if el["properties"]["name"] == row[1]:
                el["properties"]["name"] = row[2]
                found = True
        if found:
            print("DONE.")
        else:
            print("NOT FOUND!")
            errors.append([row[1], row[2]])
    print("--------------------------------------------------------------------------------------\n")
    print("-ERRORS({}):{}".format(len(errors), errors))
    
    
    save_newMap(data_map)
    print("-New map saved.")
    
def save_newMap(data):
    new_name = mapFile_path[:-5] + "_6"+".json"

    json_f = json.dumps(data)
    f = open(new_name, "w")
    f.write(json_f)
    f.close()


if __name__ == "__main__":

    # Create a list with the country present in the map
    with io.open(mapFile_path, mode="r", encoding="UTF-8") as json_file:
        map_data = json.load(json_file)
        modify_countriesName(map_data)
