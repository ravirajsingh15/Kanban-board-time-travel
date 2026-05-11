class BoardsController < ApplicationController
  
  def index
    @cards = Card.active.order(
      :column,
      :position
    )

  end
end