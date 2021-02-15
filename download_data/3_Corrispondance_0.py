#!/usr/bin/python
import pandas as pd
import json
import io

mapFile_path = "./download_data/data/map/countries-10m_V5.json"
countriesCsv_path = "./download_data/extra-data/2_countries.csv"


def compute_corrisponcance(countries_Temp, countries_Map):
    corrispondance = list(set(countries_Temp) & set(countries_Map))

    not_in_map = sorted([c for c in countries_Temp if c not in corrispondance])
    not_in_temp = sorted([c for c in countries_Map if c not in corrispondance])

    print("-{} countries for the temperature.".format(len(countries_Temp)))
    print("-{} countries present in the map.".format(len(countries_Map)))
    print("-{} countries present in both.".format(len(corrispondance)))
    print()

    print("-{} countries in TEMP but not in the MAP.".format(len(not_in_map)))
    print("-{} countries in MAP but not in TEMP.".format(len(not_in_temp)))

    save_difference(not_in_map, not_in_temp)
    #print_differnce(not_in_map, not_in_temp)


def save_difference(not_in_map, not_in_temp):
    print("\nSave the difference in a cvs[y/n]?", end=" ")
    choice = input()
    if choice == "y" or choice == "Y":
        d = {"In Temp, not in Map ({})".format(len(not_in_map)): not_in_map,
             "In Map, not in Temp ({})".format(len(not_in_temp)): not_in_temp}
        df = pd.DataFrame.from_dict(d, orient='index')
        df = df.transpose()
        df.to_csv("./download_data/extra-data/3_difference.csv")
        print("Difference saved.")
    print("_____________________________________________________")



def print_differnce(not_in_map, not_in_temp):
    print("Print difference in the console[y/n]?", end=" ")
    choice = input()
    if choice == "y" or choice == "Y":
        print("\n-------------------------------------------------------------")
        print("List of countries in TEMP but not in the MAP:")
        for c in not_in_map:
            print("-{}".format(c))

        print("\n-------------------------------------------------------------")
        print("List of countries in MAP but not in TEMP:")
        for c in not_in_temp:
            print("-{}".format(c))
    print("_____________________________________________________")


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

    compute_corrisponcance(countryTemp_list, countryMap_list)
