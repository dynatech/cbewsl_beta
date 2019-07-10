<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>COMMUNITY-BASED EARLY WARNING SYSTEM FOR DEEP-SEATED LANDSLIDES</title>
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/datatables/datatables.min.css">
    <!-- <link rel="stylesheet" href="<?php echo base_url(); ?>assets/printjs/print.min.css"> -->
    <link href="<?php echo base_url(); ?>assets/font_awesome/css/all.min.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>assets/full_calendar/core/main.css" rel="stylesheet" />
    <link href="<?php echo base_url(); ?>assets/full_calendar/daygrid/main.css" rel="stylesheet" />
    <link href="<?php echo base_url(); ?>assets/full_calendar/timegrid/main.css" rel="stylesheet" />
    <script src="<?php echo base_url(); ?>assets/full_calendar/core/main.js"></script>
    <script src="<?php echo base_url(); ?>assets/full_calendar/daygrid/main.js"></script>
    <script src="<?php echo base_url(); ?>assets/full_calendar/interaction/main.js"></script>
    <script src="<?php echo base_url(); ?>assets/full_calendar/timegrid/main.js"></script>
    <script src="<?php echo base_url(); ?>assets/moment/moment.js"></script>
    <script src="<?php echo base_url(); ?>assets/tooltip/popper.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/tooltip/tooltip.js"></script>
    <script src="<?php echo base_url(); ?>assets/jquery/jquery.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/datatables/datatables.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/highcharts/highcharts.js"></script>
    <!-- <script src="<?php echo base_url(); ?>assets/highcharts/highstock.js"></script> -->
    <!-- <script src="<?php echo base_url(); ?>assets/printjs/jspdf.min.js"></script> -->
    <!-- <script src="<?php echo base_url(); ?>assets/printjs/print.min.js"></script> -->
  
    <style>
        html {
        scroll-behavior: smooth;
        }

    </style>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">GOVPH</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-bars"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#"><i class="fas fa-user"></i> Profile</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </form>
  </div>
</nav>