import json
import time
from datetime import datetime, timedelta
from fmi_utils import *
from requests.exceptions import ReadTimeout
from xml.etree import ElementTree

def write_dose_rates(response, directory="."):
    """
    Writes GeoJSON files of dose rate measurements.

    :param response: HTTPResponse object
    :param directory: Directory to which files are written
    :return: Path of the file that was written
    """
    wfs_response = ElementTree.fromstring(response.read())
    gml_points = wfs_response.findall('.//{%s}Point' % gml_namespace)
    geojson_string = geojson_template

    # Read locations.
    locations = {}
    for n, point in enumerate(gml_points):
        identifier = point.attrib['{%s}id' % gml_namespace].split("-")[-1]
        name = point.findall('{%s}name' % gml_namespace)[0].text
        position = point.findall('{%s}pos' % gml_namespace)[0].text.strip()
        longitude = float(position.split()[1])
        latitude = float(position.split()[0])
        locations[position] = {
            "site": name,
            "longitude": longitude,
            "latitude": latitude,
            "id": identifier
        }

    # Read values.
    values = []
    try:
        value_lines = wfs_response.findall('.//{%s}doubleOrNilReasonTupleList' \
                                            % gml_namespace)[0].text.split("\n")[1:-1]
    except IndexError:
        raise Exception("No features.")

    for line in value_lines:
        value = float(line.strip().split()[0])
        values.append(value)

    # Construct features.
    position_lines =  wfs_response.findall('.//{%s}positions' \
                                            % gmlcov_namespace)[0].text.split("\n")[1:-1]
    for i, line in enumerate(position_lines):
        line = line.split()
        coords = line[0] + " " + line[1]
        timestamp = datetime.utcfromtimestamp(int(line[2]))

        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {"type": "Point"}
        }

        feature["properties"] = {
            "doseRate": values[i],
            "id": locations[coords]["id"],
            "site": locations[coords]["site"],
            "timestamp": datetime.strftime(timestamp,
                                           "%Y-%m-%dT%H:%M:%SZ")
        }

        feature["geometry"]["coordinates"] = [
            locations[coords]["longitude"],
            locations[coords]["latitude"]
        ]

        geojson_string["features"].append(feature)

    # Write output.
    filename = directory + "/" + datetime.strftime(timestamp,"%Y-%m-%dT%H%M%S") + ".json"
    with open(filename, 'w', encoding="utf-8") as fp:
        json.dump(geojson_string, fp, ensure_ascii=False, indent=4, sort_keys=True)

    return filename

if __name__ == "__main__":
    end_time = datetime.utcnow() - timedelta(seconds=1800)
    start_time = end_time - timedelta(seconds=559)
    result_dir = "../data/dose_rates"
    wfs_response = wfs_request(start_time, end_time)
    write_dose_rates(wfs_response, result_dir)
