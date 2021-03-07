import pandas as pd
import json
import io, os

mapFile_path = "./download_data/data/map/countries-10m_V35_6.json"
countries_directory = "./download_data/data/counties"

def extraxtCountry_from_map(map_file):
    countryName_list = []

    for country in map_file["objects"]["countries"]["geometries"]:
        countryName_list.append(country["properties"]["name"])

    countryName_list.sort()
    return countryName_list

if __name__ == "__main__":

    # Crete a list with the country of which we have the temperatures
    countryTemp_list = os.listdir(countries_directory)
    countryTemp_list.sort()

    # Create a list with the country present in the map
    with io.open(mapFile_path, mode="r", encoding="UTF-8") as json_file:
        map_data = json.load(json_file)
        countryMap_list = extraxtCountry_from_map(map_data)
    
    d = {"Temp": countryTemp_list, "Map": countryMap_list}
    
    df = pd.DataFrame.from_dict(d, orient='index')
    df = df.transpose()
    df.to_csv("./download_data/extra-data/15_countries_list.csv")