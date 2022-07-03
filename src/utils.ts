import { DayType } from "./types";

export const getDayColor = (dayType: DayType, isLoading: boolean): string => {
  if (isLoading) {
    return "#828282";
  }

  return dayType === "GOOD" ? "#a2d5c6" : "#d72631";
};

export const getDiff = (a: Record<string, any>, b: Record<string, any>) =>
  Object.keys(b).reduce((diff, key) => {
    if (a[key] === b[key]) return diff;
    return {
      ...diff,
      [key]: b[key],
    };
  }, {});

export const customFormat = (date: Date) => date.toLocaleDateString("en-CA");
