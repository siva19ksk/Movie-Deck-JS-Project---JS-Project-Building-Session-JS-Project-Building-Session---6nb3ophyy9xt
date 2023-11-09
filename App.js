
let currentPage=1;

const card_container=document.getElementById("card-container");
let data;
let childd;
async function MovieApi(page){
    let url=`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`;
    const res=await fetch(url);
    const res_json=await res.json();
    data=res_json.results;
    movies(data);
}

function movies(data){
    card_container.innerHTML=data.map(elem=>{
        return (`<div id="inside_card_container">
        <div id="movie-image">
            <span><img src="https://image.tmdb.org/t/p/original${elem.poster_path}" /></span>
        </div>
        <div id="${elem.title}">
        <h4>Movie: ${elem.title}</h4>
        </div>
        <div id="icons-main-div">
            <p>Votes: ${elem.vote_count}</p>
            <div>
            <i class="fa-regular fa-heart" id="icons" onclick="del(event)" value="false"></i>
            </div>
        </div>
    <p>Rating ${elem.vote_average}</p>
    </div>`)
    });
}
function del(e){
        const parentElement=e.target.parentNode.parentNode.parentNode;
        const childElement=parentElement.childNodes[3].getAttribute("id");
        const val=parentElement.childNodes[5].childNodes[3].childNodes[1];

        if(val.hasAttribute("value")){
            setTolocal(childElement);
            val.removeAttribute("value")
            console.log("hi")
        }else{
            val.setAttribute("value","false");
            removeFromLocal(childElement);
            console.log("hiii")
        }
}
function getData(){
    let existingData=localStorage.getItem("Moviesfav");
    let existingArray=JSON.parse(existingData) || [];
    return existingArray;
}
function setTolocal(name){
    console.log("set")
    let setdata=data;
    let dataArray;
    dataArray=setdata.filter(elem => elem.title === name);
    let n=dataArray[0];
    let myList=getData();
    myList=myList.concat(n);
    console.log(myList);
    localStorage.setItem("Moviesfav",JSON.stringify(myList));
}

function removeFromLocal(name){
    const getItem=localStorage.getItem("Moviesfav");
    let dataArray=JSON.parse(getItem);
    console.log(dataArray);
    console.log(name)
    dataArray=dataArray.filter(elem => elem.title !== name);
    console.log(dataArray);
    localStorage.setItem("Moviesfav",JSON.stringify(dataArray));
}
    let sorting_date=document.getElementById("asscending");
    sorting_date.addEventListener("click",()=>{
        console.log(sorting_date.getAttribute("value"))
        if(sorting_date.getAttribute("value") == "acc"){
            sorting_date.setAttribute("value","dcc");
            sorting_date.innerText="Sort by date (latest to oldest)";
            data.sort((a,b)=>new Date(b.release_date) - new Date(a.release_date));
        }else{
            sorting_date.setAttribute("value","acc");
            sorting_date.innerText="Sort by date (oldest to latest)";
            data.sort((a,b)=>new Date(a.release_date) - new Date(b.release_date));
        }
        movies(data);
    })

    let rating_order=document.getElementById("rating");
    rating_order.addEventListener("click",()=>{
        console.log("hi");
        if(rating_order.getAttribute("value") == "least"){
            rating_order.setAttribute("value","most");
            rating_order.innerText="Sort by rating (most to least)";
            data.sort((a,b)=> a.vote_average - b.vote_average);
        }else{
            rating_order.setAttribute("value","least");
            rating_order.innerText="Sort by date (least to most)";
            data.sort((a,b)=> b.vote_average - a.vote_average);
        }
        movies(data);
    })

    let search_movie=document.getElementById("search");
    let input_value=document.getElementById("input_value");
    search_movie.addEventListener("click",()=>{
        input_value=input_value.value;
        const filtered_data=data.filter((elem)=>{return elem.title.toLowerCase().includes(input_value)});
        movies(filtered_data);
    })


    function data_render(data){
        card_container.innerHTML=data.map(elem=>{
            return (`<div id="inside_card_container">
            <div id="movie-image">
                <span><img src="https://image.tmdb.org/t/p/original${elem.poster_path}"/></span>
            </div>
            <h4>${elem.title}</h4>
            <div id="icons-main-div">
                <p>${elem.vote_count}</p>
                <div>
                <i class="fa-regular fa-heart" id="icons" onclick="delformfav(event)"></i>
                </div>
            </div>
        <p>${elem.vote_average}</p>
        </div>`)
        });
    }

    function delformfav(e){
        const parentElement=e.target.parentNode.parentNode.parentNode;
        const childElement=parentElement.childNodes[3].innerText;
        console.log(childElement);
            removeFromLocal(childElement);
            let list=getData()
            console.log(list);
            data_render(list);
            // console.log("hiii")
    }

    let favourite=document.getElementById("fav-tab");
    favourite.addEventListener("click",()=>{
        let list=getData()
        console.log(list);
        data_render(list);
    })

    document.querySelector(".active-tab").addEventListener("click",()=>{
        MovieApi(currentPage);
    })

    let prev=document.getElementById("prev");
    let current=document.getElementById("current");
    let next=document.getElementById("next");
    prev.disabled=true;
    prev.addEventListener("click",()=>{
        currentPage--;
        MovieApi(currentPage);
        current.innerText=`current page - ${currentPage}`;
        if(currentPage == 1){
            prev.disabled=true;
            next.disabled=false;
        }
    })
    
    next.addEventListener('click',()=>{
        currentPage++;
        MovieApi(currentPage);
        current.textContent= `Current Page: ${currentPage}`
    
        if(currentPage == 457){
            next.disabled=true;
            prev.disabled=false;
        } else if(currentPage>=1){
            prev.disabled=false;
            next.disabled=false;
        }
    })

    MovieApi(currentPage);
