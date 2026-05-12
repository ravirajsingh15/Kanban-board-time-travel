class Event < ApplicationRecord
  belongs_to :card, optional: true

  validates :event_type, presence: true
end