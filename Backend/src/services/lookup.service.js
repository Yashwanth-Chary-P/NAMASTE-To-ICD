const { getCollection } = require("../config/db");
const { COLLECTIONS } = require("../config/constants");
const { getCodeField } = require("../utils/schema");
const { escapeRegex } = require("../utils/normalize");

async function lookupByCode(system, code) {
  const collectionName = COLLECTIONS[system];
  if (!collectionName) {
    const err = new Error("Invalid system");
    err.statusCode = 400;
    throw err;
  }

  const col = getCollection(collectionName);
  // console.log("👉 SYSTEM:", system);
  // console.log("👉 COLLECTION:", collectionName);
  // console.log("👉 CODE:", code);

  const sample = await col.findOne();
  // console.log("👉 SAMPLE DOCUMENT:", sample);
  // const codeField = getCodeField(system);

  // const doc = await col.findOne(
  //   {
  //     [codeField]: {
  //       $regex: `^${escapeRegex(code)}$`,
  //       $options: "i"
  //     }
  //   },
  //   { projection: { _id: 0 } }
  // );

const codeField = getCodeField(system);

const doc = await col.findOne(
  {
    $or: [
      {
        [codeField]: {
          $regex: `^${escapeRegex(code)}$`,
          $options: "i"
        }
      },
      {
        Code: {
          $regex: `^${escapeRegex(code)}$`,
          $options: "i"
        }
      }
    ]
  },
  { projection: { _id: 0 } }
);

  if (!doc) return null;
    console.log("👉 MATCH RESULT:", doc); // 🔥
  return {
    ...doc,
    system
  };
}

module.exports = {
  lookupByCode
};