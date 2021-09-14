let nasa = document.getElementById('bodynasa')
let main = document.getElementById('maindiv')
let dateentry = document.getElementById('dateentry').value;
let dateentrydiv = document.getElementById('dateentry');
let header = document.getElementById('header')

//load last 6 photo do the day 
window.onload = () => {
    let dates = [];
    let datenow = new Date();
    for (i = 0; i <= 6; i++) {
        let last6dates = new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() - i);
        last6dates.toLocaleString('default', { month: 'long' })
        var result = last6dates.toLocaleDateString(undefined, { // you can use undefined as first argument
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        dates.push(result);
    }

    for (i = 0; i < dates.length; i++) {
        showPhoto(dates[i]);
    }
}

//to get a specific date on the date picker
dateentrydiv.oninput = () => {
    main.querySelectorAll(".frameimage").forEach(n => n.remove());
    let dateentry = document.getElementById('dateentry').value;
    if (dateentry != '') {
        showPhoto(dateentry);
    }
}

//to get full screen(to fit in height and width of screen) HD version of photo
function hdphoto(imgsrc, date, status) {

    let framebiggerimage = document.createElement("div");
    let biggerImage = document.createElement("img");
    if (status == true) {

        biggerImage.src = imgsrc;
        biggerImage.style.maxWidth = `${window.screen.width}px`;
        biggerImage.style.maxHeight = `${window.screen.height}px`;
        framebiggerimage.style.zIndex = "99";
        framebiggerimage.style.position = "fixed";
        framebiggerimage.id = "framebiggerimage";
        framebiggerimage.style.display = "block";
        framebiggerimage.style.alignSelf = "center";

        //to click when you want to close full screen
        biggerImage.addEventListener('click', function() {
            hdphoto(imgsrc, date, false)
        })

        nasa.append(framebiggerimage);

        //to hide other images when you see hd photos
        for (i = 0; i < document.getElementsByClassName("frameimage").length; i++) {
            document.getElementsByClassName("frameimage")[i].style.visibility = 'hidden';
        }
        framebiggerimage.append(biggerImage);
        header.style.backgroundColor = "rgb(103, 139, 139)";
        header.style.opacity = "0.5";
        main.style.backgroundColor = "rgb(103, 139, 139)";
        main.style.opacity = "0.5";

    }
    if (status == false) {
        //if photo is already open, it closes and unhider other phots
        for (i = 0; i < document.getElementsByClassName("frameimage").length; i++) {
            document.getElementsByClassName("frameimage")[i].style.visibility = 'visible';
        }

        document.getElementById("framebiggerimage").remove();

        header.style.background = "none";
        header.style.opacity = "1";
        main.style.background = "none";
        main.style.opacity = "1";

    }
}

//to call API and show all information in a new div
const showPhoto = (date) => {

        fetch('https://api.nasa.gov/planetary/apod?api_key=av7FCckVr2PUJTfA1tgAMhnU6zSNHZliGns2VfKK&date=' + date)
            .then(response => response.text())
            .then(data => {
                if (JSON.parse(data)["date"] === date) {

                    let frameimage = document.createElement("div");
                    frameimage.id = "frameimage" + JSON.parse(data)["date"];
                    frameimage.classList.add('frameimage');
                    main.append(frameimage);

                    let nameImage = document.createElement("div");
                    nameImage.classList.add('nameimage');
                    nameImage.innerHTML = JSON.parse(data)["title"];

                    let date = document.createElement("div");
                    date.innerHTML = JSON.parse(data)["date"];
                    date.classList.add('texte');
                    date.style.fontStyle = "italic";

                    let explanation = document.createElement("p");
                    explanation.innerHTML = JSON.parse(data)["explanation"];
                    explanation.classList.add('texte');

                    let likebutton = document.createElement("div");
                    likebutton.id = 'likebutton' + JSON.parse(data)["date"];
                    likebutton.classList.add('likebutton');

                    likebutton.innerText = "\ud83d\ude0d LIKE";

                    frameimage.append(nameImage);
                    frameimage.append(date);

                    //check if its an image of a video 
                    if (JSON.parse(data)["media_type"] === "video") {
                        let sourcevideo = document.createElement("iframe");
                        sourcevideo.src = JSON.parse(data)["url"];
                        sourcevideo.classList.add('videonasa');
                        frameimage.append(sourcevideo);
                    } else if (JSON.parse(data)["media_type"] === "image") {
                        let image = document.createElement('img');
                        image.src = JSON.parse(data)["url"];
                        image.classList.add('imagenasa');
                        frameimage.append(image);
                        image.addEventListener('click', function() {
                            hdphoto(JSON.parse(data)["hdurl"], JSON.parse(data)["date"], true)
                        })
                    }

                    frameimage.append(explanation);
                    //event listener with date information to build list of liked/unliked photo
                    likebutton.addEventListener('click', function() {
                            likeUnlike(JSON.parse(data)["date"])
                        })
                        //if photo was previously liked. Load with button pressed
                    for (i = 0; i < JSON.parse(localStorage.getItem('likeuserlist')).length; i++) {
                        if (JSON.parse(localStorage.getItem('likeuserlist'))[i] == JSON.parse(data)["date"]) {
                            likebutton.innerText = "UNLIKE";
                            likebutton.style.transform = "translateX(3px)";
                            likebutton.style.transform = "translateY(3px)";
                            likebutton.style.boxShadow = "none";
                        }
                    }
                    frameimage.append(likebutton);
                }
            })
    }
    //list of liked photos
let likeuser = [];

//comment faire poru garder les info des like dans javascript?
//localstoda json.strignify

const likeUnlike = (date) => {
    let like = document.getElementById('likebutton' + date);

    if (like.innerText == "\ud83d\ude0d LIKE") {
        like.innerText = "UNLIKE";
        like.style.transform = "translateX(3px)";
        like.style.transform = "translateY(3px)";
        like.style.boxShadow = "0 0 0 0";
        likeuser.push(date);

    } else {
        like.innerText = "\ud83d\ude0d LIKE";
        like.style.transform = "translateX(-3px)";
        like.style.transform = "translateY(-3px)";
        like.style.boxShadow = "3px 3px 2px 1px rgb(103, 139, 139)";
        for (i = 0; i < likeuser.length; i++) {
            if (likeuser[i] == date) {
                likeuser.splice(i, 1);
            }
        }
    }
    //to keed liked list when user refrech of reload
    localStorage.setItem('likeuserlist', JSON.stringify(likeuser));
}

//night or day mode with toggle
let togglemode = document.getElementById('accept');
let textcolor = document.getElementsByTagName("div");
let pagetitlecolor = document.getElementsByTagName("h1");

togglemode.onclick = () => {
    if (nasa.className === 'bodylight') {
        nasa.classList.replace('bodylight', 'bodydark');
        textcolor[0].style.color = "lightgray";
        pagetitlecolor[0].style.color = "lightgray";
    } else if (nasa.className === 'bodydark') {
        nasa.classList.replace('bodydark', 'bodylight');
        textcolor[0].style.color = "darkslategrey";
        pagetitlecolor[0].style.color = "darkslategrey";
    }
}