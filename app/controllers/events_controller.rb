class EventsController < ApplicationController

  def index
    events =
      Event.order(
        occurred_at: :desc
      ).limit(20)

    render json: events
  end
  
end