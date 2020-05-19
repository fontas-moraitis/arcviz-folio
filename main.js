// UI Controller
const UIcontrol = function(allImages) {
     //Open gallery page
     const menuBtn = document.querySelector('.app-header__burger-wrapper');
     const dropDownMenu = document.querySelector('.drop-down-menu');
     const firstCol = document.querySelector('.col-1');
     const secondCol = document.querySelector('.col-2');
     const thirdCol = document.querySelector('.col-3');
     const loader = document.querySelector('.loader');
     const aboutBtn = document.querySelector('.app-header__about');
     const aboutPage = document.querySelector('.about-page');

     //burger-menu-animation
     let menuOpen = false;
     menuBtn.addEventListener('click', () => {
         if(!menuOpen) {
             menuBtn.classList.add('open');
             dropDownMenu.classList.add('down');
             menuOpen = true;
         } else {
             menuBtn.classList.remove('open');
             dropDownMenu.classList.remove('down');
             menuOpen = false;
         }
     });

    // APPEND IMAGES
    allImages.forEach((img, index) => {
      const imgSubdiv = parseInt(allImages.length / 3);
      if (index <= imgSubdiv) {
        firstCol.innerHTML +=
        `<div class="item-wrapper"><div class="image-container">
              <img class="image-container__image" src="${img.url}"></img>
            </div>
            <div class="desc-wrapper">
              <p class="img-title">${img.name}</p>
          </div></div>`
      }
      else if (index > imgSubdiv && index <= (imgSubdiv * 2)) {
        secondCol.innerHTML +=
        `<div class="item-wrapper"><div class="image-container">
              <img class="image-container__image" src="${img.url}"></img>
            </div>
            <div class="desc-wrapper">
              <p class="img-title">${img.name}</p>
          </div></div>`
      }
      else {
        thirdCol.innerHTML +=
        `<div class="item-wrapper"><div class="image-container">
              <img class="image-container__image" src="${img.url}"></img>
            </div>
            <div class="desc-wrapper">
              <p class="img-title">${img.name}</p>
          </div></div>`
      }
    });

    //About-me Page
    let isAboutShown = false;
    const openAboutPage = function() {
      if (!isAboutShown) {
        aboutPage.classList.add('show-about');
        aboutBtn.innerText = 'close';
        document.body.classList.add('.stop-scrolling');
        isAboutShown = true;
      } else {
        aboutPage.classList.remove('show-about');
        aboutBtn.innerText = 'about';
        document.body.classList.remove('.stop-scrolling');
        isAboutShown = false;
      }
    }

    aboutBtn.addEventListener('click', openAboutPage);


    //loader
    setTimeout(() => {
      loader.classList.add('hidden')
    }, 1800)
}

// SPLIT DATA
const splitContent = function(importedContent) {
  const items = importedContent.items;
  let galleries;
  let generalInfo;

  for (item of items) {
      if ("gallery1" in item.fields) {
          galleries = item.fields;               
      } else {
          generalInfo = item.fields
      }
  };

  return {
      galleries: galleries,
      generalInfo: generalInfo
  }
};

//about-me page:

let aboutMeContent = function(input) {
  //about-page query selectors
const aboutTitle = document.querySelector('#title');
const aboutText = document.querySelector('#text');

//change content
aboutTitle.innerText = input.cvtext1;
aboutText.innerText = input.cvtext2;
};

// GET DATA FROM THE SERVER
async function getData() 
{
  let response = await fetch('https://cdn.contentful.com/spaces/f9xo8mopdqv5/entries?access_token=qhRzmjNkUqjGoxsy5kJxQwl1k6xRjS41B15ShXWW3bE');
  let data = await response.json();
  return data;
};

// GET ALL IMAGES URLs
const imagesUrls = function(allData) {
  let urlsArr = [];
  
  allData.Asset.forEach(el => urlsArr.push({
      name: el.fields.title,
      url: el.fields.file.url,
      id: el.sys.id  
  }));

  return urlsArr;
};

// INITIALIZATION
(async () => {
  try {
      let responseData = await getData();
      const imgData = responseData.includes;
      const allImages = imagesUrls(imgData);

      let data = splitContent(responseData);
      let generalInfo = data.generalInfo

      //Navigate through filtered galleries:
      UIcontrol(allImages);

      //about-me-page
      aboutMeContent(generalInfo);

  } catch (error) {
      console.log(error);
  }
})();