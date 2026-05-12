class Card < ApplicationRecord

  validates :title, presence: true
  validates :description, presence: true

  scope :active, -> { where(deleted_at: nil)}

  COLUMNS = [
    "Backlog",
    "To Do",
    "In Progress",
    "In Review",
    "Done",
  ]
end