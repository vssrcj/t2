function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}



export default function Tester() {
   const a = {
      cool: 1,
      yes: 2,
      bla: 4,
      items: [1,2,3],
      goes: {
         a: 1,
         b: 'asdf',
      },
      list: [
         { id: 1, name: 'A1' },
         { id: 2, name: 'A2', sha: 3, complex: { a: 1, b: 1 } },
         { id: 3, name: 'A3' },
      ]
   };

   const b = {
      cool: 2,
      yes: null,
      boo: 56,
      bla: undefined,
      items: [1],
      items2: [1,2,3],
      goes: {
         c: 1,
         b: '123',
      },
      list: [
         { id: 2, name: 'B2', complex: { b: 2, c: 2 } },
         { id: 3, name: 'B3', deleted: true },
         { id: 4, name: 'B4' },
      ]
   }

   Object.freeze(a);
   Object.freeze(b);

   const c = merge(a, b);
   console.log('a: ', a);
   console.log('b: ', b);
   console.log('c: ', c);
   return 'bla';

   const venues = Array(100).fill().map((_, i) => ({
      id: 'id-' + i, categories: [],
   }));

   const categories = Array(1000000).fill().map((_, i) => ({
      id: 'id-' + i, venueId: 'id-' + getRandomInt(0, 200),
   }));

   test2(venues, categories);

   return 'bla';
}

function test1(venues, categories) {
   const d1 = Date.now();

   categories.forEach(category => {
      const venue = venues.find(v => v.id === category.venueId);
      venue.categories.push(category);
   });
   
   const d2 = Date.now();

   console.log('test1', venues, (d2 - d1) / 1000);
}

function test2(venues, categories) {
   const d1 = Date.now();
   const venueSet = venues.reduce((res, v) => ({ ...res, [v.id]: v }), {});
   categories.forEach(category => {
      const venue = venueSet[category.venueId];
      if (venue) venue.categories.push(category);
      else venueSet[category.venueId] = { id: category.venueId, categories: [category] };
   });

   const newVenues = Object.keys(venueSet).map(k => venueSet[k])
   
   const d2 = Date.now();
   console.log(newVenues);
   console.log('test2', venueSet, (d2 - d1) / 1000);
}

function toSet(list) {
   return list.reduce((set, item) => {
      set[item.id] = item;
      return set;
   }, {});
}

function getType(d) {
   if (!d) return 0;
   if (Array.isArray(d)) {
      return 1;
   }
   if (typeof(d) === 'object') {
      return 2;
   }
   return 0;
}


/**
 * Here are the rules:
 * - If either param is undefined, the other will be returned.
 * - Any simple object (Number, String, null) will be replaced.
 * - The data type may not change, expect change to null or undefined.
 * - If the new data is a simple array, keep the old one.
 */
function merge(d1, d2) {
   if (d1 === undefined) return d2;
   if (d2 === undefined) return d1;

   const type = getType(d2);

   // if array
   if (type === 1) {
      // if existing is null, set to new array
      if (!d1) return d2;

      const first = d2[0];

      // if new is empty array, keep existing array.
      if (!first) {
         return d1;
      }

      // if the list type is simple, replace array
      if (!getType(first)) return d2;

      // convert existing array to set (for performance lookup)
      const existingSet = toSet(d1);

      // array that will be returned
      const newArray = [];

      d2.forEach((newItem) => {
         const existingItem = existingSet[newItem.id];

         // if item is found in existing array
         if (existingItem) {
            // remove from existing array (because it will be replaced)
            delete existingSet[newItem.id];

            // if the new item is not deleted, merge existing and new
            if (!newItem.deleted) {
               newArray.push(merge(existingItem, newItem));
            }
         }
         // if existing item is not found, simply add new item
         else {
            newArray.push(newItem);
         }
      });
      
      // add all the existing items that weren't found in the new array
      Object.keys(existingSet).forEach((id) => {
         newArray.push(existingSet[id]);
      })
      return newArray;
   }
   // if object
   if (type === 2) {
      // if existing is null, set to new object
      if (!d1) return d2;

      // goes through each new item in the object, and merge with the old
      const data = Object.keys(d2).reduce((set, id) => {
         set[id] = merge(d1[id], d2[id]);
         return set;
      }, {});
      return {
         ...d1, // spread existing object, to keep items that aren't found in new object
         ...data,
      }
   }
   return d2;
}
