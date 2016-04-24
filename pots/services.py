import requests
from django.core import serializers

def get_storm_data(start, end):
    r = requests.get('http://www.ncdc.noaa.gov/swdiws/json/warn/%s:%s' % (start, end))
    warnings = []
    for warning in r.json()['result']:
        warnings.append({
            'poly': parse_sdo(warning['SHAPE']),
            'start': warning['ZTIME_START'],
            'end': warning['ZTIME_END'],
            'type': warning['WARNINGTYPE']
        })
    return warnings

def parse_sdo(shape):
    points_string = shape[10:-2]
    list1 = points_string.split(', ')
    list2 = []
    for point in list1:
        list2.append(point.split(' '))
    return list2
