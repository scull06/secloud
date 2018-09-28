#!/bin/env python
''' Helper class for loading and getting the data from data.json
    classes in json correspond to 0: nothing, 1: source, 2: sink'''
import json
import numpy as np

class DataProcess(object):
    """class for json data manipulation"""
    def __init__(self, data):
        self.type = type
        self.get_data_prediction(data)

    # Return x from file to use for Prediction
    def get_data_prediction(self, data):
        #return np arrays for X. Only those whose class in the JSON file is set.
        self.X = np.asarray(tuple( self.get_features(inp["textRaw"]) for inp in data))
        self.meth_txt = np.asarray(tuple(label["textRaw"] for label in data))


################## Feature creation through textRaw ####################
    def has_get(self, text):
        if 'get' in text:
            return 1
        else:
            return 0

    def has_set(self, text):
        if 'set' in text:
            return 1
        else:
            return 0

    def has_read(self, text):
        if 'read' in text:
            return 1
        else:
            return 0

    def has_write(self, text):
        if 'write' in text:
            return 1
        else:
            return 0

    def has_loc(self, text):
        if 'location' in text:
            return 1
        else:
            return 0

    def has_href(self, text):
        if 'href' in text:
            return 1
        else:
            return 0

    def has_win(self, text):
        if 'window' in text:
            return 1
        else:
            return 0

    def has_url(self, text):
        if 'url' in text:
            return 1
        else:
            return 0

    def has_doc(self, text):
        if 'document' in text:
            return 1
        else:
            return 0

    def has_search(self, text):
        if 'search' in text:
            return 1
        else:
            return 0

    def has_ref(self, text):
        if 'referrer' in text:
            return 1
        else:
            return 0

    def has_cookie(self, text):
        if 'cookie' in text:
            return 1
        else:
            return 0

    def has_session(self, text):
        if 'session' in text:
            return 1
        else:
            return 0

    def has_exec(self, text):
        if 'exec' in text:
            return 1
        else:
            return 0

    def has_src(self, text):
        if 'src' in text:
            return 1
        else:
            return 0

    def has_log(self, text):
        if '.log' in text:
            return 1
        else:
            return 0

##########################################################

# a method to return a tuple of all features

    def get_features(self, text):
                return (self.has_get(text), self.has_set(text), self.has_read(text), self.has_write(text), self.has_loc(text), self.has_href(text), self.has_win(text), self.has_url(text), self.has_doc(text), self.has_search(text), self.has_ref(text), self.has_cookie(text), self.has_session(text), self.has_exec(text), self.has_src(text), self.has_log(text))

if __name__ == '__main__':
    with open('testdata-ast.json',"r") as json_file:
        data = json.load(json_file)
        json_file.close()
        dp = DataProcess(data)
        print(dp.X)
