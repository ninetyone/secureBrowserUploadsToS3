var uploadFile = function (callback) {
    document.querySelector('.upload-result').innerText = "";
    var fileUploader = document.querySelector('.file-selector');
    var file = fileUploader.files[0];
    if (!file) return;
    var filename = file.name;
    var contentType = file.type;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText, filename, displayMessageToUser);
        }
    };
    var paramsUrl = '/get-upload-params?filename=' + filename + '&content_type=' + contentType;
    xmlhttp.withCredentials = true;
    xmlhttp.open('GET', paramsUrl);
    xmlhttp.send();
}

function uploadFileToS3(data, filename, displayMessageToUser) {
    data = JSON.parse(data);
    var s3Data = {
        'key' : data.params['key'],
        'success_action_status' : data.params['success_sction_status'],
        'policy' : data.params['policy'],
        'content-type' : data.params['content-type'],
        'X-Amz-Algorithm' : data.params['x-amz-algorithm'],
        'X-Amz-Credential' : data.params['x-amz-credential'],
        'X-Amz-Date' : data.params['x-amz-date'],
        'X-Amz-Signature' : data.params['x-amz-signature']
    };

    var uploadData = new FormData();
    uploadData.append('key', data.params['key']);
    uploadData.append('acl', data.params['acl']);
    uploadData.append('success_action_status', data.params['success_action_status']);
    uploadData.append('policy', data.params['policy']);
    uploadData.append('content-type', data.params['content-type']);
    uploadData.append('X-Amz-Algorithm', data.params['x-amz-algorithm']);
    uploadData.append('X-Amz-Credential', data.params['x-amz-credential']);
    uploadData.append('X-Amz-Date', data.params['x-amz-date']);
    uploadData.append('X-Amz-Signature', data.params['x-amz-signature']);
    uploadData.append('file', filename);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", data.endpoint_url);
    xmlhttp.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 201) {
                displayMessageToUser("File uploaded successfully!", xmlhttp.responseText);
            } else {
                displayMessageToUser("Failed to upload... Check error!");
            }
        }
    }
    xmlhttp.send(uploadData);
}

function displayMessageToUser(message, response) {
    if (response) {
        if (window.DOMParser) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(response, "text/xml");
            message += "<br/><a target='_blank' href=" + xmlDoc.getElementsByTagName("Location")[0].childNodes[0].nodeValue + ">Link</a>";
        }
    }
    console.log(message);
    document.querySelector('.upload-result').innerHTML = message;
}
