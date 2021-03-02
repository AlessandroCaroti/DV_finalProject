import time
from datetime import timedelta

if __name__ == "__main__":

    step = 1

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/1_Download_table.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/2_Table_parser.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/3_Corrispondance_0.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/4_Find_abbreviation.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/5_Find_similarity.py").read())
    step += 1
    print("########################################################################################################################\n")
    
    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/6_Apply_abbreviation-similarity.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/7_Corrispondance_1.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/8_Remove_countriesFromTable.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/9_Corrispondance_2.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/10_Add_regions.py").read())
    step += 1
    print("########################################################################################################################\n")
    
    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/11_downloader.py").read())
    step += 1
    print("########################################################################################################################\n")
    
    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/12_Modify_countriesName.py").read())
    step += 1
    print("########################################################################################################################\n")
    
    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/13_Corrispondance_3.py").read())
    step += 1
    print("########################################################################################################################\n")
    
    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/14.1_Split_by_year.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/14.2_Split_by_year.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/14.3_Split_by_year.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/14.4_Split_by_year.py").read())
    step += 1
    print("########################################################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/15_Create_countryList.py").read())
    step += 1
    print("########################################################################################################################\n")
    
    print("\t\t\nSUCCCCESSSSSSSSSSSSsS!")