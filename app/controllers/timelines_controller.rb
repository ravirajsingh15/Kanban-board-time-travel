class TimelinesController < ApplicationController

  def index

    timestamp =
      Time.parse(
        params[:timestamp]
      )

    events =
      Event.where(
        "occurred_at <= ?",
        timestamp
      ).order(
        :occurred_at
      )

    cards = {}

    events.each do |event|

      case event.event_type

      when "created"

        card =
          Card.find_by(
            id:
              event.card_id
          )

        next unless card

        cards[card.id] = {
          id:
            card.id,

          title:
            card.title,

          description:
            card.description,

          column:
            card.column,

          position:
            card.position
        }

      when "deleted"

        cards.delete(
          event.card_id
        )
      end
    end

    render json:
      cards.values
  end
end