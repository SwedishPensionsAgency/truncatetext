#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
truncatetext <- function(message, width = NULL, height = NULL) {

  # forward options using x
  x = list(
    message = message
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'truncatetext',
    x,
    width = width,
    height = height,
    package = 'truncatetext'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
truncatetextOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'truncatetext', width, height, package = 'truncatetext')
}

#' Widget render function for use in Shiny
#'
#' @export
renderTruncatetext <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, truncatetextOutput, env, quoted = TRUE)
}
