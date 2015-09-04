HTMLWidgets.widget({

  name: 'truncatetext',

  type: 'output',

  initialize: function(el, width, height) {

    $skeleton = $( "<div class='ttxt-container'>" +
                     "<div class='ttxt-text'></div>" +
                     "<div class='ttxt-fade-out'></div>" +
                   "</div>" +
                   "<div class='ttxt-read-more'><span class='ttxt-more'>Show more</span><span class='ttxt-less ttxt-nodisplay'>Show less</span></div>" );
    $( el ).append( $skeleton );
    return {
      toggleMaxHeight: this.toggleMaxHeight
    }

  },



  toggleMaxHeight: function  ( $container, maxLines, duration, height ) {

        var lineHeightFunc = function ( $element ) {
        var $tmp = $( "<div>test</div>" );
        $element.append( $tmp );
        $tmp.css({
            "padding": "0",
                "margin": "0",
                "border": "0"
        });
        var height = $tmp[ 0 ].clientHeight;
        $tmp.remove();
        return height;
        }


        var $element = $container.find( ".ttxt-text" ),
            marginTop = parseInt( $element.children().css( "margin-top" ) ) || 0,
            marginBottom = parseInt( $element.children().css( "margin-bottom" ) ) || 0,
            paddingTop = parseInt( $element.children().css( "padding-top" ) ) || 0,
            paddingBottom = parseInt( $element.children().css( "padding-bottom" ) ) || 0,
            lineHeight = parseInt( lineHeightFunc( $element ) );

        height = height !== undefined ? height : "auto";

        if ($element.height() > ( lineHeight * maxLines + marginTop + marginBottom + paddingTop + paddingBottom )) {
            $element.animate({
                "max-height": ( lineHeight * maxLines + marginTop + paddingTop ) + "px"
            }, duration);
            $element.css( "padding-bottom" , 0);

            $container.find( ".ttxt-fade-out" ).css( "width", 2 * lineHeight * maxLines + "px" );
            $container.find( ".ttxt-fade-out" ).css( "height", lineHeight + "px" );
            $container.find( ".ttxt-fade-out" ).removeClass( "ttxt-nodisplay" );
        } else {
            $element.animate({
                "max-height": typeof height === "number" ? height + "px" : height
            }, duration);
            $container.find( ".ttxt-fade-out" ).addClass( "ttxt-nodisplay" );
        }
        return $container;
    },

  renderValue: function (el, x, instance) {

    $( el ).find( ".ttxt-text" ).html( x.text );
    if ( x.more ) {
      $( el ).find( ".ttxt-read-more .ttxt-more" ).html( x.more );
    }

    if ( x.less ) {
      $( el ).find( ".ttxt-read-more .ttxt-less" ).html( x.less );
    }

    x.lines = x.lines !== undefined ? x.lines : 2;
    x.duration = x.duration !== undefined ? x.duration : 400;

    instance.x = x;

    $container = instance.toggleMaxHeight( $( el ).find( ".ttxt-container" ),  x.lines, 0 );

var scrollHeight = $container.find( ".ttxt-text" )[ 0 ].scrollHeight;

    $container.siblings( ".ttxt-read-more" ).on( "click.pmstat", function ( event ) {
                $(this).find( ".ttxt-more" ).toggleClass( "ttxt-nodisplay" );
                $(this).find( ".ttxt-less" ).toggleClass( "ttxt-nodisplay" );
                instance.toggleMaxHeight( $( this ).siblings( ".ttxt-container" ), x.lines, x.duration, scrollHeight );
            });

    this.updateControls( $container );

  },

  updateControls: function ( $container, resize ) {
    var scrollHeight = $container.find( ".ttxt-text" )[ 0 ].scrollHeight;

    if ($container.find( ".ttxt-text" )[ 0 ].clientHeight >= scrollHeight) {
        $container.find( ".ttxt-fade-out" ).addClass( "ttxt-nodisplay" );
        $container.siblings( ".ttxt-read-more" ).addClass( "ttxt-nodisplay" );
    } else if (resize) {
        $container.find( ".ttxt-fade-out" ).removeClass( "ttxt-nodisplay" );
        $container.siblings( ".ttxt-read-more" ).removeClass( "ttxt-nodisplay" );
    }
  },

  resize: function(el, width, height, instance) {
    $( el ).find( ".ttxt-container .ttxt-text" ).css( "max-height", "" );
    $container = instance.toggleMaxHeight( $( el ).find( ".ttxt-container" ),  instance.x.lines, 0 );
    this.updateControls( $container, true );
  }

});
