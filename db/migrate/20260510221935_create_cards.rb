class CreateCards < ActiveRecord::Migration[8.0]
  def change
    create_table :cards do |t|
      t.string :title
      t.text :description
      t.string :column
      t.decimal :position
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
