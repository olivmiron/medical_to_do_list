<?php if(!$_SESSION["logged_in"]) { ?>
    <div id="sign_in_square" class="floating_box">
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <span>You are not signed in</span>
        
        <div class="spacer_xl"></div>

        <div id="g_id_onload"
            data-client_id="64629051096-v5i6qsdt1mccdd8qimne5v1496o839tj.apps.googleusercontent.com"
            data-callback="handleCredentialResponse">
        </div>
        <div class="g_id_signin" data-type="standard"></div>
    </div>
<?php } ?>