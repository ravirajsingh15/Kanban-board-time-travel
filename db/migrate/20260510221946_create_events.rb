class CreateEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :events do |t|
      t.string :event_type
      t.integer :card_id
      t.jsonb :data
      t.datetime :occurred_at

      t.timestamps
    end
  end
end
