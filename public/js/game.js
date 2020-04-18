let socket = io.connect({
    transports: ['websocket', 'polling']
});

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("joinRoom", roomCode);
});

socket.on("refresh", (data) => {
    if (data == roomCode) {
        refresh();
    }
});


$(document).on("click", "#btnShuffle", function () {
    $("#btnShuffle").attr("disabled", true);
    $.ajax({
        url: "/api/shuffle",
        method: "GET",
        success: function (result) {
            $("#panel").html(result);
            socket.emit("refresh");
            $("#btnShuffle").removeAttr("disabled");
        },
        error: function (err) {
            alert("I'm sorry, I never learnt how to shuffle cards properly.");
            $("#btnShuffle").removeAttr("disabled");
        }
    });
});

$(document).on("click", "#btnDeeper", function () {
    $("#btnDeeper").attr("disabled", true);
    $.ajax({
        url: "/api/deeper",
        method: "GET",
        success: function (result) {
            $("#panel").html(result);
            socket.emit("refresh");
            $("#btnDeeper").removeAttr("disabled");
        },
        error: function () {
            alert("There was an error while moving you to another plane of understanding");
            $("#btnDeeper").removeAttr("disabled");
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
        }
    });
}