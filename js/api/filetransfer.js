var gFileSystem;
var gURI;

function onDeviceReady() 
{   
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 1000, gotFS, failfs);     
}


var gotFS = function(fileSystem) 
{
    gFileSystem = fileSystem;      
    fileSystem.root.getDirectory("img", {create:false}, imgSuccess, imgFail);
};

var imgSuccess = function(parent)
{
    var reader = parent.createReader();    
    reader.readEntries(rsuccess,rfail);
};

var imgFail = function(error)
{
    alert("cannot find img folder");
};

function rsuccess(entries) 
{    
    var i;
                    
    var currentGroup = null;
    var content      = '';
    var $contactList = $('#listview');
        
    for (i=0; i<entries.length; i++) 
    {             
    	if (entries[i].isFile === true)
        	content += '<li class="filex"><span>' + entries[i].toURI() + '</span></li>';
    }
    
    $contactList.html(content);
    
    $('.filex').bind("click",  
    function() {   
        gURI = $('span', this).html();
        uploadPhoto(gURI);
    });
    
}

function rfail() {
    alert("rfail");
}


var failfs = function(error)
{
    alert("failfs");
};

function uploadPhoto(imageURI)
{
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    options.chunkedMode = false;

    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    logme("debug", "uploading: " + imageURI);
    ft.upload(imageURI, "http://posttestserver.com/post.php?dir=merlin&dump", win, failx, options);
}

function win(r) 
{
	//strip Uploaded File: url:
	var index = r.response.lastIndexOf('http://');
	var imgurl = "";
	if (index >= 0)
		imgurl = r.response.substr(index);
	
    logme("debug", r.bytesSent + " Bytes were successfully uploaded with response code:" + r.responseCode);
	$('#imgx').attr('src', imgurl); 
    $('#imgx').css("visibility", "visible");
    $('#imgx').css("height", "auto");
}

function failx(error) 
{
    alert("An error has occurred: Code = " + error.code);
}
