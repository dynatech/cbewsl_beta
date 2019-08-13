<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {

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

	public function index()
	{	
		header('Access-Control-Allow-Origin: *');
		$this->load->view('templates/header');
		$this->load->view('home');
		$this->load->view('templates/home_footer');
		if (isset($_SESSION) == true) {
			header("Location: /dashboard");
		}
	}

	public function registerSession() {
		try {
			$data = $_POST;
			$this->session->set_userdata($data);
			$status = true;
		} catch (Exception $e) {
			$status = false;
		}
		print($status);
	}
}
