var interval = setInterval(refresh, 5000);
var count = 0;

$(document).on("click", "#btnShuffle", function () {
    $.ajax({
        url: "/api/shuffle",
        method: "GET",
        success: function (result) {
            $("#panel").html(result);
        },
        error: function (err) {
            alert("There was an error while communiating with server. You should probably start panicking.");
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
            i++;
            if (i == 3) {
                clearInterval(interval);
            }
        }
    });
}