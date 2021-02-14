import pandas as pd
import json
import io

mapFile_path = "./data/countries-10m.json"
countriesCsv_path = "./download_data/extra-data/countries.csv"


def search_for_abbreviation(countries_Temp, countries_Map):
    abbreviation = []
    corrispondance = list(set(countries_Temp) & set(countries_Map))

    not_in_map = sorted([c for c in countries_Temp if c not in corrispondance])
    not_in_temp = sorted([c for c in countries_Map if c not in corrispondance])

    for c in not_in_temp:
        if c[-1] == ".":
            for c2 in not_in_map:
                if c[:-1] == c2[:len(c)-1]:
                    abbreviation.append([c, c2])
    
    # Save countries data
    df = pd.DataFrame(abbreviation, columns=["Map Country", "Temp Country"])
    df.to_csv("./download_data/extra-data/abbreviation.csv")


def extraxtCountry_from_map(map_file):
    countryName_list = []

    for country in map_file["objects"]["countries"]["geometries"]:
        countryName_list.append(country["properties"]["name"])

    return countryName_list


if __name__ == "__main__":

    # Crete a list with the country of which we have the temperatures
    df = pd.read_csv(countriesCsv_path)
    countryTemp_list = df["Country"].tolist()

    # Create a list with the country present in the map
    with io.open(mapFile_path, mode="r", encoding="UTF-8") as json_file:
        map_data = json.load(json_file)
        countryMap_list = extraxtCountry_from_map(map_data)

    search_for_abbreviation(countryTemp_list, countryMap_list)
