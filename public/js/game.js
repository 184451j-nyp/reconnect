var interval = setInterval(refresh, 2500);
var count = 0;

$(document).on("click", "#btnShuffle", function () {
    $.ajax({
        url: "/api/shuffle",
        method: "GET",
        success: function (result) {
            $("#panel").html(result);
        },
        error: function (err) {
            alert("I'm sorry, I never learnt how to shuffle cards properly.");
        }
    });
});

$(document).on("click", "#btnDeeper", function () {
    $.ajax({
        url: "/api/deeper",
        method: "GET",
        success: function (result) {
            $("#panel").html(result);
        },
        error: function () {
            alert("There was an error while moving you to another plane of understanding");
        }
    })
});

function refresh() {
    $.ajax({
        url: "/api/refresh",
        method: "GET",
        success: function (result) {
            if (result != "") {
                $("#panel").html(result);
            }
        },
        error: function (err) {
            alert("Took too long to receive a response!");
            count++;
            if (count == 3) {
                clearInterval(interval);
            }
        }
    });
}

window.onbeforeunload = function beforeUnload(){
    console.log("unload event fired");
    $.ajax({
        url: "/api/unload",
        method: "GET",
        success: function(){
            console.log("leaving");
        },
        failure: function(){
            console.log("error in executing final order");
        }
    })
}