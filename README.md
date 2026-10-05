# To-Do Web App

A clean, responsive to-do list built with **HTML5, CSS3 and vanilla JavaScript**. It uses browser `localStorage` for persistence and requires no framework, dependency or build step.

## Features

- Add tasks with the input field and **Add task** button, or press **Enter**
- Move tasks between **Pending tasks** and **Completed tasks**
- Edit tasks inline with **Save** / **Enter** or **Cancel** / **Esc**
- Delete tasks permanently
- Live pending and completed counters
- Timestamps for when tasks were added and completed
- Persistent data with `localStorage`
- Responsive mobile layout
- Light/dark theme based on system preference
- Keyboard-friendly controls
- User task text is rendered with `textContent` instead of `innerHTML`

## Project Structure

```text
todo-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run Locally

No installation or server is required. Clone the repository and open `index.html` in any modern browser.

## How It Works

The application keeps one `tasks` array. Each task has:

```js
{ id, text, done, added, completed }
```

`render()` rebuilds both task lists from the current array after every change so the UI stays synchronized with the data.

Every change calls `save()`, which stores the array in `localStorage` under the key `todo-tasks-v1`. On startup, `load()` reads the saved data and safely falls back to an empty list if storage is unavailable or invalid.

Task text is inserted with `textContent`, never `innerHTML`, so user-entered task text is not interpreted as HTML.

## Reset Saved Data

Open the browser developer console and run:

```js
localStorage.removeItem("todo-tasks-v1");
```

Then refresh the page.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Web Storage API
- Responsive design
- Accessibility-friendly semantic markup

## License

This project is available for learning and personal portfolio use.
