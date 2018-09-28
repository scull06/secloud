from flask import Flask, request
from flask_restful import reqparse,abort, Api, Resource
import json
from classify import Classify

app = Flask(__name__)
api = Api(app)

class classify(Resource):
    def get(self):
        return 'Nothing to return.'



    def post(self):
        data = request.json
        cl = Classify(data)
        return cl.result



##
## Actually setup the Api resource routing here
##
api.add_resource(classify, '/classify')


if __name__ == '__main__':
    app.run(debug=True)
