from flask import Flask, send_file, send_from_directory, render_template, abort

app = Flask('movie-data-vis')

@app.route("/")
def home():
    return send_file('index.html')

@app.route("/<name>")
def get_file(name):
    if name in ('styles.css', 'index.js'):
        return send_file(name)
    abort(404)

@app.route("/Figures/<name>")
def get_figure(name):
    return send_from_directory("Figures", name)

@app.errorhandler(404)
def page_not_found(error):
   return render_template('404.html', title = '404'), 404

def main():
    global app
    app.run()

if __name__ == '__main__':
    main()