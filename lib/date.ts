// /lib/date.ts

export function getSacredDate() {

  return new Date()
    .toLocaleDateString(
      "en-CA",
      {
        timeZone:
          "Asia/Kolkata",
      }
    );
}