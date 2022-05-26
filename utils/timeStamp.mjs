/**
 * Returns the current date and time in a human readable format.
 * @param dateObj - Date Object - new Date()
 * @returns - String - 2022-05-26T13:38:09
 */

export const timeStamp = (dateObj) => {
  let month = dateObj.getMonth() + 1;

  // helper function
  const addZeroIfNeeded = (num) => {
    return num < 10 ? "0" + num : num.toString();
  };

  month = addZeroIfNeeded(month);
  let day = addZeroIfNeeded(dateObj.getDate());

  let year = dateObj.getFullYear();
  let hours = addZeroIfNeeded(dateObj.getHours());
  let mins = addZeroIfNeeded(dateObj.getMinutes());
  let seconds = addZeroIfNeeded(dateObj.getSeconds());

  return `${year}-${month}-${day}T${hours}:${mins}:${seconds}`;
};
