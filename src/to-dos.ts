import 'lit/polyfill-support.js'
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import importedStyles from 'litsass:./to-dos.scss'

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
const PM_600 = HOUR_1 * 22

@customElement('to-dos')
export class Element extends LitElement {
  static styles = importedStyles

  @state()
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

  @state()
  private _dayOfWeek: string

  constructor() {
    super()
    // Fetch from local storage
    // this._completedTodos = window.localStorage.getItem('completedTodos') ? JSON.parse(window.localStorage.getItem('completedTodos')!) : []

    this._completedTodos = []

    this._dayOfWeek = this._getDayOfWeek()

    // Set up a timer to update the list every minute
    setInterval(() => {
      // If the day of the week has changed, clear the completed todos
      if (this._dayOfWeek !== this._getDayOfWeek()) {
        this._completedTodos = []
        window.localStorage.setItem('completedTodos', '[]')
      }
      this.requestUpdate()
    }, 60000)
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

  private _click(item: string) {
    // if this item is already completed, remove it from the list
    if (this._completedTodos.includes(item)) {
      this._completedTodos = this._completedTodos.filter(completedItem => completedItem !== item)
      return
    } else {
      this._completedTodos = [...this._completedTodos, item]
    }
    window.localStorage.setItem('completedTodos', JSON.stringify(this._completedTodos))
  }

  private _getTodoItems() {
    const todos = this._getTodosForNow()
    return todos.map(todo => {
      return todo.items.map(item => {
        return html`<li
          class=${this._completedTodos.includes(item) ? 'completed' : ''}
          @click=${() => this._click(item)}
        >${item}</li>`
      })
    })
  }

  render() {
    return html`<div>
      <h1>To-dos / ${this._dayOfWeek}</h1>
      <ul>
        ${this._getTodoItems()}
      </ul>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'to-dos': Element
  }
}
