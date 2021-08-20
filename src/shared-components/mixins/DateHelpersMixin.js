import { format, isWithinInterval, subYears, subDays } from "date-fns";

export const DateHelpersMixin = {
  methods: {
    isValidDate(str) {
      if (this.isMonthSlashYear(str)) return true;
      let valid = false;
      try {
        let d = new Date(str);
        let formatted = this.formatMMDDYYYY(d);
        if (str === formatted) {
          valid = true;
        }
      } catch (e) {
        // Parsing of date failed.
      }
      return valid;
    },
    formatMMDDYYYY(str) {
      return this.formatDate("MM/dd/yyyy", str);
    },
    isMonthSlashYear(str) {
      return /^(0[1-9]|1[0-2])\/[12]\d{3}$/.test(str);
    },
    isYearDashMonth(str) {
      return /^[12]\d{3}-(0[1-9]|1[0-2])$/.test(str);
    },
    formatYYYYMMDD(str) {
      return this.formatDate("yyyy-MM-dd", str);
    },
    formatMMYYYY(str) {
      return this.formatDate("MM/yyyy", str);
    },
    formatYYYYMM(str) {
      let [month, year] = this.isYearDashMonth(str)
        ? str.split("-")
        : str.split("/");
      return year + "-" + month;
    },
    formatDate(f, date = new Date()) {
      let dateIsDate = date instanceof Date;
      // Solves a strange behavior, new Date('2000-01-01') is different value than new Date('01/01/2000')
      if (!dateIsDate && /\d{4}-\d{2}-\d{2}/.test(date)) {
        const [year, month, day] = date.split("-");
        date = [month, day, year].join("/");
      }
      let d;
      if (this.isYearDashMonth(date)) {
        d = new Date(date + "-05");
      } else {
        d = new Date(date);
      }
      return format(d, f);
    },
    isWithinRange(date) {
      const today = new Date();
      const start = subYears(today, 25);
      const end = subDays(new Date(), 15);
      return isWithinInterval(new Date(date), { start, end });
    },
    getAgeInYearsAndMonths(dateOfBirthStr) {
      let months;
      const now = new Date();
      const dob = new Date(dateOfBirthStr);
      let years = now.getFullYear() - dob.getFullYear();
      if (now.getMonth() >= dob.getMonth()) {
        months = now.getMonth() - dob.getMonth();
      } else {
        years--;
        months = 12 + now.getMonth() - dob.getMonth();
      }
      if (now.getDate() < dob.getDate()) {
        months--;
        if (months < 0) {
          months = 11;
          years--;
        }
      }
      return {
        years,
        months
      };
    }
  }
};
