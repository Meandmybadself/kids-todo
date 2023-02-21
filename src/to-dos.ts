type Todo = {
  daysOfTheWeek: string[]
  startTime: number
  endTime: number
  items: string[]
}

const HOUR_1 = 3600

const AM_600 = HOUR_1 * 6
const AM_800 = HOUR_1 * 8
const PM_200 = HOUR_1 * 14
const PM_600 = HOUR_1 * 23

export class TodoList {
  private _completedTodos: string[];

  private _todos: Todo[] = [
    {
      daysOfTheWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      startTime: AM_600,
      endTime: AM_800,
      items: [
        'Brush teeth',
        'Fill water bottle',
        'Get snack',
        'Get library book',
      ]
    },
    {
      startTime: PM_200,
      endTime: PM_600,
      daysOfTheWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      items: [
        'Take gear off and put away',
        'Empty backpack',
        'Wash hands',
        'Wash lunchbox',
        'Have a snack',
        "Pick out tomorrow's outfit",
      ]
    },
    {
      startTime: AM_600,
      endTime: AM_800,
      daysOfTheWeek: [
        'Friday'
      ],
      items: [
        'Pack library book'
      ]
    },
    {
      startTime: PM_200,
      endTime: PM_600,
      daysOfTheWeek: [
        'Friday'
      ],
      items: [
        'Homework'
      ]
    }
  ]

  private _dayOfWeek: string

  private _heading: HTMLElement

  private _list: HTMLUListElement

  constructor() {

    this._heading = document.querySelector('h1')!
    this._list = document.querySelector('ul')!

    // Fetch from local storage
    this._completedTodos = window.localStorage.getItem('completedTodos') ? JSON.parse(window.localStorage.getItem('completedTodos')!) : []

    // this._completedTodos = []

    this._dayOfWeek = this._getDayOfWeek()

    // Set up a timer to update the list every minute
    setInterval(() => {
      // If the day of the week has changed, clear the completed todos
      if (this._dayOfWeek !== this._getDayOfWeek()) {
        this._completedTodos = []
        window.localStorage.setItem('completedTodos', '[]')
        this._requestUpdate()
      }
    }, 60000)
    this._requestUpdate()
  }

  private _requestUpdate() {
    this._dayOfWeek = this._getDayOfWeek()
    this._heading.textContent = `To-dos / ${this._dayOfWeek}`

    const newList = this._getTodoItems().join('')
    if (newList !== this._list.innerHTML) {
      this._list.innerHTML = newList
      this._list.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', this._click.bind(this))
      })
    }
  }

  private _getDayOfWeek() {
    const date = new Date()
    const day = date.getDay()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[day]
  }

  private _getTodosForNow() {
    const dayOfWeek = this._getDayOfWeek()
    const now = new Date()
    const nowInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    return this._todos.filter(todo => {
      return todo.daysOfTheWeek.includes(dayOfWeek) && todo.startTime <= nowInSeconds && todo.endTime >= nowInSeconds
    })
  }

  private _click(e: Event) {
    const el = e.target as HTMLElement
    const item = el.textContent!
    // if this item is already completed, remove it from the list
    if (this._completedTodos.includes(item)) {
      this._completedTodos = this._completedTodos.filter(completedItem => completedItem !== item)
      el.classList.remove('completed')

      return
    } else {
      this._completedTodos = [...this._completedTodos, item]
      el.classList.add('completed')
    }
    window.localStorage.setItem('completedTodos', JSON.stringify(this._completedTodos))
  }

  private _getTodoItems() {
    const todos = this._getTodosForNow()
    return todos.map(todoGroup => todoGroup.items.map(item => `<li class=${this._completedTodos.includes(item) ? 'completed' : ''}>${item}</li>`)).flat()
  }
}

new TodoList()