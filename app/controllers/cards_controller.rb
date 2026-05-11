class CardsController < ApplicationController

  protect_from_forgery with: :null_session

  def index

    cards = Card.active.order(
      :column,
      :position
    )

    render json: cards
  end

  def create

    card = Card.create!(
      title:
        params[:title],

      description:
        params[:description],

      column:
        params[:column],

      position:
        next_position(
          params[:column]
        )
    )

    create_event(
      "created",
      card
    )

    render json: card
  end

  def update

    card =
      Card.find(
        params[:id]
      )

    old_column =
      card.column

    card.update!(
      title:
        params[:title],

      description:
        params[:description],

      column:
        params[:column]
    )

    if old_column !=
      card.column

      create_event(
        "moved",
        card,
        {
          from:
            old_column,

          to:
            card.column
        }
      )

    else

      create_event(
        "updated",
        card
      )

    end

    render json: card
  end

  def destroy

    card =
      Card.find(
        params[:id]
      )

    card.update!(
      deleted_at:
        Time.current
    )

    create_event(
      "deleted",
      card
    )

    head :ok
  end

  def reorder

    card =
      Card.find(
        params[:id]
      )

    card.update!(
      column:
        params[:column],

      position:
        params[:position]
    )

    create_event(
      "reordered",
      card,
      {
        moved_to_column:
          params[:column],

        moved_to_position:
          params[:position]
      }
    )

    render json: card
  end

  private

  def next_position(column)

    last_card =
      Card.where(
        column: column
      ).order(
        position: :desc
      ).first

    return 1 unless
      last_card

    last_card.position + 1
  end

  def create_event(
    event_type,
    card,
    extra_data = {}
  )

    Event.create!(
      event_type:
        event_type,

      card_id:
        card.id,

      data: {
        id:
          card.id,

        title:
          card.title,

        description:
          card.description,

        column:
          card.column,

        position:
          card.position,

        deleted_at:
          card.deleted_at,

        created_at:
          card.created_at,

        updated_at:
          card.updated_at
      }.merge(
        extra_data
      ),

      occurred_at:
        Time.current
    )
  end
end