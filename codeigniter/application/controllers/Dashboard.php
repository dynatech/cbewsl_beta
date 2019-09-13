<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->helper(array('url','session_helper'));
    $this->load->library('session');
    $this->load->model('upload_model');
	}

	public function index() {
    $this->load->view('templates/header');
    $this->load->view('templates/nav');
		$this->load->view('dashboard');
		$this->load->view('templates/footer');
		is_logged_in($this->session->userdata('is_logged_in'));
	}
	
	public function uploadHazardMap() {
      $data = array();
      if(!empty($_FILES['files']['name'])){
        $filesCount = count($_FILES['files']['name']);
            for($i = 0; $i < $filesCount; $i++){
                $_FILES['file']['name'] = $_FILES['files']['name'][$i];
                $_FILES['file']['type'] = $_FILES['files']['type'][$i];
                $_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
                $_FILES['file']['error'] = $_FILES['files']['error'][$i];
                $_FILES['file']['size'] = $_FILES['files']['size'][$i];
                // File upload configuration
                $uploadPath = './uploads/hazard_map';
                $config['upload_path'] = $uploadPath;
                $config['max_size'] = '30000';
                $config['allowed_types'] = 'jpg|jpeg|png|gif';
                
                // Load and initialize upload library
                $this->load->library('upload', $config);
                $this->upload->initialize($config);
                
                // Upload file to server
                if($this->upload->do_upload('file')){
                    // Uploaded file data
                    $fileData = $this->upload->data();
                    $uploadData[$i]['file_name'] = $fileData['file_name'];
                    $uploadData[$i]['uploaded_on'] = date("Y-m-d H:i:s");
                    $date = new DateTime("now", new DateTimeZone("Asia/Manila") );
                    $hazard_map_data = array(
                      "path" => "/uploads/hazard_map/".$fileData['file_name'],
                      "file_name" => $fileData['file_name'],
                      "timestamp" => $date->format("Y-m-d H:i:s")
                    );
                    $this->upload_model->insert_hazard_map_data($hazard_map_data);
                }else{
                  echo $this->upload->display_errors();
                }
            }
            $feedback = array();
            if(!empty($uploadData)){
              $feedback = array("status"=>true, "message"=>"File(s) uploaded successfully.");
            }else{
              $feedback = array("status"=>false, "message"=>"Something went wrong, Please try again.");
            }

            echo json_encode($feedback);
      }else{
        echo json_encode(array("status"=>false, "message"=>"Please select file."));
      }
  
    }

    public function uploadMomsImages($moms_id) {
      $data = array();
      if(!empty($_FILES['files']['name'])){

        $moms_directory = "./uploads/moms/".$moms_id;
        if (!is_dir($moms_directory)) {
          mkdir($moms_directory, 0777, true);
          // chmod($moms_directory, 0755);
        }

        $filesCount = count($_FILES['files']['name']);
            for($i = 0; $i < $filesCount; $i++){
                $_FILES['file']['name'] = $_FILES['files']['name'][$i];
                $_FILES['file']['type'] = $_FILES['files']['type'][$i];
                $_FILES['file']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
                $_FILES['file']['error'] = $_FILES['files']['error'][$i];
                $_FILES['file']['size'] = $_FILES['files']['size'][$i];
                // File upload configuration
                $uploadPath = './uploads/moms/'.$moms_id;
                $config['upload_path'] = $uploadPath;
                $config['allowed_types'] = 'jpg|jpeg|png|gif';
                
                // Load and initialize upload library
                $this->load->library('upload', $config);
                $this->upload->initialize($config);
                
                // Upload file to server
                if($this->upload->do_upload('file')){
                    // Uploaded file data
                    $fileData = $this->upload->data();
                    $uploadData[$i]['file_name'] = $fileData['file_name'];
                    $uploadData[$i]['uploaded_on'] = date("Y-m-d H:i:s");
                }else{
                  echo $this->upload->display_errors();
                }
            }
            $feedback = array();
            if(!empty($uploadData)){
              $feedback = array("status"=>true, "message"=>"File(s) uploaded successfully.");
            }else{
              $feedback = array("status"=>false, "message"=>"Something went wrong, Please try again.");
            }

            echo json_encode($feedback);
      }else{
        echo json_encode(array("status"=>false, "message"=>"Please select file."));
      }
  
    }

    public function get_moms_files($moms_id){
      $path    = './uploads/moms/'.$moms_id;
      $feedback = array();

      if(is_dir($path)){
        $files = array_diff(scandir($path), array('.', '..'));
        $feedback = array("status"=>true, "files"=>$files);
      }else{
        $feedback = array("status"=>false);
      }

      echo json_encode($feedback);
    }

    public function unregisterSession() {
      try {
        $this->session->unset_userdata($this->session->get_userdata());
        $this->session->sess_destroy();
        $status = true;
        redirect('/home');
      } catch (Exception $e) {
        $status = false;
      }
      echo "HEY";
      redirect('/home');
      echo json_encode($status);
    }
    
    
}


