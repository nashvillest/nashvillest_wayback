/**
 * fix department scrollable height
  */
function fix() {
    $("document").ready(function() {
    
        
        setTimeout(function() {
            var tallest = 0;
            $("#departments ul li").each(function() {
                if ($(this).height() > tallest) {
                    tallest = $(this).height();
                }            
            });
            $("#departments .items-out").height(tallest);
            $("#departments ul").children().css({'min-height': tallest});
        }, 100);
    });
}

$("document").ready(function() {
    /**
     * init scrollable plugin for departments section
     */
    if ($("#departments .items-out .items .item").size() > 5) {
        $("#departments .items-out").scrollable({
            'onSeek':function() {
                if (this.getIndex() >= this.getSize() - 5) {
                    $("#departments .nav .next").addClass("toBegin");
                }
            }
        });
    }
    var scrollable = $("#departments .items-out").data("scrollable");
    $("#departments .nav a").click(function() {
        if ($(this).hasClass("toBegin")) {
            scrollable.seekTo(0);
            $(this).removeClass("toBegin");
        }
        return false;
    });
    
    /**
     * init tabs
     */
    $(".tabs-out ul.tabs").tabs(".tabs-out .panes > div ");
});



$(function(){
    $('#featured .entry').columnize({
        lastNeverTallest: true
    });
});