import pandas as pd
import json
import io
import os

countriesData_path = "./download_data/data/countries"
countriesToModifyList_path = "./download_data/extra-data/12_toRename(created_manually).csv"

if __name__ == "__main__":
    errors = []
    df = pd.read_csv(countriesToModifyList_path, header=0)

    for index, row in df.iterrows():
        oldName = row[0]
        newName = row[1]
        if not os.path.isdir(os.path.join(countriesData_path, oldName)):
            errors.append([oldName, newName])
            continue

        # Modify json file
        with io.open(os.path.join(countriesData_path, oldName, oldName+"_info.json"), mode="r", encoding="ISO-8859-1") as json_file:
            country_info = json.load(json_file)
            country_info["Name"] = newName

            json_f = json.dumps(country_info)
            f = open(os.path.join(countriesData_path,
                                  oldName, newName+"_info.json"), "w", encoding="ISO-8859-1")
            f.write(json_f)
            f.close()

        # Remove old json file
        os.remove(os.path.join(countriesData_path,
                               oldName, oldName+"_info.json"))

        # Modify anomalyTable fileName
        os.rename(os.path.join(countriesData_path, oldName, oldName+"_anomalyTable.csv"),
                  os.path.join(countriesData_path, oldName, newName+"_anomalyTable.csv"))

        # Modify monthlyAbsoluteTemperature fileName
        os.rename(os.path.join(countriesData_path, oldName, oldName+"_monthlyAbsoluteTemperature.csv"),
                  os.path.join(countriesData_path, oldName, newName+"_monthlyAbsoluteTemperature.csv"))

        # Modify directory fileName
        os.rename(os.path.join(countriesData_path, oldName),
                  os.path.join(countriesData_path, newName))
        print(oldName,"->",newName)

    print("\nERRORS({}):{}".format(len(errors), errors))
