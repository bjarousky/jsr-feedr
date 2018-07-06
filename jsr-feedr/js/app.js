/*
  Please add all Javascript code to this file.
  https://newsapi.org
*/
var source = "abc-news";
var type = "everything";
var category;
var page = 1;

function getNews(){

  var promiseEverything = new Promise(function(resolve, reject) {

    var url = "https://newsapi.org/v2/";
    var key = "c87b19f8a2494440a6d71204acf5d1f6";
    var finalUrl;
    if (type == "everything"){
      finalUrl = url + type + "?sources=" + source + "&page=" + page + "&apiKey=" + key;
    } else if (type == "top-headlines"){
      finalUrl = url + type + "?country=us" + "&category=" + category + "&page=" + page + "&apiKey=" + key;
    }

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', finalUrl);
    httpRequest.send();
    httpRequest.onload = () => resolve(httpRequest.responseText);
    httpRequest.onerror = () => reject(httpRequest.statusText);
  });

  promiseEverything.then(function(result) {
    console.log("Stuff worked");
    addContent(JSON.parse(result));
    openModal(JSON.parse(result));
  }, function() {
    console.log("It broke");
    alert("There has been an error, please try another source.");
  });

  function addContent(result){
    for (var i = 0; i < result.articles.length; i++){
      $('#main').append(`<article class="article" data-index="${i}">
        <section class="featuredImage">
          <img src="${result.articles[i].urlToImage}" alt="" />
        </section>
        <section class="articleContent">
            <a href="#"><h3>${result.articles[i].title}</h3></a>
            <h6>${result.articles[i].source.name}</h6>
        </section>
        <section class="impressions">
          Published: ${parseDate(result.articles[i].publishedAt)}
        </section>
        <div class="clearfix"></div>
      </article>`);
    }
  }

  function parseDate(date){
    var splits = date.split("-", 3);
    var year = splits[0];
    var month = splits[1];
    var day = splits[2].split("T", 1);
    var time = date.substring(date.lastIndexOf("T") + 1, date.lastIndexOf("Z"));
    return `${month}/${day}/${year} at ${time}`;
  }

  function openModal(result){
    function renderModal(index){
      $("#popUp").html(`<a href="#" class="closePopUp">X</a>
      <div class="container">
        <h1>${result.articles[index].title}</h1>
        <p>
          ${result.articles[index].description}
        </p>
        <a href="${result.articles[index].url}" class="popUpAction" target="_blank">Read more from source</a>
      </div>`);
    }

    $(".articleContent").on("click", "a", function(){
      var parent = $(this).parent().parent();
      renderModal(parent.attr("data-index"));
      $("#popUp").removeClass("hidden");
    });

    $("#popUp").on("click", ".closePopUp", function(){
      $("#popUp").addClass("hidden");
    });
  }
}

getNews();

$("#search a").click(function(){
  $("#search").toggleClass("active");
  $("#search input").val("");
});

$("#search input").keypress(function(e){
  if (e.which == 13){
    $("#search").removeClass("active");
    str = $("#search input").val();
    source = str.replace(/\s+/g, '-').toLowerCase();
    type = "everything";
    page = 1;
    $("#main").html("");
    getNews();
  }
});

$("h1").click(function(){
  source = "abc-news";
  type = "everything";
  page = 1;
  $("#main").html("");
  getNews();
});

$("#news-category").on("click", "li", function(){
  category = $(this).attr("id");
  type = "top-headlines";
  page = 1;
  $("#main").html("");
  getNews();
});

window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        page++;
        getNews();
    }
};
