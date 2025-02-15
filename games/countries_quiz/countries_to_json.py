import json
import fiona

f = open("data/countries.json","r")
raw_data = f.read()
f.close()
data = json.loads(raw_data)



f = fiona.open("data/TM_WORLD_BORDERS_SIMPL-0.3.shp","r")
old_countries = {}
for line in f:
    name = line["properties"]["NAME"]
    lat = float(line["properties"]["LAT"])
    lon = float(line["properties"]["LON"])
    iso3 = line["properties"]["ISO3"]
    old_countries[iso3] = (name, lat, lon)
f.close()



new_countries = []
for entry in data:
    iso3 = entry["cca3"]
    if iso3 in old_countries:
        old_name, lat, lon = old_countries[iso3]
        old_name = old_name.lower()
        name_common = entry["name"]["common"]
        name_official = entry["name"]["official"]
        new_countries.append([lat, lon, [name_common, name_official]])
print(len(new_countries))



f = open("countries.js","w")
f.write("countries = [\n")
for i in range(len(new_countries)):
    lat, lon = new_countries[i][0], new_countries[i][1]
    end = ",\n" if i<len(new_countries)-1 else "\n"
    names = new_countries[i][2]
    f.write("\t[%f,%f," % (lat, lon))
    for j in range(len(names)):
        end2 = "," if j<len(names)-1 else ""
        f.write("\"%s\"%s" % (names[j],end2))
    f.write("]%s" % (end))
f.write("];")
f.close()