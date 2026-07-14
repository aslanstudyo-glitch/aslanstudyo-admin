import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { realtimeDb } from "../firebase";

function createDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createLastSevenDays() {
  const days = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);

    days.push({
      key: createDateKey(date),
      label: date.toLocaleDateString("tr-TR", {
        weekday: "short",
      }),
      fullDate: date.toLocaleDateString("tr-TR"),
      visits: 0,
    });
  }

  return days;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="visit-chart-tooltip">
      <strong>{data.fullDate}</strong>
      <span>{data.visits} ziyaret</span>
    </div>
  );
}

function VisitChart() {
  const [dailyVisits, setDailyVisits] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dailyRef = ref(realtimeDb, "analytics/daily");

    const unsubscribe = onValue(
      dailyRef,
      (snapshot) => {
        setDailyVisits(snapshot.val() || {});
        setLoading(false);
      },
      (error) => {
        console.error("Günlük ziyaret verileri alınamadı:", error);
        setDailyVisits({});
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const chartData = useMemo(() => {
    return createLastSevenDays().map((day) => ({
      ...day,
      visits: Number(dailyVisits[day.key]?.visits || 0),
    }));
  }, [dailyVisits]);

  const weeklyTotal = useMemo(() => {
    return chartData.reduce(
      (total, day) => total + day.visits,
      0
    );
  }, [chartData]);

  const busiestDay = useMemo(() => {
    return chartData.reduce(
      (highest, day) =>
        day.visits > highest.visits ? day : highest,
      chartData[0]
    );
  }, [chartData]);

  return (
    <section className="analytics-panel visit-chart-panel">
      <div className="analytics-panel-header">
        <div>
          <span>Son 7 Gün</span>
          <h2>Ziyaret Grafiği</h2>
        </div>

        <strong>{weeklyTotal} ziyaret</strong>
      </div>

      {loading ? (
        <p className="analytics-empty">
          Grafik verileri yükleniyor...
        </p>
      ) : (
        <>
          <div className="visit-chart-summary">
            <div>
              <span>Haftalık toplam</span>
              <strong>
                {weeklyTotal.toLocaleString("tr-TR")}
              </strong>
            </div>

            <div>
              <span>En yoğun gün</span>
              <strong>
                {busiestDay?.label || "-"} ·{" "}
                {busiestDay?.visits || 0}
              </strong>
            </div>
          </div>

          <div className="visit-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 15,
                  right: 5,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="rgba(255, 255, 255, 0.12)"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#b8b8b8",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#b8b8b8",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "rgba(227, 6, 19, 0.08)",
                  }}
                />

                <Bar
                  dataKey="visits"
                  fill="#e30613"
                  radius={[10, 10, 3, 3]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}

export default VisitChart;