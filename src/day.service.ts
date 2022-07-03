import axios from "axios";

import { DayType, HappyDayRecord } from "./types";

const axiosInstance = axios.create({
  baseURL: "https://p51bpqf1pj.execute-api.us-east-1.amazonaws.com/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const fetchDayMarkers = (): Promise<HappyDayRecord> =>
  axiosInstance
    .get<{ Items: { date: { S: string }; type: { S: DayType } }[] }>("/day")
    .then((res) =>
      res.data.Items.reduce(
        (acc, { date, type }) => ({ ...acc, [date.S]: type.S }),
        {}
      )
    );

export const saveDayMarkers = (markers: HappyDayRecord) =>
  axiosInstance.put("/day", JSON.stringify(markers));
