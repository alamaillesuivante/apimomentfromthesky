let nasa = document.getElementById('bodynasa')
let main = document.getElementById('maindiv')
let dateentry = document.getElementById('dateentry').value;
let dateentrydiv = document.getElementById('dateentry');
let header = document.getElementById('header')

window.onload = () => {
    let dates = []
    let datenow = new Date()
    datenow.toLocaleString('default', { month: 'long' })
    for (i = 0; i <= 6; i++) {
        let last6dates = new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() - i)
        last6dates.toLocaleString('default', { month: 'long' })
        var result = last6dates.toLocaleDateString(undefined, { // you can use undefined as first argument
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        dates.push(result)
    }

    for (i = 0; i < dates.length; i++) {
        showPhoto(dates[i])
    }
}

//quand on choisi un date aller chercher l'info du calendier
dateentrydiv.oninput = () => {
    main.querySelectorAll(".frameimage").forEach(n => n.remove());
    let dateentry = document.getElementById('dateentry').value;
    if (dateentry != '') {
        showPhoto(dateentry)
    }
}

function hdphoto(imgsrc, date, status) {
    // il faut cacher en dessou centrer relatif a la taille
    let framebiggerimage = document.createElement("div")
    let biggerImage = document.createElement("img")
    if (status == true) {

        biggerImage.src = imgsrc
        biggerImage.style.maxWidth = `${window.screen.width}px`
        biggerImage.style.maxHeight = `${window.screen.height}px`
        framebiggerimage.style.zIndex = "99"
        framebiggerimage.style.position = "fixed"
        framebiggerimage.id = "framebiggerimage"
        framebiggerimage.style.display = "block";
        framebiggerimage.style.alignSelf = "center"

        biggerImage.addEventListener('click', function() {
            hdphoto(imgsrc, date, false)
        })

        nasa.append(framebiggerimage)
        for (i = 0; i < document.getElementsByClassName("frameimage").length; i++) {
            document.getElementsByClassName("frameimage")[i].style.visibility = 'hidden'
        }
        framebiggerimage.append(biggerImage)
        header.style.backgroundColor = "rgb(103, 139, 139)"
        header.style.opacity = "0.5"
        main.style.backgroundColor = "rgb(103, 139, 139)"
        main.style.opacity = "0.5"

    }
    if (status == false) {

        for (i = 0; i < document.getElementsByClassName("frameimage").length; i++) {
            document.getElementsByClassName("frameimage")[i].style.visibility = 'visible'
        }

        document.getElementById("framebiggerimage").remove()
        header.style.backgroundColor = "white"
        header.style.opacity = "1"
        main.style.backgroundColor = "white"
        main.style.opacity = "1"

    }
}


const showPhoto = (date) => {

    fetch('https://api.nasa.gov/planetary/apod?api_key=av7FCckVr2PUJTfA1tgAMhnU6zSNHZliGns2VfKK&date=' + date)
        .then(response => response.text())
        .then(data => {
            if (JSON.parse(data)["date"] === date) {
                console.log(JSON.parse(data)["media_type"])
                let frameimage = document.createElement("div")
                frameimage.id = "frameimage" + JSON.parse(data)["date"]
                frameimage.classList.add('frameimage')
                main.append(frameimage)

                let nameImage = document.createElement("div")
                nameImage.classList.add('nameimage');
                nameImage.innerHTML = JSON.parse(data)["title"];

                let date = document.createElement("div")
                date.innerHTML = JSON.parse(data)["date"];
                date.classList.add('texte');
                date.style.fontStyle = "italic"

                let explanation = document.createElement("p")
                explanation.innerHTML = JSON.parse(data)["explanation"];
                explanation.classList.add('texte');

                let likebutton = document.createElement("div")
                likebutton.id = 'likebutton' + JSON.parse(data)["date"]
                likebutton.classList.add('likebutton')

                likebutton.innerText = "LIKE"

                frameimage.append(nameImage)
                frameimage.append(date)
                if (JSON.parse(data)["media_type"] === "video") {
                    let video = document.createElement('video')
                    let sourcevideo = document.createElement("iframe");
                    sourcevideo.src = JSON.parse(data)["url"]
                    video.append(sourcevideo)
                    video.classList.add('imagenasa')
                    frameimage.append(video)
                } else if (JSON.parse(data)["media_type"] === "image") {
                    let image = document.createElement('img')
                    image.src = JSON.parse(data)["url"];
                    image.classList.add('imagenasa')
                    frameimage.append(image)
                    image.addEventListener('click', function() {
                        hdphoto(JSON.parse(data)["hdurl"], JSON.parse(data)["date"], true)
                    })
                }
                frameimage.append(explanation)
                console.log(JSON.parse(localStorage.getItem('likeuserlist')).length)
                likebutton.addEventListener('click', function() {
                    likeUnlike(JSON.parse(data)["date"])
                })
                for (i = 0; i < JSON.parse(localStorage.getItem('likeuserlist')).length; i++) {
                    if (JSON.parse(localStorage.getItem('likeuserlist'))[i] == JSON.parse(data)["date"]) {
                        likebutton.innerText = "UNLIKE"
                        likebutton.style.transform = "translateX(3px)"
                        likebutton.style.transform = "translateY(3px)"
                        likebutton.style.boxShadow = "none"
                    }
                }
                frameimage.append(likebutton)
            }
        })
}
let likeuser = []

//comment faire poru garder les info des like dans javascript?
//localstoda json.strignify

const likeUnlike = (date) => {
    let like = document.getElementById('likebutton' + date)
    console.log(like.innerText)
    if (like.innerText == "LIKE") {
        like.innerText = "UNLIKE"
        like.style.transform = "translateX(3px)"
        like.style.transform = "translateY(3px)"
        like.style.boxShadow = "0 0 0 0"
        likeuser.push(date)

    } else {
        like.innerText = "LIKE"
        like.style.transform = "translateX(-3px)"
        like.style.transform = "translateY(-3px)"
        like.style.boxShadow = "3px 3px 2px 1px rgb(103, 139, 139)"
        for (i = 0; i < likeuser.length; i++) {
            if (likeuser[i] == date) {
                likeuser.splice(i, 1)
            }
        }
        console.log('dans unlike' + likeuser)
    }
    localStorage.setItem('likeuserlist', JSON.stringify(likeuser))
}

let togglemode = document.getElementById('accept')
let textcolor = document.getElementsByTagName("div");
let pagetitlecolor = document.getElementsByTagName("h1");
togglemode.onclick = () => {
    console.log(nasa.className)
    if (nasa.className === 'bodylight') {
        nasa.classList.replace('bodylight', 'bodydark')
        textcolor[0].style.color = "lightgray"
        pagetitlecolor[0].style.color = "lightgray"
    } else if (nasa.className === 'bodydark') {
        nasa.classList.replace('bodydark', 'bodylight')
        textcolor[0].style.color = "darkslategrey"
        pagetitlecolor[0].style.color = "darkslategrey"
    }
}