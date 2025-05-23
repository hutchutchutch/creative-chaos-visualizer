
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyCalendarProps {
  schedule: string[];
}

const DailyCalendar = ({ schedule }: DailyCalendarProps) => {
  // Time slots for a day starting from 6 AM (assuming 16 hours)
  const timeSlots = [
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", 
    "8:00 PM", "9:00 PM"
  ];

  const getLaneColor = (activity: string) => {
    switch(activity) {
      case "Happy": return "bg-[#4285F4] text-white";
      case "Healthy": return "bg-[#34A853] text-white";
      case "Helpful": return "bg-[#8B5CF6] text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className="w-full max-h-[400px] overflow-y-auto bg-white/10 backdrop-blur-sm border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center">Your Daily Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {timeSlots.map((timeSlot, index) => (
            <div 
              key={index}
              className="flex items-center gap-2"
            >
              <div className="w-16 text-xs text-gray-300">{timeSlot}</div>
              <div className={`flex-1 p-2 rounded-md ${getLaneColor(schedule[index] || "")}`}>
                {schedule[index] || "Unplanned"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCalendar;
