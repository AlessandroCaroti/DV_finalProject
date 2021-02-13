import requests

url = "http://berkeleyearth.lbl.gov/country-list/"

r = requests.get(url)
with open('./download_data/extra-data/table.html', 'w') as file:
    file.write(r.text)