
function change( to, ath, atv ) {
    // can be 0 need to check for undefined
    if ( typeof ath !== "undefined" && typeof atv !== "undefined" ) {
        History.pushState( null, null,  to + "?" + $.param({ ath: ath, atv: atv }) );
    } else{
        History.pushState( null, null,  to );
    }
}

var xhr;

function initEngine( api, need ) {

    History.Adapter.bind(window, "statechange", function() {

        if ( typeof api.call !== "function" ) { return }

		var state = History.getState(),
            pano = state.url.split( "?" )[0],
            args = state.url.split( "?" )[1];

        api.call( "tween(hotspot.alpha, 0);loadpano(" + pano + "/index.xml?" + args + ", null, MERGE, BLEND(1)); wait(BLEND); tween(hotspot.alpha, 1);" );

        if ( xhr ) {
            xhr.abort();
        }

        xhr = $.ajax({
          url: pano + "/index.json",
          dataType: "json",
          success: function( data, textStatus, xhr ) {
              document.title = data.tour_title + " — Градоскоп";
              $( ".content h2:first" ).html( data.tour_title );
              $( ".pano_content .note" ).html( data.description );
              $( ".tour_content .description" ).html( data.tour_description );
              data.date &&  $( ".created_at" ).text( data.date );
              $.each([ "prev", "next" ], function( n, v ) {
                  if( data[v] ) {
                      $( ".viewport ." + v )
                          .show()
                          .text( data[v].title )
                          .attr( "href", "/" + data[v].slug );
                  } else {
                      $( ".viewport ." + v ).hide();
                  }
              });
              $( ".pano_content .edit" ).attr( "href", "/" + data.id + "/edit" );
              $( ".tour_content .edit" ).attr( "href", "/tours/" + data.tour_id + "/edit" );

              if ( typeof _gaq !== "undefined" ) {
                  var a = document.createElement( "a" );
                  a.href = state.url;
                  _gaq.push([ "_trackPageview", a.pathname ]); // Analytics track
              }
              if ( typeof yaShareInstance !== "undefined" ) {
                  yaShareInstance.updateShareLink( state.url, data.tour_title + " — Градоскоп" );
              }

          }
        });
    });


    $( window )
        .resize(function() {
            $( "#pano" ).css({
                height: $( "#pano" ).width() / 1.7
            });
        })
        .trigger( "resize" );

    $( ".pano_link" ).live( "click", function() {
        change( $( this ).attr( "href" ) );
        return false;
    });


}


(function($) {
    $( document ).ready(function() {
		if ( swfobject.hasFlashPlayerVersion( "6.0.0" ) ) {

			swfobject.embedSWF(
			    window.static_url + "/pano/krpano.swf",
			    "krpano", "100%", "100%", "9.0.28",
			    window.static_url + "/js/expressinstall.swf",
			    { pano: defaults.pano + "/index.xml?skin=1" },
			    { allowfullscreen: true, bgcolor: "#ffffff", wmode: "opaque", allowscriptaccess: "always" },
			    { id: "krpanoSWFObject", name: "krpanoSWFObject" },
			    function( e ){
			        if ( e.success ) { initEngine( e.ref ); }
			    }
			);
			swfkrpanomousewheel.registerObject( "krpanoSWFObject" );
		} else {
			$( "#krpano" ).html( "ERROR:<br/><br/>Adobe Flash Player needed<br/><a href=\"http://www.adobe.com/go/getflashplayer/\" target=\"_blank\"><img src=\"http://www.macromedia.com/images/shared/download_buttons/get_flash_player.gif\"/></a>" );
		}
    });
})( jQuery );