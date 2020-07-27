$('a').each(function() {
    if( location.hostname === this.hostname || !this.hostname.length ) {
        $(this).addClass('local');
    } else {
        $(this).addClass('external');
        $(this).attr({
            target: "_blank",
            rel: "nofollow"
        })
    }
})

$(".profile-picture").hover(function() {
    $(this).addClass("animate__animated")
    $(this).addClass("animate__rubberBand")
});
$(".profile-picture").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function(event) {
    $(this).removeClass("animate__animated")
    $(this).removeClass("animate__rubberBand")
});

$('.featuredescription, .featureattachment').each(function() {
    $(this).attr("data-aos", "zoom-in")
})
AOS.refreshHard()

$(function(){ 
    $(".topnav").load("./sections/topnav.html")
    $(".footer").load("./sections/footer.html")
})

const commandsBody = document.querySelector("#commands-table > tbody")

function loadCommands(id) {
    $('.sidebar-button').each(function() {
        $(this).css("background-color", "#ffffff00")
        $(this).css("color", "#b5b5b5")
    })
    console.log(id)
    $('#' + id).css("background-color", "#7289da") 
    $('#' + id).css("color", "white") 
    const request = new XMLHttpRequest()
    request.open("get", `./commands/${id}.json`)
    request.onload = () => {
        try {
            const json = JSON.parse(request.responseText)
            populateCommands(json)
        } catch(error) {
        console.warn("Couldn't load commands.")
        }
    }
    request.send()
}

function populateCommands(json) {
    while (commandsBody.firstChild) {
        commandsBody.removeChild(commandsBody.firstChild)
    }

    json.forEach((row) => {
        const tr = document.createElement("tr")
        row.forEach((cell) => {
            const td = document.createElement("td")
            td.textContent = cell
            tr.appendChild(td)
        })
        commandsBody.appendChild(tr)
    })
}

if (document.getElementById("commands")) {
    document.addEventListener("DOMContentLoaded", () => {loadCommands("moderation")})
}
