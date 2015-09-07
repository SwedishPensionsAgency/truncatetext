HTMLWidgets.widget({

    name: 'truncatetext',

    type: 'output',

    initialize: function( el, width, height ) {

        $skeleton = $( "<div class='ttxt-container'>" +
            "<div class='ttxt-text'></div>" +
            "<div class='ttxt-fade-out'></div>" +
            "</div>" +
            "<div class='ttxt-read-more'><span class='ttxt-more'>Show more</span><span class='ttxt-less ttxt-nodisplay'>Show less</span></div>" );
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

    toggleMaxHeight: function  ( instance, $container, maxLines, duration ) {

        var $element = $container.find( ".ttxt-text" ),
            marginTop = parseInt( $element.children().css( "margin-top" ) ) || 0,
            marginBottom = parseInt( $element.children().css( "margin-bottom" ) ) || 0,
            paddingTop = parseInt( $element.children().css( "padding-top" ) ) || 0,
            paddingBottom = parseInt( $element.children().css( "padding-bottom" ) ) || 0,
            lineHeight = instance.lineHeightFunc( $element );


        if ( $element[ 0 ].clientHeight > ( lineHeight * maxLines + marginTop + marginBottom + paddingTop + paddingBottom + lineHeight / 2 ) ) { // add lineHeight / 2 to fix behaviour for small and large zooming
            $element.css( "padding-bottom" , 0);
            $element.animate({
                "max-height": ( lineHeight * maxLines + marginTop + paddingTop + 1 ) + "px" // 1 to show the descender in large zooming
            }, duration, function(){
              $container.parent().find( ".ttxt-more" ).removeClass( "ttxt-nodisplay" );
              $container.parent().find( ".ttxt-less" ).addClass( "ttxt-nodisplay" );
            });

            $container.find( ".ttxt-fade-out" ).css( "width", Math.min( 2 * lineHeight * maxLines, $element.width() ) + "px" );
            $container.find( ".ttxt-fade-out" ).css( "height", lineHeight + "px" );
            $container.find( ".ttxt-fade-out" ).removeClass( "ttxt-nodisplay" );

        } else {
            $element.animate({
                "max-height": $element[ 0 ].scrollHeight
            }, duration, function(){
              $container.parent().find( ".ttxt-more" ).addClass( "ttxt-nodisplay" );
              $container.parent().find( ".ttxt-less" ).removeClass( "ttxt-nodisplay" );
            });

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

        $container = instance.toggleMaxHeight( instance, $( el ).find( ".ttxt-container" ),  x.lines, 0 );

        $container.siblings( ".ttxt-read-more" ).on( "click.truncatetext", function ( event ) {

            instance.toggleMaxHeight( instance, $( this ).siblings( ".ttxt-container" ), x.lines, x.duration );
        });

        this.updateControls( instance, $container );

    },

    updateControls: function ( instance, $container, resize ) {
        var scrollHeight = $container.find( ".ttxt-text" )[ 0 ].scrollHeight,
            lineHeight = instance.lineHeightFunc( $container.find( ".ttxt-text" ) );

        if ($container.find( ".ttxt-text" )[ 0 ].clientHeight + lineHeight / 2 >= scrollHeight) { // add lineHeight / 2 to fix small and large zooming
            $container.find( ".ttxt-fade-out" ).addClass( "ttxt-nodisplay" );
            $container.siblings( ".ttxt-read-more" ).addClass( "ttxt-nodisplay" );
        } else if (resize) {
            $container.find( ".ttxt-fade-out" ).removeClass( "ttxt-nodisplay" );
            $container.siblings( ".ttxt-read-more" ).removeClass( "ttxt-nodisplay" );
        }
    },

    resize: function( el, width, height, instance ) {
        $( el ).find( ".ttxt-container .ttxt-text" ).css( "max-height", "" );
        $container = instance.toggleMaxHeight( instance, $( el ).find( ".ttxt-container" ),  instance.x.lines, 0 );
        this.updateControls( instance, $container, true );
    }

});
