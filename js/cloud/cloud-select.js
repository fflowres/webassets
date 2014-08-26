

var cloudaction = sessionStorage.cloudaction;


function cloudpage_ftp() {
    if(cloudaction ==='upload' || cloudaction ==='select'){ //reload internally
        sessionStorage.topage = 'cloud-ftp.html';
        location.reload();       
    } else if(cloudaction =='import'){ // divert to full page
        location.href = 'cloud-ftp.html';
    }
}

function cloudpage_dropbox() {
    if(cloudaction ==='upload' || cloudaction ==='select'){ //reload internally
        sessionStorage.topage = 'cloud-dropbox.html';
        location.reload();       
    } else if(cloudaction =='import'){ // divert to full page
        location.href = 'cloud-dropbox.html';
    }
}


function cloudpage_googledrive() {
    if(cloudaction ==='upload' || cloudaction ==='select'){ //reload internally
        sessionStorage.topage = 'cloud-googledrive.html';
        location.reload();       
    } else if(cloudaction =='import'){ // divert to full page
        location.href = 'cloud-googledrive.html';
    }
}


