HTMLWidgets.widget({

  name: 'truncatetext',

  type: 'output',

  initialize: function(el, width, height) {

    $skeleton = $( "<div class='container'>" +
                     "<div class='text'></div>" +
                     "<div class='fade-out'></div>" +
                   "</div>" +
                   "<div class='read-more'><span class='more'>Read more</span><span class='less nodisplay'>Colappse</span></div>" );
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

        var $element = $container.find( ".text" ),
            lineHeight = parseInt( lineHeightFunc( $element ) );

        height = height !== undefined ? height : "auto";

        if ($element.height() > (lineHeight * maxLines)) {
            $element.animate({
                "max-height": (lineHeight * maxLines) + "px"
            }, duration);
            $element.css( "padding-bottom" , 0);

            $container.find( ".fade-out" ).css( "width", 2 * lineHeight * maxLines + "px" );
            $container.find( ".fade-out" ).css( "height", lineHeight + "px" );
            $container.find( ".fade-out" ).removeClass( "nodisplay" );
        } else {
            $element.animate({
                "max-height": typeof height === "number" ? height + "px" : height
            }, duration);
            $container.find( ".fade-out" ).addClass( "nodisplay" );
        }
        return $container;
    },

  renderValue: function (el, x, instance) {

    $( el ).find( ".text" ).html( x.text );
    if ( x.more ) {
      $( el ).find( ".read-more .more" ).html( x.more );
    }

    if ( x.less ) {
      $( el ).find( ".read-more .less" ).html( x.less );
    }

    x.lines = x.lines !== undefined ? x.lines : 2;
    x.duration = x.duration !== undefined ? x.duration : 400;

    instance.x = x;

    $container = instance.toggleMaxHeight( $( el ).find( ".container" ),  x.lines, 0 );

var scrollHeight = $container.find( ".text" )[ 0 ].scrollHeight;

    $container.siblings( ".read-more" ).on( "click.pmstat", function ( event ) {
                $(this).find( ".more" ).toggleClass( "nodisplay" );
                $(this).find( ".less" ).toggleClass( "nodisplay" );
                instance.toggleMaxHeight( $( this ).siblings( ".container" ), x.lines, x.duration, scrollHeight );
            });

    this.updateControls( $container );

  },

  updateControls: function ( $container, resize ) {
    var scrollHeight = $container.find( ".text" )[ 0 ].scrollHeight;

    if ($container.find( ".text" )[ 0 ].clientHeight >= scrollHeight) {
        $container.find( ".fade-out" ).addClass( "nodisplay" );
        $container.siblings( ".read-more" ).addClass( "nodisplay" );
    } else if (resize) {
        $container.find( ".fade-out" ).removeClass( "nodisplay" );
        $container.siblings( ".read-more" ).removeClass( "nodisplay" );
    }
  },

  resize: function(el, width, height, instance) {
    $( el ).find( ".container .text" ).css( "max-height", "" );
    $container = instance.toggleMaxHeight( $( el ).find( ".container" ),  instance.x.lines, 0 );
    this.updateControls( $container, true );
  }

});
