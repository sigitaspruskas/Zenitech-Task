/**
 * This class handles and enables Lazy Loading functionality methods inside images preview container.
 */
class LazyLoad {

    key = '00ac5f70d662304b87e7da585bbdef9d';
    pageCounter = 1;
    BASE_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.key}&tags=nyc&per_page=20&page=${this.pageCounter}&format=json&nojsoncallback=1`;

    /**
     * sets default variables and their values when class object is created.
     */
    constructor() {
        this.startCounter = 0;
        this.container = document.querySelector(".load-more-container");
        this.leftContainer = document.querySelector('.left-side');
        this.previewContainer = document.querySelector('.preview-container');
        this.db = [];
    };

    /**
     * This method handles and updates API URL and increments pageCounter by +1, depending on how many photos and pages were loaded.
     * @param {number} pageNumber this must be a page number, that will be replaced in this.BASE_URL.
     */
    urlHandler(pageNumber) {
        this.pageCounter = ++pageNumber;
        return this.BASE_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.key}&tags=nyc&per_page=20&page=${this.pageCounter}&format=json&nojsoncallback=1`;
    };

    /**
     * This method initializes async requestApi() function, that fetches the data from API URL, and calls render() function, to render images thumbnails.
     */
    load() {
        const requestApi = async (url) => {
            const response = await fetch(url);
            const json = await response.json();
            console.log('');
            console.log(`Initialize load()... Array of ${json.photos.photo.length} photo objects Loaded.`);
            this.render(json.photos.photo, json.photos);
        };

        requestApi(this.BASE_URL);
    }

    /**
     * This method takes in array of objects, and response object from fetch(). It takes 5 photo objects in one iteration, and renders them.
     * If the last photos from array were rendered, it calls urlHandler() function, to update API URL, and resets this.startCounter to 0.
     * this.startCounter is used for splicing temporary array of 5 photos, from the original photoArray.
     * @param {array} photoArray Array of photo objects.
     * @param {*} responseObj must be response object that contains data and objects array from fetch, ex. 'json.photos'.
     */
    render(photoArray, responseObj) {
        console.log(responseObj);

        let start, end, arr;
        let picsLeft = photoArray.length - this.startCounter;

        if (picsLeft >= 5) {
            start = this.startCounter;
            end = start + 5;
            arr = photoArray.slice(start, end);
            console.log(`Loaded photos from API array: ${arr.length}.`);
        } else {
            start = photoArray.length - picsLeft;
            end = null;
            arr = photoArray.slice(start);
            console.log(`Loaded photos from API array: ${arr.length}.`);
            this.urlHandler(this.pageCounter);
            return this.startCounter = 0;
        };

        this.db = this.db.concat(arr);

        if (arr.length > 0) {
            let images = '';
            arr.forEach(photoObj => {
                images += `
                    <div class="preview-box" id="${photoObj.id}">
                        <img src="https://farm${photoObj.farm}.staticflickr.com/${photoObj.server}/${photoObj.id}_${photoObj.secret}.jpg" alt="${photoObj.title}" class="preview-box-img">
                    </div>
                `;
            })
            this.previewContainer.insertAdjacentHTML('beforeend', images);
            this.container.dataset.index = end;
        }
        this.startCounter = end;
    };

    /**
     * This method initializes IntersectionObserver(), that enables infinite scrolling on images preview container. 
     * When scrolled, this.load() method is called.
     */
    init() {
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const { isIntersecting } = entry;

                if (isIntersecting) {
                    this.load();
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
