HTMLWidgets.widget({

    name: 'truncatetext',

    type: 'output',

    initialize: function( el, width, height ) {

        $skeleton = $( "<div class='ttxt-container'>" +
            "<div class='ttxt-text'></div>" +
            "<div class='ttxt-fade-out'></div>" +
            "</div>" +
            "<div class='ttxt-read-more-wrapper'><span class='ttxt-read-more'><a href='#' class='ttxt-more'>Show more</a><a href='#' class='ttxt-less ttxt-nodisplay'>Show less</a></span></div>" );
        $( el ).append( $skeleton );
        return {
            toggleMaxHeight: this.toggleMaxHeight,
            lineHeightFunc: this.lineHeightFunc
        }

    },


    lineHeightFunc: function ( $element ) {
        var $tmp = $( "<div>test</div>" );
        $element.append( $tmp );
        $tmp.css({
            "padding": "0",
            "margin": "0",
            "border": "0"
        });
        var height = $tmp[ 0 ].clientHeight;
        $tmp.remove();
        return parseInt( height );
    },

    toggleMaxHeight: function  ( instance, $el, maxLines, duration ) {

        var $ttxtText = $el.find( ".ttxt-text" ),
            marginTop = parseInt( $ttxtText.children().css( "margin-top" ) ) || 0,
            marginBottom = parseInt( $ttxtText.children().css( "margin-bottom" ) ) || 0,
            paddingTop = parseInt( $ttxtText.children().css( "padding-top" ) ) || 0,
            paddingBottom = parseInt( $ttxtText.children().css( "padding-bottom" ) ) || 0,
            lineHeight = instance.lineHeightFunc( $ttxtText );


        if ( $ttxtText[ 0 ].clientHeight > ( lineHeight * maxLines + marginTop + marginBottom + paddingTop + paddingBottom + lineHeight / 2 ) ) { // add lineHeight / 2 to fix behaviour for small and large zooming
            $ttxtText.css( "padding-bottom" , 0);
            $ttxtText.animate({
                "max-height": ( lineHeight * maxLines + marginTop + paddingTop + 1 ) + "px" // 1 to show the descender in large zooming
            }, duration, function(){
              $el.find( ".ttxt-more" ).removeClass( "ttxt-nodisplay" );
              $el.find( ".ttxt-less" ).addClass( "ttxt-nodisplay" );
            });

            $el.find( ".ttxt-fade-out" ).css( "width", Math.min( 2 * lineHeight * maxLines, $ttxtText.width() ) + "px" );
            $el.find( ".ttxt-fade-out" ).css( "height", lineHeight + "px" );
            $el.find( ".ttxt-fade-out" ).removeClass( "ttxt-nodisplay" );

        } else {
            $ttxtText.animate({
                "max-height": $ttxtText[ 0 ].scrollHeight
            }, duration, function(){
              $el.find( ".ttxt-more" ).addClass( "ttxt-nodisplay" );
              $el.find( ".ttxt-less" ).removeClass( "ttxt-nodisplay" );
            });

            $el.find( ".ttxt-fade-out" ).addClass( "ttxt-nodisplay" );
        }
        return $el;
    },

    renderValue: function (el, x, instance) {

        if ( x.class ) {
          $( el ).addClass( x.class );
        }
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

        instance.toggleMaxHeight( instance, $( el ),  x.lines, 0 );

        $( el ).find( ".ttxt-read-more" ).on( "click.truncatetext", function ( event ) {
            instance.toggleMaxHeight( instance, $( this ).closest( ".truncatetext" ), x.lines, x.duration );
            return false;
        });

        this.updateControls( instance, $( el ) );

    },

    updateControls: function ( instance, $el, resize ) {
        var scrollHeight = $el.find( ".ttxt-text" )[ 0 ].scrollHeight,
            lineHeight = instance.lineHeightFunc( $el.find( ".ttxt-text" ) );

        if ($el.find( ".ttxt-text" )[ 0 ].clientHeight + lineHeight / 2 >= scrollHeight) { // add lineHeight / 2 to fix small and large zooming
            $el.find( ".ttxt-fade-out" ).addClass( "ttxt-nodisplay" );
            $el.find( ".ttxt-read-more" ).addClass( "ttxt-nodisplay" );
        } else if (resize) {
            $el.find( ".ttxt-fade-out" ).removeClass( "ttxt-nodisplay" );
            $el.find( ".ttxt-read-more" ).removeClass( "ttxt-nodisplay" );
        }
    },

    resize: function( el, width, height, instance ) {
        $( el ).find( ".ttxt-container .ttxt-text" ).css( "max-height", "" );
        instance.toggleMaxHeight( instance, $( el ),  instance.x.lines, 0 );
        this.updateControls( instance, $( el ), true );
    }

});
