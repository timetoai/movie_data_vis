from pathlib import Path
from flask import Flask, send_file, send_from_directory, render_template, abort

app = Flask('movie-data-vis')
possbile_files = [file.as_posix() for file in Path('.').glob("*") if file.suffix in (".js", ".css", ".html")]
possible_dirs = ["Figures", "templates", "data", "masks"]

@app.route("/")
def home():
    return send_file('index.html')

@app.route("/<name>")
def get_file(name):
    if name in possbile_files:
        return send_file(name)
    abort(404)

@app.route("/<directory>/<name>")
def get_figure(directory, name):
    if directory in possible_dirs:
        return send_from_directory(directory, name)
    abort(404)

@app.errorhandler(404)
def page_not_found(error):
   return render_template('404.html', title = '404'), 404

def main():
    global app
    app.run()

if __name__ == '__main__':
    main()