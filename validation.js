const { date } = require("joi");
const JoiStringFactory = require("joi-phone-number");
const Joi = require("joi").extend(require("@joi/date"));

const checkLogin = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

const createClient = Joi.object().keys({
  name: Joi.string().trim().lowercase().required(),
  address: {
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().required(),
  },
  users: Joi.array().items(Joi.string()).required(),
  contact: Joi.string().length(24).required(),
  timePreference: Joi.string().required(),
  website: Joi.string().trim(),
});

const createUser = Joi.object().keys({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  phone: Joi.string()
    .trim()
    .length(10)
    //.length(12)
    .pattern(/^[0-9]+$/)
    .required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  repeatPass: Joi.ref("password"),
});

const createInspector = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string()
    .trim()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  isManager: Joi.bool().required(),
  resetPass: Joi.bool().required(),
});

const createManager = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  phone: Joi.string()
    .trim()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  resetPass: Joi.bool(),
});

const requestInspection = Joi.object().keys({
  createdBy: Joi.object({
    userType: Joi.string(),
    userId: Joi.string().length(24).required(),
  }),
  client: Joi.string().length(24).required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zip: Joi.number().required(),
  inspections: Joi.array().items(
    Joi.object({
      type: Joi.string(), // Residential / Commercial toggle
      name: Joi.string().required(), // Dropdown
      timePreference: Joi.string().required(), // AM / PM toggle
      comment: Joi.string().max(3000).allow("").optional(),
      publicComment: Joi.bool(),
      guests: Joi.array().items(Joi.string().email().lowercase()),
    })
  ),
});

const newInspection = Joi.object().keys({
  client: Joi.string().length(24).required(), // show time preference when choosing a time
  address: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().required(),
  zip: Joi.number().required(),
  inspections: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().required(), // Residential / Commercial toggle
        name: Joi.string().required(), // Dropdown
        inspector: Joi.string().length(24).required(), // _id -> show inspector's calendar below -> TODO add drag n' drop functionality
        date: Joi.date().format().utc().required(),
        time: Joi.string().trim().required(), // dropdown based on inspector availabity, including "other" option for flexibility
        duration: Joi.number().precision(2).min(0).max(8),
        comment: Joi.string().max(3000),
        publicComment: Joi.bool(),
      })
    )
    .required(),
});

const schedulePending = Joi.object().keys({
  start: Joi.date().format().utc(),
  end: Joi.date().format().utc(),
  inspector: Joi.string().length(24),
  comment: Joi.string().max(3000),
  publicComment: Joi.bool(),
});

const cancelInspection = Joi.object().keys({
  reschedule: Joi.bool(),
  comment: Joi.string().max(3000).optional().allow(""),
});

const updateInspection = Joi.object().keys({
  start: Joi.date().format().utc(),
  end: Joi.date().format().utc(),
  timePreference: Joi.string(),
  location: {
    address: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string(),
    zip: Joi.number(),
  },
  inspector: Joi.string().length(24),
  log: {
    hours: Joi.number().precision(2).min(0).max(8),
    miles: Joi.number().integer().min(0).max(3000),
    notes: Joi.string().max(3000),
  },
});

const clientUpdateInspection = Joi.object().keys({
  timePreference: Joi.string(),
  location: {
    address: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string(),
    zip: Joi.number(),
  },
  guests: Joi.array().items(Joi.string().email().lowercase()).allow(),
});

const logInspection = Joi.object().keys({
  hours: Joi.number().precision(2).min(0).max(8),
  miles: Joi.number().integer().min(0).max(3000),
  notes: Joi.string().optional().allow("").max(3000),
});

const clientUpdateAccount = Joi.object().keys({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string()
    .trim()
    .length(10)
    //.length(12)
    .pattern(/^[0-9]+$/)
    .required(),
});

const updateOrganization = Joi.object().keys({
  address: {
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().required(),
  },
  users: Joi.array().items(Joi.string().length(24)),
  pendingUsers: Joi.array().items(Joi.string().length(24)),
  contact: Joi.string().length(24),
  timePreference: Joi.string().required(),
  website: Joi.string(),
  billingSchedule: Joi.string().allow(), // todo (not in version 1)
});

module.exports = {
  checkLogin,
  createClient,
  createInspector,
  createManager,
  requestInspection,
  cancelInspection,
  newInspection,
  schedulePending,
  createUser,
  logInspection,
  updateInspection,
  clientUpdateInspection,
  clientUpdateAccount,
  updateOrganization,
};
