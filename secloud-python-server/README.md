# app-classification-secloud
Server runs in port 5000 by default.

setup file has a list of all the necessary libraries. Having anaconda installed pretty much covers all of them.

`app.py` starts the server. Server expects a json input file as in `testdata-ast.json` and return back the same data with an extra field `class`.

`request.py` is a python way to make a request to a server. It then prints the response as json. 
