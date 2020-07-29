$('a').each(function() {
    if( location.hostname === this.hostname || !this.hostname.length ) {
        $(this).addClass('local');
        console.log(this)
    } else {
        $(this).addClass('external');
        console.log(this)
        $(this).attr({
            target: "_blank",
            rel: "nofollow"
        })
    }
})

$(".profile-picture").hover(function() {
    $(this).addClass("animate__animated")
    $(this).addClass("animate__rubberBand")
    $(this).addClass("animate__fast")
});
$(".profile-picture").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function(event) {
    $(this).removeClass("animate__rubberBand")
});

$('.tile').each(function() {
    $(this).attr("data-aos", "zoom-in")
})
AOS.init();

$(function(){ 
    $(".navbar").load("./sections/navbar.html")
    $(".footer").load("./sections/footer.html")
})

const commandsBody = document.querySelector("#commands-table > tbody")

function loadCommands(id) {
    $('.menu button').each(function() {
        $(this).attr("style", "background-color: #ffffff00 !important;")
    })
    console.log(id)
    $('#' + id).attr("style", "background-color: #7289da !important; color: white !important;") 
    console.log($('#commands'))
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
    console.log(commandsBody)
}

if (document.getElementById("moderation")) {
    document.addEventListener("DOMContentLoaded", () => {loadCommands("moderation")})
}


function toggleNavBar() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
}
