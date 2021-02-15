import requests

url = "http://berkeleyearth.lbl.gov/country-list/"

r = requests.get(url)
with open('./download_data/extra-data/1_table.html', 'w') as file:
    file.write(r.text)

print("Saved html page with the table.")