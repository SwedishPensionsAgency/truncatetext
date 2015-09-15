#' Truncated Text
#'
#' Makes a truncatable text element.
#'
#' @param text text inside the box
#' @param lines lines to show
#' @param duration determining how long the animation will run, in milliseconds
#' @param more label for the more button
#' @param less label for the less button
#' @param width width of the widget container
#' @param height height of the widget container
#' @param class class to add to the widget container
#'
#' @import htmlwidgets
#'
#' @export
truncatetext <- function(text, lines = 2, duration = 400, more = NULL, less = NULL, width = "100%", height = "auto", class = NULL){

  # forward options using x
  x = list(
    text = text,
    lines = lines,
    duration = duration,
    more = more,
    less = less,
    class = class
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
truncatetextOutput <- function(outputId, width = '100%', height = 'auto'){
  shinyWidgetOutput(outputId, 'truncatetext', width, height, package = 'truncatetext')
}

#' Widget render function for use in Shiny
#'
#' @export
renderTruncatetext <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, truncatetextOutput, env, quoted = TRUE)
}
