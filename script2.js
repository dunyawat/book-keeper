const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show Modal, Focus on Input
const showModal = () => {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

//modal event listener
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click',()=>modal.classList.remove('show-modal'))
window.addEventListener('click',(e) => (e.target === modal ? modal.classList.remove('show-modal'):false));

//Validate Form
const validate = (nameValue,urlValue) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert('Please submit values for both fields');
        return false;
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }
    // Valid

    return true;
}

// Build Bookmarks DOM
const buildBookmarks = () =>{
    //remove all bookmark elements
    bookmarksContainer.textContent = '';

    //build items
    Object.keys(bookmarks).forEach((id) => {
        const {name,url} = bookmarks[id];
        //item
        const item = document.createElement('div');
        item.classList.add('item');
        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title','Delete Bookmark');
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`);
        //Favicon/link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt','Favicon');
        //link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target','_blank');
        link.textContent = name;
        //Append to bookmarks container
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);
    });
}


// Fetch Bookmarks
const fetchBookmarks= () => {
    //get from localStorage
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        //cretae bookmark array in local
        const id = `http://dunyawat.com`
        bookmarks[id] = {
            name:'Dunyawat',
            url:'http://dunyawat.com',
        }
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

//Delete Bookmark
const deleteBookmark = (id) => {
    //Loop solutions
    if(bookmarks[id]){
        delete bookmarks[id]
    }

    //update , re-populate DOM
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
}

//Handle Data from form
const storeBookmark= (e) => {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`; 
    }

    if (!validate(nameValue,urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url:urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event listener
bookmarkForm.addEventListener('submit',storeBookmark)

//on load, fetch
fetchBookmarks();