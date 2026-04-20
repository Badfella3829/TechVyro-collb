"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

const ageData = [
  { name: '13-17', value: 8, fill: 'oklch(0.85 0.18 195)' },
  { name: '18-24', value: 38, fill: 'oklch(0.65 0.25 310)' },
  { name: '25-34', value: 32, fill: 'oklch(0.85 0.22 130)' },
  { name: '35-44', value: 15, fill: 'oklch(0.75 0.2 60)' },
  { name: '45+', value: 7, fill: 'oklch(0.7 0.22 280)' },
]

const genderData = [
  { name: 'Male', value: 72, fill: 'oklch(0.85 0.18 195)' },
  { name: 'Female', value: 24, fill: 'oklch(0.65 0.25 310)' },
  { name: 'Other', value: 4, fill: 'oklch(0.85 0.22 130)' },
]

const cityData = [
  { name: 'Mumbai', value: 18 },
  { name: 'Delhi', value: 16 },
  { name: 'Bangalore', value: 14 },
  { name: 'Hyderabad', value: 11 },
  { name: 'Chennai', value: 9 },
  { name: 'Pune', value: 8 },
  { name: 'Kolkata', value: 7 },
  { name: 'Others', value: 17 },
]

const interestData = [
  { name: 'Technology', value: 85 },
  { name: 'Gadgets', value: 78 },
  { name: 'Gaming', value: 62 },
  { name: 'Science', value: 45 },
  { name: 'Photography', value: 40 },
  { name: 'Cars & Auto', value: 35 },
]

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-3 py-2 rounded-lg text-xs">
        <span className="font-medium text-foreground">{payload[0].name}: </span>
        <span className="text-primary font-bold">{payload[0].value}%</span>
      </div>
    )
  }
  return null
}

export function AudienceDemographics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-16"
    >
      <h3 className="text-xl font-semibold text-center mb-8">Audience Demographics</h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Age Split */}
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Age Distribution
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={isInView ? 0 : 99999}
                    animationDuration={1200}
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
              {ageData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gender Split */}
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Gender Split
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={isInView ? 0 : 99999}
                    animationDuration={1200}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
              {genderData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
                  {entry.name}: {entry.value}%
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Top Cities
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: 'oklch(0.65 0 0)' }}
                    width={55}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="oklch(0.85 0.18 195)"
                    radius={[0, 4, 4, 0]}
                    animationBegin={isInView ? 0 : 99999}
                    animationDuration={1200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Interests */}
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Top Interests
            </h4>
            <div className="space-y-3 mt-2">
              {interestData.map((interest, index) => (
                <motion.div
                  key={interest.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.08 }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{interest.name}</span>
                    <span className="text-primary font-medium">{interest.value}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${interest.value}%` } : {}}
                      transition={{ duration: 1, delay: 0.8 + index * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: index % 3 === 0
                          ? 'oklch(0.85 0.18 195)'
                          : index % 3 === 1
                          ? 'oklch(0.65 0.25 310)'
                          : 'oklch(0.85 0.22 130)',
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
