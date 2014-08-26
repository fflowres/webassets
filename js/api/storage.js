var g_db = null;
var g_textFieldElement = null;
var g_FirstSuccessMessageWritten = false;

var g_defaultStoreString = "DROP TABLE IF EXISTS DEMO\nCREATE TABLE IF NOT EXISTS DEMO (id unique, data)\nINSERT INTO DEMO (id, data) VALUES (1, 'Test String')";
var g_defaultRetrieveString = 'SELECT * FROM DEMO';// where id=1';

/////////////////////////////////////////////////////////////////////////////////
//DB Stuff
/////////////////////////////////////////////////////////////////////////////////

function logToTextField(text, append)
{
    if (typeof append == "undefined")
        append = false;
        
    if (g_textFieldElement == null)
    {
        g_textFieldElement = document.getElementById("iodata");   
    }
    
    if (append)
    {
        g_textFieldElement.value += text;
    }
    else
    {
        g_textFieldElement.value = text;
    }
}

//transaction.executeSql callbacks
function executeSuccess(tx, results)
{
    if (!g_FirstSuccessMessageWritten)
    {
        g_FirstSuccessMessageWritten = true;
        logToTextField("Executed SQL successfully\n", true);
    }
    
    var numrows = results.rows.length;
    if (numrows != 0)
        logToTextField("Rows read: " + numrows + "\n");
        
    for (var i = 0; i < numrows; ++i)
    {
        logToTextField(results.rows.item(i).data + "\n", true);
    }
}

function executeError(err)
{
    logToTextField("Error executing sql: " + JSON.stringify(err));
}

//Database.transaction callbacks
function buildAndExecuteTransaction(tx)
{
    g_FirstSuccessMessageWritten = false;
    
    g_textFieldElement = document.getElementById("iodata");
    var fullquery = g_textFieldElement.value;
    var splitQuery = fullquery.split("\n");
    
    // Clear the text field for output
    logToTextField("");
    
    for (var iQ = 0; iQ < splitQuery.length; ++iQ)
    {
        tx.executeSql(splitQuery[iQ], [], executeSuccess, executeError);
    }
}

function transactionSuccess() 
{
    // Leave this out as the message is confusing
    // logToTextField("Transaction successful", true);
}

function transactionError(err)
{
    logToTextField("Transaction error: " + JSON.stringify(err));
}

/////////////////////////////////////////////////////////////////////////////////

function click_execute()
{
    g_db.transaction(buildAndExecuteTransaction, transactionError, transactionSuccess); 
}
              
function click_clear()
{
    g_textFieldElement = document.getElementById("iodata");
    g_textFieldElement.value = "";
}
function click_defaultstore()
{
    g_textFieldElement = document.getElementById("iodata");
    g_textFieldElement.value = g_defaultStoreString;
}
function click_defaultretrieve()
{
    g_textFieldElement = document.getElementById("iodata");
    g_textFieldElement.value = g_defaultRetrieveString;
}

function onDeviceReady()
{
    g_textFieldElement = document.getElementById("iodata");
    g_textFieldElement.value = g_defaultStoreString;
    g_db = window.openDatabase("Database", "1.0", "Marmalade Demo", 200000);
}   
