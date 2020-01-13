// /**
//  * This class handles and enables Lazy Loading functionality methods inside images preview container.
//  */
// class LazyLoad {

//     key = '00ac5f70d662304b87e7da585bbdef9d';
//     pageCounter = 1;
//     BASE_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.key}&tags=nyc&per_page=5&page=${this.pageCounter}&format=json&nojsoncallback=1`;
//     db = [];

//     /**
//      * sets default variables and their values when class object is created.
//      */
//     constructor() {
//         this.startCounter = 0;
//         this.container = document.querySelector(".load-more-container");
//         this.leftContainer = document.querySelector('.left-side');
//         this.previewContainer = document.querySelector('.preview-container');
//         this.countContainer = document.querySelector('.img-count');
//         this.btn = document.querySelector('.sort-btn');
//         // this.btn.addEventListener('click', () => this.sort(this.db));
//     };

//     /**
//      * This method handles and updates API URL and increments pageCounter by +1, depending on how many photos and pages were loaded.
//      * @param {number} pageNumber this must be a page number, that will be replaced in this.BASE_URL.
//      */
//     urlHandler(pageNumber) {
//         this.pageCounter = ++pageNumber;
//         return this.BASE_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.key}&tags=nyc&per_page=5&page=${this.pageCounter}&format=json&nojsoncallback=1`;
//     };

//     /**
//      * This method sorts this.db alphabetically, and then calls load() to load sorted this.db, and render it.
//      * @param {*} database 
//      */
//     sort(database) {

//         let titleArray = [];
//         let sortedArray = [];

//         database.forEach(photoObject => {
//             titleArray.push(photoObject.title);
//         });

//         titleArray.sort();
//         titleArray.filter(title => {
//             this.db.forEach(photoObj => {
//                 if (title == photoObj.title) {
//                     sortedArray.push(photoObj);
//                 }
//             })
//         });

//         this.btn.innerHTML = 'SORTED';
//         this.load(sortedArray);
//     }

//     /**
//      * This methods initializes requestApi() function, that fetches the data from API URL 
//      * (or loads existing sorted this.db if it was called from sort() method), to render images thumbnails.
//      */
//     async load(dbArray) {

//         let tempDbArray = this.db;
//         let fetchedArray = [];

//         if (dbArray == null) {
//             this.btn.innerHTML = 'SORT ALPHABETICALLY';

//             const requestApi = async (url) => {
//                 const response = await fetch(url);
//                 const json = await response.json();
//                 return json.photos.photo;
//             };

//             // fetchedArray = await requestApi(this.BASE_URL);
//             fetchedArray = await requestApi('http://localhost:5000/api/photos');
//             this.db = await tempDbArray.concat(fetchedArray);
//             await this.render(fetchedArray);

//         } else {
//             this.previewContainer.innerHTML = '';
//             this.db = dbArray;
//             this.render(dbArray);
//         }

//         return this.db;
//     }

//     /**
//      * This method takes in array of objects to be renderred in HTML. It then calls urlHandler() function, to update API URL.
//      * @param {array} photoArray Array of photo objects.
//      */
//     render(photoArray) {
//         if (photoArray.length > 0) {

//             this.countContainer.innerHTML = '';
//             this.countContainer.innerHTML = `IMAGES LOADED: ${this.db.length} `

//             let images = '';

//             photoArray.forEach(photoObj => {
//                 images += `
//                 <div class="img-info-container">
//                 <div class="preview-box" id="${photoObj.id}">
//                 <img src="https://farm${photoObj.farm}.staticflickr.com/${photoObj.server}/${photoObj.id}_${photoObj.secret}.jpg" alt="${photoObj.title}" class="preview-box-img">
//                 </div>
//                 <div class="author-text">
//                 <div class="author-title">Title:
//                 <div class="title-text">${photoObj.title}</div>
//                 </div>
//                 </div>
//                 </div>
//                 `;
//             })

//             this.previewContainer.insertAdjacentHTML('beforeend', images);
//         }

//         this.urlHandler(this.pageCounter);
//     };

