function CheckError(response) {
    if (response.ok) {
        return response.json();
    } else {
        throw Error(response);
    }
}

// addEventListener("load", (event) => {
//     const form = document.getElementById('form');
//     const formData = new FormData(form);
//     const submitBtn = document.getElementById('submit-btn');
//
//     submitBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         const val = document.getElementById('firstName').value;
//         // console.log(val)
//         // formData.append('name', val)
//         for (var [key, value] of formData.entries()) {
//             console.log(key, value);
//         }
//         // console.log( value );
//
//         fetch(
//             '/image',
//             {
//                 method: "POST",
//                 body: formData,
//             },
//         ).then(CheckError)
//             .then((json) => {
//                 console.log(json)
//             })
//             .catch((error) => {
//                 console.log(error)
//             });
//     });
// });
// addEventListener("load", (event) => {
//     const formElem = document.getElementById('formElem');
//     const submitBtn = document.getElementById('submit-btn');
//
//     submitBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         const formData = new FormData(formElem);
//         for (var [key, value] of formData.entries()) {
//             console.log('+', key, value);
//         }
//     })
// });

formElem.onsubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.querySelector('#fileInput')
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    for (var [key, value] of formData.entries()) {
        console.log(key, value);
    }
    const options = {
        method: 'POST',
        body: formData,
    };
    let response = await fetch('/image', options);

    if (response.ok) {
        response.json().then((res) => {
            document.getElementById('loaded-img').setAttribute('src', res.imageURL)
        });
    } else {
        const textEle = document.getElementById('error-fetch');
        let result = await response.text();
        textEle.innerText()
        console.log(result)
    }
};

