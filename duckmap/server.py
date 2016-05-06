from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def sample():
    return render_template('sample.html')

if __name__ == '__main__':
    app.run(port=5001)