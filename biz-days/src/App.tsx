// src/App.tsx
import { useEffect, useState } from "react";
import { parseISO, eachDayOfInterval, isWeekend } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [businessDays, setBusinessDays] = useState<number | null>(null);
  const [businessHours, setBusinessHours] = useState<number | null>(null);
  const [hourlyRate, setHourlyRate] = useState<string>("");

  useEffect(() => {
    const savedStart = localStorage.getItem("startDate");
    const savedEnd = localStorage.getItem("endDate");
    const savedRate = localStorage.getItem("hourlyRate");

    if (savedStart) setStartDate(savedStart);
    if (savedEnd) setEndDate(savedEnd);
    if (savedRate) setHourlyRate(savedRate);
  }, []);

  const calculate = () => {
    if (!startDate || !endDate) return;

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);

    const allDays = eachDayOfInterval({ start, end });
    const weekdays = allDays.filter((day) => !isWeekend(day));

    const days = weekdays.length;
    const hours = days * 8;

    setBusinessDays(days);
    setBusinessHours(hours);
  };

  const handleRateChange = (value: string) => {
    setHourlyRate(value);
    localStorage.setItem("hourlyRate", value);
  };

  const monthlyRate =
    businessHours && hourlyRate ? parseFloat(hourlyRate) * businessHours : null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 text-gray-100">
      <Card className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-center text-2xl font-bold text-transparent">
            Business Hour Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date pickers */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-gray-300">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-gray-700 bg-gray-800 text-gray-100 focus:border-purple-400 focus:ring-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-gray-300">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-gray-700 bg-gray-800 text-gray-100 focus:border-purple-400 focus:ring-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          <Button
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transition hover:opacity-90"
            onClick={calculate}
          >
            Calculate
          </Button>

          {/* Results */}
          <AnimatePresence>
            {businessDays !== null && businessHours !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6 rounded-xl border border-gray-800 bg-gray-800/60 p-6 text-center shadow-inner"
              >
                <p className="text-xl font-semibold text-purple-300">
                  {businessDays} business days
                </p>
                <p className="text-lg text-blue-300">
                  {businessHours} business hours
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Accordion for hourly rate */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="rate">
              <AccordionTrigger className="text-gray-200">
                Add hourly rate?
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <Label htmlFor="hourlyRate" className="text-gray-300">
                    Hourly Rate
                  </Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="e.g. 50"
                    value={hourlyRate}
                    onChange={(e) => handleRateChange(e.target.value)}
                    className="border-gray-700 bg-gray-800 text-gray-100 focus:border-green-400 focus:ring-green-400"
                  />

                  {monthlyRate !== null && (
                    <div className="mt-2 rounded-lg bg-gray-800/70 p-3 text-center">
                      <p className="text-md text-gray-300">
                        Monthly Equivalent
                      </p>
                      <p className="text-xl font-bold text-green-400">
                        {formatCurrency(monthlyRate)}
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
