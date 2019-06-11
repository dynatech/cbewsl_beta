<div class="sticky-top">
    <div class="btn-group btn-block" role="group" aria-label="Basic example">
        <a href="#risk_profile" role="button" class="btn btn-secondary">Risk Profile</a>
        <a href="#hazard_map" role="button" class="btn btn-secondary">Hazard Map</a>
        <a href="#hazard_data" role="button" class="btn btn-secondary">Hazard Data</a>
        <a href="#resources_and_capacities" role="button" class="btn btn-secondary">Resources and Capacities</a>
        <a href="#family_risk_profile" role="button" class="btn btn-secondary">Family Risk Profile</a>
    </div>
</div>

<div class="card m-3" id="risk_profile">
    <div class="card-body">
        <label><b>Risk Profile <a href="" data-toggle="modal" data-target="#riskProfileModal">[edit]</a></b></label>
        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sapien orci, convallis sed dignissim at, ullamcorper in mi. Phasellus ut condimentum ante, a sodales nulla. Fusce hendrerit lectus cursus, efficitur sem eu, sodales mauris. Praesent ultricies malesuada tristique. Fusce facilisis magna vitae ipsum facilisis, id scelerisque nisl rutrum. Nam sit amet lacus et elit sodales imperdiet. Donec fringilla lacus risus, vitae venenatis quam consequat sit amet. Donec venenatis ante in elementum tincidunt. Pellentesque ac sodales nisi. Suspendisse pulvinar lacus non nibh egestas blandit. Suspendisse potenti. Ut ullamcorper massa sapien, vitae molestie dolor pulvinar vel. Nunc augue nulla, semper a dui id, porttitor pulvinar lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;

        Sed eget euismod quam, vitae lacinia orci. Nulla ornare magna sapien, quis mattis ligula molestie quis. Vestibulum eget magna felis. In purus nisi, viverra quis libero sit amet, sodales tristique mi. Duis efficitur commodo urna, eget ultrices nibh facilisis et. In id dolor erat. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
        </p>
    </div>
</div>
<div class="card m-3" id="hazard_map">
    <div class="card-body">
        <label><b>Hazard Map <a href="" data-toggle="modal" data-target="#hazardMapModal">[edit]</a></b></label>
        <img src="<?php echo base_url(); ?>assets/images/umi_map.jpg" class="img-fluid" alt="Responsive image" style="width:100%">
    </div>
</div>
<div class="card m-3" id="hazard_data">
    <div class="card-body">
        <label><b>Hazard Data <a href="" data-toggle="modal" data-target="#hazardDataModal">[edit]</a></b></label>
        <table id="hazard_data_main_table" class="display table table-striped" style="width:100%">
            <thead>
                <tr>
                    <th>Hazard</th>
                    <th>Speed of Onset</th>
                    <th>Early Warning</th>
                    <th>Impact</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>Hazard</th>
                    <th>Speed of Onset</th>
                    <th>Early Warning</th>
                    <th>Impact</th>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
<div class="card m-3" id="resources_and_capacities">
    <div class="card-body">
        <label><b>Resources and Capacities <a href="" data-toggle="modal" data-target="#resourcesAndCapacitiesModal">[edit]</a></b></label>
        <table id="resources_and_capacities_main_table" class="display table table-striped" style="width:100%">
            <thead>
                <tr>
                    <th>Resource/Capacity</th>
                    <th>Status</th>
                    <th>Owner</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>Resource/Capacity</th>
                    <th>Status</th>
                    <th>Owner</th>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
<div class="card m-3" id="family_risk_profile">
    <div class="card-body">
        <label><b>Family Risk Profile <a href="" data-toggle="modal" data-target="#familyRiskProfileModal">[edit]</a></b></label>
        <table id="family_risk_profile_main_table" class="display table table-striped" style="width:100%">
            <thead>
                <tr>
                    <th>Household No.</th>
                    <th>Number of members</th>
                    <th>Number of members belonging to vulnerable groups</th>
                    <th>Nature of Vulnerability</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>Household No.</th>
                    <th>Number of members</th>
                    <th>Number of members belonging to vulnerable groups</th>
                    <th>Nature of Vulnerability</th>
                </tr>
            </tfoot>
        </table>
    </div>
</div>