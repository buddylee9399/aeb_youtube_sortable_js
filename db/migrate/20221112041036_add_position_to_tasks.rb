class AddPositionToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :position, :integer
    Task.order(:updated_at).each.with_index(1) do |task, index|
      task.update_column :position, index
    end    
  end
end
