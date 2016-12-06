import { Mongo } from 'meteor/mongo';

export const GraphData = new Mongo.Collection('graphData');

SightsSchema = new SimpleSchema({
    num: {
    type: Number,
    label: "Name of object",
    //optional:true
  },
  date: {
    type: Date,
    label: "Date",
    optional:true
  },
  //fix to time
  watch_time: {
    type: Date,
    label: "Watch Time",
    optional:true
  },
  watch_error: {
    type: Number,
    label: "Watch error",
    decimal: true,
    optional:true
  },
  zone_desc: {
    type: Number,
    label: "Zone Description",
    decimal: true,
    optional:true
  },
  //fix to time
  gmt: {
    type: Date,
    label: "GMT",
    optional:true
  },
  gmt_date: {
    type: Date,
    label: "GMT Date",
    optional:true
  },
  gha_h: {
    type: Number,
    label: "GHA H",
    decimal: true,
    optional:true
  },
  gha_ms: {
    type: Number,
    label: "GHA M:S correction",
    decimal: true,
    optional:true
  },
  gha: {
    type: Number,
    label: "Final GHA",
    decimal: true,
    //optional:true
  },
  ap_long: {
    type: Number,
    decimal: true,
    label: "AP Long",
    optional: true
  },
  lha: {
    type: Number,
    label: "LHA" ,
    decimal: true,
    optional:true
  },
  dec_h: {
    type: Number,
    label: " Declanation H",
    decimal: true,
    optional:true
  },
  d_dec: {
    type: Number,
    label: "d correction",
    decimal: true,
    optional:true
  },
  dec: {
    type: Number,
    label: "Corrected Declanation",
    decimal: true,
    //optional:true
  },
  hs: {
    type: Number,
    label: "Hs",
    decimal: true,
    //optional:true
  },
  ie: {
    type: Number,
    label: "Index Error",
    decimal: true,
    optional:true
  },
  myHieght: {
    type: Number,
    label: "myHieght",
    decimal: true,
    optional:true
  },
  ha : {
    type: Number,
    label: "Ha",
    decimal: true,
    optional:true
  },
  third_correction: {
    type: Number,
    decimal: true,
    label: "3rd correction",
    optional:true
  },
  hp: {
    type: Number,
    decimal: true,
    label: "HP Correction",
    optional:true
  },
  ho: {
    type: Number,
    label: "Ho",
    decimal: true,
    optional:true
  },
  ap_lat: {
    type: Number,
    decimal: true,
    label: "AP Lat",
    optional: true
  },
  h: {
    type: Number,
    label: "H",
    decimal: true,
    optional:true
  },
  d_h: {
    type: Number,
    decimal: true,
    label: "d correction for H",
    optional:true
  },
  hc: {
    type: Number,
    label: "Hc",
    decimal: true,
    optional:true
  },
  delta: {
    type: Number,
    decimal: true,
    label: "Hc-Ha",
    optional: true
  },
  z: {
    type: Number,
    label: "Z",
    decimal: true,
    optional:true
  },
  zn: {
    type: Number,
    decimal: true,
    label: "Zn",
    optional: true
  }
});

GraphDataSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    optional: true,
    autoform: {
      type: "hidden"
    },
    autoValue: function() {
      return this.userId;
    }
  },
  timeStamp: {
  type: Date,
  autoValue: function() {
      return (new Date())
    }
  },
  upt_lat:{
    type: Number,
    decimal: true,
    label: "UPT Lat"
  },
  upt_long:{
    type: Number,
    decimal: true,
    label: "UPT Long"
  },
  sights: {
    type: [SightsSchema],
    label: "Sights"
  },
});

GraphData.attachSchema(GraphDataSchema);
