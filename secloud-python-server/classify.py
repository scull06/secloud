import sys
import numpy as np
from helperJSON import DataProcess
from sklearn.externals import joblib
import os
import json
dir = os.path.dirname(__file__)


class Classify(object):

    def __init__(self, data):
        self. result = self.get_classification(data)
    # Function to return text for class. 0: nothing, 1: source, 2: sink
    def get_class(self, cl):
        if cl == 0:
            return ''
        if cl == 1:
            return 'Source'
        if cl == 2:
            return 'Sink'


    def get_classification(self, data):
        dp = DataProcess(data)
        X, meth_txt = (dp.X, dp.meth_txt)
        model_file = os.path.join(dir, 'svm_model.plk')
        if os.path.exists(model_file):
            clf = joblib.load(model_file)
            predictions = [self.get_class(pr) for pr in clf.predict(X)]
            for d,p in zip(data, predictions):
                d.update({"class:": p})
            return data
        else:
            print("{} file does not exist".format(model_file))

if __name__ == '__main__':
    with open('testdata-ast.json',"r") as json_file:
        data = json.load(json_file)
        json_file.close()
    cl = Classify(data)
    print(cl.result)
