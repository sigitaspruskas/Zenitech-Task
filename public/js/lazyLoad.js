/**
 * This class handles and enables Lazy Loading functionality methods inside images preview container.
 */
class LazyLoad {

    constructor() {
        this.db = [];         // database variable that is going to be used for storing fetched data
        this.page = 1;      // Everytime we load page in a browser for the first time, default page of API endpoint will be .../api/photos/1
        this.container = document.querySelector(".load-more-container");
        this.leftContainer = document.querySelector('.left-side');
        this.previewContainer = document.querySelector('.preview-container');
        this.countContainer = document.querySelector('.img-count');
        this.btn = document.querySelector('.sort-btn');
        this.btn.addEventListener('click', () => this.sort());
    };


    /**
     * This methods initializes fetching and returning data from server (Endpoint).
     * @returns Array of objects. Each object contains data about image (title, id, url, etc...)
     * @memberof LazyLoad
     */
    async load() {
        const url = `http://localhost:5000/api/photos/${this.page}`;

        this.btn.innerHTML = 'SORT ALPHABETICALLY';
        return await fetch(url).then(res => res.json());
    };

    /**
     * This method sorts the existing database (without any additions) alphabetically, and cals render() method, that re-renders images in HTML.
     *
     * @memberof LazyLoad
     */
    sort() {
        const db = this.db;

        this.btn.innerHTML = `SORTED ASC`;
        this.db = db.sort((a, b) => a.title > b.title ? 1 : -1)
        this.render();
    };

    /**
     * This method adds newly fetched images to the database, and renders them to the HTML.
     * @returns updated this.db (database of photo objects array)
     * @memberof LazyLoad
     */
    async add() {
        let db = this.db;
        let images = '';
        const newImages = await this.load(); // array of new images that will be added to gallery

        this.countContainer.innerHTML = 'LOADING';
        this.btn.innerHTML = 'SORT ALPHABETICALLY';

        this.page++; // we increment the current page, for the next iteration
        this.db = db.concat(newImages); // we add fetched images to the existing database

        newImages.forEach(photoObj => {
            images += this.addImage(photoObj);
        })
        this.previewContainer.innerHTML += images;
        this.countContainer.innerHTML = `PHOTOS LOADED ${this.db.length}`;

        return this.db;
    };

    /**
     * This method crates a string with HTML elements for one photo, that will be rendered.
     * @param {*object} photoObj
     * @returns string
     * @memberof LazyLoad
     */
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
    };

    /**
     * This method replaces existing elements order in previewContainer (in DOM) from this.db (sorted).
     * @memberof LazyLoad
     */
    render() {
        let images = '';

        if (this.db) {
            this.db.forEach(photoObj => {
                images += this.addImage(photoObj);
            });
        }
        this.previewContainer.innerHTML = images;
    };

    /**
     * This method initializes IntersectionObserver(), that enables infinite scrolling on images preview container. 
     * When scrolled, this.add() method is called.
     */
    async init() {
        let observer = new IntersectionObserver(entries => {
            entries.forEach(async entry => {
                const { isIntersecting } = entry;

                if (isIntersecting) {
                    this.db = await this.add();
                    //container.children[0].click() // commented out to prevent from executing
                    //observer = observer.disconnect() // commented out to prevent from executing
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