let pathToFile = document.getElementById("pathToFile");
let selectBtn = document.getElementById("selectBtn");
let showFilePath = document.getElementById("showFilePath");
let filePlace = document.getElementById("filePlace");
let filePlaceBut = document.getElementById("filePlaceBut");
let imageBox = document.getElementById("imageBox");
let formControlRange = document.getElementById("formControlRange");



function pathChange(e){
    let filePath = pathToFile.value;

    let res = fetch('images/has?url='+filePath)
    .then((res)=>{
        if(res.status/300 >= 1){
            pathToFile.classList.remove('is-valid');
            pathToFile.classList.add('is-invalid');
        }
        else{
            pathToFile.classList.remove('is-invalid');
            pathToFile.classList.add('is-valid');
        }
    });
}

function selectFile(e){
    let filePath = pathToFile.value;
    document.location = '/images/download?url='+filePath;

}

function fileSelectFromPc(e){
    let fs = document.createElement("input");
    let csrf = document.getElementsByName("csrfmiddlewaretoken")[0];
    fs.type = "file";
    fs.addEventListener("change", (e)=>{
        console.dir(fs.files[0])
        let filePath = fs.files[0].name;

        let fd = new FormData();

        fd.append('image', fs.files[0], fs.files[0].name);
        fs.files[1] = fs.files[0];
        console.dir(fs.files)
        setFilePath(filePath);
        for (var key of fd.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }
        let result = fetch('images/', {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data; boundary=---fwwewef",
                "X-CSRFToken": csrf.value
            },
            body: fd
        }).then((res)=>console.log(res.text()));
    });
    fs.click();
}

function fileDrop(e){
    e.preventDefault();
    console.log("drop")
    console.log(e);
}

function dragOverHandler(e){
    console.log('File(s) in drop zone');
    e.preventDefault();
    console.log(e)
}

function setImage(){

}

function loadImageFromPc(e){
    let form = document.getElementById('imageForm');
    form.submit();
    
}

function setFilePath(filePath){
    showFilePath.innerHTML = '';
    let parts = filePath.split('/');
    var frame = document.createDocumentFragment();

    for(var part of parts){
        var li = document.createElement('li');
        li.classList.add("breadcrumb-item");
        li.innerText = part;
        frame.appendChild(li);
    }
    showFilePath.appendChild(frame);
}

function setBlur(e){
    let blurValue = (e.target.value);
    let img = document.getElementById('usersImage');

    if(img !== null){
        img.style.filter = "blur("+blurValue+"px)";
        console.log(img.style)
    }
}

pathToFile.addEventListener("input", pathChange);
selectBtn.addEventListener("click", selectFile);
if(filePlace){
    filePlace.addEventListener("drop", fileDrop);
    imageBox.addEventListener("change", loadImageFromPc);
    filePlace.addEventListener("dragover", dragOverHandler);
}

formControlRange.addEventListener("input", setBlur);
document.body.addEventListener("paste", (e)=>
{
    console.log(e)
})