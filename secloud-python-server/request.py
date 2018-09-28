import requests
import json

with open('testdata-ast.json',"r") as json_file:
    data = json.load(json_file)
    json_file.close()

# call a post request on classify to get classification results
r = requests.post('http://localhost:5000/classify', json=data)

print(r.json())
