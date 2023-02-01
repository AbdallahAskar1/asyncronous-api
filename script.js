"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const imgContainer = document.querySelector(".images");
///////////////////////////////////////
// https://restcountries.com/v2/
const renderCountry = (data, className = "") => {
  const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}m people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
        </div>
    </article>
      `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML("afterend", msg);
};

// ##########callback hell##################
// const getCountryAndNeighbour = function(country){

//     const request = new XMLHttpRequest();
//     request.open('GET',`https://restcountries.com/v2/name/${country}`);
//     request.send()

//     request.addEventListener('load',function(){
//     console.log(this.responseText);
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//         renderCountry(data)

//         // get the neighboor country
//             const neighbours =data.borders;
//             const neighbour=neighbours[1];
//             console.log(neighbour);
//             if(!neighbour) return;

//             const request = new XMLHttpRequest();
//             request.open('GET',`https://restcountries.com/v2/alpha/${neighbour}`)
//             request.send();

//             request.addEventListener('load',function(){
//                 console.log(this.responseText);
//             const data= JSON.parse(this.responseText);
//             console.log(data)
//             renderCountry(data,'neighbour')
//             });
//         });

// }
// getCountryAndNeighbour('egypt')

// #####promises####
// https://restcountries.com/v2/

const getCountryData = function (country) {
  const request = fetch(`https://restcountries.com/v2/name/${country}`)
    .then((response) => response.json())
    .then((data) => {
      renderCountry(data[0]);
      const neighboor = data[0].borders[1];
      if (!neighboor) return;

      return fetch(`https://restcountries.com/v2/alpha/${neighboor}`);
    })
    .then((response) => response.json())
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => renderError(`something went wrong $$ ${err.message}`));
  console.log(request);
};

// btn.addEventListener("click", function () {
//   getCountryData("egypt");
// });

///////////

// navigator.geolocation.getCurrentPosition(
//   (postion) => console.log(postion),
//   (err) => console.log(err)
// );

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// getPosition().then((pos) => console.log(pos));

// const whereAmI = function () {
//   getPosition()
//     .then((pos) => {
//       const { latitude: lat, longitude: lng } = pos.coords;
//       return fetch(
//         `https://geocode.xyz/${lat},${lng}?geoit=json&auth=951143801428516350401x97617`
//       );
//     })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`problem with goecoding ${res.status}`);
//       }
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//       console.log(`you are in ${data.city}, ${data.country}`);
//       return fetch(`https://restcountries.com/v2/name/${data.country}`);
//     })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`problem with goecoding ${res.status}`);
//       }
//       return res.json();
//     })
//     .then((data) => renderCountry(data[0]))
//     .catch((err) => console.error(`${err.message}`));
// };
// btn.addEventListener("click", whereAmI);
//

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// const createImg = function (imgPath) {
//   return new Promise(function (resolve, reject) {
//     const img = document.createElement("img");
//     img.src = imgPath;
//     img.addEventListener("load", function () {
//       imgContainer.append(img);
//       resolve(img);
//     });
//     img.addEventListener("error", function () {
//       reject(new Error("image not found"));
//     });
//   });
// };
// let currentImg;
// createImg("img/img-1.jpg")
//   .then((img) => {
//     currentImg = img;
//     console.log("image 1 loaded ");
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = "none";
//     return createImg("img/img-2.jpg");
//   })
//   .then((img) => {
//     currentImg = img;
//     console.log("image 2 loaded");
//     return wait(2);
//   })
//   .then((img) => {
//     currentImg.style.display = "none";
//     return createImg("img/img-3.jpg");
//   })
//   .then((img) => {
//     currentImg = img;
//     console.log("image 3 loaded");
//     return wait(2);
//   })
//   .then(() => (currentImg.style.display = "none"))
//   .catch((err) => console.error(err));
// async function

