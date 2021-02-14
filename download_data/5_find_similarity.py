import pandas as pd
import json
import io
from difflib import SequenceMatcher

mapFile_path = "./data/countries-10m.json"
countriesCsv_path = "./download_data/extra-data/countries.csv"
abbreviationFile_path = "./download_data/extra-data/abbreviation.csv"


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()


def search_for_similarity(countries_Temp, countries_Map):
    similarity_list = []
    corrispondance = list(set(countries_Temp) & set(countries_Map))
    abbreviation = pd.read_csv(abbreviationFile_path, index_col=0, header=0)[
        "Map Country"].tolist()

    not_in_map = sorted([c for c in countries_Temp if c not in corrispondance])
    not_in_temp = sorted([c for c in countries_Map if c not in corrispondance])

    for c in not_in_temp:
        if c in abbreviation:
            continue
        for c2 in not_in_map:
            if similar(c, c2) > 0.6:
                print(c, "->", c2)
                print("Are the same?", end="")
                if input() == "y":
                    similarity_list.append([c, c2, similar(c, c2)])
    
    print("----------------------------------------------------")
    print("\nFound {} similatities".format(len(similarity_list)))

    # Save countries data
    df = pd.DataFrame(similarity_list, columns=["Temp Country", "Map Country", "Similarity"])
    df.to_csv("./download_data/extra-data/similarity.csv")
    print("Similarity list saved.")


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

    search_for_similarity(countryTemp_list, countryMap_list)
