import { UserInputError, AuthenticationError } from "apollo-server-errors";

// function buildFilters({ OR = [], name, vitamins }) {

//   const filter = name || vitamins ? {} : null;
//   console.log(filter);
//   if (name) {
//     filter.name = { $regex: `.*${name}.*` };
//   }
//   if (vitamins) {
//     filter.vitamins = { $regex: `.*${vitamins}.*` };
//   }

//   let filters = filter ? [filter] : [];
//   for (let i = 0; i < OR.length; i++) {
//     filters = filters.concat(buildFilters(OR[i]));
//   }
//   return filters;
// }

const category = {
  Query: {
    getCategories: async (parent, args, { db }) => {
      try {
        const categories = await db.collection("categories").find().toArray();

        return categories;
      } catch (error) {
        throw new Error("Something wrong to get data");
      }
    },
  },
  Mutation: {
    createCategory: async (parent, { name, benefit, vitamins }, { db }) => {
      let categoryCursor;
      const uppercaseName = name.toUpperCase();

      const hasName = await db
        .collection("categories")
        .findOne({ name: uppercaseName });

      if (hasName)
        throw new UserInputError("Duplicate name value in database", {
          errors: {
            name: `${name} category already exist in database. `,
          },
        });
      try {
        categoryCursor = await db.collection("categories").insertOne({
          name: uppercaseName,
          benefit,
          vitamins,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        throw new Error("Failed to save in database");
      }

      const { _id, ...rest } = categoryCursor.ops[0];
      return {
        id: _id,
        ...rest,
      };
    },
  },
};

export default category;