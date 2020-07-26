

$(document).ready(function(){
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
  });
  console.log('yes')