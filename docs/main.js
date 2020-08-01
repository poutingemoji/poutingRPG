const currentPage = window.location.pathname.replace('/','').replace('docs','').replace('.html','') || "index"

$(".navbar").load("/docs/_includes/navbar.html")
$(".footer").load("/docs/_includes/footer.html")
$(".profile-picture").hover(function() {
    $(this).addClass("animate__animated")
    $(this).addClass("animate__rubberBand")
    $(this).addClass("animate__fast")
})
$(".profile-picture").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function(event) {
    $(this).removeClass("animate__rubberBand")
})
$('a').each(function() {
    console.log(this)
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

if (currentPage == "shop") {
    $('.slick-carousel').slick({
        dots: true,
        arrows: true,
        autoplay: false,
        speed: 1800,
        responsive: [
            {
                breakpoint: 980, // tablet breakpoint
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480, // mobile breakpoint
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    })
}
//nextArrow: '<i class="fa fa-arrow-right"></i> fa-5x',
//prevArrow: '<i class="fa fa-arrow-left"></i>',
//Toggle Navbar (MOBILE)
function toggleNavBar() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
}


//AOS Tiles
$('.tile').each(function() {
    $(this).attr("data-aos", "zoom-in")
})
AOS.init()


//Load different commands table
if (currentPage == "commands") {
    $(document).ready(function() {
        loadCommands("moderation")
    })
}
const commandsBody = document.querySelector("#commands-table > tbody")
function loadCommands(id) {
    $('.menu button').each(function() {
        $(this).attr("style", "background-color: #ffffff00 !important;")
    })
    $('#' + id).attr("style", "background-color: #7289da !important; color: white !important;") 
    console.log($('#commands'))
    const request = new XMLHttpRequest()
    request.open("get", `./commandinfo.json`)
    request.onload = () => {
        try {
            const json = JSON.parse(request.responseText)
            populateCommands(json[id])
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


