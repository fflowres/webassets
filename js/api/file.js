var g_fileSystem = null;
var g_filename = null;
var g_Entry = null;
var g_TestData = ["About Web Marmalade...", "Where is my hat?"];
var g_Files = [];
var g_Written = 0;
var g_Created = 0;
var g_Parent = null;

function onDeviceReady()
{    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 1000, gotFS, fail);                  
}   

var gotFS = function(fileSystem) {
    g_fileSystem = fileSystem;    
    createTestFolder(fileSystem);
};

var createTestFolder = function(fileSystem)
{
    fileSystem.root.getDirectory("txt", {create:true, exclusive:false}, getDirectorySuccess, getDirectoryFail);
};

var getDirectorySuccess = function(parent)
{
    g_Parent = parent;
    // create our test text files if they don't already exist
    parent.getFile("about.txt", {create:true, exclusive:false}, onGotFile, fail);
    parent.getFile("another.txt", {create:true, exclusive:false}, onGotFile, fail);
};

var initData = function(current, entry)
{
    if (current < g_TestData.length)
    {
        entry.createWriter(function(writer) {
            writer.onwriteend = function(data) {
                // successfully written to file!
                g_Written++;
                if (g_Written == g_TestData.length) {
                    startDemo(g_Parent);
                }
            };
            writer.onerror = fail;
            writer.write(g_TestData[current]);
        }, fail);
    }
};

var onGotFile = function(entry)
{
    entry.file(
        function(data) {
            if (data.size == 0) {
                var tmp = g_Created;
                g_Created++;
                initData(tmp, entry);
            }
            else
            {
                g_Written++;
                if (g_Written == g_TestData.length)
                    startDemo(g_Parent);
            }
        }, 
        fail);
};

var startDemo = function(parent)
{
    var reader = parent.createReader();    
    reader.readEntries(readerSuccess, readerFail);

    $('#filemem').hide();
    $('#cancel').bind('click',
        function()
        {
            $('#filemem').hide();            
        });
        
    $('#store').bind('click', 
        function() 
        {                
            if ( g_filename !== null )
            {
                if ( g_Entry !== null )
                {
                    g_Entry.createWriter(
                        function success(writer)
                        {
                            writer.write( $('#filedata').val() );
                        },
                        function fail(evt)
                        {
                            alert("failed to create writer");
                        }
                    );
                }
                
            }

        });    
};                             

  
var fail = function(error) 
{
    alert('Failed: ' + error );
};

var gotFileEntry = function (fileEntry) 
{
    g_Entry = fileEntry;
    fileEntry.file(gotFile, fail);                         
};

function gotFile(file) 
{
    var reader = new FileReader();
    
    reader.onloadend = function(evt) {                
        $('#filedata').val(reader.result);
    };
    
    reader.readAsText(file);    
}

function readerSuccess(entries) {
    
    var i;    
    var currentGroup = null;
    var content      = '';
    var $contactList = $('#listview');       
        
    for (i=0; i<entries.length; i++) 
    {             
        if ( entries[i].isFile === true)
            content += '<li class="filex"><span>' + entries[i].name + '</span></li>';
    }
    
    $contactList.html(content);
    
    $('.filex').bind("click",  
        function() {   
            $('#filemem').show();
            g_filename = $('span', this).html();
            g_Parent.getFile(g_filename, {create:false}, gotFileEntry, fail);
        });
      
}

function readerFail() 
{
    alert("Failed to read entires");
}

var getDirectoryFail = function(error)
{
    alert("cannot find/create txt folder");
};
