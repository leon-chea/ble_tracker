class CreateHomes < ActiveRecord::Migration[5.0]
  def change
    create_table :homes do |t|
      t.integer :width
      t.integer :height
      t.string :shapes
      t.string :beacons
      t.string :obstacles
      t.string :doors

      t.timestamps
    end
  end
end
