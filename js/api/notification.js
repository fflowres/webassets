
function onDeviceReady()
{

    $('#notification-alert').bind('click', function() {
        navigator.notification.alert(
            // Message
            'Howdy Sir!',
            
            // Callback
            function() { logme("debug", "Button Pressed"); },
            
            // Title (Optional)
            'Greetings',
            
            // Button Name
            'Good day'
        );
    });

    $('#notification-confirm').bind('click', function() {
        navigator.notification.confirm(
            // Message
            'Sir or Madam?',
            
            // Callback
            function(index) {
                var gender = (index === 1) ? 'sir' : 'madam';
                navigator.notification.alert('Good day ' + gender);
            },
            
            // Title (Optional)
            'Greetings',
            
            // Button Name
            'Sir,Madam'
        );
    });

    $('#notification-vibrate').bind('click', function() {
        navigator.notification.vibrate(2500);
    });
    
    $('#notification-beep').bind('click', function() {
        navigator.notification.beep(1);
    });
}

