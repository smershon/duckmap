from flask import Flask
from flask import jsonify
from flask import render_template
from flask import request

app = Flask(__name__)

with open('/etc/duckmap/google_maps.key', 'rb') as f:
    api_key = f.readlines()[0].strip()

@app.route('/')
def sample():
    return render_template('sample.html')
    
@app.route('/builder/<mapname>')
def builder(mapname):
    return render_template('builder.html', map_name=mapname, api_key=api_key)

@app.route('/builder/savemap', methods=['POST'])
def savemap():
    data = request.json
    return jsonify({'result': 'saved'})

if __name__ == '__main__':
    app.run(port=5001)