const dayjs = require("dayjs");

const residential = [
  {
    name: "Temp Power",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Footings",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Underground Plumbing",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Damp Proofing",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Water Proofing",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Subsoil Drain",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Rough Framing",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Rough Plumbing",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Rough Electrical",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Rough Mechanical",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Full 4-Way",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Shower Pan",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Dry Wall",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Final Electrical",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Final Mechanical",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Final Plumbing",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Re-Inspection",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Power-to-Panel",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Gas Line Clearance",
    duration: 2,
    requiredCerts: [],
  },
  {
    name: "Misc.",
    duration: 2,
    requiredCerts: [],
  },
];

const numDaysInMonth = (month) => {
  let days;
  switch (month) {
    case 1:
      days = 31;
      break;
    case 2:
      days = 28;
      if (dayjs().year() % 4 === 0) {
        days = 29;
      }
      break;
    case 3:
      days = 31;
      break;
    case 4:
      days = 30;
      break;
    case 5:
      days = 31;
      break;
    case 6:
      days = 30;
      break;
    case 7:
      days = 31;
      break;
    case 8:
      days = 31;
      break;
    case 9:
      days = 30;
      break;
    case 10:
      days = 31;
      break;
    case 11:
      days = 30;
      break;
    case 12:
      days = 31;
      break;
  }
  return days;
};

module.exports = { residential, numDaysInMonth };
