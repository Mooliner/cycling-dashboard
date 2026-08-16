import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './App.css'

function diaDelAny(dataStr) {
  const data = new Date(dataStr)
  const inici = new Date(data.getFullYear(), 0, 0)
  return Math.floor((data - inici) / (1000 * 60 * 60 * 24))
}

function construeixAcumulat(activitatsAny) {
  const ordenades = [...activitatsAny].sort(
    (a, b) => new Date(a.start_date_local) - new Date(b.start_date_local)
  )
  let acumulat = 0
  const punts = {}
  ordenades.forEach(act => {
    acumulat += act.distance
    punts[diaDelAny(act.start_date_local)] = acumulat
  })
  return punts
}

function App() {
  const [totes, setTotes] = useState([])

  useEffect(() => {
    fetch('/activities.json')
      .then(resposta => resposta.json())
      .then(dades => setTotes(dades))
  }, [])

  const activitats2026 = totes.filter(
    act => new Date(act.start_date_local).getFullYear() === 2026
  )
  const activitats2025 = totes.filter(
    act => new Date(act.start_date_local).getFullYear() === 2025
  )

  const kmTotals = activitats2026.reduce((acum, act) => acum + act.distance, 0)
  const desnivellTotal = activitats2026.reduce((acum, act) => acum + act.total_elevation_gain, 0)
  const horesTotals = activitats2026.reduce((acum, act) => acum + act.moving_time, 0)
  const numSortides = activitats2026.length
  const wattsAmbDades = activitats2026.filter(act => act.average_watts)
  const wattsMitjans = wattsAmbDades.length
    ? wattsAmbDades.reduce((acum, act) => acum + act.average_watts, 0) / wattsAmbDades.length
    : 0

  const activitatsOrdenades = [...activitats2026].sort(
    (a, b) => new Date(b.start_date_local) - new Date(a.start_date_local)
  )

  // Construïm el gràfic comparatiu km acumulats 2025 vs 2026
  const punts2025 = construeixAcumulat(activitats2025)
  const punts2026 = construeixAcumulat(activitats2026)
  const totsElsDies = Array.from(
    new Set([...Object.keys(punts2025), ...Object.keys(punts2026)].map(Number))
  ).sort((a, b) => a - b)

  let ultim2025 = 0
  let ultim2026 = 0
  const dadesComparativa = totsElsDies.map(dia => {
    if (punts2025[dia] !== undefined) ultim2025 = punts2025[dia]
    if (punts2026[dia] !== undefined) ultim2026 = punts2026[dia]
    return { dia, km2025: ultim2025, km2026: ultim2026 }
  })

  return (
    <div className="app">
      <header className="header">
        <h1>Cycling Dashboard</h1>
        <p className="subtitle">Temporada 2026</p>
      </header>

      <section className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-value">{kmTotals.toFixed(0)}</span>
          <span className="kpi-label">km totals</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{desnivellTotal.toFixed(0)}</span>
          <span className="kpi-label">m de desnivel</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{horesTotals.toFixed(0)}</span>
          <span className="kpi-label">horas en bici</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{numSortides}</span>
          <span className="kpi-label">salidas</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{wattsMitjans.toFixed(0)}</span>
          <span className="kpi-label">watts medios</span>
        </div>
      </section>

      <section className="chart-section">
        <h2>Km acumulados: 2025 vs 2026</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={dadesComparativa}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262a33" />
            <XAxis
              dataKey="dia"
              type="number"
              domain={[1, 366]}
              tickFormatter={(dia) => new Date(2023, 0, dia).toLocaleDateString('ca-ES', { month: 'short' })}
              stroke="#8a8f98"
            />
            <YAxis stroke="#8a8f98" />
            <Tooltip
              labelFormatter={(dia) => new Date(2023, 0, dia).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}
              contentStyle={{ background: '#1a1d24', border: '1px solid #262a33' }}
            />
            <Legend />
            <Line type="monotone" dataKey="km2025" name="2025" stroke="#5a6472" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="km2026" name="2026" stroke="#ff6b35" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="activities">
        <h2>Actividades</h2>
        <div className="activity-list">
          {activitatsOrdenades.map((activitat, index) => (
            <div className="activity-card" key={index}>
              <div className="activity-header">
                <span className="activity-name">{activitat.name}</span>
                <span className="activity-date">
                  {new Date(activitat.start_date_local).toLocaleDateString('ca-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              <div className="activity-stats">
                <div className="stat">
                  <span className="stat-value">{activitat.distance.toFixed(1)}</span>
                  <span className="stat-unit">km</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{activitat.total_elevation_gain.toFixed(0)}</span>
                  <span className="stat-unit">m D+</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{activitat.moving_time.toFixed(1)}</span>
                  <span className="stat-unit">h</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {activitat.average_watts ? activitat.average_watts.toFixed(0) : '–'}
                  </span>
                  <span className="stat-unit">W</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {activitat.average_heartrate ? activitat.average_heartrate.toFixed(0) : '–'}
                  </span>
                  <span className="stat-unit">ppm</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{activitat.average_speed.toFixed(1)}</span>
                  <span className="stat-unit">km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App