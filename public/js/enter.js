$(document).on("click", "#btnJoin", function(){
    $("#form1").append("<input type='text' id='tbRoomCode' name='tbRoomCode' placeholder='000000' maxlength='6'>");
    $("#btnJoin").remove();
});

$(document).on("input", "#tbRoomCode", function(){
    let code = $("#tbRoomCode").val();
    if(code.length == 6){
        $("#form1").submit();
    }
});