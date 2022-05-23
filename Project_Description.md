The project was based on a dataset containing metadata for 45,000 films released up to July 2017. Data points include cast, crew, plot synopsis, budget, revenue, posters, release dates, languages, production companies, countries, TMDB vote count, and vote averages.

Based on the selected data, it was decided to create a gallery of visualizations of different data attributes. First of all, a list of visualizations was formed that might be interesting for building. It included:

1. Visualizations of a general nature:

    1.1. Number of films per year - a simple but informative graph showing the total number of films released worldwide for each year

    1.2. The number of films released by a certain country per year - this kind of visualization can be done in a more interesting format, for example, using animation to switch between years. On the other hand, it is possible to create a line chart where hovering the mouse cursor over a single curve will blur/shade the rest of the curves - this will make it easier to analyze the curves of individual countries.

    1.3. Best films by year - such visualization can be done, for example, in the form of a bubble graph, where the X-axis will mark the film's duration, Y - the film's rating, the color of the bubble - the budget, and the size of the bubble - the income of the film. Hovering over the bubble itself can show metainformation about the individual movie. The transition between years can also be done using animation.

2. Visualizations by genre

    2.1. Word Cloud by genre - based on the titles of films and their synopses, you can form a word cloud for each of the genres. For this visualization, you can set a switch to conveniently navigate between genres.

    2.2. Popularity of genres by years - this visualization can be formatted as similar to 1.2, since the data for the visualization is similar in type.

3. Visualization "Budget-Income"

    3.1. Costs and Revenue over years - such a visualization can be done in the form of a vertical bar chart, in which years are indicated along the X axis, income / cost along the Y axis, the columns themselves can be located below and above 0 in Y, while the upper part will reflect income film (and will be marked with one color) and the bottom part of the costs (marked with another color).

    3.2 Most profitable movies - this visualization is also convenient to perform in the form of a bar graph, but already horizontal. Here, the films are sorted in descending order by revenue, the y-axis is their title, the x-axis is their rating, and the color can reflect some metadata attribute (such as the production company).

4. Other visualizations - interesting visualizations that are not included in one or another group will be located here.

After forming the list of visualizations, it was decided to create a site-gallery of these visualizations, repeating the described structure. Currently, visualizations are represented by pictures of the corresponding visualizations created in python, but further it is planned to use JavaScript and in particular the d3 library to create interactive visualizations.

Link to the current version of the site: https://movie-data-vis.herokuapp.com/

GitHub repository with code: https://github.com/timetoai/movie_data_vis

Link to data source: https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset
