import addRealTimeChart from './realTimeChart.js';
import addBarRaceChart from './barRaceChart.js';


function drawBudgetRevenue()
{
    ;
};

function drawGenre()
{        
    $("#content").append("<div id=\"content1\"></div>");
    $("#content1").append("<div id=\"content_rtc\"></div>");
    $("#content1").append("<div id=\"content_brc\"></div>");
    $("#content").append("<div id=\"content_selector\"></div>");

    d3.json("data/genre_names.json", function(data) {
        let selector = $("#content_selector");
        for (let genre of data)
        {
            selector.append("<button genre=\"" + genre + "\" class=\"btn_genre\">" + genre + "</button>");
        }
        $(".btn_genre").click(drawSpecifiedGenre);
    });
};

function drawSpecifiedGenre(event)
{
    ["#content_rtc", "#content_brc"].forEach(function (elem)
    {
        for (var child of $(elem)[0].children) 
            {
                $(child).fadeOut();
            }
            $(elem).empty();
    });

    var genre = event.target.getAttribute("genre"), monthInterval = 400,
        elem = d3.select("#content")._groups[0][0],
        width = elem.clientWidth, height = elem.clientHeight,
        rtcWidth = width * 0.8, rtcHeight = height * 0.30,
        brcWidth = width * 0.8, brcHeight = height * 0.70;

    d3.json("data/genres_" + genre + "_rates.json", function(data) {
        data = JSON.parse(data);
        addRealTimeChart("#content_rtc", data, monthInterval, rtcWidth, rtcHeight);
    });

    d3.json("data/genres_" + genre + "_wc.json", function(data) {
        data =JSON.parse(data);
        addBarRaceChart("#content_brc", data, monthInterval * 12, brcWidth, brcHeight);
    });
};

$(function() {
    //initially drawing budget and revenue graph
    drawBudgetRevenue();

    $(".fil-cat").click(function() {
        // cleaning previous graphs
        for (var child of $("#content")[0].children) 
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