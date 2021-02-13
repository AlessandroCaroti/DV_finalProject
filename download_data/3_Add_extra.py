# http://berkeleyearth.lbl.gov/auto/Regional/TAVG/Text/global-land-TAVG-Trend.txt
import pandas as pd



extra_list = [["Global", "http://berkeleyearth.lbl.gov/auto/Global/Complete_TAVG_complete.txt"],
              ["Southern Hemisphere",
                  "http://berkeleyearth.lbl.gov/auto/Regional/TAVG/Text/southern-hemisphere-TAVG-Trend.txt"],
              ["Northern Hemisphere", "http://berkeleyearth.lbl.gov/auto/Regional/TAVG/Text/northern-hemisphere-TAVG-Trend.txt"]]


df = pd.DataFrame(extra_list, columns=["Region", "Link"])
df.to_csv("./download_data/extra-data/reagions.csv", mode='a', header=False, index=False)
