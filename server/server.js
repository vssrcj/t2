// const Pusher = require('pusher');

// const pusher = new Pusher({
//   appId: '574490',
//   key: '507f085c62c12711175d',
//   secret: '95c201af161aa9d9bd15',
//   cluster: 'mt1',
//   encrypted: true
// });

// pusher.trigger('my-channel', 'my-event', {
//   "message": "hello world"
// });

function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const venues = Array(100).fill().map((_, i) => ({
   id: 'id-' + i, categories: [],
}));

const categories = Array(4000000).fill().map((_, i) => ({
   id: 'id-' + i, venueId: 'id-' + getRandomInt(0, 100),
}));

test2(venues, categories);

function test1(venues, categories) {
   const d1 = Date.now();

   categories.forEach(category => {
      const venue = venues.find(v => v.id === category.venueId);
      venue.categories.push(category);
   });
   
   const d2 = Date.now();

   console.log('test1', (d2 - d1) / 1000);
}

function test2(venues, categories) {
   const d1 = Date.now();
   console.time("dbsave");
   const venueSet = venues.reduce((res, v) => ({ ...res, [v.id]: v }), {});
   // console.log(venueSet);
   categories.forEach(category => {
      const venue = venueSet[category.venueId];
      if (venue) venue.categories.push(category);
      else venueSet[category.venueId] = { id: category.venueId, categories: [category] };
   });

   const newVenues = Object.keys(venueSet).map(k => venueSet[k])
   
   const d2 = Date.now();
   console.timeEnd("dbsave");
   console.log('test2', (d2 - d1) / 1000);
}

function toSet(list) {
   return list.reduce((set, item) => {
      set[item.id] = item;
      return set;
   });
}


function merge(d1, d2) {
   if (d1 === undefined) return d2;
   if (d2 === undefined) return d1;
   const type = typeof(d1);
   if (type === 'array') {
      const oldSet = toSet(d1);
      const newArray = [];
      d2.forEach(newItem => {
         const oldItem = oldSet[newItem.id];
         if (oldItem) {
            if (!newItem.delted) {
               newArray.push(merge(oldItem, newItem));
            }
         } else {
            newArray.push(newItem);
         }
      });
      return newArray;
   }
   if (type === 'object') {
      const complexObjects = {};
      Object.keys(d2).forEach(key => {
         const value = d2[key];
         const type2 = typeof(value);
         if (type2 === 'object' || type2 === 'array') {
            complexObjects[key] = merge(d1[key], d2[key]);
         }
      });
      return {
         ...d1,
         ...d2,
         ...complexObjects,
      }
   }
   return d2;
}
