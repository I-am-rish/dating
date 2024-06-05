const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcrypt");
const config = require("../config/index");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      default: "",
    },
    last_name: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: Number,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      trim: true,
      default: "",
    },
    dob: {
      type: String,
      trim: true,
      default: "",
    },
    age: {
      type: Number,
      trim: true,
      default: 0,
    },
    age_from: {
      type: Number,
      trim: true,
      default: 0,
    },
    age_to: {
      type: Number,
      trim: true,
      default: 0,
    },
    height: {
      type: Number,
      trim: true,
      default: 0,
    },
    gender: {
      type: String,
      trim: true,
      default: "",
    },
    device_token: {
      type: String,
      trim: true,
      default: "",
    },
    access_token: {
      type: String,
      trim: true,
      default: "",
    },
    device_type: {
      type: String,
      trim: true,
      default: "",
    },
    profile_picture: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      trim: true,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_online: {
      type: Boolean,
      default: false,
    },
    is_private: {
      type: Boolean,
      default: false,
    },
    keep_loggedIn: {
      type: Boolean,
      default: false,
    },
    phone_verified: {
      type: Boolean,
      default: false,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    profile_verified: {
      type: Boolean,
      default: false,
    },
    login_way: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    isd: {
      type: String,
      default: "",
    },
    // curr_country: {
    //   type: String,
    //   default: "",
    // },
    // curr_state: {
    //   type: String,
    //   default: "",
    // },
    latitude: {
      type: String,
      trim: true,
      default: "",
    },
    longitude: {
      type: String,
      trim: true,
      default: "",
    },
    media: {
      type: [String],
      default: [],
    },
    relationship_status: {
      type: String,
      trim: true,
      default: "",
    },
    interested_in: {
      type: [String],
      trim: true,
      default: [],
    },
    my_sexual_orientation: {
      type: [String],
      trim: true,
      default: [],
    },
    degree: {
      type: String,
      trim: true,
      default: "",
    },
    profession: {
      type: String,
      trim: true,
      default: "",
    },
    languages: {
      type: [String],
      trim: true,
      default: [],
    },
    exercise: {
      type: String,
      trim: true,
      default: "",
    },
    smoking: {
      type: String,
      trim: true,
      default: "",
    },
    drinking: {
      type: String,
      trim: true,
      default: "",
    },
    religion: {
      type: String,
      trim: true,
      default: "",
    },
    have_kids: {
      type: String,
      trim: true,
      default: "",
    },
    politic: {
      type: String,
      trim: true,
      default: "",
    },
    pet: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    quote: {
      type: String,
      trim: true,
      default: "",
    },
    sun_sign: {
      type: String,
      trim: true,
      default: "",
    },
    passion: {
      type: [String],
      trim: true,
      default: [],
    },
    my_subscription: {
      type: [String],
      default: [],
    },

    profile_completion_percentage: {
      type: Number,
      default: 0,
    },
    question_answer_percentage: {
      type: Number,
      default: 0,
    },

    last_login_time: {
      type: Date,
      default: "",
    },
    deleted_time: {
      type: Date,
      default: "",
    },

    //subscription
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


userSchema.pre("save", function (next) {
  let user = this;
  let salt = config.bcrypt.saltValue;

  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(salt, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});



userSchema.plugin(mongooseDelete, { overrideMethods: true });
module.exports = mongoose.model("User", userSchema);
