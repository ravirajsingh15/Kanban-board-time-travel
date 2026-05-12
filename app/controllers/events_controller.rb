class EventsController < ApplicationController

  def index

    events =
      Event.order(
        occurred_at: :desc
      )

    render json: events
  end

end