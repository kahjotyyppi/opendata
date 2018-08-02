from datetime import datetime, timedelta
from fmi_utils import *
from xml.etree import ElementTree

sampler_geojson_template = geojson_template
sampler_geojson_template["name"] = "stuk_open_data_air_concentrations"

def get_sampler_data(args):
    """
    Performs a WFS request for sampler data from the FMI open data API.
    The function returns a dataset of the last ten days' measurements.

    :param args: program arguments
    :return: HTTPResponse object
    """
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=10)
    return wfs_request(start_time, end_time, "samplers", args.auth)

def parse_sampler_data(data):
    """
    Parses the argument sampler data into a GeoJSON string.

    :param data: raw sampler data from the FMI open data API.
    :return: GeoJSON string of sampler data
    """
    wfs_response = ElementTree.fromstring(data.read())
    wfs_members = wfs_response.findall('.//{%s}member' % wfs_ns)
    geojson_string = sampler_geojson_template

    for member in wfs_members:
        point = member.findall('.//{%s}Point' % gml_namespace)[0]
        point_id = point.attrib['{%s}id' % gml_namespace].split("-")[-1]
        name = point.findall('{%s}name' % gml_namespace)[0].text
        position = point.findall('{%s}pos' % gml_namespace)[0].text
        longitude = float(position.split()[1])
        latitude = float(position.split()[0])
        values = member.findall('.//{%s}doubleOrNilReasonTupleList' \
                                % gml_namespace)[0].text.split()
        values = list(map(float, values))
        from_time = member.findall('.//{%s}beginPosition' % gml_namespace)[0].text
        to_time = member.findall('.//{%s}endPosition' % gml_namespace)[0].text

        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {"type": "Point"}
        }

        feature["properties"] = {
            "site_id": point_id,
            "site_name": name,
            "timestamp_begin": from_time,
            "timestamp_end": to_time,
        }

        feature["geometry"]["coordinates"] = [
            longitude,
            latitude
        ]

        fields = member.findall( './/{%s}field' % swe_ns)
        for i, field in enumerate(fields):
            name = field.attrib["name"]
            label = field.findall( './/{%s}label' % swe_ns)[0].text
            unit = field.findall( './/{%s}uom' % swe_ns)[0].attrib["code"]

            if "uBq" in unit:
                unit = unit.replace("u", u"\u00B5")
            if "m3" in unit:
                unit = unit.replace("3", u"\u00B3")

            if (name == "air-volume" or "uncert" in name):
                value = int(values[i])
            else:
                value = values[i]

            if "uncertainty" in name:
                # Append existing feature.
                n = name.split("-unc")[0]
                feature["properties"][n] += u" (" + u"\u00B1 " + \
                    str(value) + u" " + str(unit) + u")"
            else:
                feature["properties"][name] = str(value) + \
                    u" " + str(unit)

        geojson_string["features"].append(feature)

    return geojson_string

def write_sampler_data(data):
    """
    Writes the argument sampler data into a file.

    :param data: GeoJSON string of sampler data
    :return: path of the file that is written
    """
    result_dir = "../data/samplers"
    filepath = result_dir + "/stuk_open_data_samplers.json"
    with open(filepath, 'w') as fp:
        json.dump(data, fp, ensure_ascii=False, indent=4, sort_keys=True)

    return filepath