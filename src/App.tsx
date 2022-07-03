import React, { useCallback, useEffect, useState } from "react";
import FullCalendar, { addDays } from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick
import { debounce, keys } from "lodash";

import { HappyDayRecord } from "./types";
import { getDayColor, getDiff, customFormat } from "./utils";
import { fetchDayMarkers, saveDayMarkers } from "./day.service";

const App: React.FC = () => {
  const [dayMarkers, setDayMarkers] = useState<{
    prev: HappyDayRecord;
    curr: HappyDayRecord;
  }>({ prev: {}, curr: {} });
  const [isLoading, setIsLoading] = useState(false);

  const saveData = useCallback(
    debounce((prevMarkers: HappyDayRecord, currMarkers: HappyDayRecord) => {
      const diff = getDiff(prevMarkers, currMarkers);

      if (keys(diff).length) {
        setIsLoading(true);

        saveDayMarkers(diff)
          .then(() => setDayMarkers({ prev: currMarkers, curr: currMarkers }))
          .finally(() => setIsLoading(false));
      }
    }, 1000),
    []
  );

  const onDayClick = (arg: DateClickArg) => {
    if (!isLoading) {
      setDayMarkers((prev) => {
        const clickedDate = customFormat(arg.date);
        const previousDay = prev.curr[clickedDate];

        return {
          ...prev,
          curr: {
            ...prev.curr,
            [clickedDate]: previousDay === "GOOD" ? "BAD" : "GOOD",
          },
        };
      });
    }
  };

  useEffect(() => {
    saveData(dayMarkers.prev, dayMarkers.curr);
  }, [dayMarkers, saveData]);

  useEffect(() => {
    setIsLoading(true);

    fetchDayMarkers()
      .then((markers) => {
        setDayMarkers({ prev: markers, curr: markers });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek",
      }}
      events={Object.entries(dayMarkers.curr)
        .filter(([, dayType]) => dayType !== undefined)
        .map(([day, dayType]) => ({
          start: day,
          end: customFormat(addDays(new Date(day), 1)),
          display: "background",
          color: getDayColor(dayType, isLoading),
          overlap: false,
        }))}
      navLinkDayClick={console.log}
      dateClick={onDayClick}
    />
  );
};

export default App;
