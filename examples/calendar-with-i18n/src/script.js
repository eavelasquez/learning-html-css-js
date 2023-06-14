const createCalendar = ({ locale = 'en', year = 2023 }) => {
  const intlMonth = new Intl.DateTimeFormat(locale, { month: 'long' })
  const intlWeekday = new Intl.DateTimeFormat(locale, { weekday: 'short' })

  const weekdays = [...Array(7).keys()]
  const weekdayNames = weekdays.map((day) => (
    intlWeekday.format(new Date(2023, 0, day + 1))
  ))

  const months = [...Array(12).keys()]

  const calendar = months.map((month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysOfMonth = [...Array(daysInMonth).keys()].map((day) => day + 1)
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const monthName = intlMonth.format(new Date(year, month))

    return { daysOfMonth, firstDayOfMonth, monthName }
  })

  const weekdayNamesHtml = weekdayNames.map((weekday) => (
    `<li class="day-name">${weekday}</li>`
  )).join('')

  const calendarHtml = calendar.map(({ daysOfMonth, firstDayOfMonth, monthName }) => {
    const monthNameHtml = `<h2>${monthName} ${year}</h2>`

    const firstDayOfMonthAttributes = `
    class="first-day" style="--first-day-start: ${firstDayOfMonth}"
  `
    const weekdaysHtml = daysOfMonth.map((day, index) => (
      `<li ${index === 0 ? firstDayOfMonthAttributes : ''}>${day}</li>`
    )).join('')

    const monthHtml = `<ol>${weekdayNamesHtml} ${weekdaysHtml}</ol>`

    return `<div class="month">${monthNameHtml} ${monthHtml}</div>`
  }).join('')

  document.querySelector('#calendar').innerHTML = calendarHtml

  const el = document.querySelector('div')
  const scrollHeight = window.innerHeight
  document.querySelector('#next').addEventListener('click', () => {
    el.scrollTo({ top: el.scrollTop + scrollHeight, behavior: 'smooth' })
  })
  document.querySelector('#previous').addEventListener('click', () => {
    el.scrollTo({ top: el.scrollTop - scrollHeight, behavior: 'smooth' })
  })
}

const locale = 'en'
const currentYear = new Date().getFullYear()

createCalendar({ locale, year: currentYear })
