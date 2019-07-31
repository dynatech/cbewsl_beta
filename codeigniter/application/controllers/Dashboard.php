<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends CI_Controller {
	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */

	public function __construct() {
		parent::__construct();
		$this->load->helper(array('url','session_helper'));
		$this->load->library('session');
	}

	public function index() {
        $this->load->view('templates/header');
        $this->load->view('templates/nav');
		$this->load->view('dashboard');
		$this->load->view('templates/footer');
		is_logged_in($this->session->userdata('is_logged_in'));
	}
	
	public function multipleImageStore() {
 
      $countfiles = count($_FILES['files']['name']);
  
      for($i=0;$i<$countfiles;$i++){
  
        if(!empty($_FILES['files']['name'][$i])){
  
          // Define new $_FILES array - $_FILES['file']
          $_FILES['file']['name'] = $_FILES['files']['name'][$i];
          $_FILES['file']['type'] = $_FILES['files']['type'][$i];
          $_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
          $_FILES['file']['error'] = $_FILES['files']['error'][$i];
          $_FILES['file']['size'] = $_FILES['files']['size'][$i];
 
          // Set preference
          $config['upload_path'] = './uploads/'; 
          $config['allowed_types'] = 'jpg|jpeg|png|gif';
          $config['max_size'] = '5000'; // max_size in kb
          $config['file_name'] = $_FILES['files']['name'][$i];
  
          //Load upload library
          $this->load->library('upload',$config); 
          $arr = array('msg' => 'something went wrong', 'success' => false);
          // File upload
          if($this->upload->do_upload('file')){
           
           $data = $this->upload->data(); 
           $insert['name'] = $data['file_name'];
           $this->db->insert('images',$insert);
           $get = $this->db->insert_id();
          $arr = array('msg' => 'Image has been uploaded successfully', 'success' => true);
 
          }
        }
  
      }
      echo json_encode($arr);
  
  	}
}