//     /**
//      * This method initializes IntersectionObserver(), that enables infinite scrolling on images preview container. 
//      * When scrolled, this.load() method is called.
//      */
//     init() {
//         let observer = new IntersectionObserver(entries => {
//             entries.forEach(entry => {
//                 const { isIntersecting } = entry;

//                 if (isIntersecting) {
//                     this.load();
//                     //container.children[0].click()
//                     //observer = observer.disconnect()
//                 }
//             }, {
//                     root: this.container
//                 })
//         })

//         observer.observe(this.container);
//     };
// };

// const lazyLoad = new LazyLoad();
// lazyLoad.init();

/**
 * This class handles and enables Lazy Loading functionality methods inside images preview container.
 */
class LazyLoad {

    constructor() {
        this.db = [];
        this.page = 1;
        this.asc = true;
        this.container = document.querySelector(".load-more-container");
        this.leftContainer = document.querySelector('.left-side');
        this.previewContainer = document.querySelector('.preview-container');
        this.countContainer = document.querySelector('.img-count');
        this.btn = document.querySelector('.sort-btn');
        this.btn.addEventListener('click', () => this.sort());
    };

    /**
     * This methods initializes requestApi() function, that fetches the data from API URL 
     * (or loads existing sorted this.db if it was called from sort() method), to render images thumbnails.
     */
    async load() {
        this.btn.innerHTML = 'SORT ALPHABETICALLY';

        const url = `http://localhost:5000/api/photos/${this.page}`;
        return await fetch(url).then(res => res.json());
    }

    sort() {
        this.btn.innerHTML = `SORTED ${this.asc ? 'ASC' : 'DESC'}`;
        const db = this.db;
        const asc = this.asc;
        this.db = db.sort((a, b) => {
            this.asc = !asc;
            if (asc) {
                return a.title > b.title ? 1 : -1
            } else {
                return a.title > b.title ? -1 : 1
            }
            // return asc ? (a.title > b.title ? 1 : -1) : (a.title > b.title ? -1 : 1);
        })
        this.render();
    }

    /**
     * This method takes in array of objects to be renderred in HTML. It then calls urlHandler() function, to update API URL.
     * @param {array} photoArray Array of photo objects.
     */
    async add() {
        this.countContainer.innerHTML = 'LOADING';

        this.btn.innerHTML = 'SORT ALPHABETICALLY';

        const newImages = await this.load();
        this.page++;
        let db = this.db;
        this.db = db.concat(newImages);

        let images = '';
        newImages.forEach(photoObj => {
            images += this.addImage(photoObj);
        })
        this.previewContainer.innerHTML += images;
        this.countContainer.innerHTML = `PHOTOS LOADED ${this.db.length}`;
        return this.db;

    };

    addImage(photoObj) {
        return `<div class="img-info-container">
            <div class="preview-box" id="${photoObj.id}">
            <img src="https://farm${photoObj.farm}.staticflickr.com/${photoObj.server}/${photoObj.id}_${photoObj.secret}.jpg" alt="${photoObj.title}" class="preview-box-img">
            </div>
            <div class="author-text">
            <div class="author-title">Title:
            <div class="title-text">${photoObj.title}</div>
            </div>
            </div>
            </div>
            `;
    }

    render() {
        let images = '';
        if (this.db) {
            this.db.forEach(photoObj => {
                images += this.addImage(photoObj);
            });
        }
        this.previewContainer.innerHTML = images;
    }

    /**
     * This method initializes IntersectionObserver(), that enables infinite scrolling on images preview container. 
     * When scrolled, this.load() method is called.
     */
    async init() {
        let observer = new IntersectionObserver(entries => {
            entries.forEach(async entry => {
                const { isIntersecting } = entry;

                if (isIntersecting) {
                    this.db = await this.add();
                    //container.children[0].click()
                    //observer = observer.disconnect()
                }
            }, {
                root: this.container
            })
        })

        observer.observe(this.container);
    };
};

const lazyLoad = new LazyLoad();
lazyLoad.init();