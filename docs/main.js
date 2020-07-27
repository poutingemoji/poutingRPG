
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
    });

  const commandsBody = document.querySelector("#commands-table > tbody")

  function loadCommands(id) {
    const sidebarButtons = document.querySelectorAll(".sidebar-button")
    for (let i = 0; i < sidebarButtons.length; i++) {
    sidebarButtons[i].style.backgroundColor = "#ffffff00"
    }
    const sidebarButton = document.getElementById(id)
    sidebarButton.style.backgroundColor = "#7289da"
    sidebarButton.style.color = "white"
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
          console.log(row)
          const tr = document.createElement("tr")
          row.forEach((cell) => {
              const td = document.createElement("td")
              td.textContent = cell
              tr.appendChild(td)
          })
          commandsBody.appendChild(tr)
      })
      console.log(json)
  }

  document.addEventListener("DOMContentLoaded", () => {loadCommands("moderation")})
  console.log(commandsBody)