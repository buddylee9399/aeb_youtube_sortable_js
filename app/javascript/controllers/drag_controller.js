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
    // console.log(event)
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
    // console.log("Data is: ", data)
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
