(function(){
  var KEY = "todo-tasks-v1";
  var tasks = load();
  var editingId = null;

  var input = document.getElementById("newTask");
  var pendingList = document.getElementById("pendingList");
  var completedList = document.getElementById("completedList");

  function load(){
    try { var d = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(d) ? d : []; }
    catch(e){ return []; }
  }
  function save(){
    try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch(e){}
  }
  function fmt(ts){
    return new Date(ts).toLocaleString([], {day:"numeric", month:"short", hour:"numeric", minute:"2-digit"});
  }
  function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  function addTask(){
    var text = input.value.trim();
    if(!text){ input.focus(); return; }
    tasks.unshift({id:uid(), text:text, done:false, added:Date.now(), completed:null});
    input.value = "";
    save(); render(); input.focus();
  }
  function toggle(id){
    var t = find(id); if(!t) return;
    t.done = !t.done;
    t.completed = t.done ? Date.now() : null;
    save(); render();
  }
  function remove(id){
    tasks = tasks.filter(function(t){ return t.id !== id; });
    if(editingId === id) editingId = null;
    save(); render();
  }
  function find(id){ return tasks.filter(function(t){ return t.id === id; })[0]; }
  function commitEdit(id, value){
    var t = find(id), v = value.trim();
    if(t && v) t.text = v;
    editingId = null; save(); render();
  }

  function el(tag, cls, text){
    var n = document.createElement(tag);
    if(cls) n.className = cls;
    if(text != null) n.textContent = text;
    return n;
  }
  function btn(label, cls, fn){
    var b = el("button", cls, label);
    b.type = "button"; b.addEventListener("click", fn);
    return b;
  }

  function item(t){
    var li = el("li", t.done ? "done" : "");
    var cb = el("input"); cb.type = "checkbox"; cb.checked = t.done;
    cb.setAttribute("aria-label", t.done ? "Mark as pending" : "Mark complete");
    cb.title = t.done ? "Mark as pending" : "Mark complete";
    cb.addEventListener("change", function(){ toggle(t.id); });
    li.appendChild(cb);

    var body = el("div", "body");
    if(editingId === t.id){
      var ei = el("input", "edit-input"); ei.type = "text"; ei.value = t.text; ei.maxLength = 200;
      ei.setAttribute("aria-label", "Edit task");
      ei.addEventListener("keydown", function(e){
        if(e.key === "Enter") commitEdit(t.id, ei.value);
        if(e.key === "Escape"){ editingId = null; render(); }
      });
      body.appendChild(ei);
      li.appendChild(body);
      var a = el("div", "actions");
      a.appendChild(btn("Save", "", function(){ commitEdit(t.id, ei.value); }));
      a.appendChild(btn("Cancel", "", function(){ editingId = null; render(); }));
      li.appendChild(a);
      setTimeout(function(){ ei.focus(); ei.select(); }, 0);
    } else {
      body.appendChild(el("span", "text", t.text));
      body.appendChild(el("span", "time",
        "Added " + fmt(t.added) + (t.done && t.completed ? " · Completed " + fmt(t.completed) : "")));
      li.appendChild(body);
      var act = el("div", "actions");
      act.appendChild(btn("Edit", "", function(){ editingId = t.id; render(); }));
      act.appendChild(btn("Delete", "danger", function(){ remove(t.id); }));
      li.appendChild(act);
    }
    return li;
  }

  function fill(list, items, emptyMsg){
    list.innerHTML = "";
    if(!items.length){
      var li = el("li", "empty", emptyMsg);
      li.style.display = "block";
      list.appendChild(li);
      return;
    }
    items.forEach(function(t){ list.appendChild(item(t)); });
  }

  function render(){
    var p = tasks.filter(function(t){ return !t.done; });
    var c = tasks.filter(function(t){ return t.done; })
                 .sort(function(a,b){ return (b.completed||0) - (a.completed||0); });
    document.getElementById("pendingCount").textContent = p.length + " pending";
    document.getElementById("completedCount").textContent = c.length + " completed";
    fill(pendingList, p, "Nothing pending. Add a task above to get started.");
    fill(completedList, c, "No completed tasks yet. Finish something and it will show up here.");
  }

  document.getElementById("addBtn").addEventListener("click", addTask);
  input.addEventListener("keydown", function(e){ if(e.key === "Enter") addTask(); });
  render();
})();
