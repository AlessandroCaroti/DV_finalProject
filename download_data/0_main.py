

if __name__ == "__main__":
    step = 1

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/1_Download_table.py").read())
    step += 1
    print("#################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/2_Table_parser.py").read())
    step += 1
    print("#################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/3_Corrispondance_0.py").read())
    step += 1
    print("#################################################################################\n")

    print("\t\tSTEP {}:\n".format(step))
    exec(open("./download_data/4_Find_abbreviation.py").read())
    step += 1
    print("#################################################################################\n")
