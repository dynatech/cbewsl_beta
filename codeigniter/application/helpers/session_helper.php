<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
    function is_logged_in() {
        if(isset($_SESSION) == false) {
            $lastURL = current_url();
            redirect('/');
        }
    }
?>