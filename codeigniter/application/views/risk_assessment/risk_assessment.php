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
        <p id="current_risk_profile">
        </p>
    </div>
</div>
<div class="card m-3" id="hazard_map">
    <div class="card-body">
        <label><b>Hazard Map <a href="" data-toggle="modal" data-target="#hazardMapModal" id="open_hazard_data_modal">[edit]</a></b></label>
        <div id="latest_hazard_map_preview"></div>
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