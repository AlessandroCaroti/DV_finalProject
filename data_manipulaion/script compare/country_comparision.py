from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from functools import partial
import pycountry
import numpy as np
import pgeocode
import pandas as pd

def country_to_iso(country_name):
    try:
        result = pycountry.countries.search_fuzzy(country_name)
    except Exception:
        return np.nan
    else:
        return result[0].alpha_3

iso = country_to_iso("French")
#print(iso)

#nomi = pgeocode.Nominatim(iso)
#print(nomi.query_location())

csv1 = pd.read_csv("Countries_not_in_region.csv", names=['country'])
csv2 = pd.read_csv("Regions_not_in_countries.csv", names=['country'] )

country = pd.DataFrame()
#csv1.sort_values(by=['country']).to_csv("Countries_not_in_region.csv", index=False, header=False)
#csv2.sort_values(by=['country']).to_csv("Regions_not_in_countries.csv", index=False, header=False)
list_region =csv1['country'].to_list()
list_country =csv2['country'].to_list()


print(len(list_region))
if(len(csv2) < len(csv1)):
    end_idx = len(csv2)
    
    for _ in range(end_idx, len(csv1)):
        list_country.append("NaN")

country["Regions Not In Countries"] = list_region
country["Country Not In Region"] = list_country

#country.to_csv("Comparision_countries_regions.csv",index=False)

print(country.values.tolist())
