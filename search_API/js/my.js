/*
* inkop acc key: b74b0de819msh5577558461952fcp131892jsn378a2e4e86a6
* my acc key: 4585108d7fmsh287aa55893a641cp125f5bjsn4ac8b63dfc4e
* */
const rapidAccessKey = 'b74b0de819msh5577558461952fcp131892jsn378a2e4e86a6';
const imgUrlFirst = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?pageNumber=1&pageSize=10&q=';
const imgUrlSecond  = '&autoCorrect=false';
const newsUrlFirst = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?toPublishedDate=null&fromPublishedDate=null&pageSize=10&q=';
const newsUrlSecond = '&autoCorrect=false&pageNumber=1';
const webUrlFirst = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI?pageNumber=1&q=';
const webUrlSecond = '&autoCorrect=false&pageSize=10';

const autoUrl = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/spelling/AutoComplete?text=';


addListeners();

function getInputValue() {
    return document.getElementById('userQuery').value;
}

function addListeners(){
    document.getElementById('searchWeb').addEventListener('click',function() {
        fetchWeb(webUrlFirst, webUrlSecond, getInputValue());
    });

    document.getElementById('searchImg').addEventListener('click',function() {
        fetchImg(imgUrlFirst, imgUrlSecond, getInputValue());
    });

    document.getElementById('searchNews').addEventListener('click',function () {
        fetchNews(newsUrlFirst, newsUrlSecond, getInputValue());
    });

    document.getElementById('userQuery').addEventListener("input", function () {
        fetchAutoComplete(autoUrl, this.value);
    })
}

/*============== web search block ==============*/

function fetchWeb(urlStart, urlEnd, userQuery) {
    fetch(urlStart + userQuery + urlEnd, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
            "x-rapidapi-key": rapidAccessKey
        }
    })
        .then(response => response.json())
        .then (responseData => {
        addResponseWebOrNews(responseData);
    })
        .catch(err => {
            console.log(err);
        });

}

/*============== img search block ==============*/

function fetchImg(urlStart, urlEnd, userQuery) {
    fetch(urlStart + userQuery + urlEnd, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
            "x-rapidapi-key": rapidAccessKey
        }
    })
        .then(response => response.json())
        .then (responseData => {
            addResponseImg(responseData);
        })
        .catch(err => {
            console.log(err);
        });

}
function addResponseImg(response) {
   removeTempElements();
   let urlArr = response.value;
   let responseContent = document.getElementById('responseContent');

   for (let i = 0; i < urlArr.length; i++){
       let currentImg = document.createElement('img');
       /*img settings*/
       currentImg.src = urlArr[i].url;
       currentImg.alt = urlArr[i].title;
       currentImg.className = 'f-img';
       let newsLink = document.createElement('a');
       newsLink.href = urlArr[i].webpageUrl;
       newsLink.appendChild(currentImg);
       responseContent.appendChild(newsLink);
   }
}

/*============== news search block ==============*/

function fetchNews(urlStart, urlEnd, userQuery) {
    fetch(urlStart + userQuery + urlEnd, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
            "x-rapidapi-key": rapidAccessKey
        }
    })
        .then(response => response.json())
        .then (responseData => {
        addResponseWebOrNews(responseData);
    })
        .catch(err => {
            console.log(err);
        });
}

function addResponseWebOrNews(response) {
    removeTempElements();
    let responseContent = document.getElementById('responseContent');
    let arr = response.value;

    for (let i = 0; i < arr.length; i++){
        let newsContainer = document.createElement('div');
        newsContainer.className = 'newsContainer';
        let newsTittle = document.createElement('div');
        newsTittle.innerText = arr[i].title;
        newsTittle.className = 'news-tittle';
        let newsBody = document.createElement('div');
        newsBody.innerHTML = arr[i].body;
        newsBody.className = 'news-body';

        newsContainer.appendChild(newsTittle);
        newsContainer.appendChild(newsBody);
        responseContent.appendChild(newsContainer);
    }
}

/*==============autoComplete block==============*/

function fetchAutoComplete(urlStart, userQuery) {
    fetch(urlStart + userQuery, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
            "x-rapidapi-key": rapidAccessKey
        }
    })
        .then(response => response.json())
        .then (responseData => {
        addAutoCompleteContent(responseData);
    })
        .catch(err => {
            console.log(err);
        });
}

function addAutoCompleteContent(response) {
    let autoCompleteHolder = document.getElementById('autoCompleteHolder');
    autoCompleteHolder.innerHTML = '';
    for (let i = 0; i < response.length; i++){
        let p = document.createElement('p')
        console.log(p);
        p.className = 'tempAutoComplete';
        p.innerText = response[i];
        p.addEventListener('click', function() {
            document.getElementById('userQuery').value = p.innerText;
            autoCompleteHolder.innerHTML = '';
        });
        autoCompleteHolder.appendChild(p);
    }
}

function setInputValue (p) {
    console.log(p);
}

/* clear all search and auto complete results */
function removeTempElements() {
    let autoCompleteHolder = document.getElementById('autoCompleteHolder');
    autoCompleteHolder.innerHTML = '';
    let elements = document.getElementById('responseContent');
    elements.innerHTML = '';
}

