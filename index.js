function draw_budget_revenue()
{
    ;
};

function draw_genres()
{
    ;
};

$(function() {
    //initially drawing budget and revenue graph
    draw_budget_revenue();

    $(".fil-cat").click(function() {
        // cleaning previous graphs
        for (var child in $("#content")[0].children) 
        {
            $(child).fadeOut();
        }
        $("#content").empty();

        // drawing new graphs
        if ($(this).attr("data-rel") == "budget_revenue")
            draw_budget_revenue();
        else
            draw_genres();
    });
});