const whereAmI = async function () {
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  const resGeo = await fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=951143801428516350401x97617`
  );
  const dataGeo = await resGeo.json();
  const country = dataGeo.country;
  const res = await fetch(`https://restcountries.com/v2/name/${country}`);
  const data = await res.json();

  renderCountry(data[0]);
};
btn.addEventListener("click", whereAmI);
//iife 
// (async function(){
//   try{
//     const city= await whereAmI();
//       console.log(city)
//   }catch(err){
//     console.error(err);

//   }
//   console.log("3" )
// })();
///////////////////////////////////////////////////////////////////////
const getJson = async function(url,errorMsg='something went wrong') {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`${errorMsg} (${response.status})`);
  return  response.json();
};



// const get3Countries = async function(c1,c2,c3){

//     try{
//     //  const [data1]= await getJson(`https://restcountries.com/v2/name/${c1}`)
//     //  const [data2]= await getJson(`https://restcountries.com/v2/name/${c2}`)
//     //  const [data3]= await getJson(`https://restcountries.com/v2/name/${c3}`) 
//     const data=await Promise.all([
//       getJson(`https://restcountries.com/v2/name/${c1}`),
//       getJson(`https://restcountries.com/v2/name/${c2}`),
//       getJson(`https://restcountries.com/v2/name/${c3}`)
//     ]);

//      console.log(data.map(d=>d[0].capital));
//     }catch(err){
//       console.log(err);
//     }
// }
// get3Countries('egypt','kuwait','canada')

// promise.race 
(async function(){
  const res= await Promise.race(
    [
      getJson(`https://restcountries.com/v2/name/egypt`),
      getJson(`https://restcountries.com/v2/name/kuwait`),
      getJson(`https://restcountries.com/v2/name/canada`)
    ]
  );
  console.log(res[0]);
})();

const timeout = function(sec) {
  return new Promise(function(_,reject) {
    setTimeout(function()
  {
    reject(new Error('request took too long'))
  },sec*1000)
  })
}

Promise.race([
  getJson(`https://restcountries.com/v2/name/canada`),
  timeout(0.1)
])
.then(res=>console.log(res[0]))
.catch(err=>console.error(err));

///////////////////////

const createImg = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement("img");
    img.src = imgPath;
    img.addEventListener("load", function () {
      imgContainer.append(img);
      resolve(img);
    });
    img.addEventListener("error", function () {
      reject(new Error("image not found"));
    });
  });
};
// let currentImg;
// createImg("img/img-1.jpg")
//   .then((img) => {
//     currentImg = img;
//     console.log("image 1 loaded ");
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = "none";
//     return createImg("img/img-2.jpg");
//   })
//   .then((img) => {
//     currentImg = img;
//     console.log("image 2 loaded");
//     return wait(2);
//   })
//   .then((img) => {
//     currentImg.style.display = "none";
//     return createImg("img/img-3.jpg");
//   })
//   .then((img) => {
//     currentImg = img;
//     console.log("image 3 loaded");
//     return wait(2);
//   })
//   .then(() => (currentImg.style.display = "none"))
//   .catch((err) => console.error(err));


  const loadPath = async function(){
    try{
        let img=await createImg('img/img-1.jpg')
        console.log('load img 1');
        await wait(2);
        img.style.display= 'none';

         img=await createImg('img/img-2.jpg')
        console.log('load img 1');
        await wait(2);
        img.style.display= 'none';

         img=await createImg('img/img-3.jpg')
        console.log('load img 1');
        await wait(2);
        img.style.display= 'none';

    }catch(err){
      console.log(err);
    }
  }

  // loadPath()

  const loadAll =async function(imgArr) {
    try{
      const imgs = imgArr.map(async img => await createImg(img))
      const imgsEl = await Promise.all(imgs);
      imgsEl.forEach(img=>img.classList.add('parallel'))
    }catch(err){
        console.log(err);
    }
  }
  loadAll(['img/img-1.jpg','img/img-2.jpg','img/img-3.jpg'])
