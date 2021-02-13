import pandas as pd
import requests

regions_not_needed = ["Newfoundland and Labrador", "Guangdong", "CuraÃ§ao"]


def extract_countryGeneralization(table):
    generalizations = []
    regions = []

    # skip the first 2 row
    table = table[table.find("</tr>"):]
    table = table[table.find("</tr>"):]

    while table:
        if table.find("<td><a href=") == -1:
            break
        start_generalization = table.find(
            "<td><a href=\"") + len("<td><a href=\"")
        end_generalization = table.find("</a>", start_generalization)

        link, region = table[start_generalization: end_generalization].split("\">")
        table = table[end_generalization:]

        if (region not in country_list) and (region not in regions_not_needed):
            regions.append([region, link])
            generalizations.append(region)

    return generalizations, regions


if __name__ == "__main__":
    df = pd.read_csv("./download_data/extra-data/countries.csv", index_col=0)
    countries = df.values.tolist()

    global country_list
    country_list = df["Country"].tolist()

    error = []
    regions = []

    print("This will take some times...")
    print("{} counties to process".format(len(countries)))

    for i, country in enumerate(countries):
        print(i, end=", ", flush=True)

        # Extract the Regions of each country
        response = requests.get(country[1], allow_redirects=True)
        if response.status_code == 200:
            webContent = response.content.decode(
                "ISO-8859-1", "backslashreplace")
            start_table = webContent.find("Mean Rate of Change")
            end_table = webContent.find("</table> ", start_table)
        else:
            error.append(country[0])
            continue

        country_generalization, regions_extracted = extract_countryGeneralization(
            webContent[start_table:end_table])

        regions += regions_extracted
        country += [country_generalization]
    print()

    # remove duplicates
    regions = set(tuple(row) for row in regions)

    # Save regions data
    df = pd.DataFrame(regions, columns=["Region", "Link"])
    df.to_csv("./download_data/extra-data/reagions.csv", index=False)
    print("Regions links saved.")

    # Update countyes data
    df = pd.DataFrame(countries, columns=["Country", "Link", "Generalization"])
    df.to_csv("./download_data/extra-data/countries.csv")
    print("Countries links updated.")
