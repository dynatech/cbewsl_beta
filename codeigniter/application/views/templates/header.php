<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>COMMUNITY-BASED EARLY WARNING SYSTEM FOR DEEP-SEATED LANDSLIDES</title>
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="<?php echo base_url(); ?>assets/datatables/datatables.min.css">
    <link href="<?php echo base_url(); ?>assets/font_awesome/css/all.min.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>assets/full_calendar/core/main.css" rel="stylesheet" />
    <link href="<?php echo base_url(); ?>assets/full_calendar/daygrid/main.css" rel="stylesheet" />
    <script src="<?php echo base_url(); ?>assets/full_calendar/core/main.js"></script>
    <script src="<?php echo base_url(); ?>assets/full_calendar/daygrid/main.js"></script>
    <script src="<?php echo base_url(); ?>assets/moment/moment.js"></script>
    <script src="<?php echo base_url(); ?>assets/tooltip/popper.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/tooltip/tooltip.js"></script>
    <!-- <link rel="stylesheet" href="<?php echo base_url(); ?>assets/datatables/datatables/js/jquery.dataTables.min.js"> -->
    <script src="<?php echo base_url(); ?>assets/jquery/jquery.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="<?php echo base_url(); ?>assets/datatables/datatables.min.js"></script>
  
    <style>
        html {
        scroll-behavior: smooth;
        }

        .popper,
        .tooltip {
          position: absolute;
          z-index: 9999;
          background: #FFC107;
          color: black;
          width: 150px;
          border-radius: 3px;
          box-shadow: 0 0 2px rgba(0,0,0,0.5);
          padding: 10px;
          text-align: center;
        }
        .style5 .tooltip {
          background: #1E252B;
          color: #FFFFFF;
          max-width: 200px;
          width: auto;
          font-size: .8rem;
          padding: .5em 1em;
        }
        .popper .popper__arrow,
        .tooltip .tooltip-arrow {
          width: 0;
          height: 0;
          border-style: solid;
          position: absolute;
          margin: 5px;
        }

        .tooltip .tooltip-arrow,
        .popper .popper__arrow {
          border-color: #FFC107;
        }
        .style5 .tooltip .tooltip-arrow {
          border-color: #1E252B;
        }
        .popper[x-placement^="top"],
        .tooltip[x-placement^="top"] {
          margin-bottom: 5px;
        }
        .popper[x-placement^="top"] .popper__arrow,
        .tooltip[x-placement^="top"] .tooltip-arrow {
          border-width: 5px 5px 0 5px;
          border-left-color: transparent;
          border-right-color: transparent;
          border-bottom-color: transparent;
          bottom: -5px;
          left: calc(50% - 5px);
          margin-top: 0;
          margin-bottom: 0;
        }
        .popper[x-placement^="bottom"],
        .tooltip[x-placement^="bottom"] {
          margin-top: 5px;
        }
        .tooltip[x-placement^="bottom"] .tooltip-arrow,
        .popper[x-placement^="bottom"] .popper__arrow {
          border-width: 0 5px 5px 5px;
          border-left-color: transparent;
          border-right-color: transparent;
          border-top-color: transparent;
          top: -5px;
          left: calc(50% - 5px);
          margin-top: 0;
          margin-bottom: 0;
        }
        .tooltip[x-placement^="right"],
        .popper[x-placement^="right"] {
          margin-left: 5px;
        }
        .popper[x-placement^="right"] .popper__arrow,
        .tooltip[x-placement^="right"] .tooltip-arrow {
          border-width: 5px 5px 5px 0;
          border-left-color: transparent;
          border-top-color: transparent;
          border-bottom-color: transparent;
          left: -5px;
          top: calc(50% - 5px);
          margin-left: 0;
          margin-right: 0;
        }
        .popper[x-placement^="left"],
        .tooltip[x-placement^="left"] {
          margin-right: 5px;
        }
        .popper[x-placement^="left"] .popper__arrow,
        .tooltip[x-placement^="left"] .tooltip-arrow {
          border-width: 5px 0 5px 5px;
          border-top-color: transparent;
          border-right-color: transparent;
          border-bottom-color: transparent;
          right: -5px;
          top: calc(50% - 5px);
          margin-left: 0;
          margin-right: 0;
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
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>