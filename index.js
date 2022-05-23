function overlay(e) {
    if (e.data.on == true)
    {
        $("#overlay_img")[0].src = e.target.src;
        $("#overlay")[0].style.display = "block";
    }
    else
    {
        $("#overlay")[0].style.display = "none";
    }
}

$(document).ready(function() {
    $('.tile').click({on: true}, overlay);
    $("#overlay").click({on: false}, overlay);
});

$(function() {
    var selectedClass = "";
    $(".fil-cat").click(function() {
        selectedClass = $(this).attr("data-rel");
        $("#portfolio").fadeTo(100, 0.1);
        $("#portfolio div").not("." + selectedClass).fadeOut().removeClass('scale-anm');
        setTimeout(function() {
            $("." + selectedClass).fadeIn().addClass('scale-anm');
            $("#portfolio").fadeTo(300, 1);
        }, 300);

    });
});