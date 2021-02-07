import io
import json
import shutil
import os
import pandas as pd

from numpy.lib.function_base import _i0_dispatcher

#data_temp_folder = "./data_temp"
data_temp_folder = "./remaining_data/data_new"

if __name__ == "__main__":
    
    country_csv = pd.read_csv("./data_manipulaion/script compare/compare data/to_modify.csv")


    modify_list = country_csv.values.tolist()#[("Antigua and Barb.", "Antigua and Barbuda")]
    
    i=0
    for new_name, original  in modify_list:
        print(original,"->",new_name)
        old_dir = os.path.join(data_temp_folder, original)
        new_dir = os.path.join(data_temp_folder, new_name)
        
        
        if os.path.exists( old_dir+"_OLD"):
            i+=1
            #print(original,"->",new_name)
            continue

        if not os.path.exists(old_dir):
            print("\n\nERRORE!!!")
            print("Directory {} not exist!\n\n".format(old_dir))
            continue
        
        try:
            os.mkdir(new_dir)

            #json
            print(os.path.join(old_dir,original+"_info.json"))
            with open(os.path.join(old_dir,original+"_info.json")) as json_file:
                data = json.load(json_file)
                data["Name"] = new_name

                json_f = json.dumps(data)
                f = open(os.path.join(new_dir, new_name+"_info.json"), "w")
                f.write(json_f)
                f.close()
            

            #anomalyTable
            shutil.copyfile(os.path.join(old_dir,original+"_anomalyTable.csv"),
                            os.path.join(new_dir,new_name+"_anomalyTable.csv"))

            #monthlyAbsoluteTemp
            shutil.copyfile(os.path.join(old_dir,original+"_monthlyAbsoluteTemperature.csv"),
                            os.path.join(new_dir,new_name+"_monthlyAbsoluteTemperature.csv"))


            os.rename(old_dir, old_dir+"_OLD")
        except ValueError as err:
            if os.path.exists(new_dir):
                os.remove(new_dir)
            print("ERRORE")
            raise err

    print("COUNT:", i)
    
    list_dir = pd.DataFrame()
    list_dir["Country"]=os.listdir(data_temp_folder) 
    list_dir.to_csv("country_corrected.csv", header=True, index=False)