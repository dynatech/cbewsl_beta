<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Upload_model extends CI_Model{
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function insert_hazard_map_data($data){
        $this->db->insert("hazard_map", $data);
    }
}
?>