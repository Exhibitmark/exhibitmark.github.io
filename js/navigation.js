const nav = {
    "videos":{
        "title":"Videos",
        "url":"./index.html"
    },
    "fileshare":{
        "title":"Fileshare",
        "url":"./fileshare.html"
    },
    "leaderboard":{
        "title":"Leaderboard",
        "url":"./speedruns.html"
    },
    "submit":{
        "title":"Submit Run",
        "url":"./speedrun_submit.html"
    },
    "rules":{
        "title":"Rules",
        "url":"./rules.html"
    }
}

let page = window.location.pathname.split("/").pop();

for(var i in nav){
    if(nav[i].url.includes(page)){
        $( "#nav" ).append(buildSideNav(nav[i],true));
    } else {
        $( "#nav" ).append(buildSideNav(nav[i])); 
    }
}


function buildSideNav(e,current = false){
    if(current){
        return `
        <li>
            <a href="${e.url}" style="background-color:#e8e8e8 ;" class="side-menu">
                <div class="side-menu__icon"></div>
                <div style="color:#6769eb; font-weight:600" class="side-menu__title">${e.title}</div>
            </a>
        </li>
        `
    }

    return `
    <li>
        <a href="${e.url}" class="side-menu">
            <div class="side-menu__title">${e.title}</div>
        </a>
    </li>
    `
}