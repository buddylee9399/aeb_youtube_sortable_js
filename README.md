# What I did
- from this go rails tutorial: https://www.youtube.com/watch?v=r884jAqAbHY
- Heres the github of sortablejs: https://github.com/SortableJS/Sortable
- http://sortablejs.github.io/Sortable/
- create task scaffold name position:integer
- bundle add acts_as_list
- update task.rb

```
class Task < ApplicationRecord
	acts_as_list
end
```
- rails g stimulus drag
- update the drag controller

```
export default class extends Controller {
  connect() {
    console.log('im in the drag controller')
  }
}
```
- update the task index

```
<div id="tasks" data-controller="drag">  
    <% @tasks.each do |task| %>
      <%= render task %>
    <% end %>
</div>
```
- update task partial

```
<div class="task">
  <%= link_to task.name, task %>
</div>
```
- bin/importmap pin sortablejs
- update drag controller

```
import { Controller } from "@hotwired/stimulus"
import Sortable from 'sortablejs'

// Connects to data-controller="drag"
export default class extends Controller {
  connect() {
    // console.log('im in the drag controller')
    // console.log("Sortable: ", Sortable);
    var el = document.getElementById('tasks');
    console.log(el);
    var sortable = Sortable.create(el);    
  }
}
```

- update drag controller to see what the event drag object is
```
export default class extends Controller {
  connect() {
    // console.log('im in the drag controller')
    // console.log("Sortable: ", Sortable);
    var el = document.getElementById('tasks');
    // console.log(el);
    var sortable = Sortable.create(el, {
      onEnd: this.end.bind(this),
      animation: 400
    });    
  }

  end(event) {
    console.log(event)
  }
}
```
- refresh the page, and test dragging items, IT WORKED
- not persisting yet
- update routes

```
  resources :tasks do
    member do
      patch :move
    end
  end
```

- update task controller
```
before_action :set_task, only: %i[ show edit update destroy move ]
  def move    
    # debugger
    @task.insert_at(params[:resource][:position])
    head :ok
  end
params.require(:task).permit(:name, :position)
```

- update task index

```
<div id="tasks" data-controller="drag" data-drag-url="/tasks/:id/move">
    <% @tasks.each do |task| %>
      <%= render task %>
    <% end %>
</div>
```

- update task partial

```
<div data-id="<%= task.id %>" class="task">
  <%= link_to task.name, task %> | 
  <%= "Position: #{task.position}" %> |
  <%= link_to "Delete task", task_path(task), data: { turbo_method: "delete", turbo_confirm: "Are you sure?" } %>
</div>
```

- final drag controller.js

```
import { Controller } from "@hotwired/stimulus"
import Sortable from 'sortablejs'

// Connects to data-controller="drag"
export default class extends Controller {
  connect() {
    // console.log('im in the drag controller')
    // console.log("Sortable: ", Sortable);
    var el = document.getElementById('tasks');
    // console.log(el);
    var sortable = Sortable.create(el, {
      onEnd: this.end.bind(this),
      animation: 400
    });    
  }

  end(event) {
    console.log(event)
    // event.preventDefault();
    let resourceID = event.item.dataset.id
    let newPosition = event.newIndex + 1
    // console.log("id and position: ", resourceID, newPosition)
    // let data = new FormData()
    // data.append("position", event.newIndex + 1)
    let taskUrl = this.data.get("url").replace(":id", resourceID)
    let data = JSON.stringify({
      resource: {
        id: resourceID,
        position: newPosition,
      },
    });    
    console.log("Data is: ", data)
    fetch(taskUrl, {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "X-CSRF-Token": this.getMetaValue("csrf-token"),
        "Content-Type": "application/json",
      },
      body: data,
    });    
    // console.log("id and datas are: ", id, data, taskUrl)
    // Rails.ajax({
    //   url: taskUrl,
    //   type: 'PATCH',
    //   data: data
    // })
  }
  getMetaValue(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    // console.log("Element content: ", element.getAttribute("content"));
    return element.getAttribute("content");
  }  
}
```