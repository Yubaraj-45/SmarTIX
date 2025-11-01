import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Ticket, Users, BarChart2, Lightbulb, PieChart, Filter } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { generateMockBookings, generateMockEvents } from '../utils/mockData';
import { Booking, Event } from '../types';
import { useChartTheme } from '../hooks/useChartTheme';

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-card/50 dark:bg-card/20 backdrop-blur-lg border border-border rounded-lg p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  </div>
);

const OrganizerDashboard: React.FC = () => {
  const chartTheme = useChartTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  useEffect(() => {
    const mockBookings = generateMockBookings(150);
    const mockEvents = generateMockEvents(10);
    setBookings(mockBookings);
    setEvents(mockEvents);
    if (mockEvents.length > 0) {
      setSelectedEventId(mockEvents[0].id);
    }
  }, []);

  const filteredBookings = bookings.filter(b => b.eventId === selectedEventId);
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const ticketsSold = filteredBookings.reduce((sum, b) => sum + b.quantity, 0);

  const getSalesChartOptions = () => ({
    tooltip: { trigger: 'axis', backgroundColor: 'hsla(var(--background), 0.8)', borderColor: 'hsl(var(--border))', textStyle: { color: chartTheme.textColor } },
    xAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], axisLine: { lineStyle: { color: chartTheme.lineColor } }, axisLabel: { color: chartTheme.textColor } },
    yAxis: { type: 'value', name: 'Tickets Sold', axisLine: { lineStyle: { color: chartTheme.lineColor } }, axisLabel: { color: chartTheme.textColor }, splitLine: { lineStyle: { color: chartTheme.lineColor, type: 'dashed' } } },
    series: [{
      data: [820, 932, 901, ticketsSold],
      type: 'line',
      smooth: true,
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: chartTheme.gradientStart }, { offset: 1, color: chartTheme.gradientEnd }] } },
      itemStyle: { color: chartTheme.primaryColor }
    }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  });

  const getDemographicsChartOptions = () => {
    const ageGroups = { '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0 };
    filteredBookings.forEach(b => {
      if (b.age <= 24) ageGroups['18-24']++;
      else if (b.age <= 34) ageGroups['25-34']++;
      else if (b.age <= 44) ageGroups['35-44']++;
      else ageGroups['45+']++;
    });
    return {
      tooltip: { trigger: 'item', backgroundColor: 'hsla(var(--background), 0.8)', borderColor: 'hsl(var(--border))', textStyle: { color: chartTheme.textColor } },
      legend: { top: 'bottom', textStyle: { color: chartTheme.textColor } },
      series: [{
        name: 'Age Group',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: 'hsl(var(--card))', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold', color: chartTheme.textColor } },
        labelLine: { show: false },
        data: Object.entries(ageGroups).map(([name, value]) => ({ value, name })),
        color: chartTheme.pieColors,
      }]
    };
  };

  const getFunnelChartOptions = () => ({
    tooltip: { trigger: 'item', formatter: '{b} : {c}', backgroundColor: 'hsla(var(--background), 0.8)', borderColor: 'hsl(var(--border))', textStyle: { color: chartTheme.textColor } },
    series: [{
      name: 'Conversion',
      type: 'funnel',
      left: '10%',
      top: 20,
      bottom: 20,
      width: '80%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: { show: true, position: 'inside', formatter: '{b}', color: '#fff' },
      labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
      itemStyle: { borderColor: 'hsl(var(--card))', borderWidth: 1 },
      emphasis: { label: { fontSize: 20 } },
      data: [
        { value: 100, name: 'Views' },
        { value: 45, name: 'Clicks' },
        { value: 25, name: 'Checkout' },
        { value: 18, name: 'Booked' }
      ],
      color: chartTheme.pieColors,
    }]
  });

  const insights = [
    "Your 25-34 age group is the most engaged. Target social media ads to this demographic.",
    "Sales peak in the final week. Consider an 'early bird' discount to boost initial sales.",
    "Conversion from 'Checkout' to 'Booked' is high (72%). The payment process is effective."
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Organizer Intelligence</h1>
            <div className="mt-4 sm:mt-0">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              >
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
            <MetricCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<DollarSign />} />
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
            <MetricCard title="Tickets Sold" value={ticketsSold.toLocaleString('en-IN')} icon={<Ticket />} />
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
            <MetricCard title="Conversion Rate" value="18%" icon={<Users />} />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-card/50 dark:bg-card/20 backdrop-blur-lg border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><BarChart2 className="w-5 h-5 mr-2" />Sales Trend</h2>
            <ReactECharts option={getSalesChartOptions()} theme="customed" style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-card/50 dark:bg-card/20 backdrop-blur-lg border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><PieChart className="w-5 h-5 mr-2" />Attendee Demographics</h2>
            <ReactECharts option={getDemographicsChartOptions()} theme="customed" style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-card/50 dark:bg-card/20 backdrop-blur-lg border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><Filter className="w-5 h-5 mr-2" />Conversion Funnel</h2>
            <ReactECharts option={getFunnelChartOptions()} theme="customed" style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-card/50 dark:bg-card/20 backdrop-blur-lg border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><Lightbulb className="w-5 h-5 mr-2" />AI-Generated Insights</h2>
            <ul className="space-y-3">
              {insights.map((insight, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-muted-foreground">
                  <Lightbulb className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
