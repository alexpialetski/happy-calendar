import React, { useCallback, useEffect, useState, useContext } from "react";
import { debounce, keys } from "lodash";
import { useParams, Navigate } from "react-router-dom";
import FullCalendar, { addDays } from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick

import { HappyDayRecord } from "../types/day";
import { AppParams } from "../types/app";
import { getDayColor, getDiff, customFormat } from "../utils/day";
import { fetchDayMarkers, saveDayMarkers } from "../service/day.service";
import { UserContext } from "../context/UserContext";
import { Loader } from "../components/Loader";

export const Calendar: React.FC = () => {
  const { userId } = useParams<AppParams>();
  const [dayMarkers, setDayMarkers] = useState<{
    prev: HappyDayRecord;
    curr: HappyDayRecord;
  }>({ prev: {}, curr: {} });
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user } = useContext(UserContext);

  const calendarPlugins = [dayGridPlugin];
  const resultUserId = userId || user?.username;

  const saveData = useCallback(
    debounce((prevMarkers: HappyDayRecord, currMarkers: HappyDayRecord) => {
      const diff = getDiff(prevMarkers, currMarkers);

      if (keys(diff).length && resultUserId) {
        setIsSaving(true);

        saveDayMarkers(diff, resultUserId)
          .then(() => setDayMarkers({ prev: currMarkers, curr: currMarkers }))
          .catch(() => setDayMarkers({ prev: prevMarkers, curr: prevMarkers }))
          .finally(() => setIsSaving(false));
      }
    }, 1000),
    [resultUserId]
  );

  const onDayClick = (arg: DateClickArg) => {
    if (!isSaving) {
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
    if (resultUserId) {
      setIsFetching(true);

      fetchDayMarkers(resultUserId)
        .then((markers) => {
          setDayMarkers({ prev: markers, curr: markers });
        })
        .finally(() => setIsFetching(false));
    }
  }, [resultUserId]);

  if (!resultUserId) {
    return <Navigate to="../people" />;
  }

  if (isFetching) {
    return <Loader />;
  }

  if (resultUserId === user?.username) {
    calendarPlugins.push(interactionPlugin);
  }

  return (
    <FullCalendar
      plugins={calendarPlugins}
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
          color: getDayColor(dayType, isSaving),
          overlap: false,
        }))}
      navLinkDayClick={console.log}
      dateClick={onDayClick}
    />
  );
};
