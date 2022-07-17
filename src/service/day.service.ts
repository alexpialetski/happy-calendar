import { DayType, HappyDayRecord } from "../types/day";
import { axiosInstance } from "./axiosInstance";

export const fetchDayMarkers = (userName: string): Promise<HappyDayRecord> =>
  axiosInstance
    .get<{ Items: { date: { S: string }; type: { S: DayType } }[] }>(
      `/day/${userName}`
    )
    .then((res) =>
      res.data.Items.reduce(
        (acc, { date, type }) => ({ ...acc, [date.S]: type.S }),
        {}
      )
    );

export const saveDayMarkers = (markers: HappyDayRecord, userName: string) =>
  axiosInstance.put(`/day/${userName}`, JSON.stringify(markers));
