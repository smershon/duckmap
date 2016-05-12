from flask import Flask
from flask import render_template

app = Flask(__name__)

with open('/etc/duckmap/google_maps.key', 'rb') as f:
    api_key = f.readlines()[0].strip()

@app.route('/')
def sample():
    return render_template('sample.html')
    
@app.route('/builder')
def builer():
    return render_template('builder.html', api_key=api_key)

if __name__ == '__main__':
    app.run(port=5001)