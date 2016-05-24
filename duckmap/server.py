from flask import Flask
from flask import jsonify
from flask import render_template
from flask import request

import simplejson as json
import os

import logging

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

with open('/etc/duckmap/google_maps.key', 'rb') as f:
    api_key = f.readlines()[0].strip()

@app.route('/')
def sample():
    return render_template('sample.html')
    
@app.route('/builder/<mapname>')
def builder(mapname):
    data = json.dumps({'mapname': mapname, 'borders': [], 'areas': {}})

    if (os.path.exists('data/%s.json' % mapname)):
        with open('data/%s.json' % mapname, 'rb') as f:
            data = f.readlines()[0].strip()

    return render_template('builder.html', map_name=mapname, api_key=api_key, data=data)

@app.route('/builder/savemap', methods=['POST'])
def savemap():
    data = request.json
    with open('data/%s.json' % data['mapname'], 'wb') as f:
        f.write(json.dumps(data));
    return jsonify({'result': 'saved'})

if __name__ == '__main__':
    app.run(port=5001)