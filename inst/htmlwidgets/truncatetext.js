HTMLWidgets.widget({

  name: 'truncatetext',

  type: 'output',

  initialize: function(el, width, height) {

    return {
      // TODO: add instance fields as required
    }

  },

  renderValue: function(el, x, instance) {

    $container = $( "<div class='container'></div>" );
    $container.html(x.message);
    $( el ).append( $container );

  },

  resize: function(el, width, height, instance) {
  }

});
