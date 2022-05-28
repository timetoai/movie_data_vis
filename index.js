import addRealTimeChart from './realTimeChart.js';


function drawBudgetRevenue()
{
    ;
};

function drawGenre()
{
    var genre = "Comedy";
    d3.json("data/genres_" + genre + "_rates.json", function(data) {
        data = JSON.parse(data);
        addRealTimeChart(data, 400, 600, 250);
    });
};

$(function() {
    //initially drawing budget and revenue graph
    drawBudgetRevenue();

    $(".fil-cat").click(function() {
        // cleaning previous graphs
        for (var child in $("#content")[0].children) 
        {
            $(child).fadeOut();
        }
        $("#content").empty();

        // drawing new
        if ($(this).attr("data-rel") == "budget_revenue")
            drawBudgetRevenue();
        else
            drawGenre();
    });
});