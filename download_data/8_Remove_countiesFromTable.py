import pandas as pd
import json
import io

countriesCsv_path = "./download_data/extra-data/2_countries.csv"
countriesToIgnoreList_path = "./download_data/extra-data/"

if __name__ == "__main__":

    # Crete a list with the country of which we have the temperatures
    df = pd.read_csv(countriesCsv_path)
